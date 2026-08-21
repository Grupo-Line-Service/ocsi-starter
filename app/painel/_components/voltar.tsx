/**
 * VOLTAR — mora no núcleo compartilhado (`@ocsi/ui/react-next/voltar`).
 *
 * Este arquivo é só a porta de entrada: mantém `../_components/voltar`
 * funcionando nas dezenas de telas que já o importam, enquanto a implementação
 * real vive no pacote e o RG Ambiental usa exatamente o mesmo componente.
 *
 * ⚠️ Era uma CÓPIA até 11/08/2026, e a cópia custou caro: o pacote levou o
 * leitor do contador `telas-visitadas` e deixou o escritor (o AppShell) no
 * produto. Aqui funcionava porque o nosso AppShell escreve; no RG, não —
 * editando um cliente, "Voltar" ia para a LISTA. Duas cópias do mesmo
 * componente é exatamente o retrabalho que o pacote existe para matar, então
 * agora existe UMA só, e ela decide sozinha (history.state do App Router).
 */
export { Voltar } from "@ocsi/ui/react-next/voltar";
