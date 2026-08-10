"use client";

import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CabecalhoPagina } from "../_components/cabecalho-pagina";
import { BuscaViva } from "../_components/busca-viva";
import { cabecalhoPadrao, thPadrao, linhaZebra } from "@ocsi/ui/react/tabela-padrao";
import { Carregando } from "@ocsi/ui/react/carregando";
import { formatarValor, formatarData } from "@ocsi/ui/lib/formato";

/**
 * TELA DE EXEMPLO — é o gabarito vivo do produto.
 *
 * Mostra, funcionando, o que toda tela de lista deve ter:
 *  - cabeçalho com título, descrição e ação primária;
 *  - barra de filtros: abas à esquerda, busca à direita, tudo numa linha;
 *  - tabela no padrão extrato (cabeçalho na cor da marca, TH maiúsculo, zebra);
 *  - estado de carregando e estado vazio — os dois SEMPRE, nunca uma tela em
 *    branco sem explicação.
 *
 * TODO(produto novo): troque pelos seus dados e apague o que não usar. Mas
 * mantenha a ESTRUTURA — ela é o padrão de todos os produtos OCSI.
 */

type Linha = { id: string; nome: string; valor: number; data: string; situacao: "ativo" | "inativo" };

const EXEMPLOS: Linha[] = [
  { id: "1", nome: "Primeiro registro", valor: 1250.5, data: "2026-08-01", situacao: "ativo" },
  { id: "2", nome: "Segundo registro", valor: 890, data: "2026-08-03", situacao: "ativo" },
  { id: "3", nome: "Terceiro registro", valor: 3400.9, data: "2026-08-07", situacao: "inativo" },
];

export default function ExemploPage() {
  // useSearchParams exige Suspense na árvore (regra do Next).
  return (
    <Suspense fallback={<Carregando />}>
      <Conteudo />
    </Suspense>
  );
}

function Conteudo() {
  // A busca vive na URL: o filtro fica compartilhável por link e sobrevive ao
  // F5. Quem escreve na caixa é a BuscaViva, que navega sozinha.
  const busca = useSearchParams().get("q") ?? "";
  const [aba, setAba] = useState<"todos" | "ativo" | "inativo">("todos");
  const [carregando] = useState(false); // troque pelo estado real da sua busca

  const lista = useMemo(() => {
    const q = busca.trim().toLowerCase();
    return EXEMPLOS
      .filter((l) => aba === "todos" || l.situacao === aba)
      .filter((l) => !q || l.nome.toLowerCase().includes(q));
  }, [busca, aba]);

  const abas = [
    { id: "todos", rotulo: "Todos", n: EXEMPLOS.length },
    { id: "ativo", rotulo: "Ativos", n: EXEMPLOS.filter((l) => l.situacao === "ativo").length },
    { id: "inativo", rotulo: "Inativos", n: EXEMPLOS.filter((l) => l.situacao === "inativo").length },
  ] as const;

  return (
    <>
      <CabecalhoPagina
        titulo="Exemplo"
        descricao="Lista no padrão do grupo — copie a estrutura desta tela."
        acoes={<button className="btn btn-primary">Novo</button>}
      />

      {/* Abas à esquerda, busca à direita — uma linha só (gabarito). */}
      <div className="barra-filtros">
        <div className="barra-filtros-chips">
          {abas.map((a) => (
            <button
              key={a.id}
              className={`btn btn-chip${aba === a.id ? " btn-primary" : ""}`}
              onClick={() => setAba(a.id)}
            >
              {a.rotulo} ({a.n})
            </button>
          ))}
        </div>
        <div className="barra-filtros-busca">
          <BuscaViva base="/painel/exemplo" inicial={busca} placeholder="Buscar…" />
        </div>
      </div>

      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={cabecalhoPadrao}>
                <th style={thPadrao}>Nome</th>
                <th style={thPadrao}>Data</th>
                <th style={{ ...thPadrao, textAlign: "right" }}>Valor</th>
                <th style={thPadrao}>Situação</th>
              </tr>
            </thead>
            <tbody>
              {lista.map((l, i) => (
                <tr key={l.id} style={linhaZebra(i)}>
                  <td style={celula}>
                    <span className="texto-truncado">{l.nome}</span>
                  </td>
                  <td style={celula}>{formatarData(l.data)}</td>
                  <td style={{ ...celula, textAlign: "right", fontWeight: 600 }}>{formatarValor(l.valor)}</td>
                  <td style={celula}>
                    <span
                      style={{
                        fontSize: 12, fontWeight: 700, padding: "3px 10px", borderRadius: 999,
                        background: l.situacao === "ativo" ? "var(--chip-ok-bg)" : "var(--chip-neutro-bg)",
                        color: l.situacao === "ativo" ? "var(--chip-ok-fg)" : "var(--chip-neutro-fg)",
                      }}
                    >
                      {l.situacao === "ativo" ? "Ativo" : "Inativo"}
                    </span>
                  </td>
                </tr>
              ))}

              {/* Carregando e vazio: os dois estados SEMPRE. Tela em branco sem
                  explicação é o jeito mais rápido de parecer quebrada. */}
              {carregando && (
                <tr><td colSpan={4}><Carregando /></td></tr>
              )}
              {!carregando && !lista.length && (
                <tr>
                  <td colSpan={4} className="muted" style={{ padding: 32, textAlign: "center" }}>
                    Nada encontrado neste filtro.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

const celula: React.CSSProperties = { padding: "12px 14px", fontSize: 14 };
