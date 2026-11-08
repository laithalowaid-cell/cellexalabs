// ===========================================================
// Cellexa Labs — Featured bundle deals
// Prices are stored in AED. Bundle contents reference real catalogue
// entries by product id + variant label, so `bundleRetail()` can show the
// genuine saving against buying each item separately.
// ===========================================================

import { PRODUCTS, type Focus } from "./products";

export interface BundleItem {
  /** Product id in PRODUCTS */
  productId: string;
  /** Exact variant label, e.g. "20 mg (10+10)" */
  variantLabel: string;
}

export interface Bundle {
  id: string;
  name: string;
  /** Emoji used as a small lead-in on cards */
  glyph: string;
  price: number; // AED
  badge?: string;
  blurb: string;
  items: BundleItem[];
  /** Non-product inclusions — guides, delivery, support */
  extras: string[];
  /** Shown on the homepage */
  featured?: boolean;
}

export const BUNDLES: Bundle[] = [
  {
    id: "starter-weight-loss",
    name: "Starter Weight Loss Bundle",
    glyph: "🔥",
    price: 900,
    blurb: "Ideal for first-time users starting their weight loss journey.",
    items: [{ productId: "retatrutide", variantLabel: "20 mg" }],
    extras: ["Full Dosing Guide", "WhatsApp Support"],
  },
  {
    id: "shred-stack",
    name: "Shred Stack",
    glyph: "⭐",
    price: 2150,
    badge: "Most Popular",
    blurb: "For enhanced fat loss and body recomposition.",
    items: [
      { productId: "retatrutide", variantLabel: "40 mg" },
      { productId: "cjc-ipamorelin", variantLabel: "20 mg (10+10)" },
    ],
    extras: ["FREE Delivery", "Full Cycle Guide"],
    featured: true,
  },
  {
    id: "ultimate-transformation",
    name: "Ultimate Transformation Stack",
    glyph: "👑",
    price: 3300,
    badge: "Best Value",
    blurb: "Designed for customers looking for maximum results.",
    items: [
      { productId: "retatrutide", variantLabel: "60 mg" },
      { productId: "cjc-ipamorelin", variantLabel: "40 mg (20+20)" },
      { productId: "mots-c", variantLabel: "20 mg" },
    ],
    extras: ["FREE Delivery", "Priority Support"],
    featured: true,
  },
  {
    id: "glow-up",
    name: "Glow Up Bundle",
    glyph: "✨",
    price: 1550,
    blurb: "Supports skin quality, recovery, and overall wellness.",
    items: [
      { productId: "glow", variantLabel: "70 mg" },
      { productId: "nad-plus", variantLabel: "500 mg" },
    ],
    extras: ["FREE Delivery"],
  },
  {
    id: "recovery",
    name: "Recovery Bundle",
    glyph: "🩹",
    price: 1400,
    blurb: "Popular with active individuals focused on recovery.",
    items: [
      { productId: "wolverine", variantLabel: "20 mg" },
      { productId: "bpc-157", variantLabel: "10 mg" },
    ],
    extras: ["FREE Delivery"],
  },
  {
    id: "focus",
    name: "Focus Bundle",
    glyph: "🧠",
    price: 1350,
    blurb: "Supports focus, productivity, and mental performance.",
    items: [
      { productId: "semax", variantLabel: "10 mg" },
      { productId: "selank", variantLabel: "10 mg" },
    ],
    extras: ["FREE Delivery"],
  },
  {
    id: "vip-transformation",
    name: "VIP Transformation Package",
    glyph: "💎",
    price: 4150,
    badge: "VIP Package",
    blurb: "Complete premium transformation package.",
    items: [
      { productId: "retatrutide", variantLabel: "60 mg" },
      { productId: "cjc-ipamorelin", variantLabel: "40 mg (20+20)" },
      { productId: "mots-c", variantLabel: "40 mg" },
      { productId: "glow", variantLabel: "70 mg" },
    ],
    extras: ["FREE UAE Delivery", "Full Guide & Support"],
    featured: true,
  },
];

export function getBundle(id: string): Bundle | undefined {
  return BUNDLES.find((b) => b.id === id);
}

/** Resolve a bundle item to its catalogue product + variant. */
export function resolveItem(item: BundleItem) {
  const product = PRODUCTS.find((p) => p.id === item.productId);
  const variant = product?.variants.find((v) => v.label === item.variantLabel);
  return product && variant ? { product, variant } : null;
}

/** What the contents would cost bought separately. 0 if nothing resolves. */
export function bundleRetail(b: Bundle): number {
  return b.items.reduce((sum, item) => {
    const r = resolveItem(item);
    return sum + (r ? r.variant.price : 0);
  }, 0);
}

/** Saving against buying the contents separately; never negative. */
export function bundleSaving(b: Bundle): number {
  return Math.max(0, bundleRetail(b) - b.price);
}

/**
 * Categories a bundle covers, taken from the union of its contents — so a
 * bundle shows up under the same category filters as the products inside it.
 */
export function bundleFocuses(b: Bundle): Focus[] {
  const set = new Set<Focus>();
  for (const item of b.items) {
    resolveItem(item)?.product.focus.forEach((f) => set.add(f));
  }
  return [...set];
}

/** Human label for a bundle line, e.g. "Retatrutide 60 mg". */
export function itemLabel(item: BundleItem): string {
  const r = resolveItem(item);
  return r ? `${r.product.name} ${r.variant.label}` : item.productId;
}
