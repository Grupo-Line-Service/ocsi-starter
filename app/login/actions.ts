"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

/**
 * Entrar. Devolve a mensagem de erro para a tela mostrar; sucesso redireciona.
 *
 * ⚠️ A mensagem é PROPOSITALMENTE genérica ("E-mail ou senha inválidos"): dizer
 * "esse e-mail não existe" entrega a quem sonda quais endereços estão
 * cadastrados.
 */
export async function entrar(_estadoAnterior: string | null, form: FormData): Promise<string | null> {
  const email = String(form.get("email") ?? "").trim();
  const senha = String(form.get("senha") ?? "");

  if (!email || !senha) return "Informe e-mail e senha.";

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password: senha });

  if (error) return "E-mail ou senha inválidos.";

  revalidatePath("/", "layout");
  redirect("/painel");
}

/** Sair. Sempre termina no login, mesmo se o signOut falhar. */
export async function sair() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/login");
}
