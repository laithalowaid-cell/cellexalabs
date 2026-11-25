import Link from "next/link";
import { PRODUCTS, FOCUS_META, Focus, fromPrice, formatPrice } from "@/lib/products";
import { BUNDLES } from "@/lib/bundles";
import { cutout, cutoutSize, heroImage } from "@/lib/pens";
import BundleCard from "@/components/BundleCard";
import SummitHero from "@/components/summit/SummitHero";
import PenAnatomy from "@/components/summit/PenAnatomy";
import PenRange from "@/components/summit/PenRange";
import Snowfall from "@/components/summit/Snowfall";
import { ArrowRight } from "@/components/icons";
import Testimonials from "@/components/Testimonials";

// Re-check approved reviews at most once an hour; approving a review refreshes the page at once.
export const revalidate = 3600;

/** The pen in the hero. Name, dose and price come from products.ts. */
const HERO_PEN_ID = "retatrutide";
const HERO_PEN_DOSE = "30 mg";
/** The pen shown close up in "Anatomy of a pen". */
const ANATOMY_PEN_ID = "retatrutide";
const ANATOMY_PEN_DOSE = "30 mg";
/** Vials with clean cut-outs, shown on the snow. */
const VIAL_IDS = ["retatrutide-vial", "ghk-cu-vial", "mots-c-vial", "pt-141-vial"];

const FOCUS_ORDER: Focus[] = ["weightloss", "growth", "recovery", "antiaging", "wellness"];

function find(id: string) {
  const p = PRODUCTS.find((x) => x.id === id);
  if (!p) throw new Error(`Homepage: no product with id "${id}"`);
  return p;
}

export default function Home() {
  const pens = PRODUCTS.filter((p) => p.form === "pen");

  const heroProduct = find(HERO_PEN_ID);
  const heroVariant = heroProduct.variants.find((v) => v.label === HERO_PEN_DOSE) ?? heroProduct.variants[0];
  const heroPen = {
    id: heroProduct.id,
    name: heroProduct.name,
    dose: heroVariant.label,
    price: fromPrice(heroProduct),
    // Full-resolution cut-out: this pen is shown very large.
    image: (cutout(heroVariant.image) ?? heroVariant.image ?? "").replace("/pens/", "/pens/hd/"),
    count: pens.length,
  };

  const anatomy = find(ANATOMY_PEN_ID);
  const anatomyImage = (cutout(anatomy.variants.find((v) => v.label === ANATOMY_PEN_DOSE)?.image) ?? "").replace("/pens/", "/pens/hd/");

  const vials = VIAL_IDS.map(find);
  const vialCount = PRODUCTS.filter((p) => p.form === "vial").length;

  return (
    <>
      <SummitHero pen={heroPen} />

      <PenAnatomy image={anatomyImage} name={`${anatomy.name} ${ANATOMY_PEN_DOSE}`} />

      <PenRange />

      {/* ============== VIALS ON THE SNOW ============== */}
      <section className="vials-band relative overflow-clip" aria-labelledby="vials-title">
        <div className="mx-auto grid max-w-[1440px] items-end gap-10 px-4 py-24 sm:px-10 lg:grid-cols-[1fr_1.3fr] xl:px-16">
          <div>
            <h2 id="vials-title" className="display-xl text-[clamp(2.4rem,6.5vw,6rem)] text-plum-deep" data-split="lines">
              Also in vials
            </h2>
            <p className="mt-5 max-w-md text-base leading-relaxed text-ink" data-reveal="up">
              {vialCount} compounds as lyophilised powder in a sealed vial, for researchers who reconstitute
              their own.
            </p>
            <Link href="/shop?form=vial" className="btn-ghost mt-7" data-reveal="up">
              Shop vials
              <ArrowRight width={17} height={17} />
            </Link>
          </div>
          <ul className="grid grid-cols-4 items-end gap-3 sm:gap-6">
            {vials.map((v, i) => {
              const img = cutout(heroImage(v));
              return (
                <li key={v.id} data-reveal="up" data-delay={String(i * 0.08)}>
                  <Link href={`/shop/${v.id}`} className="vial-tile group block text-center">
                    {img && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={img} alt={`${v.name} vial`} loading="lazy" {...cutoutSize(img)} className="mx-auto h-auto w-full max-w-[150px]" />
                    )}
                    <span className="mt-3 block font-display text-sm font-semibold text-plum-deep sm:text-base">{v.name}</span>
                    <span className="font-data block text-xs text-ink-soft">{formatPrice(fromPrice(v))}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* ============== BUNDLES ============== */}
      <section className="bg-blush py-24" aria-labelledby="bundles-title">
        <div className="mx-auto max-w-[1440px] px-4 sm:px-10 xl:px-16">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <h2 id="bundles-title" className="display-xl text-[clamp(2.4rem,6.5vw,6rem)] text-plum-deep" data-split="lines">
              Bundles
            </h2>
            <p className="max-w-sm text-base leading-relaxed text-ink" data-reveal="up">
              Stacks priced below the cost of buying each pen on its own.
            </p>
          </div>
          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {BUNDLES.filter((b) => b.featured).map((b, i) => (
              <div key={b.id} data-reveal="up" data-delay={String(i * 0.08)}>
                <BundleCard bundle={b} />
              </div>
            ))}
          </div>
          <div className="mt-10">
            <Link href="/bundles" className="btn-ghost">
              All bundles
              <ArrowRight width={17} height={17} />
            </Link>
          </div>
        </div>
      </section>

      {/* ============== CATEGORIES ============== */}
      <section className="mx-auto max-w-[1440px] overflow-x-clip px-4 py-24 sm:px-10 xl:px-16" aria-labelledby="cats-title">
        <h2 id="cats-title" className="font-data text-xs uppercase tracking-[0.18em] text-ink-soft">
          Shop by research area
        </h2>
        <ul className="mt-6 border-t border-line">
          {FOCUS_ORDER.map((k) => {
            const n = PRODUCTS.filter((p) => p.focus.includes(k)).length;
            return (
              <li key={k} className="border-b border-line" data-reveal="glide">
                <Link href={`/shop?focus=${k}`} className="cat-row group">
                  <span className="cat-row__title font-display">{FOCUS_META[k].title}</span>
                  <span className="font-data text-sm text-ink-soft">{n} products</span>
                  <ArrowRight width={22} height={22} className="cat-row__arrow" />
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      <Testimonials />

      {/* ============== SUMMIT CLOSER ============== */}
      <section className="closer relative overflow-clip" aria-labelledby="closer-title">
        <div className="closer__sky" aria-hidden="true" />
        <div className="closer__mountain" aria-hidden="true" data-parallax="0.08">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/mountain/massif.webp" alt="" loading="lazy" width={2400} height={1500} />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/mountain/snow.webp" alt="" loading="lazy" width={2400} height={1500} className="closer__snow" />
        </div>
        <Snowfall density={0.6} className="z-10" />
        <div className="relative z-20 mx-auto max-w-[1440px] px-4 pb-20 pt-28 sm:px-10 xl:px-16">
          <h2 id="closer-title" className="display-xl max-w-5xl text-[clamp(2.6rem,8vw,8rem)] text-white" data-split="lines">
            Tested at the top
          </h2>
          <p className="mt-6 max-w-lg text-base leading-relaxed text-white/90" data-reveal="up">
            Every compound is characterised for identity and purity and backed by independent third-party testing,
            supplied for laboratory research use only.
          </p>
          <div className="mt-8 flex flex-wrap gap-3" data-reveal="up">
            <Link href="/shop" className="btn-ghost">
              Shop the catalog
              <ArrowRight width={17} height={17} />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
