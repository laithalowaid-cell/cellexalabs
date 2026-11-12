import type { Metadata } from "next";
import { cookies } from "next/headers";
import {
  ADMIN_COOKIE,
  ORDER_STATUSES,
  adminConfigured,
  listOrders,
  sessionValid,
  storageReady,
  type Order,
} from "@/lib/orders";
import { formatPrice } from "@/lib/products";
import { changeStatus, login, logout } from "./actions";

export const metadata: Metadata = {
  title: "Orders",
  robots: { index: false, follow: false },
};

const when = (iso: string) =>
  new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Dubai",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));

const waLink = (phone: string) => {
  let d = phone.replace(/\D/g, "");
  if (d.startsWith("00")) d = d.slice(2);
  else if (d.startsWith("0")) d = "971" + d.slice(1);
  return `https://wa.me/${d}`;
};

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ wrong?: string; status?: string }>;
}) {
  const sp = await searchParams;
  const shell = "mx-auto w-full max-w-5xl px-5 py-12";

  if (!adminConfigured() || !storageReady()) {
    return (
      <main className={shell}>
        <h1 className="font-display text-3xl font-medium text-plum-deep">Orders</h1>
        <p className="mt-4 text-sm text-ink-soft">
          This page is not switched on yet. It needs an orders password and order storage to be
          set up for the site.
        </p>
      </main>
    );
  }

  if (!sessionValid((await cookies()).get(ADMIN_COOKIE)?.value)) {
    return (
      <main className={`${shell} max-w-sm`}>
        <h1 className="font-display text-3xl font-medium text-plum-deep">Orders</h1>
        <form action={login} className="mt-6 space-y-3">
          <label htmlFor="pw" className="block text-xs font-medium text-ink-soft">
            Password
          </label>
          <input id="pw" name="password" type="password" required autoFocus className="input" />
          {sp.wrong && <p className="text-xs text-red-600">That password is not right.</p>}
          <button className="btn-primary w-full text-sm">Open orders</button>
        </form>
      </main>
    );
  }

  const all = await listOrders();
  const filter = ORDER_STATUSES.find((s) => s === sp.status);
  const orders = filter ? all.filter((o) => o.status === filter) : all;
  const count = (s: string) => all.filter((o) => o.status === s).length;

  return (
    <main className={shell}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-3xl font-medium text-plum-deep">Orders</h1>
        <form action={logout}>
          <button className="text-xs font-medium text-ink-soft hover:text-plum">Lock page</button>
        </form>
      </div>
      <p className="mt-2 text-xs leading-relaxed text-ink-soft">
        An order appears here the moment a customer taps “Send Order on WhatsApp”. It stays “New”
        until you have seen their WhatsApp message and confirmed it.
      </p>

      <nav className="mt-6 flex flex-wrap gap-2 text-xs">
        <a
          href="/admin/orders"
          className={`rounded-full border px-3 py-1.5 ${!filter ? "border-plum bg-blush text-plum-deep" : "border-line text-ink-soft"}`}
        >
          All ({all.length})
        </a>
        {ORDER_STATUSES.map((s) => (
          <a
            key={s}
            href={`/admin/orders?status=${encodeURIComponent(s)}`}
            className={`rounded-full border px-3 py-1.5 ${filter === s ? "border-plum bg-blush text-plum-deep" : "border-line text-ink-soft"}`}
          >
            {s} ({count(s)})
          </a>
        ))}
      </nav>

      {orders.length === 0 ? (
        <p className="mt-10 text-sm text-ink-soft">No orders here yet.</p>
      ) : (
        <ul className="mt-6 space-y-4">
          {orders.map((o) => (
            <OrderCard key={o.ref} o={o} />
          ))}
        </ul>
      )}
    </main>
  );
}

function OrderCard({ o }: { o: Order }) {
  const priceWarning = o.lines.some((l) => !l.priceOk);
  return (
    <li className="surface-card p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-ink">{o.customer.name}</p>
          <p className="mt-0.5 text-xs text-ink-soft">
            {when(o.createdAt)} ·{" "}
            <a href={waLink(o.customer.phone)} className="underline hover:text-plum">
              {o.customer.phone}
            </a>
          </p>
        </div>
        <p className="font-display text-xl font-medium text-plum-deep tabular-nums">
          {formatPrice(o.total)}
        </p>
      </div>

      <ul className="mt-3 space-y-1 text-sm text-ink">
        {o.lines.map((l, i) => (
          <li key={i} className="flex justify-between gap-4">
            <span>
              {l.qty} × {l.name} <span className="text-ink-soft">— {l.variantLabel}</span>
            </span>
            <span className="shrink-0 tabular-nums text-ink-soft">
              {formatPrice(l.unitPrice * l.qty)}
            </span>
          </li>
        ))}
      </ul>

      <p className="mt-3 text-xs leading-relaxed text-ink-soft">
        {o.customer.emirate} · {o.customer.address.replace(/\s*\n\s*/g, ", ")}
        <br />
        {o.customer.payment}
        {o.discount > 0 && ` · ${o.discountPercent}% discount (−${formatPrice(o.discount)})`}
        {o.freeDelivery && " · Free delivery"}
        <br />
        Ref {o.ref}
      </p>

      {priceWarning && (
        <p className="mt-2 text-xs font-medium text-red-600">
          Check the prices on this order: one did not match the shop’s price list.
        </p>
      )}

      <form action={changeStatus} className="mt-4 flex flex-wrap items-center gap-2">
        <input type="hidden" name="ref" value={o.ref} />
        <label htmlFor={`st-${o.ref}`} className="text-xs font-medium text-ink-soft">
          Status
        </label>
        <select
          id={`st-${o.ref}`}
          name="status"
          defaultValue={o.status}
          className="input !w-auto !py-1.5 text-sm"
        >
          {ORDER_STATUSES.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
        <button className="btn-ghost !py-1.5 text-xs">Save</button>
      </form>
    </li>
  );
}
