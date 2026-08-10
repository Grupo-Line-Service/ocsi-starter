#!/usr/bin/env node
/**
 * Normaliza a saída do `supabase gen types typescript` para que o arquivo
 * gerado do banco REMOTO (npm run db:types) e o gerado do banco LOCAL das
 * migrações (CI) sejam comparáveis byte a byte (SAAS-70). Remove só o que é
 * ruído legítimo entre os dois mundos:
 *
 * 1. Bloco `__InternalSupabase` (+ comentários acima): metadado da versão do
 *    gerador — varia com a versão da CLI, não com o schema.
 * 2. Bloco `graphql_public`: extensão presente conforme o ambiente, sem uso
 *    no app.
 * 3. Funções `ocsi_*` em Functions: pertencem à integração do SITE (schema
 *    ocsi_site, outro projeto no mesmo Supabase) — o app não depende delas
 *    nos tipos (chamadas com cast explícito) e o CI não deve exigi-las das
 *    migrações deste repo.
 *
 * Uso: node scripts/normalizar-tipos.mjs < entrada.ts > saida.ts
 */

const entrada = await new Promise((resolve) => {
  let s = "";
  process.stdin.setEncoding("utf-8");
  process.stdin.on("data", (c) => (s += c));
  process.stdin.on("end", () => resolve(s));
});

const linhas = entrada.split("\n");
const saida = [];

for (let i = 0; i < linhas.length; i++) {
  const l = linhas[i];

  // 1) __InternalSupabase: { ... } — pula até fechar o bloco (e os comentários
  //    imediatamente acima, que já foram emitidos: remove-os da saída).
  if (/^\s*__InternalSupabase: \{/.test(l)) {
    while (saida.length && /^\s*\/\//.test(saida[saida.length - 1])) saida.pop();
    let prof = 0;
    for (; i < linhas.length; i++) {
      prof += (linhas[i].match(/\{/g) ?? []).length;
      prof -= (linhas[i].match(/\}/g) ?? []).length;
      if (prof === 0) break;
    }
    continue;
  }

  // 2) graphql_public: { ... } (nível 1)
  if (/^  graphql_public: \{/.test(l)) {
    let prof = 0;
    for (; i < linhas.length; i++) {
      prof += (linhas[i].match(/\{/g) ?? []).length;
      prof -= (linhas[i].match(/\}/g) ?? []).length;
      if (prof === 0) break;
    }
    continue;
  }

  // 3) Entradas ocsi_* dentro de Functions (indentação 6). Cobre a forma
  //    simples (`ocsi_x: { ... }`) e a de overload (`ocsi_x:` + `| { ... }`).
  if (/^ {6}ocsi_\w+:/.test(l)) {
    for (; i + 1 < linhas.length; i++) {
      const prox = linhas[i + 1];
      if (/^ {6}[A-Za-z_]/.test(prox) || /^ {4}\}/.test(prox)) break;
    }
    continue;
  }

  saida.push(l);
}

// Nova linha final única (os geradores divergem no rabo do arquivo).
while (saida.length && saida[saida.length - 1].trim() === "") saida.pop();
process.stdout.write(saida.join("\n") + "\n");
