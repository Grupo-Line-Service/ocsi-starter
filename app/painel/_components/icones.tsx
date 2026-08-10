import type { CSSProperties, ReactNode } from "react";

function Svg({ children }: { children: ReactNode }) {
  return (
    <svg
      width={16}
      height={16}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

export const IconeEditar = (
  <Svg>
    <path d="M12 20h9" />
    <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4z" />
  </Svg>
);

export const IconeExcluir = (
  <Svg>
    <path d="M3 6h18" />
    <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    <path d="M6 6l1 14a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-14" />
  </Svg>
);

export const IconePower = (
  <Svg>
    <path d="M12 2v10" />
    <path d="M18.36 6.64a9 9 0 1 1-12.72 0" />
  </Svg>
);

export const IconeVenda = (
  <Svg>
    <path d="M12 2v20" />
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
  </Svg>
);

export const IconeContrato = (
  <Svg>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <path d="M14 2v6h6" />
    <path d="M8 13h8" />
    <path d="M8 17h5" />
  </Svg>
);

/** Botão só-ícone, quadrado, alinhado (usa a classe .btn para borda/hover). */
export const estiloIconeBtn: CSSProperties = {
  padding: 6,
  display: "inline-grid",
  placeItems: "center",
  verticalAlign: "middle",
  lineHeight: 0,
};
