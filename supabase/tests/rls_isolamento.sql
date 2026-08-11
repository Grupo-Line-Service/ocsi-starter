-- ============================================================================
-- TESTE DE ISOLAMENTO ENTRE INQUILINOS (RLS).
--
-- Roda contra um Supabase LOCAL no CI (`supabase start`). Postgres cru não
-- serve: as policies usam auth.uid(), os roles do Supabase e RLS de verdade.
--
-- Cenário: duas organizações, um usuário em cada. Prova que uma NÃO enxerga a
-- outra. Falha faz RAISE EXCEPTION e, com `psql -v ON_ERROR_STOP=1`, derruba o
-- CI. O begin/rollback deixa o banco limpo no fim.
--
-- ⚠️ AO CRIAR TABELA NOVA, acrescente um caso aqui. É a única forma de saber
-- que o isolamento continua valendo — RLS quebrado não dá erro: ele mostra
-- dado alheio em silêncio, e você só descobre pelo cliente reclamando.
-- ============================================================================

begin;

do $$
declare
  org_a uuid := '00000000-0000-4000-a000-0000000000a1';
  org_b uuid := '00000000-0000-4000-b000-0000000000b1';
  u_a   uuid := '00000000-0000-4000-a000-00000000000a';
  u_b   uuid := '00000000-0000-4000-b000-00000000000b';
  visto int;
begin
  -- --- Cenário -------------------------------------------------------------
  insert into public.organizacoes (id, nome) values (org_a, 'Organização A'), (org_b, 'Organização B');

  insert into auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at)
  values
    (u_a, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'a@teste.local', '', now(), now(), now()),
    (u_b, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'b@teste.local', '', now(), now(), now());

  insert into public.usuarios (id, organizacao_id, nome, email)
  values (u_a, org_a, 'Usuário A', 'a@teste.local'), (u_b, org_b, 'Usuário B', 'b@teste.local');

  -- --- Como o usuário A ----------------------------------------------------
  set local role authenticated;
  perform set_config('request.jwt.claims', json_build_object('sub', u_a, 'role', 'authenticated')::text, true);

  select count(*) into visto from public.organizacoes;
  if visto <> 1 then
    raise exception 'VAZOU: usuário A enxerga % organizações (esperado 1)', visto;
  end if;

  select count(*) into visto from public.organizacoes where id = org_b;
  if visto <> 0 then
    raise exception 'VAZOU: usuário A enxerga a organização B';
  end if;

  select count(*) into visto from public.usuarios;
  if visto <> 1 then
    raise exception 'VAZOU: usuário A enxerga % usuários (esperado 1: ele mesmo)', visto;
  end if;

  -- --- Como o usuário B (o espelho, para não passar por acidente) ----------
  perform set_config('request.jwt.claims', json_build_object('sub', u_b, 'role', 'authenticated')::text, true);

  select count(*) into visto from public.usuarios where id = u_a;
  if visto <> 0 then
    raise exception 'VAZOU: usuário B enxerga o usuário A';
  end if;

  -- --- Visitante não autenticado não vê nada -------------------------------
  -- ⚠️ Existem DUAS formas de estar certo aqui, e o teste precisa aceitar as
  -- duas — senão ele reprova a mais segura:
  --   (a) o banco NEGA o acesso (`revoke all ... from anon` da migração,
  --       defesa em profundidade) → erro `insufficient_privilege`. É o
  --       resultado MAIS FORTE: a RLS deixa de ser a única barreira;
  --   (b) o acesso passa e a RLS devolve 0 linhas.
  -- Só é falha o anônimo VER LINHA. Escrito só com (b), este teste derrubava o
  -- CI do template exatamente por a migração ser mais rigorosa que ele.
  reset role;
  set local role anon;
  perform set_config('request.jwt.claims', null, true);

  begin
    select count(*) into visto from public.organizacoes;
    if visto <> 0 then
      raise exception 'VAZOU: anônimo enxerga % organizações (esperado 0)', visto;
    end if;
  exception
    when insufficient_privilege then
      raise notice 'anon sem privilégio na tabela (defesa em profundidade) — ok';
  end;

  reset role;
  raise notice 'RLS OK — isolamento entre inquilinos preservado.';
end $$;

rollback;
