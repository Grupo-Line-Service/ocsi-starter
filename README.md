# OCSI Starter — todo produto novo começa aqui

Ponto de partida dos produtos OCSI. **Não copie o `saas-gestao` à mão**: clone
este template e o produto já nasce com estrutura, núcleo visual, autenticação,
white-label, isolamento no banco e CI.

> *"todos os novos projetos já nascem com tudo do SaaS Gestão, igual idêntico"*
> — dono, 10/08/2026

## Por que este repositório existe

A regra "copie o gabarito" já existia, escrita nos `CLAUDE.md`, e não segurou:

- o **Omnivis** nasceu antes de existir padrão e ficou com 1792 linhas de CSS
  sem camada base de botão ou campo;
- o **RG Ambiental** nasceu copiando à mão, com "se existe no SaaS, existe igual
  aqui" na primeira linha do próprio `CLAUDE.md` — e divergiu mesmo assim.

**Copiar é um ato que alguém precisa lembrar de fazer; nascer certo é uma
condição.**

## Começar

1. **Use this template** no GitHub → nomeie o repositório do produto.
   ⚠️ **Crie o repositório do produto como PRIVADO** — ele vai receber regra de
   negócio. Só o starter e o `@ocsi/ui` são públicos.
2. `npm install`
3. `cp .env.example .env.local` e preencha com o seu projeto Supabase.
4. Aplique a migração inicial (`supabase/migrations/`) no seu projeto.
5. `npm run dev`
6. Apague o `MANUTENCAO-DO-STARTER.md` — ele é do template, não do seu produto.

Sem escrever uma linha você já tem: login, shell com menu lateral, tela de
início, tela de exemplo no padrão, tema por organização e CI.

## O que já vem pronto

| | |
|---|---|
| **Núcleo visual** | `@ocsi/ui` — botão, card, input, barra de filtros, KPI, shell, cabeçalho de página |
| **White-label** | cada organização escolhe cor, logo, fonte e cantos (`app/layout.tsx`) |
| **Autenticação** | login, logout, sessão renovada, **timeout por inatividade (12h)** |
| **Proteção de rota** | padrão FECHADO no `middleware.ts` — rota nova já nasce protegida |
| **Banco** | `organizacoes` + `usuarios`, RLS por `organizacao_id`, papel anônimo zerado |
| **CI** | typecheck, testes, build **e** isolamento entre inquilinos em Supabase real |
| **Carregamento** | barra no topo entre telas + spinner local |

## Onde mexer primeiro

Procure por `TODO(produto novo)` — marcam exatamente o que trocar:

- `app/layout.tsx` — nome e descrição do produto
- `app/painel/layout.tsx` — **os itens do menu**
- `app/painel/exemplo/` — a tela de exemplo: copie a estrutura, troque os dados
- `app/globals.css` — só o que for exclusivo deste produto
- `supabase/migrations/` — as suas tabelas

## Regras que não se negociam

1. **Componente ou classe do núcleo vem de `@ocsi/ui`.** Antes de escrever
   qualquer coisa, consulte o
   [catálogo](https://github.com/Grupo-Line-Service/ocsi-ui/blob/main/docs/catalogo.md).
   Proibido recriar com outro nome o que já existe.
2. **Mudou o núcleo? Muda no pacote**, não aqui — assim a melhoria chega a todos
   os produtos, e não só a este.
3. **RLS em toda tabela**, sempre com um caso novo em
   `supabase/tests/rls_isolamento.sql`. RLS quebrado não dá erro: mostra dado
   alheio em silêncio.
4. **Migração com nome por TIMESTAMP.** Nunca misture com numeração sequencial
   no mesmo diretório — o `db reset` aplica em ordem alfabética e a dependência
   entre migrações quebra só no CI.
5. **`service_role` jamais no runtime do cliente.**
6. **Botão de ação com trava anti-duplo-clique** (veja o login).

## Instalar/atualizar o núcleo

```bash
npm install "https://github.com/Grupo-Line-Service/ocsi-ui/archive/refs/tags/vX.Y.Z.tar.gz"
```

⚠️ Sempre por **tag**. Nunca `npm i github:owner/repo` (vira `git+ssh://` no
lockfile e a Vercel não tem chave SSH — o build quebra só no deploy) e nunca
`refs/heads/main.tar.gz` (o hash deixa de bater e o build cai sozinho).
