// ===========================================================
// Cellexa Labs — site-wide promotions
// Multi-buy discounts are counted on total item quantity (2× the same pen
// counts as 2) and apply to everything in the cart, bundles included.
// ===========================================================

export const FREE_DELIVERY_THRESHOLD = 1000; // AED

/** Highest tier whose `minQty` is met wins; tiers are checked top-down. */
export const DISCOUNT_TIERS: { minQty: number; percent: number; label: string }[] = [
  { minQty: 3, percent: 10, label: "3+ items — 10% off" },
  { minQty: 2, percent: 5, label: "2 items — 5% off" },
];

/** Copy shown on the storefront. */
export const PROMOS: { title: string; detail: string }[] = [
  {
    title: "Free UAE Delivery",
    detail: `On every order over ${FREE_DELIVERY_THRESHOLD.toLocaleString("en-US")} AED.`,
  },
  { title: "Buy Any 2", detail: "5% off your order automatically." },
  { title: "Buy Any 3", detail: "10% off plus free delivery." },
  { title: "Returning Customers", detail: "5% loyalty discount — mention it on WhatsApp." },
];

export interface CartTotals {
  subtotal: number;
  qty: number;
  discountPercent: number;
  discountLabel: string | null;
  discount: number;
  total: number;
  freeDelivery: boolean;
  /** Items still needed for the next discount tier, if any. */
  nextTier: { needed: number; percent: number } | null;
}

export function cartTotals(subtotal: number, qty: number): CartTotals {
  const tier = DISCOUNT_TIERS.find((t) => qty >= t.minQty) ?? null;
  const discountPercent = tier?.percent ?? 0;
  // Round to whole fils-free AED so the displayed lines always add up.
  const discount = Math.round((subtotal * discountPercent) / 100);
  const total = subtotal - discount;

  // The smallest tier not yet reached — used for the "add one more" nudge.
  const upcoming = [...DISCOUNT_TIERS]
    .sort((a, b) => a.minQty - b.minQty)
    .find((t) => qty < t.minQty);

  return {
    subtotal,
    qty,
    discountPercent,
    discountLabel: tier?.label ?? null,
    discount,
    total,
    // 3+ items earns delivery outright; otherwise it's the order value.
    freeDelivery: total >= FREE_DELIVERY_THRESHOLD || qty >= 3,
    nextTier: upcoming ? { needed: upcoming.minQty - qty, percent: upcoming.percent } : null,
  };
}
