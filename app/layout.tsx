import type { Metadata } from "next";
import { Nunito, Inter, Poppins, Lora } from "next/font/google";
import { cssDoTema, temaValido, corValida } from "@ocsi/ui/lib/tema";
import { createClient } from "@/lib/supabase/server";
import "./globals.css";

// Tipografia por inquilino: as quatro famílias são auto-hospedadas via
// next/font e o tema escolhe qual vale, pela CSS var --fonte-app.
const nunito = Nunito({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"], display: "swap", variable: "--font-nunito" });
const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"], display: "swap", variable: "--font-inter" });
const poppins = Poppins({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"], display: "swap", variable: "--font-poppins" });
const lora = Lora({ subsets: ["latin"], weight: ["400", "500", "600", "700"], display: "swap", variable: "--font-lora" });

export const metadata: Metadata = {
  // TODO(produto novo): troque o nome e a descrição.
  title: "OCSI Starter",
  description: "Ponto de partida dos produtos OCSI.",
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  /**
   * WHITE-LABEL: injeta as CSS variables da organização logada por cima das do
   * globals.css. O cliente escolhe UMA cor e o motor (@ocsi/ui/lib/tema) deriva
   * gradiente, translúcido, contraste do texto e brilho do fundo — mais fonte e
   * cantos.
   *
   * Falha em silêncio de propósito: qualquer problema aqui cai no tema padrão
   * do globals.css. Uma tela sem cor de marca é um contratempo; uma tela que
   * não abre é um incidente.
   */
  let temaCss: string | null = null;
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data } = await supabase
        .from("usuarios")
        .select("organizacoes(tema, cor_primaria, cor_secundaria, fonte, cantos)")
        .eq("id", user.id)
        .maybeSingle();
      const org = data?.organizacoes as {
        tema: string | null; cor_primaria: string | null; cor_secundaria: string | null;
        fonte: string | null; cantos: string | null;
      } | null;
      if (org) {
        temaCss = cssDoTema(temaValido(org.tema), corValida(org.cor_primaria), {
          corSecundaria: org.cor_secundaria,
          fonte: org.fonte,
          cantos: org.cantos,
        });
      }
    }
  } catch {
    /* mantém o tema padrão do globals.css */
  }

  return (
    <html lang="pt-BR" className={`${nunito.variable} ${inter.variable} ${poppins.variable} ${lora.variable}`}>
      <body>
        {temaCss && <style dangerouslySetInnerHTML={{ __html: temaCss }} />}
        {children}
      </body>
    </html>
  );
}
