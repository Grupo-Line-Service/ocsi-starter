"use client";

import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";

/**
 * Busca VIVA genérica (padrão do sistema): filtra enquanto digita (debounce
 * 300ms) atualizando ?q= na URL — preservando os demais parâmetros (abas,
 * ordenação). Reutilizável em qualquer lista. Acabamento: botão rosa com lupa
 * grudado no fim do campo (clicar busca na hora, sem esperar o debounce).
 */
export function BuscaViva({
  base,
  inicial,
  placeholder,
  inline = false,
}: {
  base: string;
  inicial: string;
  placeholder: string;
  /** Cola a busca numa linha já existente (sem margem inferior, cresce e alinha à direita). */
  inline?: boolean;
}) {
  const router = useRouter();
  const params = useSearchParams();
  const [valor, setValor] = useState(inicial);
  const [pendente, startTransition] = useTransition();
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const primeira = useRef(true);

  const buscar = useCallback(
    (termo: string) => {
      startTransition(() => {
        const novos = new URLSearchParams(params.toString());
        const q = termo.trim();
        if (q) novos.set("q", q);
        else novos.delete("q");
        novos.delete("msg");
        novos.delete("erro");
        const qs = novos.toString();
        router.replace(qs ? `${base}?${qs}` : base, { scroll: false });
      });
    },
    [base, params, router],
  );

  useEffect(() => {
    if (primeira.current) {
      primeira.current = false;
      return;
    }
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => buscar(valor), 300);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [valor, buscar]);

  const dispararAgora = () => {
    if (timer.current) clearTimeout(timer.current);
    buscar(valor);
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        marginBottom: inline ? 0 : 16,
        ...(inline ? { flex: "1 1 240px", justifyContent: "flex-end" } : {}),
      }}
    >
      <CampoBusca
        valor={valor}
        onChange={setValor}
        onBuscar={dispararAgora}
        placeholder={placeholder}
        pendente={pendente}
      />
      {pendente && <span className="muted" style={{ fontSize: 13 }}>buscando…</span>}
    </div>
  );
}

/**
 * Campo de busca com o acabamento do sistema: lupa rosa no fim + botão de
 * limpar quando há texto. Compartilhado entre as buscas vivas.
 */
export function CampoBusca({
  valor,
  onChange,
  onBuscar,
  placeholder,
  pendente = false,
}: {
  valor: string;
  onChange: (v: string) => void;
  onBuscar: () => void;
  placeholder: string;
  pendente?: boolean;
}) {
  return (
    <div style={{ position: "relative", width: "100%", maxWidth: 420 }}>
      <input
        className="input"
        value={valor}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            onBuscar();
          }
        }}
        placeholder={placeholder}
        style={{ paddingRight: valor ? 82 : 52 }}
        autoComplete="off"
      />
      {valor && (
        <button
          type="button"
          onClick={() => onChange("")}
          aria-label="Limpar busca"
          title="Limpar"
          style={{
            position: "absolute",
            right: 48,
            top: "50%",
            transform: "translateY(-50%)",
            width: 24,
            height: 24,
            borderRadius: "50%",
            border: "none",
            background: "transparent",
            color: "var(--text-dim)",
            cursor: "pointer",
            fontSize: 15,
            lineHeight: 1,
            display: "grid",
            placeItems: "center",
          }}
        >
          ✕
        </button>
      )}
      <button
        type="button"
        onClick={onBuscar}
        aria-label="Buscar"
        title="Buscar"
        style={{
          position: "absolute",
          right: 5,
          top: "50%",
          transform: "translateY(-50%)",
          width: 38,
          height: 32,
          borderRadius: 8,
          border: "none",
          cursor: "pointer",
          background: "linear-gradient(135deg, var(--accent), var(--accent-2))",
          color: "var(--accent-contrast)",
          boxShadow: "0 4px 12px var(--accent-soft)",
          display: "grid",
          placeItems: "center",
          opacity: pendente ? 0.7 : 1,
          transition: "filter 0.15s ease",
        }}
      >
        <svg width={17} height={17} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="7" />
          <path d="M21 21l-4.3-4.3" />
        </svg>
      </button>
    </div>
  );
}
