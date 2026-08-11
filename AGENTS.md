# AGENTS.md


<!-- OCSI:GOVERNANCA:INICIO -->
## Governança OCSI (bloco gerado — não edite aqui)

> Este trecho é sincronizado a partir de
> [`ocsi-framework/docs/governance/BLOCO_AGENTS.md`](https://github.com/Grupo-Line-Service/ocsi-framework/blob/main/docs/governance/BLOCO_AGENTS.md)
> e é **idêntico em todos os produtos**. Para mudar, edite **lá** e rode
> `node scripts/sincronizar-governanca.mjs` — a alteração chega sozinha a todos
> os repositórios. Alterar este bloco no produto será sobrescrito.

### 1. Leia a fonte da verdade ANTES, documente nela DEPOIS

> Regra do dono, 11/08/2026: *"sempre verificar a fonte da verdade antes de
> atualizar, olhar; fez, documenta — porque tem várias equipes usando, e tem que
> ser regra."*

**ANTES** de escrever código que aplica uma regra de negócio, abra a fonte e
**leia**: o Notion (negócio) e o `docs/` do repositório (técnico). Não vale
confiar na memória, e **não vale confiar no resumo da issue** — issue resumindo
documento velho já mandou construir o motor errado.

**DEPOIS** de fazer, a decisão volta para a fonte: **datada, com a frase de quem
decidiu, e dizendo o que ela REVOGA**. Registro completo = Notion + `docs/` do
repositório + Linear + o `CLAUDE.md` do produto afetado.

**Documento que contradiz a decisão nova não fica de pé.** Reescreva a seção e
marque a revogação — duas versões convivendo é pior do que não ter documento.

Custou duas vezes no mesmo dia (11/08/2026): o KPI "Faturado no mês" nasceu
somando `faturas` quando o documento oficial já dizia desde 06/08 que quem manda
no "faturei" é a **nota fiscal**; e a política comercial desatualizada fez tratar
como **defeito** uma cobrança que era **legítima** (SAAS-224).

**Várias equipes consomem os mesmos documentos. Documento desatualizado não erra
sozinho — ele multiplica o erro pelo número de times.**

### 2. Regra COPIADA não é regra DISTRIBUÍDA

O que precisa valer em todo lugar mora em **um** lugar e é **referenciado ou
gerado** — nunca duplicado à mão. Cópia congela e diverge em silêncio:

- o visual dos produtos era cópia → virou o pacote **`@ocsi/ui`**;
- a governança era cópia → virou **este bloco**, sincronizado por script;
- e em 11/08/2026 o `Voltar` do RG ainda estava quebrado porque o pacote levou
  metade do mecanismo: **peça de núcleo que depende de o produto lembrar de
  fazer algo não é peça de núcleo, é armadilha.**

Antes de criar componente, classe ou utilitário, consulte o
[catálogo do núcleo](https://github.com/Grupo-Line-Service/ocsi-ui/blob/main/docs/catalogo.md).
**Se está lá, IMPORTE; nunca recrie com outro nome.**

**O limite da distribuição** (regra do dono, 11/08/2026): a base é MODULAR —
**o núcleo vale para todos; módulo é eletivo, por cliente.** Distribuir não é
empurrar tudo para todo mundo:

| Camada | Exemplo | Chega a quem |
|---|---|---|
| Núcleo | governança, `@ocsi/ui`, esqueleto do starter | **todos**, automaticamente |
| Módulo eletivo | fiscal, frota, resíduos, VMS | **só quem ativou** (`organizacao_modulos`) |
| Sob medida | módulo construído para UM cliente | **só aquele cliente** |
| Específico do produto | telas e regras do domínio | só o próprio repositório |

Copiar peça de módulo para o núcleo "porque dois produtos usam" quebra a
cobrança (módulo é o que se vende) e obriga todo mundo a carregar o que não
comprou. Se dois produtos precisam do mesmo módulo, o caminho é o HUB — ativa-se
o módulo para o cliente, não se duplica o código.

O **sob medida** tem duas regras a mais: (1) nasce e morre atrás do gate do
cliente — generalizar para o catálogo é decisão COMERCIAL do dono, nunca
"aproveitamento" técnico; (2) por carregar negócio do cliente, **jamais**
encosta nos repositórios públicos (`ocsi-ui`, `ocsi-starter`) — nem como
exemplo, nem em teste, nem em comentário.

### 3. Um agente por vez no repositório

Antes de escrever, confira branch e commits recentes. Se outro agente está
trabalhando ali, **não escreva de fora** — entregue o texto pronto por issue no
Linear, ou abra PR. Decisão aprovada vira teste, não vira só comentário.

### 4. Onde cada coisa é registrada

| O quê | Onde |
|---|---|
| Decisão de negócio | Notion (Centro de Comando → página do produto) |
| Regra técnica do produto | `docs/` do repositório + `CLAUDE.md` |
| Governança que vale para todos | `ocsi-framework/docs/governance/` |
| Execução / tarefa | Linear (Iniciativa → Projeto → Issue) |
| Código | GitHub, commit explicando **por quê** |
<!-- OCSI:GOVERNANCA:FIM -->

Este repositório segue as instruções de [`CLAUDE.md`](CLAUDE.md) — leia antes de
qualquer alteração.

O padrão do grupo vive no [ocsi-framework](https://github.com/Grupo-Line-Service/ocsi-framework)
e o núcleo compartilhado em [ocsi-ui](https://github.com/Grupo-Line-Service/ocsi-ui).

## REGRA DE PROCESSO: leia a fonte ANTES, documente nela DEPOIS

> Regra do dono, 11/08/2026: *"sempre verificar a fonte da verdade antes de
> atualizar, olhar; fez, documenta — porque tem várias equipes usando, e tem que
> ser regra."*

**ANTES** de escrever código que aplica uma regra de negócio, abra a fonte e
leia — o documento oficial do produto, não a memória e **não o resumo da
issue** (issue resumindo documento velho já mandou construir o motor errado).

**DEPOIS** de fazer, a decisão volta para a fonte: datada, com a frase de quem
decidiu, e dizendo o que ela **revoga**. Documento que contradiz a decisão nova
não fica de pé — reescreva a seção e marque a revogação.

Por que é regra e não recomendação: **várias equipes consomem os mesmos
documentos**. Documento desatualizado não erra sozinho — ele multiplica o erro
pelo número de times.
