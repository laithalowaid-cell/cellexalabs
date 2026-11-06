"use client";

import { useState } from "react";
import Link from "next/link";
import { Product } from "@/lib/products";
import { useStore } from "@/lib/store";
import { VialThumb } from "./VialThumb";
import { ProductImage } from "./ProductImage";
import ReconstitutionCalculator from "./ReconstitutionCalculator";
import {
  PlusIcon,
  MinusIcon,
  CheckIcon,
  ShieldIcon,
  FlaskIcon,
  PenIcon,
  VialIcon,
} from "./icons";

type Tab = "profile" | "qa" | "recon";

// Standard research-peptide storage — shown in the bullets and the spec table.
const STORAGE_LABEL = "Store lyophilised at −20 °C, protect from light";
const STORAGE_SPEC = "−20 °C, protect from light";

export default function ProductDetail({ product }: { product: Product }) {
  const { addToCart, fmt, setCartOpen } = useStore();
  const [variant, setVariant] = useState(product.variants[0]);
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState<Tab>("profile");
  const [added, setAdded] = useState(false);

  const mainImage = variant.image ?? product.images?.[0];

  const lineTotal = variant.price * qty;

  function handleAdd() {
    addToCart(
      {
        productId: product.id,
        name: product.name,
        variantLabel: variant.label,
        unitPrice: variant.price,
        cap: product.cap,
        form: product.form,
      },
      qty
    );
    setAdded(true);
    setTimeout(() => setAdded(false), 1400);
  }

  function buyNow() {
    addToCart(
      {
        productId: product.id,
        name: product.name,
        variantLabel: variant.label,
        unitPrice: variant.price,
        cap: product.cap,
        form: product.form,
      },
      qty
    );
    setCartOpen(true);
  }

  const views = [0, 1, 2];

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-2 text-xs text-ink-soft">
        <Link href="/" className="hover:text-plum">Home</Link>
        <span>/</span>
        <Link href="/shop" className="hover:text-plum">Shop</Link>
        <span>/</span>
        <span className="text-ink">{product.name}</span>
      </nav>

      <div className="grid gap-12 lg:grid-cols-2">
        {/* ===== Left: gallery ===== */}
        <div className="lg:sticky lg:top-24 lg:self-start">
          <div className="relative flex aspect-square items-center justify-center overflow-hidden rounded-3xl border border-line bg-gradient-to-br from-blush via-white to-blush-deep">
            <span className="absolute inset-x-0 top-0 h-1.5" style={{ background: product.cap }} />
            <div className="flex h-full w-full items-center justify-center p-6 transition-transform duration-500 ease-out">
              {product.form === "vial" && !mainImage ? (
                <VialThumb cap={product.cap} form={product.form} size={220} />
              ) : (
                <ProductImage
                  src={mainImage}
                  name={product.name}
                  dose={variant.label}
                  accent={product.cap}
                  penWidth={460}
                  imgClassName="max-h-full w-auto object-contain"
                />
              )}
            </div>
            <span className="absolute left-5 top-5 flex items-center gap-1.5 rounded-full border border-line bg-white/80 px-3 py-1 text-xs font-medium text-ink-soft backdrop-blur">
              {product.form === "vial" ? <VialIcon width={14} height={14} /> : <PenIcon width={14} height={14} />}
              {product.form === "vial" ? "Sterile Vial" : "Injection Pen"}
            </span>
          </div>
          {product.variants.length > 1 && (
            <div className="mt-4 flex gap-3">
              {product.variants.slice(0, 6).map((v) => (
                <button
                  key={v.label}
                  onClick={() => setVariant(v)}
                  className={`flex h-20 flex-1 items-center justify-center overflow-hidden rounded-xl border bg-mist/40 p-1 transition-colors ${
                    variant.label === v.label ? "border-plum" : "border-line hover:border-rosegold"
                  }`}
                  aria-label={`${product.name} ${v.label}`}
                >
                  <ProductImage
                    src={v.image ?? product.images?.[0]}
                    name={product.name}
                    accent={product.cap}
                    penWidth={150}
                    imgClassName="max-h-full w-auto object-contain"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ===== Right: info ===== */}
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-blush px-3 py-1 text-[0.68rem] font-medium uppercase tracking-wider text-plum">
              <span className="h-2 w-2 rounded-full" style={{ background: product.cap }} />
              {product.category}
            </span>
          </div>

          <h1 className="font-display mt-4 text-4xl font-medium leading-tight text-plum-deep sm:text-5xl">
            {product.name}
          </h1>
          {product.subtitle && <p className="mt-1 text-base text-ink-soft">{product.subtitle}</p>}
          <p className="mt-4 text-sm leading-relaxed text-ink-soft">{product.mechanism}</p>

          {/* Factual, research-framed bullets */}
          <ul className="mt-5 space-y-2 text-sm text-ink-soft">
            {[
              product.summary,
              `≥ ${product.purity} purity (HPLC)`,
              STORAGE_LABEL,
              product.form === "vial"
                ? "Lyophilised powder, single sealed vial"
                : "Pre-filled injection pen",
            ].map((b) => (
              <li key={b} className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-rosegold-deep" />
                <span>{b}</span>
              </li>
            ))}
          </ul>

          {/* RUO disclaimer directly under the bullets — identical on every product */}
          <p className="mt-4 text-xs italic leading-relaxed text-ink-soft">
            For laboratory research use only. Not for human consumption, therapeutic use,
            diagnostic application, or veterinary use.
          </p>

          {/* Certificate of Analysis — per-product COA page */}
          <Link
            href={`/coa/${product.id}`}
            className="mt-4 inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 text-xs font-semibold text-plum transition-colors hover:border-rosegold hover:text-rosegold-deep"
          >
            <FlaskIcon width={14} height={14} />
            Certificate of Analysis (COA)
          </Link>

          {/* Active dosage banner */}
          <div className="mt-6 flex items-center justify-between rounded-xl border border-rosegold-soft bg-blush px-5 py-3">
            <div>
              <span className="text-[0.65rem] uppercase tracking-wider text-rosegold-deep">
                Amount
              </span>
              <p className="font-display text-2xl font-semibold text-plum-deep">{variant.label}</p>
            </div>
            <div className="text-right">
              <span className="text-[0.65rem] uppercase tracking-wider text-rosegold-deep">Purity</span>
              <p className="font-display text-2xl font-semibold text-plum-deep">{product.purity}</p>
            </div>
          </div>

          {/* Variant selector */}
          <div className="mt-6">
            <span className="text-xs font-bold uppercase tracking-wider text-plum-deep">
              Select size
            </span>
            <div className="mt-3 flex flex-wrap gap-2">
              {product.variants.map((v) => (
                <button
                  key={v.label}
                  onClick={() => setVariant(v)}
                  className={`rounded-xl border px-4 py-2.5 text-left transition-colors ${
                    variant.label === v.label
                      ? "border-plum bg-plum/5"
                      : "border-line hover:border-rosegold"
                  }`}
                >
                  <span className="block text-sm font-semibold text-ink">{v.label}</span>
                  <span className="block text-xs text-ink-soft">{fmt(v.price)}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Quantity + total + actions */}
          <div className="mt-6 flex flex-wrap items-center gap-4">
            <div className="flex items-center rounded-full border border-line">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="flex h-11 w-11 items-center justify-center rounded-full text-ink-soft hover:text-plum"
                aria-label="Decrease quantity"
              >
                <MinusIcon />
              </button>
              <span className="w-10 text-center font-semibold text-ink">{qty}</span>
              <button
                onClick={() => setQty((q) => q + 1)}
                className="flex h-11 w-11 items-center justify-center rounded-full text-ink-soft hover:text-plum"
                aria-label="Increase quantity"
              >
                <PlusIcon />
              </button>
            </div>
            <div>
              <span className="text-[0.65rem] uppercase tracking-wider text-ink-soft">Total</span>
              <p className="font-display text-2xl font-semibold text-plum-deep">{fmt(lineTotal)}</p>
            </div>
          </div>

          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <button onClick={handleAdd} className={`btn-primary flex-1 ${added ? "!bg-none !bg-instock" : ""}`}>
              {added ? <><CheckIcon width={18} height={18} /> Added to cart</> : <><PlusIcon width={18} height={18} /> Add to Cart</>}
            </button>
            <button onClick={buyNow} className="btn-ghost flex-1">
              Buy Now
            </button>
          </div>
          <button
            onClick={() => setCartOpen(true)}
            className="mt-2 text-xs font-medium text-ink-soft hover:text-plum"
          >
            View cart →
          </button>
        </div>
      </div>

      {/* ===== Tabs ===== */}
      <div className="mt-16">
        <div className="flex gap-1 border-b border-line">
          {([
            ["profile", "Molecular Profile"],
            ["qa", "Quality Assurance"],
            // Vials are reconstituted and drawn on a syringe; pens ship
            // pre-filled and are dialled in clicks.
            ["recon", product.form === "vial" ? "Reconstitution" : "Pen Dosing"],
          ] as [Tab, string][]).map(([id, label]) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`relative px-5 py-3 text-sm font-semibold transition-colors ${
                tab === id ? "text-plum" : "text-ink-soft hover:text-ink"
              }`}
            >
              {label}
              {tab === id && (
                <span className="absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-plum" />
              )}
            </button>
          ))}
        </div>

        <div className="py-8">
          {tab === "profile" ? (
            <div className="max-w-2xl">
              <table className="w-full border-collapse text-sm">
                <tbody>
                  {[
                    ["CAS", product.molecular.cas],
                    ["Molecular mass", product.molecular.weight],
                    ["Molecular formula", product.molecular.formula],
                    ["Sequence", product.molecular.sequence],
                    ["Form", product.form === "vial" ? "Lyophilised powder, single sealed vial" : "Pre-filled injection pen"],
                    ["Purity", `≥ ${product.purity}`],
                    ["Storage", STORAGE_SPEC],
                    ["COA", "Available on request"],
                  ].map(([k, v]) => (
                    <tr key={k} className="border-b border-line">
                      <td className="w-48 py-3 pr-4 align-top text-xs font-bold uppercase tracking-wider text-plum-deep">
                        {k}
                      </td>
                      <td className="py-3 font-mono text-[0.82rem] text-ink">
                        {v || <span className="font-sans text-ink-soft">—</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="mt-4 text-xs text-ink-soft">
                Independently third-party tested · COA available on request.
              </p>
            </div>
          ) : tab === "recon" ? (
            <div className="max-w-3xl">
              <p className="mb-6 max-w-2xl text-sm leading-relaxed text-ink-soft">
                {product.form === "vial" ? (
                  <>
                    Pre-filled with this vial&rsquo;s {variant.label} of peptide. Adjust the
                    bacteriostatic water and target dose to see the draw volume and where it
                    lands on a U-100 insulin syringe.
                  </>
                ) : (
                  <>
                    Pre-filled with this pen&rsquo;s {variant.label} of peptide. Set your target
                    dose to see how many clicks to dial.
                  </>
                )}
              </p>
              <ReconstitutionCalculator
                defaultMg={variant.mg}
                defaultMode={product.form === "vial" ? "vial" : "pen"}
                compact
              />
              <p className="mt-6 text-xs leading-relaxed text-ink-soft">
                Research use only — not for human or veterinary use. This tool does not
                constitute dosing guidance.{" "}
                <Link href="/calculator" className="text-rosegold-deep underline-offset-4 hover:underline">
                  Open the full calculator
                </Link>
                .
              </p>
            </div>
          ) : (
            <div className="grid max-w-4xl gap-6 sm:grid-cols-2">
              <div className="surface-card p-6">
                <FlaskIcon width={24} height={24} className="text-rosegold-deep" />
                <h3 className="font-display mt-3 text-xl font-medium text-plum-deep">
                  Minimum 99% Purity
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                  Every Cellexa Labs compound undergoes rigorous independent third-party
                  testing to ensure a minimum of 99% purity — premium research-grade quality
                  in every batch.
                </p>
              </div>
              <div className="surface-card p-6">
                <ShieldIcon width={24} height={24} className="text-rosegold-deep" />
                <h3 className="font-display mt-3 text-xl font-medium text-plum-deep">
                  Pristine Sterile Containment
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                  Manufactured and packaged under sterile conditions with full endotoxin
                  screening. Certificates of Analysis are available on request for every batch.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ===== Research-Use-Only disclaimer (persistent, shown on every product) ===== */}
      <div className="mt-12 rounded-2xl border border-line bg-mist/40 px-6 py-5">
        <p className="text-xs font-bold uppercase tracking-wider text-plum-deep">
          Research Use Only
        </p>
        <p className="mt-2 max-w-3xl text-xs leading-relaxed text-ink-soft">
          This product is intended for laboratory research use only. It is not a drug, food, or
          cosmetic, and is not intended for human or animal use, diagnosis, treatment, cure, or
          prevention of any disease. By purchasing, you confirm you are a qualified researcher or
          institution acquiring this material for lawful research purposes.
        </p>
      </div>
    </div>
  );
}
