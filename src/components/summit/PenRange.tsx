import Link from "next/link";
import { PRODUCTS } from "@/lib/products";
import RangeRow from "./RangeRow";
import { ArrowRight } from "../icons";

/** The pen range as an index: one row per pen, the pen itself gliding across each row. */
export default function PenRange({ limit = 8 }: { limit?: number }) {
  const pens = PRODUCTS.filter((p) => p.form === "pen");
  const ordered = [...pens.filter((p) => p.featured), ...pens.filter((p) => !p.featured)];
  const shown = ordered.slice(0, limit);

  return (
    <section className="mx-auto max-w-[1440px] overflow-x-clip px-4 py-24 sm:px-10 sm:py-32 xl:px-16" aria-labelledby="range-title">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <h2 id="range-title" className="display-xl text-[clamp(2.6rem,8vw,7.5rem)] text-plum-deep" data-split="lines">
          The pen range
        </h2>
        <p className="max-w-sm text-base leading-relaxed text-ink" data-reveal="up">
          {pens.length} peptides, each pre-filled in a 240-click pen. Prices are per pen, in AED.
        </p>
      </div>

      <ul className="mt-14 border-t border-line">
        {shown.map((p) => (
          <RangeRow key={p.id} product={p} />
        ))}
      </ul>

      <div className="mt-10 flex justify-end">
        <Link href="/shop?form=pen" className="btn-primary">
          See all {pens.length} pens
          <ArrowRight width={17} height={17} />
        </Link>
      </div>
    </section>
  );
}
