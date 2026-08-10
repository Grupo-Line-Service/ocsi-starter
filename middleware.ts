import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

/**
 * Sessão e proteção de rota para o app inteiro.
 *
 * Quem decide o que é público é a lista em `lib/supabase/middleware.ts` — o
 * padrão é FECHADO: rota que não estiver lá exige login.
 */
export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Todas as rotas, exceto:
     * - api/*  → chamadas máquina-a-máquina; cada handler se autentica sozinho.
     *            Sob o middleware elas levariam 307 para /login e nunca
     *            executariam (armadilha real já paga no saas-gestao).
     * - _next/static, _next/image, favicon e imagens → estáticos.
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
