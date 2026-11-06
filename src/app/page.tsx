import Link from "next/link";
import { PRODUCTS, FOCUS_META, Focus, Form } from "@/lib/products";
import { BUNDLES } from "@/lib/bundles";
import ProductCard from "@/components/ProductCard";
import BundleCard from "@/components/BundleCard";
import TrustBar from "@/components/TrustBar";
import HeroVisual from "@/components/HeroVisual";
import { ArrowRight } from "@/components/icons";
import { DnaMark } from "@/components/Logo";

const FORMAT_CARDS: {
  form: Form;
  title: string;
  meta: string;
  blurb: string;
  image: string;
  /** Pens are a long landscape render, so they sit on a diagonal to fill the slot. */
  imageClass: string;
}[] = [
  {
    form: "vial",
    title: "Vials",
    meta: "lyophilised",
    blurb: "Reconstitute and draw exactly what your protocol calls for.",
    image: "/products/ghk-cu-vial-100mg.png",
    imageClass: "scale-95",
  },
  {
    form: "pen",
    title: "Pens",
    meta: "pre-filled",
    blurb: "Reconstituted and pre-filled. No mixing, no draw-up, dial by clicks.",
    image: "/products/retatrutide-60mg.png",
    imageClass: "-rotate-[38deg] scale-[1.55]",
  },
];

const FOCUS_CARDS: { key: Focus; featured: string[] }[] = [
  { key: "weightloss", featured: ["Retatrutide", "AOD-9604", "Kisspeptin-10"] },
  { key: "growth", featured: ["CJC + Ipamorelin", "IGF-1 LR3", "Ipamorelin"] },
  { key: "recovery", featured: ["BPC-157", "KLOW", "Wolverine Stack"] },
  { key: "antiaging", featured: ["NAD+", "MOTS-C", "GHK-Cu"] },
];

export default function Home() {
  const featured = PRODUCTS.filter((p) => p.featured).slice(0, 4);
  const countByForm = (form: Form) => PRODUCTS.filter((p) => p.form === form).length;

  return (
    <>
      {/* ============== HERO ============== */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 -z-10"
          style={{
            background:
              "radial-gradient(1200px 500px at 15% -10%, rgba(236,220,174,0.5), transparent), radial-gradient(900px 500px at 100% 0%, rgba(27,36,71,0.12), transparent)",
          }}
        />
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 md:py-24 lg:grid-cols-2 lg:px-8">
          {/* Left */}
          <div style={{ animation: "var(--animate-slide-up)" }}>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-line bg-white/70 px-3.5 py-1.5 backdrop-blur">
              <DnaMark size={16} />
              <span className="eyebrow text-rosegold-deep">Premium Research Peptides · UAE</span>
            </div>
            <h1 className="font-display text-5xl font-medium leading-[1.05] text-plum-deep sm:text-6xl lg:text-7xl">
              Research-Grade Peptides.
              <br />
              <span className="text-rosegold-gradient">Gulf-Grade Purity.</span>
            </h1>
            <p className="mt-6 max-w-lg text-base leading-relaxed text-ink-soft">
              Research-grade peptides, synthesized to a minimum{" "}
              <strong className="text-ink">99% purity</strong> and independently third-party
              tested. Pens and vials, discreetly packaged with fast delivery across the UAE.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link href="/shop" className="btn-primary">
                Shop Our Catalog
                <ArrowRight width={18} height={18} />
              </Link>
            </div>
            <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3">
              {[
                ["99%+", "Verified Purity"],
                ["3rd-Party", "Lab Tested"],
                ["UAE", "Fast Delivery"],
              ].map(([big, small]) => (
                <div key={small}>
                  <p className="font-display text-2xl font-semibold text-plum">{big}</p>
                  <p className="text-xs uppercase tracking-wider text-ink-soft">{small}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right */}
          <div className="relative" style={{ animation: "var(--animate-slide-up)", animationDelay: "0.1s" }}>
            <HeroVisual />
          </div>
        </div>
      </section>

      <TrustBar />

      {/* ============== CHOOSE A FORMAT: VIAL OR PEN ============== */}
      <section className="mx-auto max-w-7xl px-4 pt-20 sm:px-6 lg:px-8">
        <h2 className="font-display text-4xl font-medium text-plum-deep sm:text-5xl">
          Vials or pens.
        </h2>

        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {FORMAT_CARDS.map((f) => (
            <Link
              key={f.form}
              href={`/shop?form=${f.form}`}
              className="group flex items-center gap-6 rounded-card bg-blush p-8 transition-[transform,box-shadow] hover:-translate-y-1 hover:shadow-[0_18px_40px_-24px_rgba(16,26,48,0.35)] sm:gap-8"
            >
              <div className="flex h-40 w-32 shrink-0 items-center justify-center sm:h-48 sm:w-40">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={f.image}
                  alt=""
                  aria-hidden
                  // Product shots ship on a white backdrop; multiply drops it
                  // into the tinted card instead of showing a white box.
                  className={`max-h-full max-w-full object-contain mix-blend-multiply ${f.imageClass}`}
                />
              </div>

              <div className="min-w-0">
                <h3 className="font-display text-3xl font-medium text-plum-deep">{f.title}</h3>

                <p className="mt-2 font-mono text-xs tracking-wide text-ink-soft">
                  {countByForm(f.form)} products &middot; {f.meta}
                </p>

                <p className="mt-4 text-[0.95rem] leading-relaxed text-ink">{f.blurb}</p>

                <span className="mt-6 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-rosegold-deep transition-colors group-hover:text-plum">
                  Browse {f.title.toLowerCase()}
                  <ArrowRight width={14} height={14} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ============== FEATURED BUNDLES ============== */}
      <section className="mt-20 bg-blush/40 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="lux-rule mb-4">
              <span className="eyebrow text-rosegold-deep">Featured Deals</span>
            </div>
            <h2 className="font-display text-4xl font-medium text-plum-deep sm:text-5xl">
              Bundle Deals
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-sm text-ink-soft">
              Curated stacks priced below the cost of buying each compound separately.
            </p>
          </div>

          <div className="mt-14 grid gap-6 lg:grid-cols-3">
            {BUNDLES.filter((b) => b.featured).map((b) => (
              <BundleCard key={b.id} bundle={b} />
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link href="/bundles" className="btn-ghost text-sm">
              View all bundles
            </Link>
          </div>
        </div>
      </section>

      {/* ============== SHOP BY TREATMENT FOCUS ============== */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="lux-rule mb-4">
            <span className="eyebrow text-rosegold-deep">Curated Collections</span>
          </div>
          <h2 className="font-display text-4xl font-medium text-plum-deep sm:text-5xl">
            Shop by Category
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm text-ink-soft">
            A research-grade catalogue organised by compound class.
          </p>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {FOCUS_CARDS.map(({ key, featured }) => {
            const meta = FOCUS_META[key];
            const dark = key === "growth";
            return (
              <Link
                key={key}
                href={`/shop?focus=${key}`}
                className={`group relative flex flex-col overflow-hidden rounded-2xl border p-6 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_28px_56px_-28px_rgba(122,46,85,0.45)] ${
                  dark
                    ? "border-charcoal-soft bg-charcoal text-white"
                    : "border-line bg-white"
                }`}
              >
                <span
                  className="absolute right-5 top-5 h-3.5 w-3.5 rounded-full ring-4 ring-white/40"
                  style={{ background: meta.cap }}
                />
                <span
                  className={`eyebrow ${dark ? "text-rosegold-soft" : "text-rosegold-deep"}`}
                >
                  Category
                </span>
                <h3
                  className={`font-display mt-3 text-2xl font-medium leading-tight ${
                    dark ? "text-white" : "text-ink"
                  }`}
                >
                  {meta.title}
                </h3>
                <p className={`mt-2 text-sm ${dark ? "text-white/70" : "text-ink-soft"}`}>
                  {meta.blurb}
                </p>
                <div className="mt-5 flex flex-wrap gap-1.5">
                  {featured.map((f) => (
                    <span
                      key={f}
                      className={`rounded-full px-2.5 py-1 text-[0.66rem] font-medium ${
                        dark ? "bg-white/10 text-white/80" : "bg-blush text-plum"
                      }`}
                    >
                      {f}
                    </span>
                  ))}
                </div>
                <span
                  className={`mt-auto inline-flex items-center gap-1.5 pt-6 text-sm font-semibold transition-colors ${
                    dark
                      ? "text-white group-hover:text-rosegold-soft"
                      : "text-plum group-hover:text-rosegold-deep"
                  }`}
                >
                  Explore collection
                  <ArrowRight
                    width={16}
                    height={16}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ============== FEATURED PRODUCTS ============== */}
      <section className="bg-blush/40 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <span className="eyebrow text-rosegold-deep">Best Sellers</span>
              <h2 className="font-display mt-2 text-4xl font-medium text-plum-deep sm:text-5xl">
                Featured Compounds
              </h2>
            </div>
            <Link href="/shop" className="btn-ghost text-sm">
              View all
              <ArrowRight width={16} height={16} />
            </Link>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>

      {/* ============== TONE / TRUST CLOSER ============== */}
      <section className="mx-auto max-w-5xl px-4 py-24 text-center sm:px-6 lg:px-8">
        <div className="lux-rule mb-6">
          <DnaMark size={20} />
        </div>
        <h2 className="font-display text-3xl font-medium leading-snug text-plum-deep sm:text-4xl">
          Peptide science. <span className="text-rosegold-gradient">Verified purity.</span>
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-ink-soft">
          Cellexa Labs offers a curated range of research peptides and related compounds,
          each characterised for identity and purity and backed by rigorous third-party
          testing — supplied for laboratory research use only.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/shop" className="btn-primary">Browse the Catalog</Link>
        </div>
      </section>
    </>
  );
}
