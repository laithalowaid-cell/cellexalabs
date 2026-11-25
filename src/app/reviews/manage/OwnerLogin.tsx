"use client";

import { useActionState } from "react";
import { ownerLogin } from "../actions";

export default function OwnerLogin() {
  const [state, action, pending] = useActionState(ownerLogin, {});
  return (
    <form action={action} className="mt-6 grid max-w-sm gap-3">
      <label htmlFor="owner-key" className="text-xs font-medium text-ink-soft">
        Owner key
      </label>
      <input id="owner-key" name="key" type="password" autoComplete="current-password" required className="input" />
      {state.error && (
        <p className="text-sm text-red-700" role="alert">
          {state.error}
        </p>
      )}
      <button type="submit" className="btn-primary justify-self-start" disabled={pending}>
        {pending ? "Checking…" : "Open reviews"}
      </button>
    </form>
  );
}
