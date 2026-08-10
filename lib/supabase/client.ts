import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/lib/database.types";
import { fetchComErroAmigavel } from "./erro-amigavel";

/**
 * Cliente Supabase para uso no browser (Client Components).
 * Usa a chave pública (anon). O isolamento é garantido por RLS no banco.
 * NUNCA usar service role aqui.
 */
export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    // Erro de escrita bloqueada (RLS/suspensão) sai TRADUZIDO daqui (SAAS-117).
    { global: { fetch: fetchComErroAmigavel() } },
  );
}
