import Link from "next/link";
import { fromPrice, formatPrice, type Product } from "@/lib/products";
import { cutout, cutoutSize, heroImage } from "@/lib/pens";
import { ArrowRight } from "../icons";

export function doseList(p: Product) {
  const allMg = p.variants.every((v) => /mg$/i.test(v.label.trim()));
  return allMg
    ? `${p.variants.map((v) => v.label.replace(/\s*mg$/i, "")).join(" · ")} mg`
    : p.variants.map((v) => v.label).join(" · ");
}

/** One product as an index row: name and doses, the product gliding across, the starting price. */
export default function RangeRow({ product: p }: { product: Product }) {
  const src = heroImage(p);
  const img = cutout(src);
  return (
    <li className="border-b border-line" data-reveal="glide">
      <Link href={`/shop/${p.id}`} className="range-row group">
        <span className="range-row__flood" aria-hidden="true" />
        <span className="range-row__text">
          <span className="font-display text-2xl font-semibold text-plum-deep sm:text-[2.1rem]">{p.name}</span>
          <span className="font-data mt-1 block text-[0.82rem] text-ink-soft">
            {p.form === "vial" ? "Vial · " : "Pen · "}
            {doseList(p)}
          </span>
        </span>
        <span className={`range-row__pen ${p.form === "vial" ? "is-vial" : ""}`} aria-hidden="true">
          {(img ?? src) && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={img ?? src} alt="" loading="lazy" {...cutoutSize(img)} className={img ? "" : "mix-blend-multiply"} />
          )}
        </span>
        <span className="range-row__price font-data">
          <span className="text-ink-soft">from</span> {formatPrice(fromPrice(p))}
          <ArrowRight width={18} height={18} className="range-row__arrow" />
        </span>
      </Link>
    </li>
  );
}
