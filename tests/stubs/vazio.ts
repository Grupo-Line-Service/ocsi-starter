/**
 * Stub vazio para `server-only` e `client-only` nos testes.
 *
 * O `vitest.config.ts` aponta os dois pacotes para cá: em teste não existe
 * fronteira servidor/cliente, e o `server-only` só sabe viver dentro do bundler
 * do Next. Sem este arquivo, qualquer módulo com `import "server-only"` derruba
 * a suíte inteira com `Cannot find package 'server-only'` — e o erro aponta
 * para o módulo importado, não para a configuração, o que faz perder tempo
 * procurando no lugar errado.
 *
 * O `vitest.config.ts` já referenciava este caminho, mas o arquivo não existia:
 * a suíte passava enquanto os testes fossem puros e quebrava no primeiro que
 * tocasse código de servidor. Corrigido no template para nascer certo.
 */
export {};
