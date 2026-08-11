# CLAUDE.md — [NOME DO PRODUTO]

> **TODO(produto novo):** troque o nome acima, preencha a seção "O produto",
> apague o `MANUTENCAO-DO-STARTER.md` (é do template) e apague este aviso.
> O resto vale para todos os produtos OCSI — **não mexa sem motivo**, e se
> mexer, leve a mudança para o starter.
>
> ⚠️ **Este produto é PRIVADO** (o starter e o `@ocsi/ui` é que são públicos).
> Regra de negócio, integração contratada e dado de cliente vivem AQUI e não
> sobem para o núcleo nem para o template.

## O produto

*(Uma frase: para quem é, que problema resolve. Depois: o domínio, os termos
que o cliente usa, o fluxo principal.)*

## REGRA ZERO — este produto é uma CÓPIA da estrutura OCSI

Nasceu do [`ocsi-starter`](https://github.com/Grupo-Line-Service/ocsi-starter),
que espelha o `saas-gestao` (o gabarito). **Se existe no gabarito, existe igual
aqui** — mesma estrutura de pastas, mesmos nomes, mesmo comportamento:

- `app/painel/` com `_components/` — shell autenticado
- `lib/supabase/`: `client.ts` (browser/anon), `server.ts` (server components e
  actions), `admin.ts` (**service_role, server-only**, só provisionamento),
  `middleware.ts` (sessão)
- `middleware.ts` na raiz — proteção de rota, padrão FECHADO
- `supabase/migrations/AAAAMMDDHHMMSS_nome.sql`
- **RLS em toda tabela**, isolando por `organizacao_id`

## O núcleo vem do pacote, não daqui

Botão, card, input, barra de filtros, KPI, shell, cabeçalho de página, formatação
de dinheiro e data, busca de CNPJ/CEP, contatos com apelido, tema por inquilino:
tudo em **`@ocsi/ui`**.

**Antes de criar qualquer componente ou classe, consulte o
[catálogo](https://github.com/Grupo-Line-Service/ocsi-ui/blob/main/docs/catalogo.md).**
É a lista do que já existe pronto.

- **Mudou uma medida do núcleo? Muda NO PACOTE** e publique uma tag nova. Assim
  a melhoria chega a todos os produtos — foi para isso que o núcleo existe.
- **PROIBIDO recriar com outro nome** o que o pacote já tem. Foi assim que um
  produto acabou com `.card2`, `.in` e `.muted2` fazendo o mesmo que `.card`,
  `.input` e `.muted`.
- **Cor literal em `base.css` quebra o teste do pacote**, de propósito: a
  estrutura é do pacote, a cor é do tema.

## Regras que não se negociam

1. **Nunca no chute.** Erro estranho → releia a fonte (documentação, código
   real, log) até explicar TODOS os sintomas. Uma rodada completa vale mais que
   cinco tentativas.
2. **RLS em toda tabela**, com um caso novo em
   `supabase/tests/rls_isolamento.sql`. RLS quebrado **não dá erro**: mostra
   dado de outro cliente em silêncio, e você descobre pelo cliente reclamando.
   ⚠️ **Tabela nova exige TRÊS coisas na mesma migração**: `enable row level
   security` + `create policy` + **`grant`**. Política não é privilégio — a
   policy diz *quais linhas*, o grant diz *se pode ler a tabela*. Faltando o
   grant, o banco responde `permission denied for table X` mesmo com a policy
   perfeita, e o erro não menciona RLS — manda você investigar o lado errado.
3. **`service_role` JAMAIS no runtime do cliente.** Ela ignora RLS por completo.
   Só em `lib/supabase/admin.ts`, só no servidor, e nunca com prefixo
   `NEXT_PUBLIC_`.
4. **Migração com nome por TIMESTAMP**, nunca sequencial. O `db reset` aplica em
   ordem alfabética: misturar convenções faz uma migração rodar antes da tabela
   que ela altera existir — e quebra só no CI, porque produção já tem o schema
   montado. (Custou dois dias de CI vermelho no `saas-gestao`.)
5. **Depois de migração, `npm run db:types` e commite.** `lib/database.types.ts`
   é **gerado** — não escreva nada nele à mão, nem comentário: o CI compara
   byte a byte com o que sai do schema, e um cabeçalho explicativo já bastou
   para deixar o CI do template vermelho. Sem Docker na máquina? O CI publica o
   arquivo pronto como artefato `database.types.ts` quando acusa a divergência.
6. **Botão de ação trava contra duplo clique**: desabilita, vira gerúndio
   ("Salvando…"). Sem isso, dois cliques viram duas cobranças.
7. **Rota nova é FECHADA por padrão.** Para torná-la pública, acrescente na
   lista de `lib/supabase/middleware.ts` — e saiba que prefixo largo demais abre
   o app inteiro (há teste protegendo).
8. **Toda tela tem estado de CARREGANDO e de VAZIO.** Tela em branco sem
   explicação é o jeito mais rápido de parecer quebrada.
9. **Um voltar por tela**, texto sempre "Voltar", volta UMA tela.
10. **Verificar antes de afirmar.** "Está funcionando" só depois de rodar e
    olhar — build passando não é prova de que a tela abre.

## Padrão de telas

`docs/padroes-de-tela.md` é o gabarito. Referência viva: `app/painel/exemplo/`.
Mudou um padrão? Aplique em TODAS as telas no mesmo commit — nunca deixe cinco
novas e quinze velhas.

## Comandos

```bash
npm run dev        # desenvolvimento
npm run typecheck  # tipos
npm test           # testes
npm run build      # build de produção (o que a Vercel roda)
npm run db:types   # regenera os tipos do banco após migração
```

## Antes de commitar

Rode `typecheck`, `test` e `build` localmente. É a única barreira antes do
deploy — e é mais rápido que descobrir pelo CI.
