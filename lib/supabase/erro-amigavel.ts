/**
 * TRADUÇÃO CENTRAL do erro de escrita bloqueada (SAAS-117).
 *
 * A suspensão real é aplicada pelo BANCO (policies restritivas da migration
 * 0116). Quando uma escrita escapa da UI e bate na trava, o PostgREST devolve
 * 403 com code 42501 e a mensagem crua "new row violates row-level security
 * policy…" — que vazava para o cliente em qualquer tela.
 *
 * Este fetch envolve o transporte do supabase-js e reescreve ESSA mensagem na
 * resposta, antes de qualquer action/tela ver. Um lugar só, vale para toda
 * query dos clientes anon (server e browser). Sem tocar em 53 arquivos de ação.
 */

export const MENSAGEM_ESCRITA_BLOQUEADA =
  "Não foi possível gravar: a conta está em modo somente-leitura (pagamento pendente ou suspensa) ou você não tem permissão neste registro. Veja Configurações → Plano para regularizar.";

export function fetchComErroAmigavel(fetchBase: typeof fetch = fetch): typeof fetch {
  return async (entrada, init) => {
    const resposta = await fetchBase(entrada, init);
    // 403 é raro no caminho feliz — só aí pagamos o custo de ler o corpo.
    if (resposta.status !== 403) return resposta;
    try {
      const corpo = await resposta.clone().json();
      if (corpo?.code === "42501" && /row-level security/i.test(String(corpo?.message ?? ""))) {
        const amigavel = { ...corpo, message: MENSAGEM_ESCRITA_BLOQUEADA };
        return new Response(JSON.stringify(amigavel), {
          status: resposta.status,
          statusText: resposta.statusText,
          headers: resposta.headers,
        });
      }
    } catch {
      /* corpo não-JSON: devolve como veio */
    }
    return resposta;
  };
}
