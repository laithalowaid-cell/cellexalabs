"use client";

import { useStore } from "@/lib/store";
import {
  bundleRetail,
  bundleSaving,
  itemLabel,
  resolveItem,
  type Bundle,
} from "@/lib/bundles";
import { CheckIcon } from "./icons";

/**
 * A featured bundle. Adds to the cart as a single line priced at the bundle
 * rate — the contents are listed in the message rather than added separately,
 * so the bundle price is what gets charged.
 */
export default function BundleCard({
  bundle,
  compact = false,
}: {
  bundle: Bundle;
  compact?: boolean;
}) {
  const { addToCart, fmt } = useStore();
  const retail = bundleRetail(bundle);
  const saving = bundleSaving(bundle);

  function add() {
    addToCart({
      productId: `bundle-${bundle.id}`,
      name: bundle.name,
      variantLabel: bundle.items.map(itemLabel).join(" + "),
      unitPrice: bundle.price,
      // Cap colour borrows the first item's category for the thumbnail.
      cap: resolveItem(bundle.items[0])?.product.cap ?? "var(--color-cap-lavender)",
      form: "bundle",
    });
  }

  return (
    <div
      className={`surface-card relative flex flex-col p-7 ${
        bundle.badge ? "border-rosegold/60" : ""
      }`}
    >
      {bundle.badge && (
        <span className="absolute -top-3 left-7 rounded-full bg-plum px-3 py-1 text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-white">
          {bundle.badge}
        </span>
      )}

      <div className="flex items-start justify-between gap-3">
        <h3 className="font-display text-2xl font-medium leading-tight text-plum-deep">
          <span aria-hidden className="mr-2">
            {bundle.glyph}
          </span>
          {bundle.name}
        </h3>
      </div>

      <div className="mt-4 flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <span className="font-display text-3xl font-medium text-plum tabular-nums">
          {fmt(bundle.price)}
        </span>
        {saving > 0 && (
          <>
            <span className="text-sm text-ink-soft line-through tabular-nums">
              {fmt(retail)}
            </span>
            <span className="rounded-full bg-blush px-2 py-0.5 text-xs font-semibold text-rosegold-deep">
              Save {fmt(saving)}
            </span>
          </>
        )}
      </div>

      <p className="mt-3 text-sm leading-relaxed text-ink-soft">{bundle.blurb}</p>

      <ul className="mt-5 space-y-2">
        {bundle.items.map((item) => (
          <li key={`${item.productId}-${item.variantLabel}`} className="flex gap-2.5 text-sm text-ink">
            <CheckIcon width={16} height={16} className="mt-0.5 shrink-0 text-rosegold-deep" />
            <span>{itemLabel(item)} Pen</span>
          </li>
        ))}
        {bundle.extras.map((extra) => (
          <li key={extra} className="flex gap-2.5 text-sm text-ink-soft">
            <CheckIcon width={16} height={16} className="mt-0.5 shrink-0 text-rosegold-deep" />
            <span>{extra}</span>
          </li>
        ))}
      </ul>

      <button
        onClick={add}
        className={`btn-primary mt-7 w-full text-sm ${compact ? "" : "sm:mt-auto"}`}
      >
        Shop Now
      </button>
    </div>
  );
}
