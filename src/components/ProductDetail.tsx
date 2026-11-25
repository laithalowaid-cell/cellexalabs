"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { Product } from "@/lib/products";
import { cutout, cutoutSize } from "@/lib/pens";
import { useStore } from "@/lib/store";
import { usePage } from "@/engine/next";
import { ease, isTouch, prefersReducedMotion } from "@/engine";
import { VialThumb } from "./VialThumb";
import ReconstitutionCalculator from "./ReconstitutionCalculator";
import Snowfall from "./summit/Snowfall";
import { PlusIcon, MinusIcon, CheckIcon, ShieldIcon, FlaskIcon, ArrowRight } from "./icons";

type Tab = "profile" | "qa" | "recon";

// Standard research-peptide storage, shown in the bullets and the spec table.
const STORAGE_LABEL = "Store lyophilised at −20 °C, protect from light";
const STORAGE_SPEC = "−20 °C, protect from light";

export default function ProductDetail({ product }: { product: Product }) {
  const { addToCart, fmt, setCartOpen } = useStore();
  const [variant, setVariant] = useState(product.variants[0]);
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState<Tab>("profile");
  const [added, setAdded] = useState(false);

  const scene = useRef<HTMLElement>(null);
  const penRef = useRef<HTMLDivElement>(null);
  const firstVariant = useRef(true);

  const isPen = product.form === "pen";
  const rawImage = variant.image ?? product.images?.[0];
  const clean = cutout(rawImage);
  const shown = clean ?? rawImage;
  const lineTotal = variant.price * qty;

  // Scene motion: intro, scroll drift, pointer light and the pen hovering.
  usePage(({ intro }) => {
    const el = scene.current;
    if (!el || prefersReducedMotion()) return;
    const q = gsap.utils.selector(el);
    intro.add(
      gsap
        .timeline()
        .from(q("[data-layer]"), { yPercent: 8, duration: 1.8, stagger: 0.06, ease: ease.out }, 0)
        .from(q("[data-name] span"), { yPercent: 105, duration: 1.3, stagger: 0.035, ease: ease.out }, 0.1)
        .from(q("[data-pen-glide]"), { xPercent: 60, autoAlpha: 0, duration: 1.9, ease: ease.out }, 0.3),
      0,
    );
    gsap.to(q("[data-pen-float]"), { y: -8, duration: 2.8, ease: "sine.inOut", yoyo: true, repeat: -1 });
    gsap
      .timeline({ defaults: { ease: "none" }, scrollTrigger: { trigger: el, start: "top top", end: "bottom top", scrub: 0.6 } })
      .to(q("[data-layer='massif']"), { yPercent: 10 }, 0)
      .to(q("[data-layer='far']"), { yPercent: 4 }, 0)
      .to(q("[data-name]"), { yPercent: 40 }, 0)
      .to(q("[data-pen-glide]"), { xPercent: -14 }, 0);
    if (!isTouch()) {
      const mx = gsap.quickTo(q("[data-layer='massif']")[0], "x", { duration: 1.2, ease: ease.soft });
      const px = gsap.quickTo(q("[data-pen-float]")[0], "x", { duration: 1.2, ease: ease.soft });
      const onMove = (e: PointerEvent) => {
        const nx = e.clientX / innerWidth - 0.5;
        mx(-nx * 14);
        px(-nx * 24);
      };
      addEventListener("pointermove", onMove, { passive: true });
      return () => removeEventListener("pointermove", onMove);
    }
  });

  // A new dose glides its pen in across the snow.
  useEffect(() => {
    if (firstVariant.current) {
      firstVariant.current = false;
      return;
    }
    if (!penRef.current || prefersReducedMotion()) return;
    gsap.fromTo(penRef.current, { xPercent: 22, autoAlpha: 0 }, { xPercent: 0, autoAlpha: 1, duration: 1.1, ease: ease.out });
  }, [variant.label]);

  function line() {
    return {
      productId: product.id,
      name: product.name,
      variantLabel: variant.label,
      unitPrice: variant.price,
      cap: product.cap,
      form: product.form,
    };
  }

  function handleAdd() {
    addToCart(line(), qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 1400);
  }

  function buyNow() {
    addToCart(line(), qty);
    setCartOpen(true);
  }

  return (
    <>
      {/* ===== Scene: the product at the summit ===== */}
      <section ref={scene} className="pdp-scene" aria-labelledby="pdp-title">
        <div className="pdp-scene__sky" aria-hidden="true" />
        <picture data-layer="far" className="pdp-scene__layer">
          <source media="(max-width: 767px)" srcSet="/mountain/far-sm.webp" />
          <img src="/mountain/far.webp" alt="" width={2400} height={1500} />
        </picture>
        <p
          data-name
          className="pdp-scene__name display-xl"
          aria-hidden="true"
          style={{ "--chars": product.name.length } as CSSProperties}
        >
          {product.name.split("").map((c, i) => (
            <span key={i}>{c === " " ? " " : c}</span>
          ))}
        </p>
        <picture data-layer="massif" className="pdp-scene__layer">
          <source media="(max-width: 767px)" srcSet="/mountain/massif-sm.webp" />
          <img src="/mountain/massif.webp" alt="" width={2400} height={1500} fetchPriority="high" />
        </picture>
        <picture data-layer="snow" className="pdp-scene__layer">
          <source media="(max-width: 767px)" srcSet="/mountain/snow-sm.webp" />
          <img src="/mountain/snow.webp" alt="" width={2400} height={1500} />
        </picture>
        <Snowfall density={0.7} className="z-[12]" />

        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="pdp-scene__crumbs font-data [&_a]:py-1.5">
          <Link href="/" className="link-glide">Home</Link>
          <span aria-hidden="true">/</span>
          <Link href={isPen ? "/shop?form=pen" : "/shop?form=vial"} className="link-glide">
            {isPen ? "Pens" : "Vials"}
          </Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page">{product.name}</span>
        </nav>

        {/* The product */}
        <div data-pen-glide className={`pdp-scene__product ${isPen ? "is-pen" : "is-vial"}`}>
          <div data-pen-float>
            <div ref={penRef}>
              {shown ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={shown}
                  src={shown}
                  alt={`${product.name} ${variant.label} ${isPen ? "pre-filled pen" : "vial"}`}
                  {...cutoutSize(clean)}
                  className={clean ? "" : "mix-blend-multiply"}
                />
              ) : (
                <VialThumb cap={product.cap} form={product.form} size={220} />
              )}
            </div>
            <span className="pdp-scene__shadow" aria-hidden="true" />
          </div>
        </div>

        {/* Buy panel */}
        <div data-buy className="pdp-buy">
          <p className="font-data text-[0.7rem] uppercase tracking-[0.16em] text-rosegold-deep">
            {isPen ? "Pre-filled pen · 240 clicks" : "Lyophilised vial"} · {product.category}
          </p>
          <h1 id="pdp-title" className="font-display mt-2 text-[2.1rem] font-semibold leading-[1.02] text-plum-deep sm:text-5xl">
            {product.name}
          </h1>
          {product.subtitle && <p className="mt-1 text-[0.95rem] text-ink-soft">{product.subtitle}</p>}

          <fieldset className="mt-6">
            <legend className="font-data text-[0.7rem] uppercase tracking-[0.16em] text-ink-soft">Dose</legend>
            <div className="mt-2 flex flex-wrap gap-2">
              {product.variants.map((v) => {
                const on = variant.label === v.label;
                return (
                  <button
                    key={v.label}
                    type="button"
                    onClick={() => setVariant(v)}
                    aria-pressed={on}
                    className={`dose-pill ${on ? "is-on" : ""}`}
                  >
                    <span className="block text-sm font-semibold">{v.label}</span>
                    <span className="font-data block text-[0.72rem] opacity-80">{fmt(v.price)}</span>
                  </button>
                );
              })}
            </div>
          </fieldset>

          <div className="mt-6 flex flex-wrap items-end justify-between gap-4">
            <div className="flex items-center rounded-full border border-line bg-white">
              <button
                type="button"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="flex h-11 w-11 items-center justify-center rounded-full text-ink-soft transition-colors hover:text-rosegold-deep"
                aria-label="Decrease quantity"
              >
                <MinusIcon />
              </button>
              <span className="font-data w-10 text-center font-semibold text-ink" aria-live="polite">
                {qty}
              </span>
              <button
                type="button"
                onClick={() => setQty((q) => q + 1)}
                className="flex h-11 w-11 items-center justify-center rounded-full text-ink-soft transition-colors hover:text-rosegold-deep"
                aria-label="Increase quantity"
              >
                <PlusIcon />
              </button>
            </div>
            <div className="text-right">
              <span className="font-data text-[0.7rem] uppercase tracking-[0.16em] text-ink-soft">Total</span>
              <p key={lineTotal} className="pdp-total font-display text-3xl font-semibold text-plum-deep">
                {fmt(lineTotal)}
              </p>
            </div>
          </div>

          <div className="mt-5 grid gap-2 sm:grid-cols-2">
            <button type="button" onClick={handleAdd} className={`btn-primary ${added ? "!bg-instock" : ""}`}>
              {added ? (
                <>
                  <CheckIcon width={18} height={18} /> Added to cart
                </>
              ) : (
                <>
                  <PlusIcon width={18} height={18} /> Add to cart
                </>
              )}
            </button>
            <button type="button" onClick={buyNow} className="btn-ghost">
              Buy now
              <ArrowRight width={17} height={17} />
            </button>
          </div>
        </div>
      </section>

      {/* ===== Details ===== */}
      <section className="mx-auto max-w-[1440px] px-4 py-20 sm:px-10 xl:px-16" aria-label="Product details">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_1fr]">
          <div data-reveal="up">
            <p className="text-lg leading-relaxed text-ink sm:text-xl">{product.mechanism}</p>
            <ul className="mt-6 space-y-2.5 text-[0.95rem] text-ink">
              {[
                product.summary,
                `≥ ${product.purity} purity (HPLC)`,
                STORAGE_LABEL,
                isPen ? "Pre-filled injection pen" : "Lyophilised powder, single sealed vial",
              ].map((b) => (
                <li key={b} className="flex items-start gap-3">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-rosegold-deep" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
            {/* RUO disclaimer directly under the bullets, identical on every product */}
            <p className="mt-5 text-sm italic leading-relaxed text-ink-soft">
              For laboratory research use only. Not for human consumption, therapeutic use, diagnostic application, or
              veterinary use.
            </p>
            <Link href={`/coa/${product.id}`} className="btn-ghost mt-6">
              <FlaskIcon width={16} height={16} />
              Certificate of Analysis (COA)
            </Link>
          </div>

          <dl className="pdp-facts" data-reveal="up" data-delay="0.1">
            {[
              ["Dose", variant.label],
              ["Purity", product.purity],
              ["Format", isPen ? "Pen, 2.4 mL, 240 clicks" : "Sealed vial"],
              ["Price", fmt(variant.price)],
            ].map(([k, v]) => (
              <div key={k}>
                <dt className="font-data text-[0.7rem] uppercase tracking-[0.16em] text-ink-soft">{k}</dt>
                <dd className="font-display mt-1 text-2xl font-semibold text-plum-deep sm:text-3xl">{v}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* ===== Tabs ===== */}
        <div className="mt-20">
          <div className="flex gap-1 overflow-x-auto border-b border-line" role="tablist" aria-label="Product information">
            {(
              [
                ["profile", "Molecular profile"],
                ["qa", "Quality assurance"],
                // Vials are reconstituted and drawn on a syringe; pens ship pre-filled and are dialled in clicks.
                ["recon", isPen ? "Pen dosing" : "Reconstitution"],
              ] as [Tab, string][]
            ).map(([id, label]) => (
              <button
                key={id}
                type="button"
                role="tab"
                aria-selected={tab === id}
                onClick={() => setTab(id)}
                className={`pdp-tab ${tab === id ? "is-on" : ""}`}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="py-10" role="tabpanel">
            {tab === "profile" ? (
              <div className="max-w-3xl">
                <table className="w-full border-collapse text-sm">
                  <tbody>
                    {[
                      ["CAS", product.molecular.cas],
                      ["Molecular mass", product.molecular.weight],
                      ["Molecular formula", product.molecular.formula],
                      ["Sequence", product.molecular.sequence],
                      ["Form", isPen ? "Pre-filled injection pen" : "Lyophilised powder, single sealed vial"],
                      ["Purity", `≥ ${product.purity}`],
                      ["Storage", STORAGE_SPEC],
                      ["COA", "Available on request"],
                    ].map(([k, v]) => (
                      <tr key={k} className="border-b border-line">
                        <th scope="row" className="w-48 py-3.5 pr-4 text-left align-top font-data text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-ink-soft">
                          {k}
                        </th>
                        <td className="font-data break-all py-3.5 text-[0.85rem] text-ink">
                          {v || <span className="font-sans text-ink-soft">Not listed</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <p className="mt-4 text-sm text-ink-soft">Independently third-party tested. COA available on request.</p>
              </div>
            ) : tab === "recon" ? (
              <div className="max-w-3xl">
                <p className="mb-6 max-w-2xl text-[0.95rem] leading-relaxed text-ink">
                  {isPen ? (
                    <>
                      Pre-filled with this pen&rsquo;s {variant.label} of peptide. Set your target dose to see how many
                      clicks to dial.
                    </>
                  ) : (
                    <>
                      Pre-filled with this vial&rsquo;s {variant.label} of peptide. Adjust the bacteriostatic water and
                      target dose to see the draw volume and where it lands on a U-100 insulin syringe.
                    </>
                  )}
                </p>
                <ReconstitutionCalculator defaultMg={variant.mg} defaultMode={isPen ? "pen" : "vial"} compact />
                <p className="mt-6 text-sm leading-relaxed text-ink-soft">
                  Research use only, not for human or veterinary use. This tool does not constitute dosing guidance.{" "}
                  <Link href="/calculator" className="text-rosegold-deep underline underline-offset-4">
                    Open the full calculator
                  </Link>
                  .
                </p>
              </div>
            ) : (
              <div className="grid max-w-4xl gap-8 sm:grid-cols-2">
                <div>
                  <FlaskIcon width={26} height={26} className="text-rosegold-deep" />
                  <h3 className="font-display mt-3 text-xl font-semibold text-plum-deep">Minimum 99% purity</h3>
                  <p className="mt-2 text-[0.95rem] leading-relaxed text-ink">
                    Every Cellexa Labs compound undergoes independent third-party testing to ensure a minimum of 99%
                    purity in every batch.
                  </p>
                </div>
                <div>
                  <ShieldIcon width={26} height={26} className="text-rosegold-deep" />
                  <h3 className="font-display mt-3 text-xl font-semibold text-plum-deep">Sterile containment</h3>
                  <p className="mt-2 text-[0.95rem] leading-relaxed text-ink">
                    Manufactured and packaged under sterile conditions with full endotoxin screening. Certificates of
                    Analysis are available on request for every batch.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ===== Research-Use-Only disclaimer (persistent, shown on every product) ===== */}
        <div className="mt-8 border-t border-line pt-8">
          <p className="font-data text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-plum-deep">
            Research use only
          </p>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-ink-soft">
            This product is intended for laboratory research use only. It is not a drug, food, or cosmetic, and is not
            intended for human or animal use, diagnosis, treatment, cure, or prevention of any disease. By purchasing,
            you confirm you are a qualified researcher or institution acquiring this material for lawful research
            purposes.
          </p>
        </div>
      </section>
    </>
  );
}
