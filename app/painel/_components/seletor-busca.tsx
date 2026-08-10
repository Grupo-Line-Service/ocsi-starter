"use client";

import { useEffect, useMemo, useRef, useState } from "react";

export type OpcaoSeletor = { id: string; rotulo: string; detalhe?: string | null };

/**
 * Combobox com BUSCA VIVA — o padrão do sistema para escolher entidades que
 * crescem (clientes, contratos, fornecedores…). Digita → filtra → seleciona.
 * O id escolhido viaja num input hidden (`name`); o texto é só apresentação.
 * Substitui QUALQUER <select> cru de entidade (regra do dono, 22/07).
 */
export function SeletorBusca({
  name,
  opcoes,
  inicialId,
  placeholder,
  obrigatorio,
  onEscolha,
}: {
  name: string;
  opcoes: OpcaoSeletor[];
  inicialId?: string | null;
  placeholder?: string;
  obrigatorio?: boolean;
  onEscolha?: (opcao: OpcaoSeletor | null) => void;
}) {
  const inicial = useMemo(() => opcoes.find((o) => o.id === inicialId) ?? null, [opcoes, inicialId]);
  const [texto, setTexto] = useState(inicial?.rotulo ?? "");
  const [selecionado, setSelecionado] = useState<OpcaoSeletor | null>(inicial);
  const [aberto, setAberto] = useState(false);
  const [destaque, setDestaque] = useState(0);
  const caixaRef = useRef<HTMLDivElement>(null);

  const filtro = texto.trim().toLowerCase();
  const visiveis = useMemo(() => {
    if (!filtro || (selecionado && texto === selecionado.rotulo)) return opcoes.slice(0, 50);
    return opcoes
      .filter((o) => `${o.rotulo} ${o.detalhe ?? ""}`.toLowerCase().includes(filtro))
      .slice(0, 50);
  }, [opcoes, filtro, selecionado, texto]);

  // Fecha ao clicar fora.
  useEffect(() => {
    const fora = (e: MouseEvent) => {
      if (!caixaRef.current?.contains(e.target as Node)) setAberto(false);
    };
    document.addEventListener("mousedown", fora);
    return () => document.removeEventListener("mousedown", fora);
  }, []);

  function escolher(o: OpcaoSeletor) {
    setSelecionado(o);
    setTexto(o.rotulo);
    setAberto(false);
    onEscolha?.(o);
  }

  function aoDigitar(v: string) {
    setTexto(v);
    setAberto(true);
    setDestaque(0);
    if (selecionado && v !== selecionado.rotulo) {
      setSelecionado(null);
      onEscolha?.(null);
    }
  }

  return (
    <div ref={caixaRef} style={{ position: "relative" }}>
      <input type="hidden" name={name} value={selecionado?.id ?? ""} />
      <input
        className="input"
        value={texto}
        required={obrigatorio && !selecionado}
        placeholder={placeholder ?? "Digite para buscar…"}
        autoComplete="off"
        onChange={(e) => aoDigitar(e.target.value)}
        onFocus={() => setAberto(true)}
        onKeyDown={(e) => {
          if (!aberto && (e.key === "ArrowDown" || e.key === "Enter")) setAberto(true);
          if (e.key === "ArrowDown") { e.preventDefault(); setDestaque((d) => Math.min(d + 1, visiveis.length - 1)); }
          if (e.key === "ArrowUp") { e.preventDefault(); setDestaque((d) => Math.max(d - 1, 0)); }
          if (e.key === "Enter" && aberto && visiveis[destaque]) { e.preventDefault(); escolher(visiveis[destaque]); }
          if (e.key === "Escape") setAberto(false);
        }}
        style={selecionado ? { borderColor: "var(--ok)" } : undefined}
      />
      {aberto && visiveis.length > 0 && (
        <div
          style={{
            position: "absolute", left: 0, right: 0, top: "calc(100% + 4px)", zIndex: 40,
            maxHeight: 280, overflowY: "auto",
            background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 10,
            boxShadow: "0 14px 34px rgba(0,0,0,.5)",
          }}
        >
          {visiveis.map((o, i) => (
            <button
              key={o.id}
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => escolher(o)}
              onMouseEnter={() => setDestaque(i)}
              style={{
                display: "block", width: "100%", textAlign: "left", padding: "9px 12px",
                background: i === destaque ? "var(--surface-2)" : "transparent",
                border: "none", cursor: "pointer", color: "var(--text)", font: "inherit", fontSize: 14,
              }}
            >
              {o.rotulo}
              {o.detalhe && <span className="muted" style={{ fontSize: 12 }}> · {o.detalhe}</span>}
            </button>
          ))}
        </div>
      )}
      {aberto && visiveis.length === 0 && (
        <div style={{ position: "absolute", left: 0, right: 0, top: "calc(100% + 4px)", zIndex: 40, background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 10, padding: "10px 12px", fontSize: 13 }} className="muted">
          Nada encontrado para “{texto}”.
        </div>
      )}
    </div>
  );
}
