import "server-only";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/database.types";

/**
 * Cliente Supabase com SERVICE ROLE — ignora RLS.
 *
 * ⚠️ USO RESTRITO A CÓDIGO DE SERVIDOR (Route Handlers / Edge Functions).
 * Serve apenas para provisionamento privilegiado: criar a organização e o
 * primeiro admin no cadastro. O import "server-only" garante, em tempo de
 * build, que este módulo nunca vá para o bundle do cliente.
 *
 * NUNCA importar em Client Components. NUNCA expor a chave ao browser.
 */
export function createAdminClient() {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceRoleKey) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY ausente. Necessária para provisionamento (cadastro).",
    );
  }

  return createClient<Database>(process.env.NEXT_PUBLIC_SUPABASE_URL!, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
