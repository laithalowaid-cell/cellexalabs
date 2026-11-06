"use client";

import {
  EMIRATES,
  PAYMENT_METHODS,
  type CheckoutDetails,
  type CheckoutErrors,
} from "@/lib/checkout";

/**
 * Delivery + payment details captured before handing the order to WhatsApp.
 * Controlled by the cart drawer, which owns the state and validation.
 */
export default function CheckoutForm({
  details,
  errors,
  onChange,
}: {
  details: CheckoutDetails;
  errors: CheckoutErrors;
  onChange: (patch: Partial<CheckoutDetails>) => void;
}) {
  const err = (msg?: string) =>
    msg ? <p className="mt-1.5 text-xs text-red-600">{msg}</p> : null;

  return (
    <div className="space-y-5">
      <div>
        <label htmlFor="co-name" className="mb-1.5 block text-xs font-medium text-ink-soft">
          Full name
        </label>
        <input
          id="co-name"
          type="text"
          autoComplete="name"
          value={details.name}
          onChange={(e) => onChange({ name: e.target.value })}
          aria-invalid={Boolean(errors.name)}
          className="input"
          placeholder="e.g. Ahmed Al Mansoori"
        />
        {err(errors.name)}
      </div>

      <div>
        <label htmlFor="co-emirate" className="mb-1.5 block text-xs font-medium text-ink-soft">
          Emirate
        </label>
        <select
          id="co-emirate"
          value={details.emirate}
          onChange={(e) => onChange({ emirate: e.target.value })}
          aria-invalid={Boolean(errors.emirate)}
          className="input"
        >
          <option value="">Select an emirate…</option>
          {EMIRATES.map((em) => (
            <option key={em} value={em}>
              {em}
            </option>
          ))}
        </select>
        {err(errors.emirate)}
      </div>

      <div>
        <label htmlFor="co-address" className="mb-1.5 block text-xs font-medium text-ink-soft">
          Delivery address
        </label>
        <textarea
          id="co-address"
          rows={3}
          autoComplete="street-address"
          value={details.address}
          onChange={(e) => onChange({ address: e.target.value })}
          aria-invalid={Boolean(errors.address)}
          className="input resize-none"
          placeholder="Building / villa, street, area, any landmark"
        />
        {err(errors.address)}
      </div>

      <fieldset>
        <legend className="mb-2 block text-xs font-medium text-ink-soft">Payment method</legend>
        <div className="space-y-2">
          {PAYMENT_METHODS.map((p) => {
            const active = details.payment === p.value;
            return (
              <label
                key={p.value}
                className={`flex cursor-pointer items-start gap-3 rounded-card border p-3.5 transition-colors ${
                  active
                    ? "border-rosegold bg-blush"
                    : "border-line hover:border-rosegold-soft"
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  value={p.value}
                  checked={active}
                  onChange={() => onChange({ payment: p.value })}
                  className="mt-0.5 h-4 w-4 accent-[var(--color-plum)]"
                />
                <span>
                  <span className="block text-sm font-semibold text-ink">{p.value}</span>
                  <span className="mt-0.5 block text-xs leading-relaxed text-ink-soft">
                    {p.hint}
                  </span>
                </span>
              </label>
            );
          })}
        </div>
        {err(errors.payment)}
      </fieldset>

      <p className="text-[0.7rem] leading-relaxed text-ink-soft">
        These details are added to the WhatsApp message you send us — they are not
        submitted to this website or stored on our servers.
      </p>
    </div>
  );
}
