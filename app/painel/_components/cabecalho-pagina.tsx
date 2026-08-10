import Link from "next/link";

/**
 * CABEÇALHO PADRÃO DE PÁGINA (dono, 07/08/2026: "coloca uma moldura no título,
 * quero mais bonita essa tela e todas as próximas vinculadas a essa").
 *
 * Uma faixa com moldura própria: título + explicação de um lado, ações
 * primárias do outro, tudo dentro do mesmo bloco. Substitui o
 * `<div flex space-between><h1>…</h1>{ações}</div> + <p muted>` solto.
 *
 * Uso:
 *   <CabecalhoPagina titulo="Clientes" descricao="…" acoes={<>…</>} />
 */
export function CabecalhoPagina({
  titulo,
  descricao,
  acoes,
  chip,
  href,
}: {
  titulo: string;
  descricao?: React.ReactNode;
  acoes?: React.ReactNode;
  /** Selo ao lado do título (status da tela, contagem, ambiente…). */
  chip?: React.ReactNode;
  /** Quando informado, o PRÓPRIO título vira a porta de edição. */
  href?: string;
}) {
  return (
    <div className="cabecalho-pagina">
      <div style={{ flex: 1, minWidth: 240 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
          <h1 style={{ margin: 0, fontSize: 26, letterSpacing: -0.4 }}>
            {href ? (
              <Link href={href} className="titulo-editavel" title="Editar cadastro">
                {titulo}
              </Link>
            ) : (
              titulo
            )}
          </h1>
          {chip}
        </div>
        {descricao && (
          <p className="muted" style={{ margin: "6px 0 0", fontSize: 13.5, maxWidth: 760, lineHeight: 1.5 }}>
            {descricao}
          </p>
        )}
      </div>
      {acoes && <div style={{ display: "flex", gap: 8, flexWrap: "wrap", flexShrink: 0 }}>{acoes}</div>}
    </div>
  );
}
