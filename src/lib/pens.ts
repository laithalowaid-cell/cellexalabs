// Transparent cut-outs of the product photos, so pens and vials can float over the mountain.
// Pens: every /products/*.png that is not a vial has a cut-out at /pens/<same file>.
// Vials: only the four listed below have clean cut-outs; others fall back to the original photo.
import type { Product } from "./products";
import SIZES from "./cutout-sizes.json";

const VIAL_CUTOUTS = new Set([
  "ghk-cu-vial-100mg",
  "mots-c-vial-40mg",
  "pt-141-vial-10mg",
  "retatrutide-vial-60mg",
]);

/** The see-through version of a product photo, or undefined if there isn't one. */
export function cutout(image?: string): string | undefined {
  if (!image?.startsWith("/products/")) return undefined;
  const base = image.slice("/products/".length).replace(/\.png$/, "");
  if (base.includes("vial")) return VIAL_CUTOUTS.has(base) ? `/vials/${base}.webp` : undefined;
  return `/pens/${base}.webp`;
}

/** Intrinsic width and height of a cut-out, so the browser reserves its space before it loads. */
export function cutoutSize(src?: string): { width?: number; height?: number } {
  const file = src?.split("/").pop();
  const s = file ? (SIZES as Record<string, number[]>)[file] : undefined;
  return s ? { width: s[0], height: s[1] } : {};
}

/** First variant image of a product (its representative photo). */
export function heroImage(p: Product): string | undefined {
  return p.variants.find((v) => v.image)?.image ?? p.images?.[0];
}
