"use client";

import { useState } from "react";

/** Máscara de dinheiro (digita os centavos): "156000" → "1.560,00". */
function maskMoney(v: string): string {
  const d = v.replace(/\D/g, "").replace(/^0+/, "").slice(0, 12);
  if (!d) return "";
  const cents = d.padStart(3, "0");
  return `${Number(cents.slice(0, -2)).toLocaleString("pt-BR")},${cents.slice(-2)}`;
}

/** Input de valor em R$ com máscara pt-BR — parseValor lê direto no servidor. */
export function CampoDinheiro({
  name,
  obrigatorio,
  inicial,
  placeholder,
}: {
  name: string;
  obrigatorio?: boolean;
  inicial?: string;
  placeholder?: string;
}) {
  const [v, setV] = useState(inicial ?? "");
  return (
    <input
      className="input"
      name={name}
      required={obrigatorio}
      value={v}
      onChange={(e) => setV(maskMoney(e.target.value))}
      placeholder={placeholder ?? "0,00"}
      inputMode="decimal"
      autoComplete="off"
    />
  );
}
