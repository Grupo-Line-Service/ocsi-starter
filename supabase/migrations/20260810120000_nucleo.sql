-- =============================================================================
-- NÚCLEO — organizações, usuários e o isolamento entre inquilinos.
--
-- ⚠️ CONVENÇÃO DE NOME: AAAAMMDDHHMMSS_descricao.sql, SEMPRE. Não misture com
-- numeração sequencial (0001_, 0002_) no mesmo diretório: o `db reset` aplica
-- em ordem ALFABÉTICA, e "0185_" vem antes de "20260808_". Uma migração que
-- dependa de tabela criada pela outra quebra só no banco zerado do CI — em
-- produção passa despercebido, porque lá a ordem foi cronológica. Já custou
-- dois dias de CI vermelho no saas-gestao.
--
-- ⚠️ RLS EM TODA TABELA. Sem exceção. A regra de acesso mora no banco, não na
-- tela: esconder um botão não impede ninguém de chamar a API.
-- =============================================================================

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Organizações (inquilinos)
-- ---------------------------------------------------------------------------
create table public.organizacoes (
  id            uuid primary key default gen_random_uuid(),
  nome          text not null,
  documento     text,                       -- CNPJ/CPF, se o produto precisar
  logo_url      text,
  -- Aparência (white-label): o motor em @ocsi/ui/lib/tema deriva o resto a
  -- partir da cor primária.
  tema          text default 'claro' check (tema in ('claro', 'escuro')),
  cor_primaria  text,
  cor_secundaria text,
  fonte         text,
  cantos        text,
  criado_em     timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Usuários — espelho de auth.users com o vínculo à organização
-- ---------------------------------------------------------------------------
create table public.usuarios (
  id              uuid primary key references auth.users(id) on delete cascade,
  organizacao_id  uuid not null references public.organizacoes(id) on delete cascade,
  nome            text not null default '',
  email           text,
  ativo           boolean not null default true,
  criado_em       timestamptz not null default now()
);

create index usuarios_organizacao_id_idx on public.usuarios (organizacao_id);

-- ---------------------------------------------------------------------------
-- A base do isolamento: a organização de quem está chamando.
--
-- security definer + search_path fixo de propósito: a função precisa ler
-- public.usuarios ignorando o RLS (senão seria uma referência circular — a
-- política de usuarios chamaria a função que lê usuarios).
-- ---------------------------------------------------------------------------
create or replace function public.organizacao_atual()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select organizacao_id from public.usuarios where id = auth.uid()
$$;

-- ---------------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------------
alter table public.organizacoes enable row level security;
alter table public.usuarios     enable row level security;

-- Cada um enxerga apenas a própria organização.
create policy organizacoes_da_minha_org on public.organizacoes
  for select to authenticated
  using (id = public.organizacao_atual());

create policy usuarios_da_minha_org on public.usuarios
  for select to authenticated
  using (organizacao_id = public.organizacao_atual());

-- ⚠️ Escrita fica de fora de propósito: cada produto decide quem pode alterar o
-- quê (cargo, permissão, dono da conta). Crie as políticas de insert/update
-- junto com o seu modelo de permissão — nunca libere geral "para destravar".

-- ---------------------------------------------------------------------------
-- GRANT — política NÃO é privilégio (as duas coisas são obrigatórias)
--
-- ⚠️ ARMADILHA CLÁSSICA DO POSTGRES, e o teste de RLS pegou: habilitar RLS e
-- escrever a policy NÃO dá acesso a nada. A policy responde "QUAIS LINHAS";
-- o grant responde "PODE LER A TABELA?". Sem o grant, o banco devolve
-- `permission denied for table organizacoes` — mesmo com a policy perfeita.
--
-- Sintoma quando falta: o app parece quebrado logo depois do login, e o erro
-- não fala em RLS nenhuma — fala em permissão, o que manda a investigação
-- para o lado errado.
--
-- Regra para tabela nova: `enable row level security` + `create policy` +
-- `grant` — os três, na mesma migração, sempre.
-- ---------------------------------------------------------------------------
grant select on public.organizacoes to authenticated;
grant select on public.usuarios     to authenticated;

-- ---------------------------------------------------------------------------
-- Papel anônimo: zero privilégio (defesa em profundidade).
-- O RLS não deve ser a única barreira. RPC pública nova exige grant EXPLÍCITO
-- na própria migração — e atenção: recriar uma função reaplica o ACL padrão em
-- silêncio, desfazendo revokes antigos.
-- ---------------------------------------------------------------------------
revoke all on public.organizacoes from anon;
revoke all on public.usuarios     from anon;
