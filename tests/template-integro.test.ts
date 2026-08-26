import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

/**
 * O TEMPLATE PRECISA NASCER INTEIRO.
 *
 * Defeito no starter não aparece aqui — aparece semanas depois, no produto de
 * outra pessoa, com um erro que não parece de template. Foi o que houve com o
 * stub de `server-only`: o `vitest.config.ts` já apontava para
 * `tests/stubs/vazio.ts`, o arquivo não existia, e a suíte do starter passava
 * porque nenhum teste daqui toca código de servidor. O primeiro produto a
 * escrever um teste de servidor é que descobriu — e o erro dizia
 * `Cannot find package 'server-only'`, mandando procurar no lugar errado.
 *
 * Regra que este teste aplica: **arquivo que a configuração promete tem que
 * existir**. Regra sem mecanismo não segura.
 */

const raiz = process.cwd();

describe("integridade do template", () => {
  it("todo alias do vitest.config aponta para arquivo que existe", () => {
    const config = readFileSync(join(raiz, "vitest.config.ts"), "utf8");

    // Pega os caminhos passados a fileURLToPath(new URL("./algo", …)).
    const caminhos = [...config.matchAll(/new URL\("(\.[^"]+)"/g)].map((m) => m[1]);
    expect(caminhos.length, "nenhum caminho encontrado no vitest.config").toBeGreaterThan(0);

    for (const rel of caminhos) {
      if (rel === "." || rel === "./") continue; // a própria raiz
      const alvo = join(raiz, rel);
      expect(existsSync(alvo), `vitest.config aponta para "${rel}", que não existe no template`).toBe(true);
    }
  });

  it("o stub de server-only/client-only existe", () => {
    // Sem ele, qualquer produto quebra no primeiro teste que tocar servidor.
    expect(existsSync(join(raiz, "tests/stubs/vazio.ts"))).toBe(true);
  });
});
