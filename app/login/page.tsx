"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { entrar } from "./actions";

/**
 * Tela de entrada.
 *
 * TODO(produto novo): troque o título e o texto de apoio pela sua marca.
 */
export default function LoginPage() {
  const [erro, acao] = useActionState(entrar, null);

  return (
    <main style={{ minHeight: "100dvh", display: "grid", placeItems: "center", padding: 24 }}>
      <div className="card" style={{ width: "100%", maxWidth: 400 }}>
        <h1 style={{ margin: "0 0 4px", fontSize: 22 }}>Entrar</h1>
        <p className="muted" style={{ margin: "0 0 20px", fontSize: 14 }}>
          Acesse a sua organização
        </p>

        <form action={acao} style={{ display: "grid", gap: 14 }}>
          <label style={{ display: "grid", gap: 6 }}>
            <span style={{ fontSize: 13, fontWeight: 600 }}>E-mail</span>
            <input className="input" name="email" type="email" autoComplete="email" required autoFocus />
          </label>

          <label style={{ display: "grid", gap: 6 }}>
            <span style={{ fontSize: 13, fontWeight: 600 }}>Senha</span>
            <input className="input" name="senha" type="password" autoComplete="current-password" required />
          </label>

          {erro && (
            <p role="alert" style={{ margin: 0, color: "var(--danger)", fontSize: 13, fontWeight: 600 }}>
              {erro}
            </p>
          )}

          <BotaoEntrar />
        </form>
      </div>
    </main>
  );
}

/**
 * Botão com trava anti-duplo-clique (REGRA DO GRUPO): desabilita e vira
 * gerúndio enquanto envia. Sem isso, dois cliques rápidos viram duas ações.
 */
function BotaoEntrar() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="btn btn-primary" disabled={pending} style={{ marginTop: 4 }}>
      {pending ? "Entrando…" : "Entrar"}
    </button>
  );
}
