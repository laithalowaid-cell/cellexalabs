import { notFound } from "next/navigation";
import { WHATSAPP_NUMBER, WHATSAPP_DISPLAY } from "@/lib/constants";
import type { Metadata } from "next";
import Link from "next/link";
import { PRODUCTS, getProduct } from "@/lib/products";

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
  if (!product) return { title: "COA not found" };
  return {
    title: `Certificate of Analysis — ${product.name} | Cellexa Labs`,
    description: `Certificate of Analysis (COA) information for ${product.name}, research-grade material tested to ${product.purity} purity.`,
  };
}

export default async function CoaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = getProduct(id);
  if (!product) notFound();

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <p className="eyebrow mb-4 text-rosegold-deep">Quality Assurance</p>
      <h1 className="font-display text-4xl font-semibold leading-tight text-plum-deep">
        Certificate of Analysis
      </h1>
      <p className="mt-3 border-b border-line pb-8 text-sm text-ink-soft">
        {product.name}
        {product.subtitle ? ` · ${product.subtitle}` : ""}
      </p>

      <div className="surface-card mt-8 p-6">
        <table className="w-full border-collapse text-sm">
          <tbody>
            {[
              ["Product", product.name],
              ["CAS", product.molecular.cas],
              ["Molecular formula", product.molecular.formula],
              ["Molecular mass", product.molecular.weight],
              ["Sequence", product.molecular.sequence],
              ["Purity (specification)", `≥ ${product.purity}`],
              ["Analysis method", "HPLC · MS"],
              ["Storage", "−20 °C, protect from light"],
            ].map(([k, v]) => (
              <tr key={k} className="border-b border-line">
                <td className="w-56 py-3 pr-4 align-top text-xs font-bold uppercase tracking-wider text-plum-deep">
                  {k}
                </td>
                <td className="py-3 font-mono text-[0.82rem] text-ink">
                  {v || <span className="font-sans text-ink-soft">—</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-8 rounded-2xl border border-line bg-mist/40 px-6 py-5">
        <p className="text-xs font-bold uppercase tracking-wider text-plum-deep">
          Batch COA
        </p>
        <p className="mt-2 text-sm leading-relaxed text-ink-soft">
          A batch-specific Certificate of Analysis (identity and purity by HPLC and mass
          spectrometry) is available on request for every lot. Message us on WhatsApp at{" "}
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-rosegold-deep underline-offset-4 hover:underline"
          >
            {WHATSAPP_DISPLAY}
          </a>{" "}
          with your order reference and we will provide the COA PDF for the lot supplied.
        </p>
        <p className="mt-3 text-[0.7rem] italic text-ink-soft">
          Research Use Only — for laboratory research use, not for human consumption. Not
          evaluated by any regulatory authority.
        </p>
      </div>

      <p className="mt-8 text-center text-xs text-ink-soft/70">
        <Link href={`/shop/${product.id}`} className="underline-offset-4 hover:text-plum hover:underline">
          ← Back to {product.name}
        </Link>
        {" · "}
        <Link href="/compliance" className="underline-offset-4 hover:text-plum hover:underline">
          Compliance
        </Link>
      </p>
    </div>
  );
}
