import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "@/lib/database.types";
import { fetchComErroAmigavel } from "./erro-amigavel";

/**
 * Cliente Supabase para Server Components, Route Handlers e Server Actions.
 * Usa a chave pública (anon) + a sessão do usuário nos cookies.
 * O acesso continua sujeito ao RLS — este cliente age como o usuário logado.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      // Erro de escrita bloqueada (RLS/suspensão) sai TRADUZIDO daqui (SAAS-117).
      global: { fetch: fetchComErroAmigavel() },
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // Chamado a partir de um Server Component: pode ser ignorado
            // quando há middleware cuidando da renovação da sessão.
          }
        },
      },
    },
  );
}
