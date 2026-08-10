import type { CSSProperties } from "react";

/** Ação-fantasma padrão: botão sem fundo, ícone + rótulo, para rodapé de card. */
export const acaoFantasma: CSSProperties = {
  background: "transparent",
  border: "none",
  color: "var(--text-dim)",
  padding: "6px 10px",
  borderRadius: 8,
  fontSize: 13,
  cursor: "pointer",
  font: "inherit",
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
  textDecoration: "none",
};

/** Título de seção do sistema: rótulo uppercase com ícone + descrição de 1–2 linhas. */
export function TituloSecao({ icone, titulo, descricao }: { icone: string; titulo: string; descricao: string }) {
  return (
    <div>
      <div style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: 0.5, fontWeight: 700, color: "var(--text-dim)" }}>
        {icone ? `${icone} ` : ""}{titulo}
      </div>
      <p className="muted" style={{ margin: "4px 0 0", fontSize: 13 }}>{descricao}</p>
    </div>
  );
}
