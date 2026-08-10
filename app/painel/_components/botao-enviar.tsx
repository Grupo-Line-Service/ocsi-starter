"use client";

import { useFormStatus } from "react-dom";

/**
 * Botão de submit à prova de DUPLO-CLIQUE (caso real: cobrança avulsa criada
 * em duplicidade, 05/08/2026): desabilita enquanto a action roda e mostra o
 * estado. Use em todo form de criação.
 */
export function BotaoEnviar({ rotulo, ocupado }: { rotulo: string; ocupado?: string }) {
  const { pending } = useFormStatus();
  return (
    <button className="btn btn-primary" type="submit" disabled={pending} style={{ alignSelf: "flex-start" }}>
      {pending ? (ocupado ?? "Criando…") : rotulo}
    </button>
  );
}
