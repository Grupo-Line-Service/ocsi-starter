# Padrões de tela — GABARITO OBRIGATÓRIO

> **Regra zero:** tela nova ou alterada segue ESTE documento. Se um padrão
> mudar, a mudança é aplicada em **TODAS as telas no mesmo commit** — nunca
> "atualizei 5 e deixei 15 velhas". Antes de entregar, conferir contra uma
> tela de referência: **Clientes** (lista) e **ficha do Cliente** (detalhe).

## 1. Estrutura da página (nesta ordem)

```
<section>                        ← SEM maxWidth (largura vem do CSS global 1480px)
  [Voltar]                       ← só em telas de detalhe (bola rosa ← rótulo)
  ┌──────────────────────────────────────────────┐
  │ <h1>Título</h1>        [+ Ação primária]     │  ← MESMA linha (flex space-between)
  └──────────────────────────────────────────────┘
  <p muted>subtítulo de 1–2 linhas explicando a tela</p>
  [msg verde / erro vermelho de searchParams]
  <BuscaViva />                  ← toda lista tem
  [abas/filtros com CONTAGEM]    ← chips btn/btn-primary
  conteúdo (cards / tabela)
</section>
```

- Ação primária = form recolhível na própria linha (padrão `NovaFatura`):
  botão "+ Nome curto"; expandido ocupa `flexBasis: 100%`.
- Telas dentro de `configuracoes/` não têm h1 próprio (o layout provê).

## 1.1 Botões: DUAS escalas, nunca padding solto (07/08/2026)

O sistema tem **duas** medidas de botão, ambas no `globals.css` — nenhuma tela
inventa a sua com `style={{ padding: … }}`:

- **Ação** (`.btn`, `.btn btn-primary`): altura **42px**, padding lateral 18px,
  fonte 14. É o botão de fazer coisa (Salvar, Novo cliente, Editar cadastro).
- **Chip** (`.btn btn-chip`): altura **34px**, padding 14px, fonte 13,5. É aba
  de página, filtro com contagem, seletor de etapa.

Regras: dentro de uma MESMA barra todos os botões têm a mesma escala; o ícone
é normalizado por CSS (`.btn svg` 16px, sem encolher); **um único primário por
barra** (o resto é secundário, variando só a cor do texto quando for perigoso).
Barra de ações de ficha **não** vive dentro de um `card` — fica no mesmo plano
das abas. Motivo: botões de alturas diferentes na mesma linha é o defeito
visual que mais salta aos olhos (relato do dono: "um botão maior que o outro,
um no modal outro não").

## 1.1.1 Barra de filtros: chips e busca na MESMA linha (07/08/2026)

Abas/chips de filtro e a busca (mais o `FiltroMes`, quando houver) vivem numa
linha só — chips à esquerda, busca à direita (pedido do dono: "joga a pesquisa
na linha dos botões"). Classes prontas no `globals.css`:

```tsx
<div className="barra-filtros">
  <div className="barra-filtros-chips">{abas}</div>
  <div className="barra-filtros-busca"><FiltroMes …/><BuscaViva … inline /></div>
</div>
```

`.barra-filtros-busca` já empurra para a direita e, em tela estreita, desce
ocupando a largura toda. Referência: **Clientes**.

**Ordem na página quando há totais**: `cabeçalho → totais do mês →
barra de filtros → tabela`. Os totais resumem o MÊS e as abas filtram a LISTA:
com as abas acima, o usuário lê que os números respondem à aba — leitura errada
de dinheiro.

## 1.2 Voltar: UM só, e volta UMA tela (07/08/2026)

- A tela de detalhe tem **um único** elemento de voltar: a seta (`Voltar`), com
  o texto **sempre "Voltar"** — nunca o nome de um destino.
- Ela **desfaz o último passo** (volta para a tela de onde o usuário veio).
  Só quando não há navegação interna na aba (link de e-mail, aba nova) é que
  usa o `href` declarado.
- **PROIBIDO** um segundo "← voltar ao resumo / às notas / ao cliente" solto na
  página: dois voltares competindo é o defeito que gerou a regra — o usuário
  clica no mais chamativo e vai parar onde não queria. Navegação entre etapas
  DENTRO de um formulário (wizard) não conta, é outro contexto.

## 1.3 Ação destrutiva mora atrás de uma porta

- Excluir/encerrar **não fica visível junto das ações do dia a dia**, nem
  acompanha o usuário por todas as abas de um formulário ("é um convite para
  excluir"). Vive na ÚLTIMA aba, com título próprio.
- Antes de executar: explicar o efeito (o que é apagado × preservado) e a
  diferença para a ação reversível equivalente (inativar × excluir).
- Confirmação por **digitação do documento** (CNPJ/CPF do cliente) — prova que
  é o cadastro certo; "sim/não" não protege contra nome parecido. Sem
  documento no cadastro, cai na palavra EXCLUIR.
- O servidor valida de novo (a tela nunca é a única barreira).

## 2. Largura

- **PROIBIDO** `maxWidth` no `<section>` raiz. O teto único é o CSS global
  (`.painel-main > * { max-width: 1480px }`).
- `maxWidth` só em cards/formulários internos quando melhorar a leitura
  (ex.: formulário de 1 coluna ~720px).

## 3. Listas e tabelas

- Tabela dentro de `card` com `padding: 0` + `overflowX: auto`.
- **Cabeçalho padrão (referência: Clientes):** linha `surface-2`, rótulos 12px
  muted, colunas ORDENÁVEIS por clique (seta ↑/↓ na ativa), ações à direita.
  **Ordenação padrão = alfabética pela coluna principal** (razão social/nome) —
  nunca por "criado em". Evoluiu o cabeçalho? Replicar em TODAS as tabelas no
  mesmo commit.
- `th`/`td` padrão (12px muted / 14px). Linhas com `borderTop` var(--border).
- Célula principal clicável (link sem sublinhado, peso 600) + descritivo
  muted de 12px embaixo quando houver.
- **Ações por linha em ÍCONES com tooltip** (↗️ abrir · 🧾 boleto · 📄 nota ·
  ⬇️ XML · ✏️ editar · 🗑 excluir) — nunca texto repetido linha a linha. Ícones
  SVG compartilhados de `app/painel/_components/icones` (`IconeEditar`,
  `IconePower`, `IconeExcluir` + `estiloIconeBtn`). Gabaritos: `AcoesContrato`,
  `AcoesCliente`, `AcoesFatura` (Contas a Receber), `AcoesConta` (Contas a
  Pagar), Ordens de Serviço.
- **Linha de TABELA usa ícone-só; CARD/menu usa botão com TEXTO** (`✏️ Editar`
  / `🗑 Excluir`) — decisão do dono (27/07/2026). O ícone-só cabe na linha
  apertada; no card o rótulo lê melhor. NÃO converter os cards (Moldes de
  proposta, Cargos, Fornecedores) para ícone-só.
- Estado vazio: `card` com frase muted útil (diferenciar "nada" × "nada na busca").
- **Campo de busca (`CampoBusca`, dentro de `BuscaViva`):** acabamento do
  sistema — botão rosa (gradiente da marca) com **lupa branca** grudado no fim
  do campo (dispara a busca na hora; Enter também) + botão ✕ para limpar quando
  há texto. Nunca um `<input>` de busca "pelado".
- Datas: `formatarData` (YYYY-MM-DD) ou `dataSP`/`formatarDataHoraSP`
  (timestamps). **NUNCA** `slice` de timestamp nem `toLocaleString` sem fuso.

## 3.1 Card de recurso conectado (bancos, bots, domínios…)

- **Identidade:** LOGO OFICIAL da marca (asset local em `public/<tipo>/`,
  ex.: `public/bancos/inter.svg`) num QUADRADO arredondado 44px de fundo
  branco; emoji só como fallback de marca desconhecida · nome em 15px/700 +
  selos (ex.: PADRÃO em pílula accent) · linha meta muted 12px que INCLUI o
  **identificador oficial** (nº do banco no Bacen: Inter 077, Asaas 461) e a
  função ("… · Banco 077 · Emissor de boletos e PIX") · chip de status à
  direita.
- **Ações:** NUNCA fileira de botões cinza iguais. **Editar e Remover** vivem
  na linha de identidade, ao lado do chip de status, como botões-fantasma
  **SÓ ícone** (✏️ 🗑, tooltip com verbo + efeito; Remover em danger).
  Ações de mudança de estado (conectar, tornar padrão) ficam num **rodapé**
  com fundo `surface-2` + divisor, como botões-fantasma com ícone + rótulo —
  e o rodapé só é renderizado quando ainda existe passo a dar.
- **Ação cumprida NÃO aparece:** se o estado já diz "Conectado", não existe
  botão "Testar conexão". Passo técnico obrigatório (testar credencial,
  registrar webhook) é AUTOMÁTICO na sequência do salvar — nunca um clique
  separado do usuário.
- **Agrupamento por função ("molde"):** seções com rótulo uppercase 12px +
  descrição de 1–2 linhas; função indisponível aparece como card tracejado
  "EM BREVE" com explicação e onde vai morar.
- **Adicionar:** botão na linha do título; se o recurso tem mais de uma
  função, o clique abre a ESCOLHA DE FUNÇÃO (cards lado a lado, disponível ×
  em breve) antes do formulário.

## 2.1 Navegação por período (mês/ano)

Listas que crescem sem limite (notas fiscais, extrato, lançamentos) abrem no
**MÊS ATUAL por padrão** — nunca a base inteira. Controle: `‹ julho de 2026 ›`
(seta a seta), atalho "Mês atual" quando fora dele, e "Todos os meses" como
opção explícita. KPIs da tela contam o PERÍODO exibido. Combina com a
BuscaViva (parâmetros `mes` + `q` preservados nos links). Referência:
Financeiro → Notas fiscais (entrada).

## 3.1.1 Cores de alerta — VERMELHO NÃO EXISTE no sistema

Alerta/negativo/vencido usa a família ROSA (decisão do dono, 23/07/2026):
`--danger: #f472b6` · texto claro `#f9a8d4` / `#fbcfe8` · fundos escuros
`#3b1127` / `#3a1226` · tons fortes `#be185d` / `#831843`. Nunca usar hex
vermelho (`#ef4444`, `#fca5a5`, `#fecaca`…) — sempre o token `var(--danger)`
ou os rosas acima.

## 3.2 Processo em etapas (wizard) — OBRIGATÓRIO para fluxos longos

Referência: fluxo "Nova integração" do Banco Inter. Processo com 3+ grupos de
decisão NUNCA vai inteiro numa tela; vira wizard:

- **Uma tela, um foco:** cada etapa faz UMA pergunta/grupo (identificação,
  escolhas, dados, credenciais…), com título claro e microcopy curta.
- **Indicador de etapas** sempre visível (lateral em desktop): concluída com
  ✓ verde e link para editar, atual destacada, futuras esmaecidas.
- **Voltar / Continuar** em toda etapa ("Continuar" desabilitado até a etapa
  ficar válida); nada é gravado antes do fim.
- **Revisão final:** última etapa resume tudo o que foi escolhido, com atalho
  de edição por seção, antes do botão de confirmação único.
- Onde usar: conexão de banco, onboarding de organização, configuração do
  emissor fiscal, importações (planilha/OFX), cadastros ricos.

**Gabarito visual aprovado (23/07/2026): "Criar despesa da nota"**
(`app/painel/financeiro/entrada/despesa/[docId]/_components/wizard-despesa.tsx`).
Todo wizard novo segue estes detalhes:

- **Stepper em painel próprio à DIREITA** do form ("COMO FUNCIONA"), com uma
  frase de explicação por passo, estilo Office 365 — nunca espremido dentro
  do card do formulário.
- **Dinheiro sempre mascarado pt-BR** enquanto digita (dígitos entram como
  centavos, tipo app de banco; prefixo R$ dentro do campo, alinhado à
  direita). Nunca um input numérico cru.
- **Datas** com `type="date"`: calendário no clique E digitação livre.
- **Recorrência/parcelas: o usuário faz a REGRA** — "N parcela(s), a cada X
  dias/semanas/meses/anos" — com chips de sugestão de um clique (toda
  semana, a cada 15 dias, todo mês, a cada 3/6 meses, todo ano; a ativa
  acende em rosa). A regra parte da 1ª data; cada linha gerada continua
  editável individualmente.
- **Criação inline** do que faltar no caminho (ex.: "➕ Criar categoria…" no
  próprio select) — o usuário nunca abandona o fluxo para cadastrar apoio.
- Voltar do topo = componente `Voltar` (bola rosa, seta branca) — seção 1.

## 3.3 Ler primeiro, editar por intenção — OBRIGATÓRIO

Nenhuma tela de DADOS EXISTENTES abre em modo edição. O padrão:

- Os dados aparecem como **leitura bem apresentada** (avatar/ícone, nome em
  destaque, chips, linhas meta) — nunca inputs habilitados de cara.
- Um botão **✏️ Editar** (ou "Trocar…" para credenciais) revela o formulário,
  com **Cancelar + Salvar**; ao salvar, volta à leitura com confirmação curta.
- Vale para perfil, empresa, cadastros, configurações. Formulários de
  **criação** (novo cliente, nova despesa) abrem direto — não há o que ler.
- Referência: Configurações → Perfil (dados + senha).

## 3.4 Integridade visível + INTOCÁVEL = VERDADE FISCAL (não "pago")

Regra do dono (23/07 + **refinada em 27/07/2026**). O princípio que manda:
**o que o USUÁRIO criou/lançou/escreveu ele pode CORRIGIR** — quanto menos ele
redigita, menos erro. Só a **verdade fiscal** é intocável. Congela:

1. **NF-e capturada do site do governo** — o documento em si é intocável, sempre.
2. **Documento fiscal vinculado / NFS-e emitida pela empresa** → congela o
   **valor e a competência** (é verdade fiscal a partir daí).
3. **Apuração/competência fechada** (e DRE gerada) → congela **TUDO**.

**Pago NÃO trava** (a antiga "pago é intocável" valia só antes de existir o editar).

- **Editar (por CAMPO)** — `editarFatura` / `editarConta`:
  - descrição, vencimento (e categoria, na despesa) = do usuário → **livres**
    até a apuração fechar.
  - valor / competência → **congelam** quando há documento fiscal
    (`temDocFiscal`: fatura = `documento_fiscal_id` ou NFS-e autorizada; despesa
    = `origem='nota_fiscal'`). No form, viram só-leitura com 🔒 e explicação.
  - `bloqueioReceita/Despesa` (competência fechada) → congela tudo; cancelada é
    terminal. Ler primeiro, ✏️ Editar revela o form (seção 3.3).
- **Excluir (mesma régua)** — `excluirFatura` / `excluirConta`:
  - período fechado → bloqueia.
  - com documento fiscal → **CANCELA** preservando a nota e o histórico.
  - sem documento fiscal e período aberto → **apaga de vez** (mesmo paga),
    limpando os vínculos operacionais: desfaz a conciliação (o lançamento do
    banco **volta para a fila**, nunca some), apaga pagamentos, cobranças e
    tentativas de NFS-e falhas. Segurança não-fiscal: pagamento em curso no
    banco pede cancelar no banco antes.
  - Nunca exclusão de mentirinha (cancelar dizendo "excluído"), nunca órfão.
- **Criar**: o registro aparece imediatamente em todas as telas que o listam
  (consultas vivas), e a mensagem de sucesso aponta onde ele foi parar
  ("Concilie em Extrato de movimentações", "Revise em Comercial → Contratos").
- Referências: `editarFatura`/`excluirFatura` (financeiro/[id] e /actions),
  `editarConta`/`excluirConta` (financeiro/pagar), excluirContrato/excluirCliente.

## 4. Métricas e drill-down

- Definição de métrica mora em **helper de lib/** (ex.: `statusEfetivoFatura`)
  — nunca redefinida inline. Vencida = status vencida OU aberta vencida.
- **Todo número clicável aterrissa numa lista filtrada que mostra EXATAMENTE
  aquele número.** Conferir o clique de ponta a ponta.
- KPIs: card com rótulo muted 12px, valor 26px/700, sub muted 12px.

## 5. Formulários

- Ver checklist completo em CLAUDE.md/memória: abas por domínio, busca CNPJ/CEP,
  linhas repetíveis, máscaras, descrição obrigatória onde der sentido
  ("avulso de quê?").
- **Seletor de entidade que cresce (cliente, contrato, fornecedor, item) =
  `SeletorBusca`** (combobox com busca viva). `<select>` cru só para enums
  pequenos e fixos.
- Ficha/detalhe: RESUMO só leitura primeiro; editar é ação explícita (✏️).
- `?voltar=` sanitizado (`startsWith("/painel")`).

## 6. Histórico / trilhas

- Tabela **Data | Evento | Por** (nunca bullets com código cru), evento
  humanizado em PT + detalhe muted, bolinha de categoria, busca + filtros com
  contagem. Referência: aba Histórico do cliente.

## 7. Comunicação (e-mail, bot, PDF)

- Motor único `lib/email-render.ts` (layout de tabelas, logo, tabela de dados,
  botão sóbrio, rodapé corporativo). Textos elaborados, tom profissional —
  ver `padrao-comunicacao-profissional` na memória. Nunca HTML solto/texto seco.

## 7.1 Nomes de menus, títulos e subtítulos — Title Case pt-BR

Regra do dono (23/07/2026): em **menus, h1, h2 de cards e títulos de seção**,
as palavras principais levam maiúscula; conectivos ficam minúsculos (de, do,
da, dos, das, e, a, o, em, no, na, por, para, com).

- Certo: "Visão Geral", "Contas a Pagar", "Extrato de Movimentações",
  "Fluxo de Caixa", "Bancos e Boletos", "Notas Fiscais de Serviço".
- Errado: "Visão geral", "Contas A Pagar", "Extrato De Movimentações".
- Texto corrido/frases NÃO seguem a regra — só títulos/menus/subtítulos.
- Ao RENOMEAR uma tela: menu + h1 + todas as menções em outras telas no
  MESMO commit (nunca menu com um nome e a tela com outro).
- Nomes vigentes decididos: "Competência" (ex-Visão de competência),
  "NFS-e Automática" (ex-Notas fiscais, a caixa de captura),
  "Bancos e Boletos" (ex-Conta PJ e Cobrança).

## 8. Fuso horário

- "Hoje"/agora: `hojeSP()`, `somarDiasSP(n)`. Exibição: `dataSP`,
  `formatarDataHoraSP`. Servidor roda em UTC — depois das 21h o dia vira.

## Checklist antes de entregar QUALQUER tela

- [ ] Sem `maxWidth` no section raiz; comparou lado a lado com Clientes?
- [ ] h1 + ação primária na mesma linha; subtítulo muted
- [ ] BuscaViva + filtros/abas com contagem (se lista)
- [ ] Ações em ícones com tooltip; estado vazio decente
- [ ] Datas/horas pelos helpers SP; métricas por helper de lib/
- [ ] Números clicáveis pousam no filtro certo
- [ ] Seletores de entidade = SeletorBusca
- [ ] Criou os ATALHOS até a tela? (menu da conta, sidebar `pronto: true`,
      atalhos da Visão geral, ações contextuais) — tela sem atalho não existe
- [ ] Varreu as OUTRAS telas afetadas pelo mesmo padrão?
