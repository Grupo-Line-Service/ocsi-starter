"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { sair } from "../../login/actions";

/**
 * Menu da conta: iniciais, nome, e as ações de perfil e saída.
 *
 * Mantido enxuto de propósito — cada produto acrescenta os próprios itens.
 */
export function AccountMenu({ usuarioNome, email }: { usuarioNome: string; email: string }) {
  const [aberto, setAberto] = useState(false);
  const caixa = useRef<HTMLDivElement>(null);

  // Clique fora fecha. Sem isto o menu fica aberto atrás da tela seguinte.
  useEffect(() => {
    function fora(e: MouseEvent) {
      if (caixa.current && !caixa.current.contains(e.target as Node)) setAberto(false);
    }
    document.addEventListener("mousedown", fora);
    return () => document.removeEventListener("mousedown", fora);
  }, []);

  const iniciais = usuarioNome
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p.charAt(0).toUpperCase())
    .join("");

  return (
    <div ref={caixa} style={{ position: "relative" }}>
      <button
        onClick={() => setAberto((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={aberto}
        style={{
          display: "flex", alignItems: "center", gap: 8, padding: "4px 8px 4px 4px",
          background: "transparent", border: "1px solid var(--border)",
          borderRadius: 999, cursor: "pointer", color: "var(--text)",
        }}
      >
        <span
          style={{
            width: 30, height: 30, borderRadius: "50%",
            background: "linear-gradient(135deg, var(--accent), var(--accent-2))",
            color: "var(--accent-contrast)", display: "grid", placeItems: "center",
            fontWeight: 700, fontSize: 12,
          }}
        >
          {iniciais || "?"}
        </span>
        <span style={{ fontSize: 13, fontWeight: 600, maxWidth: 140 }} className="texto-truncado">
          {usuarioNome}
        </span>
      </button>

      {aberto && (
        <div
          role="menu"
          className="card"
          style={{
            position: "absolute", right: 0, top: "calc(100% + 8px)",
            minWidth: 240, padding: 8, zIndex: 50,
          }}
        >
          <div style={{ padding: "8px 10px 10px" }}>
            <div style={{ fontWeight: 700 }}>{usuarioNome}</div>
            <div className="muted" style={{ fontSize: 12 }}>{email}</div>
          </div>
          <div style={{ height: 1, background: "var(--border)", margin: "4px 0 6px" }} />
          <Link href="/painel/perfil" className="account-menu-item" style={itemEstilo} role="menuitem">
            Meu perfil
          </Link>
          <form action={sair}>
            <button type="submit" className="account-menu-item" style={{ ...itemEstilo, width: "100%", textAlign: "left", background: "none", border: "none", cursor: "pointer" }} role="menuitem">
              Sair
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

const itemEstilo: React.CSSProperties = {
  display: "block",
  padding: "9px 10px",
  borderRadius: 8,
  fontSize: 14,
  color: "var(--text)",
};
