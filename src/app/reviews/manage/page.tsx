import type { Metadata } from "next";
import { cookies } from "next/headers";
import { ADMIN_COOKIE, getPending, getPublished, isValidAdminCookie, reviewsEnabled, type Review } from "@/lib/reviews";
import { approveReview, deleteReview, ownerLogout, unpublishReview } from "../actions";
import OwnerLogin from "./OwnerLogin";

export const metadata: Metadata = {
  title: "Manage reviews",
  robots: { index: false, follow: false },
};

const fmt = new Intl.DateTimeFormat("en-GB", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Dubai" });

function ReviewBlock({ r, children }: { r: Review; children: React.ReactNode }) {
  return (
    <li className="rounded-card border border-line bg-white p-5">
      <p className="font-data text-xs text-ink-soft">
        {fmt.format(new Date(r.createdAt))} · {"★".repeat(r.rating)}
        {"☆".repeat(5 - r.rating)} · {r.productName || "General"}
      </p>
      <p className="mt-3 whitespace-pre-wrap text-[0.95rem] leading-relaxed text-ink">{r.text}</p>
      <p className="mt-3 text-sm font-semibold text-plum-deep">
        {r.name}
        {r.emirate && <span className="font-normal text-ink-soft">, {r.emirate}</span>}
      </p>
      <div className="mt-4 flex flex-wrap gap-2">{children}</div>
    </li>
  );
}

/** Private page for the owner: approve, delete or unpublish customer reviews. */
export default async function ManageReviews() {
  const jar = await cookies();
  const signedIn = isValidAdminCookie(jar.get(ADMIN_COOKIE)?.value);

  return (
    <section className="mx-auto max-w-4xl px-4 py-16 sm:px-10">
      <h1 className="font-display text-4xl font-semibold text-plum-deep">Manage reviews</h1>

      {!reviewsEnabled() ? (
        <p className="mt-4 text-ink">Review storage is not connected on this deployment.</p>
      ) : !signedIn ? (
        <>
          <p className="mt-4 max-w-lg text-ink">Enter your owner key to approve or delete customer reviews.</p>
          <OwnerLogin />
        </>
      ) : (
        <Manage />
      )}
    </section>
  );
}

async function Manage() {
  const [pending, published] = await Promise.all([getPending(), getPublished()]);
  return (
    <>
      <p className="mt-4 max-w-2xl text-sm leading-relaxed text-ink-soft">
        Approve reviews about ordering, delivery, packaging and product quality. Delete anything with health or
        medical claims, contact details, links or offensive language: products are sold for research use only.
      </p>
      <form action={ownerLogout} className="mt-4">
        <button type="submit" className="btn-ghost text-sm">
          Sign out
        </button>
      </form>

      <h2 className="mt-12 font-display text-2xl font-semibold text-plum-deep">Waiting for approval ({pending.length})</h2>
      {pending.length === 0 ? (
        <p className="mt-3 text-ink-soft">No new reviews.</p>
      ) : (
        <ul className="mt-5 grid gap-4">
          {pending.map((r) => (
            <ReviewBlock key={r.id} r={r}>
              <form action={approveReview}>
                <input type="hidden" name="id" value={r.id} />
                <input type="hidden" name="productId" value={r.productId} />
                <button type="submit" className="btn-primary text-sm">
                  Approve and publish
                </button>
              </form>
              <form action={deleteReview}>
                <input type="hidden" name="id" value={r.id} />
                <button type="submit" className="btn-ghost text-sm">
                  Delete
                </button>
              </form>
            </ReviewBlock>
          ))}
        </ul>
      )}

      <h2 className="mt-14 font-display text-2xl font-semibold text-plum-deep">On the site ({published.length})</h2>
      {published.length === 0 ? (
        <p className="mt-3 text-ink-soft">Nothing published yet.</p>
      ) : (
        <ul className="mt-5 grid gap-4">
          {published.map((r) => (
            <ReviewBlock key={r.id} r={r}>
              <form action={unpublishReview}>
                <input type="hidden" name="id" value={r.id} />
                <input type="hidden" name="productId" value={r.productId} />
                <button type="submit" className="btn-ghost text-sm">
                  Remove from site
                </button>
              </form>
            </ReviewBlock>
          ))}
        </ul>
      )}
    </>
  );
}
