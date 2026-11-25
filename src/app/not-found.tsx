import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight } from "@/components/icons";

export const metadata: Metadata = { title: "Page not found", robots: { index: false } };

/** 404: a route off the mountain. The number sits behind the peak, like the wordmark on the home page. */
export default function NotFound() {
  return (
    <section className="pdp-scene" aria-labelledby="nf-title" style={{ alignContent: "center" }}>
      <div className="pdp-scene__sky" aria-hidden="true" />
      <picture className="pdp-scene__layer" aria-hidden="true">
        <source media="(max-width: 767px)" srcSet="/mountain/far-sm.webp" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/mountain/far.webp" alt="" width={2400} height={1500} />
      </picture>
      <p className="pdp-scene__name display-xl" aria-hidden="true" style={{ fontSize: "min(26rem, 40vw)", top: "6%" }}>
        404
      </p>
      <picture className="pdp-scene__layer" aria-hidden="true">
        <source media="(max-width: 767px)" srcSet="/mountain/massif-sm.webp" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/mountain/massif.webp" alt="" width={2400} height={1500} />
      </picture>
      <div className="pdp-buy relative z-20 mx-auto mt-[38svh] max-w-md text-center">
        <h1 id="nf-title" className="font-display text-3xl font-semibold text-plum-deep">
          This route is off the map
        </h1>
        <p className="mt-3 text-[0.95rem] leading-relaxed text-ink">
          The page may have moved, or the link has a typo. The pens are all still where they were.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link href="/shop?form=pen" className="btn-primary">
            Shop pens
            <ArrowRight width={17} height={17} />
          </Link>
          <Link href="/" className="btn-ghost">
            Back to the summit
          </Link>
        </div>
      </div>
    </section>
  );
}
