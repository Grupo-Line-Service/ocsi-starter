# Manutenção do starter — o que pode e o que NÃO pode entrar aqui

> **Este arquivo é do STARTER, não do seu produto.**
> Criou um produto a partir deste template? **Apague este arquivo.** As regras
> abaixo valem para quem mantém o template, não para quem o usa.

## Este repositório é PÚBLICO

Qualquer pessoa lê, clona e indexa o que estiver aqui. Isso é intencional — o
starter e o `@ocsi/ui` mostram *como* construímos, não *o que* vendemos. Mas
significa que uma linha descuidada fica pública para sempre: apagar depois não
desfaz clones, caches nem buscadores.

## ❌ NUNCA entra

| | Por quê |
|---|---|
| Chave, token, senha, URL de projeto real | É segredo. `.env.example` só com placeholder. |
| Regra de negócio de qualquer produto | Fiscal, cobrança, contratos, MTR, rastreamento — isso é do produto, e produto é privado. |
| Nome, CNPJ ou dado de cliente | Nem em exemplo, nem em comentário, nem em teste. Use "Organização A". |
| Integração com serviço pago ou contratado | Endpoint, formato de payload e particularidade de contrato são nossos. |
| Esquema de banco específico de um produto | Só o núcleo: `organizacoes` e `usuarios`. |
| Print, log ou trecho de dado real | Mesmo anonimizado — o formato já entrega coisa demais. |

## ✅ Pode entrar

- Esqueleto, convenção e estrutura de pastas
- Autenticação, proteção de rota, RLS **genéricos**
- Componentes de tela sem dado (o que for reutilizável sobe para o `@ocsi/ui`)
- Lições de engenharia, inclusive de incidentes nossos, **desde que descrevam o
  defeito técnico e não o cliente ou o negócio**. "Migração fora de ordem quebra
  o CI" pode; "o cliente X ficou sem faturar" não.

## Teste antes de commitar

Pergunte: *"se um concorrente ler isto, ele ganha alguma coisa além de uma boa
prática de engenharia?"* Se a resposta for sim, não entra.

E, no automático:

```bash
grep -rniE "eyJ[A-Za-z0-9_-]{20,}|\.supabase\.co|password\s*=|secret\s*=" \
  --include="*.ts" --include="*.tsx" --include="*.sql" --include="*.md" . \
  | grep -v node_modules | grep -v placeholder
```

Saída vazia = pode publicar.

## Quando o gabarito muda

Mudança estrutural no `saas-gestao` (esqueleto, shell, convenção, versão de
dependência) **precisa vir para cá** — senão o próximo produto nasce velho, que
é exatamente o problema que este template existe para resolver.

⚠️ **As versões de Next, React e Supabase espelham o gabarito.** Não "atualize
porque saiu nova": alinhe com o `saas-gestao`. Divergir quebra de formas que
parecem outro assunto — `@supabase/ssr` 0.5 contra 0.12 derrubou 15 pontos do
typecheck com erros que aparentavam ser de tipagem do banco.
