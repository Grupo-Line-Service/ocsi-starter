"use client";

import { useFormStatus } from "react-dom";
import type { CSSProperties, ReactNode } from "react";

/**
 * REGRA DO GRUPO (dono, 05/08 e 15/08/2026): TODO botão que dispara uma server
 * action mostra que está trabalhando e NÃO aceita segundo clique.
 *
 *  • desabilita enquanto a action roda (useFormStatus — precisa ficar DENTRO do <form>);
 *  • troca o conteúdo pelo estado ocupado (gerúndio) ou por um spinner (ícones);
 *  • acende a barra fina no topo (`.barra-carregando` do @ocsi/ui) — o mesmo
 *    sinal da navegação entre telas, para o usuário saber que algo está indo.
 *
 * Use em TODO form de ação (enviar, excluir, marcar, converter…). Não existe
 * motivo para <button type="submit"> cru numa action.
 *
 * SAAS-266: aceita `name`/`value` (forms com várias ações), `formAction` (server
 * action alternativa por botão), `disabled` externo, `aria-label` e `id`.
 */
export function BotaoAcao({
  children,
  ocupado,
  className,
  style,
  title,
  icone = false,
  name,
  value,
  formAction,
  disabled,
  id,
  "aria-label": ariaLabel,
}: {
  children: ReactNode;
  /** Texto durante a ação (ex.: "Enviando…"). Em botão-ícone vira o title. */
  ocupado: string;
  className?: string;
  style?: CSSProperties;
  title?: string;
  /** Botão-ícone: mostra spinner no lugar do ícone (não cabe texto). */
  icone?: boolean;
  name?: string;
  value?: string;
  formAction?: string | ((formData: FormData) => void | Promise<void>);
  disabled?: boolean;
  id?: string;
  "aria-label"?: string;
}) {
  const { pending } = useFormStatus();
  return (
    <>
      {pending && <div className="barra-carregando" aria-hidden />}
      <button
        type="submit"
        id={id}
        name={name}
        value={value}
        formAction={formAction}
        className={className}
        disabled={pending || disabled}
        aria-busy={pending}
        aria-label={ariaLabel}
        title={pending ? ocupado : title}
        style={{ ...style, ...(pending ? { opacity: 0.7, cursor: "wait" } : null) }}
      >
        {pending ? (icone ? <span className="spinner" role="status" aria-label={ocupado} /> : <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}><span className="spinner" aria-hidden />{ocupado}</span>) : children}
      </button>
    </>
  );
}
