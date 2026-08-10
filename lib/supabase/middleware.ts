import { createServerClient } from "@supabase/ssr";
import type { User } from "@supabase/supabase-js";
import { NextResponse, type NextRequest } from "next/server";

/** Apaga os cookies de auth do Supabase (sb-*) da requisição e da resposta. */
function limparCookiesSupabase(request: NextRequest, response: NextResponse) {
  request.cookies
    .getAll()
    .filter((c) => c.name.startsWith("sb-"))
    .forEach((c) => response.cookies.delete(c.name));
}

/**
 * Expiração de sessão por INATIVIDADE.
 *
 * O refresh token do Supabase nunca expira por padrão, e o recurso nativo de
 * time-box/inactivity timeout exige plano Pro. Então controlamos aqui: um cookie
 * httpOnly guarda o instante da última atividade; a cada request renovamos
 * (janela deslizante). Passando do limite, a sessão é encerrada.
 *
 * Para mudar o tempo, altere só esta constante.
 */
const INATIVIDADE_MS = 12 * 60 * 60 * 1000; // 12 horas
export const COOKIE_ATIVIDADE = "ultima_atividade";

/**
 * Renova a sessão do Supabase a cada request, aplica o timeout de inatividade
 * e protege as rotas do app. Chamado pelo middleware raiz (middleware.ts).
 */
export async function updateSession(request: NextRequest) {
  // Expõe a rota atual para os layouts (Server Components) via header — usado
  // pelo gate de 2FA obrigatório para não redirecionar em loop na tela de Segurança.
  request.headers.set("x-pathname", request.nextUrl.pathname);
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // IMPORTANTE: não colocar lógica entre createServerClient e getUser().
  // getUser() pode devolver erro (ou lançar) quando o refresh token do cookie
  // está velho/rotacionado — envolvemos para nunca derrubar o middleware.
  let user: User | null = null;
  let authError: unknown = null;
  try {
    const { data, error } = await supabase.auth.getUser();
    user = data.user;
    authError = error;
  } catch (e) {
    authError = e;
  }

  // ROTAS PÚBLICAS — tudo o que não estiver aqui exige sessão.
  //
  // ⚠️ Ao criar rota pública nova (link de e-mail, página de convite, webhook
  // com token próprio), acrescente aqui. Esquecer disto tem uma assinatura
  // clara: o link do e-mail leva o cliente para a tela de login em vez do
  // conteúdo.
  const { pathname } = request.nextUrl;
  const isPublic =
    pathname === "/" ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/recuperar-senha") ||
    pathname.startsWith("/definir-senha") ||
    pathname.startsWith("/confirmar") || // validação de e-mail (o link chega SEM sessão)
    pathname.startsWith("/auth"); // callback do Supabase (troca o code por sessão)

  // Refresh token inválido (rotacionado/expirado — ex.: logout em outra aba, ou
  // cookie antigo). O SDK devolve user=null + erro; sem tratar, o mesmo cookie
  // ruim reaparece a cada request e enche o painel de erros ("Invalid Refresh
  // Token: Refresh Token Not Found"). Limpamos os cookies de auth para estancar
  // a repetição e seguimos como visitante (redirect ao login se for rota fechada).
  const temCookieAuth = request.cookies
    .getAll()
    .some((c) => c.name.startsWith("sb-"));
  if (!user && authError && temCookieAuth) {
    limparCookiesSupabase(request, supabaseResponse);
    if (!isPublic) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      url.search = "";
      const resposta = NextResponse.redirect(url);
      supabaseResponse.cookies.getAll().forEach((c) => resposta.cookies.set(c));
      return resposta;
    }
    return supabaseResponse;
  }

  // Sem usuário em rota protegida → manda para o login.
  if (!user && !isPublic) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.search = "";
    return NextResponse.redirect(url);
  }

  // 2FA: quem TEM fator verificado mas entrou só com senha fica em aal1 e precisa
  // subir para aal2 (código do app). Barra o acesso até validar em /mfa. Exceção:
  // a própria /mfa, o /auth (confirmação de link) e o logout.
  if (
    user &&
    !pathname.startsWith("/mfa") &&
    !pathname.startsWith("/auth") &&
    !pathname.startsWith("/logout")
  ) {
    const { data: aal } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
    if (aal && aal.currentLevel === "aal1" && aal.nextLevel === "aal2") {
      console.error("[mw] gate 2FA aal1->aal2", user.email, pathname);
      const url = request.nextUrl.clone();
      url.pathname = "/mfa";
      url.search = "";
      return NextResponse.redirect(url);
    }
  }

  if (user) {
    const agora = Date.now();
    const bruto = request.cookies.get(COOKIE_ATIVIDADE)?.value;
    const ultima = bruto ? Number(bruto) : NaN;

    // Ficou parado além do limite: encerra a sessão.
    if (Number.isFinite(ultima) && agora - ultima > INATIVIDADE_MS) {
      console.error("[mw] kick por inatividade", user.email, { ultima, agora, delta: agora - ultima });
      await supabase.auth.signOut();

      const url = request.nextUrl.clone();
      url.pathname = "/login";
      url.search = "";
      url.searchParams.set("expirou", "1");

      const resposta = NextResponse.redirect(url);
      // Leva os cookies de auth limpos pelo signOut para a resposta de redirect.
      supabaseResponse.cookies
        .getAll()
        .forEach((c) => resposta.cookies.set(c));
      // Zera com os MESMOS atributos do set (delete simples não removia em
      // todos os navegadores/escopos — o cookie velho voltava a derrubar).
      resposta.cookies.set({
        name: COOKIE_ATIVIDADE,
        value: "",
        maxAge: 0,
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
      });
      return resposta;
    }

    // Janela deslizante: qualquer uso renova a última atividade.
    supabaseResponse.cookies.set({
      name: COOKIE_ATIVIDADE,
      value: String(agora),
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 30, // o cookie sobrevive à inatividade p/ podermos detectá-la
    });
  }

  return supabaseResponse;
}
