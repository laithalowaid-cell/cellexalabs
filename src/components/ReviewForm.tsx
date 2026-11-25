"use client";

import { useActionState, useState } from "react";
import { submitReview, type ReviewFormState } from "@/app/reviews/actions";
import { EMIRATES } from "@/lib/checkout";

type ProductOption = { id: string; label: string };

const initial: ReviewFormState = { status: "idle" };

/** The "leave a review" form. Reviews go to the owner first and appear only once approved. */
export default function ReviewForm({ products }: { products: ProductOption[] }) {
  const [state, action, pending] = useActionState(submitReview, initial);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  // Controlled fields, so nothing typed is lost when the server sends back an error.
  const [name, setName] = useState("");
  const [emirate, setEmirate] = useState("");
  const [product, setProduct] = useState("");
  const [text, setText] = useState("");
  const [consent, setConsent] = useState(false);
  const err = (k: keyof NonNullable<ReviewFormState["fieldErrors"]>) =>
    state.fieldErrors?.[k] ? (
      <p className="mt-1.5 text-xs text-red-700" role="alert">
        {state.fieldErrors[k]}
      </p>
    ) : null;

  if (state.status === "sent") {
    return (
      <div className="review-sent" role="status">
        <p className="font-display text-2xl font-semibold text-plum-deep">Thank you.</p>
        <p className="mt-2 text-[0.95rem] leading-relaxed text-ink">
          Your review has been sent. We read every one, and approved reviews appear on this page.
        </p>
      </div>
    );
  }

  return (
    <form action={action} className="grid gap-5" noValidate>
      {/* Spam trap: hidden from people, filled in by bots */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="rv-extra">Leave this empty</label>
        <input id="rv-extra" name="cl_hp_extra" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <fieldset>
        <legend className="mb-2 block text-xs font-medium text-ink-soft">Your rating</legend>
        <div className="flex gap-1" onMouseLeave={() => setHover(0)}>
          {[1, 2, 3, 4, 5].map((n) => (
            <label key={n} className="star-pick" onMouseEnter={() => setHover(n)}>
              <input
                type="radio"
                name="rating"
                value={n}
                checked={rating === n}
                onChange={() => setRating(n)}
                className="sr-only"
              />
              <span aria-hidden="true" className={(hover || rating) >= n ? "is-on" : ""}>
                ★
              </span>
              <span className="sr-only">
                {n} star{n > 1 ? "s" : ""}
              </span>
            </label>
          ))}
        </div>
        {err("rating")}
      </fieldset>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="rv-name" className="mb-1.5 block text-xs font-medium text-ink-soft">
            Name to show (e.g. Ahmed K.)
          </label>
          <input
            id="rv-name"
            name="name"
            type="text"
            maxLength={40}
            autoComplete="given-name"
            className="input"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          {err("name")}
        </div>
        <div>
          <label htmlFor="rv-emirate" className="mb-1.5 block text-xs font-medium text-ink-soft">
            Emirate (optional)
          </label>
          <select id="rv-emirate" name="emirate" className="input" value={emirate} onChange={(e) => setEmirate(e.target.value)}>
            <option value="">Prefer not to say</option>
            {EMIRATES.map((e) => (
              <option key={e} value={e}>
                {e}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="rv-product" className="mb-1.5 block text-xs font-medium text-ink-soft">
          Product (optional)
        </label>
        <select id="rv-product" name="product" className="input" value={product} onChange={(e) => setProduct(e.target.value)}>
          <option value="">General / my order</option>
          {products.map((p) => (
            <option key={p.id} value={p.id}>
              {p.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="rv-text" className="mb-1.5 block text-xs font-medium text-ink-soft">
          Your review
        </label>
        <textarea
          id="rv-text"
          name="text"
          rows={4}
          maxLength={600}
          className="input resize-none"
          placeholder="Ordering, delivery, packaging, product quality…"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        {err("text")}
      </div>

      <div>
        <label className="flex items-start gap-3 text-sm leading-relaxed text-ink">
          <input
            type="checkbox"
            name="consent"
            value="yes"
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
            className="mt-1 h-4 w-4 shrink-0 accent-[var(--color-plum)]"
          />
          <span>
            This is my own experience as a Cellexa Labs customer. It may be shown on this website with the name above,
            and it contains no medical or health claims.
          </span>
        </label>
        {err("consent")}
      </div>

      {state.status === "error" && state.message && (
        <p className="text-sm text-red-700" role="alert">
          {state.message}
        </p>
      )}

      <div>
        <button type="submit" className="btn-primary" disabled={pending}>
          {pending ? "Sending…" : "Send review"}
        </button>
        <p className="mt-3 text-xs leading-relaxed text-ink-soft">
          Reviews are read before they are published. We don&rsquo;t publish your contact details.
        </p>
      </div>
    </form>
  );
}
