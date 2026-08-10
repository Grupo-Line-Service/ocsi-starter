"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

/**
 * Toast global do sistema. Lê os parâmetros que as telas já usam ao redirecionar
 * (`?msg=` sucesso, `?erro=` erro, `?ok=1` sucesso genérico) e mostra um aviso
 * VISÍVEL no topo — some sozinho e limpa a URL (não repete no F5). Assim toda
 * tela ganha feedback bom sem precisar mexer nela.
 */
export function Toast() {
  const params = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const [toast, setToast] = useState<{ tipo: "ok" | "erro"; texto: string } | null>(null);

  const erro = params.get("erro");
  const msg = params.get("msg");
  const ok = params.get("ok");

  useEffect(() => {
    let texto: string | null = null;
    let tipo: "ok" | "erro" = "ok";
    if (erro) {
      texto = erro;
      tipo = "erro";
    } else if (msg) {
      texto = msg;
      tipo = "ok";
    } else if (ok === "1") {
      texto = "Alterações salvas com sucesso.";
      tipo = "ok";
    }
    if (!texto) return;

    setToast({ tipo, texto });

    // Limpa os parâmetros da URL para não reaparecer no refresh.
    const sp = new URLSearchParams(Array.from(params.entries()));
    sp.delete("erro");
    sp.delete("msg");
    sp.delete("ok");
    const qs = sp.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });

    const t = setTimeout(() => setToast(null), tipo === "erro" ? 6500 : 4200);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [erro, msg, ok]);

  if (!toast) return null;
  const sucesso = toast.tipo === "ok";

  return (
    <>
      <style>{`
        @keyframes toast-in { from { opacity: 0; transform: translate(-50%, -14px); } to { opacity: 1; transform: translate(-50%, 0); } }
        @media (prefers-reduced-motion: reduce) { .toast-sistema { animation: none !important; } }
      `}</style>
      <div
        role={sucesso ? "status" : "alert"}
        aria-live={sucesso ? "polite" : "assertive"}
        className="toast-sistema"
        style={{
          position: "fixed",
          top: 18,
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 9999,
          maxWidth: "min(520px, calc(100vw - 24px))",
          display: "flex",
          alignItems: "flex-start",
          gap: 12,
          padding: "13px 16px",
          borderRadius: 12,
          background: sucesso ? "var(--chip-ok-bg)" : "var(--chip-danger-bg)",
          color: sucesso ? "var(--chip-ok-fg)" : "var(--chip-danger-fg)",
          border: `1px solid ${sucesso ? "var(--chip-ok-fg)" : "var(--chip-danger-fg)"}`,
          boxShadow: "0 12px 34px rgba(0,0,0,.22)",
          animation: "toast-in .22s ease-out",
          fontSize: 14,
          fontWeight: 600,
          lineHeight: 1.45,
        }}
      >
        <span style={{ fontSize: 16, flexShrink: 0, marginTop: 1 }}>{sucesso ? "✅" : "⚠️"}</span>
        <span style={{ flex: 1 }}>{toast.texto}</span>
        <button
          type="button"
          onClick={() => setToast(null)}
          aria-label="Fechar aviso"
          style={{ background: "none", border: "none", color: "inherit", cursor: "pointer", fontSize: 16, lineHeight: 1, opacity: 0.7, flexShrink: 0, padding: 0 }}
        >
          ✕
        </button>
      </div>
    </>
  );
}
