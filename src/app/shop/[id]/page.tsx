import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { PRODUCTS, getProduct } from "@/lib/products";
import ProductDetail from "@/components/ProductDetail";
import ProductCard from "@/components/ProductCard";

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ id: p.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const product = getProduct(id);
  if (!product) return { title: "Not found" };
  const titleTag = product.subtitle
    ? `${product.name} — ${product.subtitle}`
    : product.name;
  return {
    title: titleTag,
    description: product.mechanism,
    alternates: { canonical: `/shop/${product.id}` },
    openGraph: {
      title: `${titleTag} | Cellexa Labs`,
      description: product.mechanism,
      images: [{ url: product.variants[0].image ?? "/og.png" }],
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = getProduct(id);
  if (!product) notFound();

  const related = PRODUCTS.filter(
    (p) => p.id !== product.id && p.focus.some((f) => product.focus.includes(f))
  ).slice(0, 4);

  // Structured data — lets the catalogue surface as rich results in search.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.mechanism,
    sku: product.id,
    brand: { "@type": "Brand", name: "Cellexa Labs" },
    image: product.variants
      .map((v) => v.image)
      .filter(Boolean)
      .map((src) => `https://cellexalabs.com${src}`),
    offers: product.variants.map((v) => ({
      "@type": "Offer",
      name: `${product.name} ${v.label}`,
      price: v.price,
      priceCurrency: "AED",
      availability: "https://schema.org/InStock",
      url: `https://cellexalabs.com/shop/${product.id}`,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProductDetail product={product} />

      {related.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 pb-8 sm:px-6 lg:px-8">
          <h2 className="font-display text-2xl font-medium text-plum-deep">
            Related Compounds
          </h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}
