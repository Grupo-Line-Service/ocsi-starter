import { redirect } from "next/navigation";

/**
 * Raiz: quem chega aqui vai para o painel (e, se não estiver logado, o
 * middleware o manda para /login).
 *
 * TODO(produto novo): se o seu produto tiver página pública de entrada
 * (apresentação, venda), troque este redirect por ela — e lembre de manter "/"
 * na lista de rotas públicas em `lib/supabase/middleware.ts`.
 */
export default function Home() {
  redirect("/painel");
}
