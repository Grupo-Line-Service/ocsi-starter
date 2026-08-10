import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

/**
 * O padrão do app é FECHADO: rota que não está na lista de públicas exige
 * login. Este teste protege essa lista dos dois erros possíveis.
 *
 * Por que testar uma lista: ela cresce sem cerimônia (alguém precisa de um link
 * de e-mail público e acrescenta um prefixo). Um prefixo largo demais abre o
 * app inteiro sem ninguém perceber — não há erro, não há alerta; a porta
 * simplesmente fica aberta.
 */
const middleware = readFileSync(join(process.cwd(), "lib/supabase/middleware.ts"), "utf8");
const bloco = middleware.slice(middleware.indexOf("const isPublic"), middleware.indexOf("// Refresh token inválido"));

describe("rotas públicas", () => {
  it("o painel NUNCA é público", () => {
    expect(bloco).not.toMatch(/startsWith\("\/painel/);
  });

  it("nenhum prefixo largo demais abre o app inteiro", () => {
    // startsWith("/") casa com QUALQUER rota — seria o app todo aberto.
    const prefixos = [...bloco.matchAll(/startsWith\("([^"]+)"\)/g)].map((m) => m[1]);
    for (const p of prefixos) {
      expect(p.length, `prefixo público curto demais: "${p}"`).toBeGreaterThan(1);
      expect(p.startsWith("/"), `prefixo público sem barra inicial: "${p}"`).toBe(true);
    }
  });

  it("o login continua público (senão ninguém entra)", () => {
    expect(bloco).toMatch(/startsWith\("\/login"\)/);
  });

  it("o callback de autenticação continua público", () => {
    // O link de convite/recuperação chega SEM sessão: se /auth fechar, o
    // usuário cai no login e o convite nunca se completa.
    expect(bloco).toMatch(/startsWith\("\/auth"\)/);
  });
});
