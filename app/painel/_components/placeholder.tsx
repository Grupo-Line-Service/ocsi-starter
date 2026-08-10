export function ModulePlaceholder({
  titulo,
  descricao,
  itens,
}: {
  titulo: string;
  descricao: string;
  itens: string[];
}) {
  return (
    <section>
      <h1 style={{ marginTop: 0 }}>{titulo}</h1>
      <p className="muted">
        {descricao}
      </p>
      <div className="card" style={{ maxWidth: 620 }}>
        <div className="muted" style={{ fontSize: 12, marginBottom: 8 }}>
          Nesta tela (em construção)
        </div>
        <ul style={{ margin: 0, paddingLeft: 18 }}>
          {itens.map((i) => (
            <li key={i} style={{ marginBottom: 4 }}>
              {i}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
