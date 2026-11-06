import { PRODUCTS } from "@/lib/products";

// Google Merchant Center product feed (RSS 2.0 + g: namespace).
// One <item> per purchasable variant (each dose is its own SKU), grouped by
// product via g:item_group_id. Data comes from the real PRODUCTS catalogue in
// src/lib/products.ts — no placeholder data.

// Prerender at build time and serve statically; the CDN caches per Cache-Control
// below. The feed regenerates on each deploy (prices/products live in code).
export const dynamic = "force-static";

const SITE = (process.env.NEXT_PUBLIC_SITE_URL || "https://cellexalabs.com").replace(/\/$/, "");
const BRAND = "Cellexa Labs";
const GOOGLE_CATEGORY = "Business & Industrial > Science & Laboratory > Laboratory Chemicals";

// Product ids excluded from the Google Merchant feed ONLY (still live on the
// website) — removed to resolve a Healthcare & Medicines policy violation.
const FEED_EXCLUDED_IDS = new Set<string>([
  "wolverine-vial", // Wolverine Stack 20mg — Vial
  "retatrutide-vial", // Retatrutide 60mg — Vial
  "mots-c-vial", // MOTS-C 40mg — Vial
  "klow-vial", // KLOW 80mg — Vial
  "glow-vial", // GLOW 70mg — Vial
]);

/** Escape the five XML predefined entities. */
function xmlEscape(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/** Strip any HTML tags and collapse whitespace to a single clean line. */
function toPlainText(input: string): string {
  return input
    .replace(/<[^>]*>/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/** URL/id-safe slug for a variant label, e.g. "30 mg + 5 mg" -> "30-mg-5-mg". */
function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function buildFeed(): string {
  const items: string[] = [];

  for (const product of PRODUCTS) {
    // Feed advertises vials only. Pre-filled injection pens are intentionally
    // excluded (vials read as research materials; pens read as finished
    // products). To advertise both, remove this guard.
    if (product.form !== "vial") continue;
    if (FEED_EXCLUDED_IDS.has(product.id)) continue;

    const formLabel = "Vial";

    for (const variant of product.variants) {
      const id = `${product.id}-${slugify(variant.label)}`;
      const title = toPlainText(`${product.name} ${variant.label} — ${formLabel}`);
      const description = toPlainText(product.mechanism);
      const link = `${SITE}/shop/${product.id}`;
      const imageLink = `${SITE}${variant.image}`;
      const price = `${variant.price.toFixed(2)} AED`;

      items.push(
        [
          "    <item>",
          `      <g:id>${xmlEscape(id)}</g:id>`,
          // Research materials have no manufacturer GTIN/MPN — declare no standard identifiers.
          `      <g:identifier_exists>false</g:identifier_exists>`,
          `      <g:item_group_id>${xmlEscape(product.id)}</g:item_group_id>`,
          `      <title>${xmlEscape(title)}</title>`,
          `      <description>${xmlEscape(description)}</description>`,
          `      <link>${xmlEscape(link)}</link>`,
          `      <g:image_link>${xmlEscape(imageLink)}</g:image_link>`,
          `      <g:availability>in stock</g:availability>`,
          `      <g:price>${xmlEscape(price)}</g:price>`,
          `      <g:brand>${xmlEscape(BRAND)}</g:brand>`,
          `      <g:condition>new</g:condition>`,
          `      <g:google_product_category>${xmlEscape(GOOGLE_CATEGORY)}</g:google_product_category>`,
          "    </item>",
        ].join("\n")
      );
    }
  }

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">',
    "  <channel>",
    `    <title>${xmlEscape(BRAND)}</title>`,
    `    <link>${xmlEscape(SITE)}</link>`,
    "    <description>Research-grade peptides — Cellexa Labs product feed.</description>",
    ...items,
    "  </channel>",
    "</rss>",
    "",
  ].join("\n");
}

export function GET() {
  const xml = buildFeed();

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      // CDN caches for 1 hour; serves stale for up to a day while revalidating.
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
