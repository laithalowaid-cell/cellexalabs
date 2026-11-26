import Link from "next/link";
import { PRODUCTS } from "@/lib/products";
import { getPublished } from "@/lib/reviews";
import ReviewForm from "./ReviewForm";

function Stars({ n }: { n: number }) {
  return (
    <span className="review-stars" aria-label={`${n} out of 5 stars`}>
      {"★★★★★".slice(0, n)}
      <span className="opacity-25">{"★★★★★".slice(n)}</span>
    </span>
  );
}

const dateFmt = new Intl.DateTimeFormat("en-GB", { month: "long", year: "numeric" });

/** Approved customer reviews, plus the form to leave one. Server component; React escapes all review text. */
export default async function Testimonials() {
  const reviews = (await getPublished()).slice(0, 12);
  const products = PRODUCTS.map((p) => ({
    id: p.id,
    label: `${p.name} (${p.form === "vial" ? "vial" : p.form === "spray" ? "nasal spray" : "pen"})`,
  })).sort((a, b) => a.label.localeCompare(b.label));
  const avg = reviews.length ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0;

  return (
    <section id="reviews" className="mx-auto max-w-[1440px] overflow-x-clip px-4 py-24 sm:px-10 xl:px-16" aria-labelledby="reviews-title">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <h2 id="reviews-title" className="display-xl text-[clamp(2.4rem,6.5vw,6rem)] text-plum-deep" data-split="lines">
          From our clients
        </h2>
        {reviews.length > 0 && (
          <p className="font-data text-sm text-ink-soft">
            <span className="text-plum-deep">{avg.toFixed(1)} / 5</span> from {reviews.length} review
            {reviews.length > 1 ? "s" : ""}
          </p>
        )}
      </div>

      {reviews.length > 0 ? (
        <ul className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {reviews.map((r, i) => (
            <li key={r.id} className="review-card" data-reveal="up" data-delay={String((i % 3) * 0.06)}>
              <Stars n={r.rating} />
              <blockquote className="mt-4 text-[1.02rem] leading-relaxed text-ink">&ldquo;{r.text}&rdquo;</blockquote>
              <p className="mt-5 text-sm font-semibold text-plum-deep">
                {r.name}
                {r.emirate && <span className="font-normal text-ink-soft">, {r.emirate}</span>}
              </p>
              <p className="font-data mt-1 text-xs text-ink-soft">
                {r.productId ? (
                  <Link href={`/shop/${r.productId}`} className="underline underline-offset-4 hover:text-rosegold-deep">
                    {r.productName}
                  </Link>
                ) : (
                  "Order"
                )}{" "}
                · {dateFmt.format(new Date(r.createdAt))}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-6 max-w-lg text-base leading-relaxed text-ink">
          Bought from us? Tell other clients how ordering and delivery went. Approved reviews appear here.
        </p>
      )}

      <div className="review-form mt-14">
        <h3 className="font-display text-2xl font-semibold text-plum-deep sm:text-3xl">Leave a review</h3>
        <div className="mt-6 max-w-2xl">
          <ReviewForm products={products} />
        </div>
      </div>
    </section>
  );
}
