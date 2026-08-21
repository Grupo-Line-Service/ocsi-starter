"use client";

import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";

/**
 * Diálogo de confirmação DO SISTEMA (SAAS-118): substitui o window.confirm/alert
 * nativo ("app.ocsi.com.br diz…") por um modal no tema do cliente. Um host único
 * no layout raiz atende o app inteiro; as telas chamam `confirmar()`/`avisar()`
 * (Promise) ou o atalho `confirmarSubmit()` para formulários com server action.
 *
 * Acessível: role alertdialog, foco no botão de confirmar, Esc/overlay cancela,
 * mensagens com quebra de linha preservada (whiteSpace pre-line).
 */

export type OpcoesConfirmar = {
  mensagem: string;
  titulo?: string;
  /** Rótulo do botão de ação (padrão "Confirmar"). */
  confirmarRotulo?: string;
  cancelarRotulo?: string;
  /** "perigo" pinta a ação de vermelho (excluir/remover/cancelar sem volta). */
  tom?: "normal" | "perigo";
  /** Aviso simples: só o botão OK (substitui o alert). */
  somenteAviso?: boolean;
};

type Pendente = OpcoesConfirmar & { resolver: (ok: boolean) => void };

// O host registra o abridor aqui ao montar (client-only, um por página).
let abrirDialogo: ((p: Pendente) => void) | null = null;

/** Pergunta e resolve true/false. Sem host montado, cai no confirm nativo. */
export function confirmar(o: OpcoesConfirmar | string): Promise<boolean> {
  const op: OpcoesConfirmar = typeof o === "string" ? { mensagem: o } : o;
  if (!abrirDialogo) return Promise.resolve(window.confirm(op.mensagem));
  return new Promise((resolver) => abrirDialogo!({ ...op, resolver }));
}

/** Aviso com um OK (substitui o alert nativo). */
export function avisar(mensagem: string, titulo?: string): Promise<void> {
  return confirmar({ mensagem, titulo, somenteAviso: true, confirmarRotulo: "OK" }).then(() => undefined);
}

/**
 * Atalho para `<form action={serverAction} onSubmit={(e) => confirmarSubmit(e, "…")}>`:
 * segura o envio, pergunta no diálogo e reenvia o MESMO form se confirmado
 * (flag em dataset evita loop no onSubmit disparado pelo requestSubmit).
 */
export function confirmarSubmit(e: FormEvent<HTMLFormElement>, o: OpcoesConfirmar | string): void {
  const form = e.currentTarget;
  if (form.dataset.confirmado === "1") {
    delete form.dataset.confirmado;
    return;
  }
  e.preventDefault();
  void confirmar(o).then((ok) => {
    if (!ok) return;
    form.dataset.confirmado = "1";
    form.requestSubmit();
  });
}

export function DialogoConfirmarHost() {
  const [pendente, setPendente] = useState<Pendente | null>(null);
  const botaoRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    abrirDialogo = (p) => {
      // Pergunta nova por cima de uma aberta: a antiga responde "não" (não trava).
      setPendente((atual) => {
        atual?.resolver(false);
        return p;
      });
    };
    return () => {
      abrirDialogo = null;
    };
  }, []);

  useEffect(() => {
    if (!pendente) return;
    botaoRef.current?.focus();
    const aoTeclar = (ev: KeyboardEvent) => {
      if (ev.key === "Escape") {
        ev.preventDefault();
        fechar(false);
      }
    };
    window.addEventListener("keydown", aoTeclar);
    return () => window.removeEventListener("keydown", aoTeclar);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pendente]);

  function fechar(ok: boolean) {
    pendente?.resolver(ok);
    setPendente(null);
  }

  if (!pendente) return null;
  const perigo = pendente.tom === "perigo";

  return (
    <div
      onClick={() => fechar(false)}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 10000,
        background: "rgba(0,0,0,.45)",
        display: "grid",
        placeItems: "center",
        padding: 16,
      }}
    >
      <style>{`
        @keyframes dlg-in { from { opacity: 0; transform: translateY(10px) scale(.98); } to { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: reduce) { .dlg-sistema { animation: none !important; } }
      `}</style>
      <div
        role="alertdialog"
        aria-modal="true"
        aria-label={pendente.titulo ?? (pendente.somenteAviso ? "Aviso" : "Confirmar")}
        className="card dlg-sistema"
        onClick={(ev) => ev.stopPropagation()}
        style={{
          maxWidth: 440,
          width: "100%",
          padding: "20px 22px",
          boxShadow: "0 24px 60px rgba(0,0,0,.35)",
          animation: "dlg-in .18s ease-out",
        }}
      >
        <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 8 }}>
          {pendente.titulo ?? (pendente.somenteAviso ? "Aviso" : perigo ? "Tem certeza?" : "Confirmar")}
        </div>
        <p style={{ margin: 0, fontSize: 14, lineHeight: 1.55, whiteSpace: "pre-line", color: "var(--text-dim)" }}>
          {pendente.mensagem}
        </p>
        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 18 }}>
          {!pendente.somenteAviso && (
            <button type="button" className="btn" onClick={() => fechar(false)}>
              {pendente.cancelarRotulo ?? "Cancelar"}
            </button>
          )}
          <button
            ref={botaoRef}
            type="button"
            className={perigo ? "btn" : "btn btn-primary"}
            onClick={() => fechar(true)}
            style={perigo ? { background: "var(--danger)", borderColor: "var(--danger)", color: "#fff" } : undefined}
          >
            {pendente.confirmarRotulo ?? "Confirmar"}
          </button>
        </div>
      </div>
    </div>
  );
}
