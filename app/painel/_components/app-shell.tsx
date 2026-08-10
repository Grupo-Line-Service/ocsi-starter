"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { IndicadorNavegacao } from "@ocsi/ui/react-next/indicador-navegacao";
import { Sidebar, type ItemMenu } from "./sidebar";
import { AccountMenu } from "./account-menu";

/**
 * MOLDURA DO SISTEMA — header full-width + sidebar + área de conteúdo.
 *
 * Comportamento (padrão do grupo, 05/08/2026): no desktop a JANELA não rola —
 * cabeçalho e menu ficam sempre à mão, e só o `.painel-main` tem scroll. No
 * mobile a sidebar vira gaveta. As classes vêm de `@ocsi/ui/css/shell.css`.
 *
 * Este componente é APRESENTAÇÃO. Quem descobre usuário, organização e
 * permissão é o layout server (`app/painel/layout.tsx`) — assim a decisão de
 * acesso não depende do navegador.
 */
export function AppShell({
  organizacaoNome,
  logoUrl,
  usuarioNome,
  email,
  menu,
  children,
}: {
  organizacaoNome: string;
  logoUrl: string | null;
  usuarioNome: string;
  email: string;
  menu: ItemMenu[];
  children: React.ReactNode;
}) {
  const [gaveta, setGaveta] = useState(false);
  const pathname = usePathname();
  const main = useRef<HTMLElement>(null);

  // Trocou de tela: fecha a gaveta e volta o scroll ao topo. Sem isto, a tela
  // nova abre no meio — o scroller é o <main>, não a janela.
  useEffect(() => {
    setGaveta(false);
    main.current?.scrollTo({ top: 0 });
  }, [pathname]);

  // Contador de telas visitadas nesta aba: é o que permite ao botão Voltar
  // saber se existe passo anterior DENTRO do app (ver @ocsi/ui/react-next/voltar).
  useEffect(() => {
    try {
      const n = Number(sessionStorage.getItem("telas-visitadas") ?? "0");
      sessionStorage.setItem("telas-visitadas", String(n + 1));
    } catch {
      /* navegador sem sessionStorage: o Voltar cai no href fixo */
    }
  }, [pathname]);

  return (
    <div className="painel-root">
      {/* Sinal de que o clique foi recebido enquanto a próxima tela é montada
          no servidor. Suspense porque o indicador lê os parâmetros da URL. */}
      <Suspense fallback={null}>
        <IndicadorNavegacao />
      </Suspense>

      <header className="painel-header">
        <div className="painel-header-left">
          <button className="painel-hamburger" onClick={() => setGaveta(true)} aria-label="Abrir menu">
            ☰
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={logoUrl}
                alt={organizacaoNome}
                style={{ height: 34, width: "auto", maxWidth: 150, objectFit: "contain", flexShrink: 0 }}
              />
            ) : (
              <div
                style={{
                  width: 30, height: 30, borderRadius: 8,
                  background: "var(--accent)", color: "var(--accent-contrast)",
                  display: "grid", placeItems: "center", fontWeight: 800,
                }}
              >
                {(organizacaoNome || "O").trim().charAt(0).toUpperCase() || "O"}
              </div>
            )}
            <div className="painel-marca" style={{ lineHeight: 1.15 }}>
              <div style={{ fontWeight: 700, fontSize: 14 }}>{organizacaoNome}</div>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <AccountMenu usuarioNome={usuarioNome} email={email} />
        </div>
      </header>

      <div className="painel-body">
        <Sidebar itens={menu} aberta={gaveta} />
        {gaveta && <div className="painel-overlay" onClick={() => setGaveta(false)} />}
        <main className="painel-main" ref={main}>
          {children}
        </main>
      </div>
    </div>
  );
}
