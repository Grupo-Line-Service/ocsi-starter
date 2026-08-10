import Link from "next/link";
import { hojeSP, rotuloMesAno, somarMeses } from "@ocsi/ui/lib/formato";

/**
 * Navegador de MÊS/ANO do padrão extrato (regra do dono, 03/08/2026: "filtro
 * por mês/ano em todo lugar que tem planilha"). Server component de links —
 * o mês vive na URL (`?mes=AAAA-MM` ou `mes=todos`) e a tela filtra por ele.
 *
 * Uso: <FiltroMes base="/painel/financeiro" mes={mes} extra={{ st: aba, q }} />
 * A tela lê `sp.mes` com `mesDoParam(sp.mes)` (mesmo contrato do Extrato).
 */

/** Normaliza o param: "todos" | AAAA-MM válido | padrão = mês atual. */
export function mesDoParam(bruto: string | undefined): string {
  if (bruto === "todos") return "todos";
  return /^\d{4}-\d{2}$/.test(bruto ?? "") ? bruto! : hojeSP().slice(0, 7);
}

/** true quando a data (AAAA-MM-DD ou AAAA-MM) pertence ao mês filtrado. */
export function noMes(data: string | null | undefined, mes: string): boolean {
  if (mes === "todos") return true;
  return (data ?? "").slice(0, 7) === mes;
}

export function FiltroMes({
  base,
  mes,
  extra = {},
  param = "mes",
}: {
  base: string;
  mes: string;
  extra?: Record<string, string | undefined>;
  param?: string;
}) {
  const mesAtual = hojeSP().slice(0, 7);
  const mesRef = mes === "todos" ? mesAtual : mes;
  const url = (m?: string) => {
    const p = new URLSearchParams();
    for (const [k, v] of Object.entries(extra)) if (v) p.set(k, v);
    if (m) p.set(param, m);
    const qs = p.toString();
    return qs ? `${base}?${qs}` : base;
  };

  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
      <div style={{ display: "inline-flex", alignItems: "center", border: "1px solid var(--border)", borderRadius: 10, overflow: "hidden" }}>
        <Link href={url(somarMeses(mesRef, -1))} className="btn" style={{ border: "none", borderRadius: 0, padding: "6px 12px" }} title="Mês anterior">‹</Link>
        <span style={{ padding: "6px 14px", fontSize: 13, fontWeight: 700, minWidth: 150, textAlign: "center" }}>
          {mes === "todos" ? "Todos os meses" : rotuloMesAno(mes)}
        </span>
        <Link href={url(somarMeses(mesRef, 1))} className="btn" style={{ border: "none", borderRadius: 0, padding: "6px 12px" }} title="Próximo mês">›</Link>
      </div>
      {mes !== mesAtual && (
        <Link href={url()} className="btn" style={{ fontSize: 12 }}>Mês atual</Link>
      )}
      <Link
        href={url("todos")}
        className="btn"
        style={mes === "todos" ? { background: "var(--accent)", color: "var(--accent-contrast, #fff)", border: "1px solid var(--accent)", fontSize: 12 } : { fontSize: 12 }}
      >
        Todos os meses
      </Link>
    </div>
  );
}
