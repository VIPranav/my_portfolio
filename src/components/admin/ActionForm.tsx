"use client";
import { useActionState } from "react";
import type { ActionResult } from "@/actions/projects";
export default function ActionForm({
  action,
  children,
  className = "",
  confirmMessage,
}: {
  action: (form: FormData) => Promise<ActionResult>;
  children: React.ReactNode;
  className?: string;
  confirmMessage?: string;
}) {
  const [state, submit, pending] = useActionState(
    async (_: ActionResult, form: FormData) => action(form),
    { ok: false },
  );
  return (
    <form
      action={submit}
      className={className}
      onSubmit={(e) => {
        if (confirmMessage && !window.confirm(confirmMessage))
          e.preventDefault();
      }}
    >
      <fieldset
        disabled={pending}
        style={{ border: 0, padding: 0, margin: 0, minWidth: 0 }}
      >
        {children}
      </fieldset>
      {state.error && (
        <p className="field-error" role="alert">
          {state.error}
        </p>
      )}
      {state.ok && (
        <span role="status" className="small muted">
          Saved.
        </span>
      )}
    </form>
  );
}
