import type { Metadata } from "next";
import Link from "next/link";
import { BUNDLES } from "@/lib/bundles";
import { PROMOS } from "@/lib/promos";
import BundleCard from "@/components/BundleCard";

export const metadata: Metadata = {
  title: "Bundle Deals",
  description:
    "Curated peptide bundles for weight loss, recovery, focus and full transformation — priced below buying each compound separately.",
};

export default function BundlesPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="text-center">
        <div className="lux-rule mb-4">
          <span className="eyebrow text-rosegold-deep">Featured Deals</span>
        </div>
        <h1 className="font-display text-4xl font-medium text-plum-deep sm:text-5xl">
          Bundle Deals
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-ink-soft">
          Curated stacks priced below the cost of buying each compound on its own. Every
          bundle ships with the guides and support listed on the card.
        </p>
      </div>

      <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {BUNDLES.map((b) => (
          <BundleCard key={b.id} bundle={b} />
        ))}
      </div>

      {/* Site-wide promotions */}
      <section className="mt-20">
        <div className="text-center">
          <div className="lux-rule mb-4">
            <span className="eyebrow text-rosegold-deep">Always On</span>
          </div>
          <h2 className="font-display text-3xl font-medium text-plum-deep">
            Site-Wide Offers
          </h2>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {PROMOS.map((p) => (
            <div key={p.title} className="rounded-card bg-blush p-6">
              <h3 className="text-sm font-semibold text-plum-deep">{p.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">{p.detail}</p>
            </div>
          ))}
        </div>

        <p className="mt-6 text-center text-xs leading-relaxed text-ink-soft">
          Multi-buy discounts apply automatically in the cart and are counted on total
          quantity. The loyalty discount is applied when we confirm your order on WhatsApp.
        </p>
      </section>

      <p className="mt-12 text-center text-xs text-ink-soft/70">
        <Link href="/compliance" className="underline-offset-4 hover:text-plum hover:underline">
          Research Use Only — see our compliance policy
        </Link>
      </p>
    </div>
  );
}
