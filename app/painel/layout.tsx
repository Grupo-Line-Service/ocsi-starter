import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AppShell } from "./_components/app-shell";
import type { ItemMenu } from "./_components/sidebar";

/**
 * LAYOUT DO SHELL AUTENTICADO — server component.
 *
 * É AQUI que se descobre quem entrou, de qual organização e o que pode ver. O
 * shell (client) recebe tudo pronto e só desenha.
 *
 * Por que no servidor: esconder item de menu no navegador não protege nada — a
 * rota continua acessível a quem digitar a URL. A decisão de acesso mora no
 * servidor (aqui e no `middleware.ts`), e o RLS do banco é a última linha.
 */
export default async function PainelLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login"); // rede de segurança: o middleware já barraria

  const { data } = await supabase
    .from("usuarios")
    .select("nome, organizacoes(nome, logo_url)")
    .eq("id", user.id)
    .maybeSingle();

  const org = data?.organizacoes as { nome: string; logo_url: string | null } | null;

  // TODO(produto novo): o menu do seu produto. Monte a lista AQUI, já filtrada
  // pela permissão de quem entrou — nunca renderize tudo para esconder depois.
  const menu: ItemMenu[] = [
    { href: "/painel", rotulo: "Início", icone: "🏠" },
    { href: "/painel/exemplo", rotulo: "Exemplo", icone: "📄" },
  ];

  return (
    <AppShell
      organizacaoNome={org?.nome ?? "Minha organização"}
      logoUrl={org?.logo_url ?? null}
      usuarioNome={data?.nome ?? user.email ?? "Usuário"}
      email={user.email ?? ""}
      menu={menu}
    >
      {children}
    </AppShell>
  );
}
