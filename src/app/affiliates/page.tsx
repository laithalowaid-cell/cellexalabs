import type { Metadata } from "next";
import Link from "next/link";
import { WHATSAPP_NUMBER, WHATSAPP_DISPLAY } from "@/lib/constants";
import { ArrowRight, SparkIcon, AwardIcon, ShieldIcon, WhatsAppIcon } from "@/components/icons";

export const metadata: Metadata = {
  title: "Affiliate Program",
  description:
    "Join the Cellexa Labs affiliate program. Earn 10% commission on every order you refer, free to join, paid monthly in AED.",
};

const COMMISSION_PERCENT = 10;
const CUSTOMER_DISCOUNT_PERCENT = 5;

const APPLY_TEXT = [
  "Hi Cellexa Labs! I'd like to join your affiliate program.",
  "",
  "Name: ",
  "Instagram / TikTok / WhatsApp channel: ",
  "How I plan to promote: ",
  "",
  "Please send me my coupon code and the details. Thank you!",
].join("\n");

const APPLY_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(APPLY_TEXT)}`;

const STATS = [
  { value: `${COMMISSION_PERCENT}%`, label: "Commission per order" },
  { value: "AED", label: "Payouts, monthly" },
  { value: "0", label: "Cost to join" },
];

const STEPS = [
  {
    n: "1",
    title: "Apply on WhatsApp",
    body: "Send us your name and how you plan to promote. Once approved, we issue you a personal coupon code.",
  },
  {
    n: "2",
    title: "Share your code",
    body: `Post it anywhere, or simply hand it out. It gives your audience ${CUSTOMER_DISCOUNT_PERCENT}% off and credits you even on WhatsApp orders and bank-transfer orders, no tracking cookie needed.`,
  },
  {
    n: "3",
    title: "Get paid monthly",
    body: "Commission is confirmed once an order is paid, never on cancellations. Payouts are totalled and sent in AED at the end of each month.",
  },
];

const BENEFITS = [
  {
    icon: ShieldIcon,
    title: "Coupon-code tracking",
    body: `Your code gives your audience ${CUSTOMER_DISCOUNT_PERCENT}% off and credits you automatically — works on WhatsApp and bank-transfer orders too.`,
  },
  {
    icon: AwardIcon,
    title: "Transparent payouts",
    body: "A clear statement of every order attributed to your code, totalled and paid in AED at month end.",
  },
  {
    icon: SparkIcon,
    title: "Ready-made content",
    body: "Product photography and captions supplied on request, on brand and ready to post.",
  },
];

const FAQS = [
  {
    q: "Who can join?",
    a: "Anyone with an audience interested in research peptides — there's no minimum follower count. We approve applications individually on WhatsApp.",
  },
  {
    q: "When do I actually earn commission?",
    a: "As soon as an order placed with your code is confirmed and paid. Cancelled or refunded orders don't count.",
  },
  {
    q: "How and when am I paid?",
    a: "We total your confirmed commissions at the end of each month and send them by bank transfer in AED.",
  },
  {
    q: "Can I promote on WhatsApp and Instagram?",
    a: "Yes. Your coupon code works everywhere — including WhatsApp orders and bank-transfer orders, where a tracking link alone wouldn't count the sale.",
  },
];

export default function AffiliatesPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
      {/* Hero */}
      <div className="text-center">
        <p className="eyebrow mb-4 text-rosegold-deep">Cellexa Labs · Partner Program</p>
        <h1 className="font-display text-4xl font-semibold leading-tight text-plum-deep sm:text-5xl">
          Recommend the standard.
          <br />
          Earn on every order.
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-ink-soft sm:text-base">
          Join the Cellexa Labs affiliate program and earn commission on every paid order you
          refer. Free to join, tracked with your personal code, paid out monthly in AED.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <a href={APPLY_URL} target="_blank" rel="noopener noreferrer" className="btn-primary">
            <WhatsAppIcon width={18} height={18} />
            Apply on WhatsApp
          </a>
          <Link href="/shop" className="btn-ghost">
            Browse the Catalog
            <ArrowRight width={16} height={16} />
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="mt-14 grid grid-cols-3 gap-px overflow-hidden rounded-card border border-line bg-line">
        {STATS.map((s) => (
          <div key={s.label} className="bg-white px-3 py-6 text-center sm:px-6">
            <div className="font-display text-3xl font-medium text-plum-deep sm:text-4xl">
              {s.value}
            </div>
            <div className="mt-1 text-[0.7rem] uppercase tracking-wide text-ink-soft sm:text-xs">
              {s.label}
            </div>
          </div>
        ))}
      </div>

      {/* How it works */}
      <div className="mt-20">
        <p className="eyebrow text-center text-rosegold-deep">How It Works</p>
        <h2 className="mt-2 text-center font-display text-2xl font-medium text-plum-deep sm:text-3xl">
          Three steps to your first payout
        </h2>
        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          {STEPS.map((s) => (
            <div key={s.n} className="surface-card p-6">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blush font-display text-base font-semibold text-plum-deep">
                {s.n}
              </div>
              <h3 className="mt-4 text-sm font-semibold text-ink">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">{s.body}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Why Cellexa Labs */}
      <div className="mt-20">
        <p className="eyebrow text-center text-rosegold-deep">Why Cellexa Labs</p>
        <h2 className="mt-2 text-center font-display text-2xl font-medium text-plum-deep sm:text-3xl">
          Built for how the UAE actually buys
        </h2>
        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          {BENEFITS.map(({ icon: Icon, title, body }) => (
            <div key={title} className="text-center sm:text-left">
              <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-blush text-rosegold-deep sm:mx-0">
                <Icon width={20} height={20} />
              </span>
              <h3 className="mt-4 text-sm font-semibold text-ink">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">{body}</p>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <div className="mt-20">
        <p className="eyebrow text-center text-rosegold-deep">Questions</p>
        <h2 className="mt-2 text-center font-display text-2xl font-medium text-plum-deep sm:text-3xl">
          Frequently asked
        </h2>
        <div className="mx-auto mt-10 max-w-2xl space-y-6">
          {FAQS.map((f) => (
            <div key={f.q} className="border-b border-line pb-6">
              <h3 className="text-sm font-semibold text-ink">{f.q}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">{f.a}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="surface-card mt-20 p-8 text-center">
        <h2 className="font-display text-2xl font-medium text-plum-deep">Ready to start?</h2>
        <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-ink-soft">
          Message us on WhatsApp to apply — most applications are approved the same day.
        </p>
        <a
          href={APPLY_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary mt-6 inline-flex"
        >
          <WhatsAppIcon width={18} height={18} />
          Apply on WhatsApp
        </a>
        <p className="mt-4 text-xs text-ink-soft">
          Or reach us directly at{" "}
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-rosegold-deep underline-offset-4 hover:underline"
          >
            {WHATSAPP_DISPLAY}
          </a>
        </p>
      </div>
    </div>
  );
}
