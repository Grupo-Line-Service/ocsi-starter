"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export type ItemMenu = {
  href: string;
  rotulo: string;
  /** Emoji ou SVG. Mantenha um só por item — ícone é atalho visual, não enfeite. */
  icone?: React.ReactNode;
};

/**
 * Menu lateral. As classes (`.sb-item`, `.sb-ativo`) vêm de
 * `@ocsi/ui/css/shell.css` — o item ativo sai no gradiente da marca do
 * inquilino, sem nada de cor escrita aqui.
 *
 * Os itens vêm por prop, do layout server: assim o menu já chega FILTRADO pela
 * permissão de quem entrou, em vez de renderizar tudo e esconder no cliente
 * (esconder no cliente não protege nada — o link continua acessível).
 */
export function Sidebar({ itens, aberta }: { itens: ItemMenu[]; aberta: boolean }) {
  const pathname = usePathname();

  return (
    <aside
      className={`painel-sidebar${aberta ? " aberta" : ""}`}
      style={{
        width: 248,
        minWidth: 248,
        borderRight: "1px solid var(--border)",
        background: "var(--surface)",
        padding: "14px 12px",
        display: "flex",
        flexDirection: "column",
        gap: 4,
        overflowY: "auto",
      }}
    >
      {itens.map((item) => {
        const ativo = pathname === item.href || pathname.startsWith(item.href + "/");
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`sb-item${ativo ? " sb-ativo" : ""}`}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "10px 14px",
              fontSize: 14,
            }}
          >
            {item.icone && <span aria-hidden style={{ flexShrink: 0 }}>{item.icone}</span>}
            {item.rotulo}
          </Link>
        );
      })}
    </aside>
  );
}
