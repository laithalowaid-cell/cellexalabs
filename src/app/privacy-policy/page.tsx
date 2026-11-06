import type { Metadata } from "next";
import { WHATSAPP_NUMBER, WHATSAPP_DISPLAY } from "@/lib/constants";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Notice",
  description: "How Cellexa Labs collects, uses, and protects your personal information.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <p className="eyebrow mb-4 text-rosegold-deep">Legal</p>
      <h1 className="font-display text-4xl font-semibold leading-tight text-plum-deep">
        Privacy Notice
      </h1>
      <p className="mt-3 border-b border-line pb-8 text-sm text-ink-soft">
        Last updated 13 June 2026
      </p>

      <p className="mt-8 text-sm leading-relaxed text-ink-soft">
        We collect the minimum needed to ship an order and answer a research question. We don&apos;t
        sell your data.
      </p>

      <Section title="What We Collect">
        <ul>
          <li><strong className="font-semibold text-plum-deep">Order data:</strong> name, institution, email, shipping address, phone, items ordered.</li>
          <li><strong className="font-semibold text-plum-deep">Account data:</strong> if you create an account via account.cellexalabs.com, your name, email, and order history.</li>
          <li><strong className="font-semibold text-plum-deep">Payment data:</strong> held by our payment processor; we never see the full card number.</li>
          <li><strong className="font-semibold text-plum-deep">Site analytics:</strong> aggregate counts of pageviews and clicks for catalogue maintenance.</li>
          <li><strong className="font-semibold text-plum-deep">Support correspondence:</strong> the contents of messages you send us on WhatsApp.</li>
        </ul>
      </Section>

      <Section title="How We Use It">
        <ul>
          <li>Process and ship your orders.</li>
          <li>Respond to your support requests.</li>
          <li>Maintain order history for return, replacement, and audit.</li>
          <li>Comply with UAE legal record-keeping obligations.</li>
        </ul>
      </Section>

      <Section title="How Long We Keep It">
        <p>
          Order records are retained for seven years from the order date in line with UAE
          commercial record-keeping requirements. Support correspondence is retained for two
          years.
        </p>
      </Section>

      <Section title="Who We Share With">
        <ul>
          <li>Our payment processor for card payments.</li>
          <li>The courier handling your shipment, including name, address, and phone.</li>
          <li>Auditors and regulators, on lawful request.</li>
        </ul>
      </Section>

      <Section title="Your Rights">
        <p>
          You can request a copy of the personal data we hold about you, or ask us to delete it
          where the legal retention period has elapsed. Message us on WhatsApp at{" "}
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-rosegold-deep underline-offset-4 hover:underline"
          >
            {WHATSAPP_DISPLAY}
          </a>
          .
        </p>
      </Section>

      <div className="surface-card mt-10 p-6">
        <h2 className="mb-3 text-base font-semibold text-plum-deep">Contact</h2>
        <p className="text-sm leading-relaxed text-ink-soft">
          For any question about how your data is handled, message us on WhatsApp at{" "}
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-rosegold-deep underline-offset-4 hover:underline"
          >
            {WHATSAPP_DISPLAY}
          </a>
          .
        </p>
      </div>

      <p className="mt-8 text-center text-xs text-ink-soft/70">
        <Link href="/terms" className="underline-offset-4 hover:text-plum hover:underline">
          Terms of Sale
        </Link>
        {" · "}
        <Link href="/compliance" className="underline-offset-4 hover:text-plum hover:underline">
          Compliance
        </Link>
        {" · "}
        <Link href="/" className="underline-offset-4 hover:text-plum hover:underline">
          Back to site
        </Link>
      </p>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-10">
      <h2 className="mb-3 text-base font-semibold text-plum-deep">{title}</h2>
      <div className="space-y-3 text-sm leading-relaxed text-ink-soft [&_ul]:ml-4 [&_ul]:mt-2 [&_ul]:list-disc [&_ul]:space-y-2">
        {children}
      </div>
    </div>
  );
}
