import Link from "next/link";
import { CabecalhoPagina } from "./_components/cabecalho-pagina";

export default function InicioPage() {
  return (
    <>
      <CabecalhoPagina
        titulo="Início"
        descricao="Ponto de partida do seu produto. Troque este conteúdo pelo painel real."
      />

      <div style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" }}>
        <Link href="/painel/exemplo" className="tile-kpi">
          <div className="card">
            <div className="muted" style={{ fontSize: 13, fontWeight: 600 }}>Tela de exemplo</div>
            <div style={{ fontSize: 26, fontWeight: 800, marginTop: 6 }}>Ver</div>
            <div className="muted" style={{ fontSize: 12, marginTop: 4 }}>
              Lista no padrão de gabarito
            </div>
          </div>
        </Link>

        <div className="card">
          <div className="muted" style={{ fontSize: 13, fontWeight: 600 }}>Núcleo</div>
          <div style={{ fontSize: 26, fontWeight: 800, marginTop: 6 }}>@ocsi/ui</div>
          <div className="muted" style={{ fontSize: 12, marginTop: 4 }}>
            Botão, card, input, shell e tema já vêm do pacote
          </div>
        </div>

        <div className="card">
          <div className="muted" style={{ fontSize: 13, fontWeight: 600 }}>Marca</div>
          <div style={{ fontSize: 26, fontWeight: 800, marginTop: 6 }}>Sua cor</div>
          <div className="muted" style={{ fontSize: 12, marginTop: 4 }}>
            Definida por organização — este texto e os botões já seguem ela
          </div>
        </div>
      </div>
    </>
  );
}
