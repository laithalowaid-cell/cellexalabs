import type { Metadata } from "next";
import Link from "next/link";
import { WHATSAPP_NUMBER, WHATSAPP_DISPLAY } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Terms of Sale",
  description: "Terms governing the use of cellexalabs.com and the purchase of catalogue items.",
};

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <p className="eyebrow mb-4 text-rosegold-deep">Legal</p>
      <h1 className="font-display text-4xl font-semibold leading-tight text-plum-deep">
        Terms of Sale
      </h1>
      <p className="mt-3 border-b border-line pb-8 text-sm text-ink-soft">
        Last updated 13 June 2026
      </p>

      <p className="mt-8 text-sm leading-relaxed text-ink-soft">
        Plain-language terms governing the use of cellexalabs.com and the purchase of
        catalogue items.
      </p>

      <Section title="1. Who We Are">
        <p>
          Cellexa Labs (cellexalabs.com) is a UAE-incorporated research-supply business.
          References to &ldquo;we&rdquo; or &ldquo;us&rdquo; mean Cellexa Labs; references to &ldquo;you&rdquo; mean
          the natural person placing an order or browsing the site.
        </p>
      </Section>

      <Section title="2. Licence to Use This Site">
        <p>
          We grant you a limited, personal, non-exclusive right to access cellexalabs.com and
          place orders under these Terms. It can&rsquo;t be transferred, sold, or sub-licensed, and
          we can withdraw it at any time. It gives you no ownership in the site, its content, or
          the Cellexa Labs name and brand.
        </p>
      </Section>

      <Section title="3. Eligibility">
        <p>
          You confirm that you are 21 years or older, a qualified researcher, and acting in a
          research capacity when you place an order. Orders placed in breach of this clause may
          be cancelled without refund.
        </p>
      </Section>

      <Section title="4. Research Use Only">
        <p>
          All products are sold for laboratory research use only. See the full{" "}
          <Link href="/compliance" className="text-rosegold-deep underline-offset-4 hover:underline">
            Compliance
          </Link>{" "}
          page. By placing an order you agree not to use, re-sell, or relabel products in any
          way inconsistent with that scope.
        </p>
      </Section>

      <Section title="5. Acceptable Use">
        <p>When using cellexalabs.com, you agree not to:</p>
        <ul>
          <li>
            Use the site unlawfully, in breach of these Terms or anyone else&rsquo;s rights, or give
            us false information about your identity, age, location, or research purpose.
          </li>
          <li>
            Order products to resell, redistribute, or administer to a person or animal, or
            access any account, order, or area of the site that isn&rsquo;t yours.
          </li>
          <li>
            Scrape, harvest, data-mine, or use bots, crawlers, or other automated tools on the
            site, or upload viruses, malware, or harmful code.
          </li>
          <li>
            Post fake reviews, fraudulent orders, or false return/chargeback claims; send spam or
            phishing messages; or impersonate anyone, misrepresent your link to Cellexa Labs,
            or otherwise harm our name, reputation, or operations.
          </li>
        </ul>
      </Section>

      <Section title="6. Your Account">
        <p>
          If you create an account via account.cellexalabs.com, you&rsquo;re responsible for your
          login details and all activity under it. Tell us at{" "}
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-rosegold-deep underline-offset-4 hover:underline"
          >
            {WHATSAPP_DISPLAY}
          </a>{" "}
          if you suspect unauthorised use. We can suspend, restrict, or close an account at any
          time, with or without notice, for suspected fraud, misuse, or breach of these Terms.
        </p>
      </Section>

      <Section title="7. Orders and Pricing">
        <p>
          Prices on the catalogue are in UAE Dirham (AED) and include 5% VAT. Shipping is added
          at checkout. We may correct pricing errors at any time before dispatch. Order
          confirmation does not constitute acceptance until the order has shipped.
        </p>
      </Section>

      <Section title="8. Payment">
        <p>
          Payment is taken at order placement via our card payment processors. Cash on Delivery
          is available for orders within the UAE. We do not store card numbers on our
          infrastructure.
        </p>
      </Section>

      <Section title="9. Shipping and Risk">
        <p>
          Title and risk transfer on delivery to the address on the order. See the Shipping page
          for courier, packaging, and timing detail.
        </p>
      </Section>

      <Section title="10. Returns and Refunds">
        <p>
          For full details, see our Returns &amp; Refunds policy. In summary: approved returns
          must be unopened, unused, in original packaging, and requested within 48 hours of
          delivery. Refunds are issued to your original payment method within 5–10 business days
          of approval. Shipping fees are non-refundable unless the return is due to our error.
        </p>
      </Section>

      <Section title="11. Warranty">
        <p>
          We warrant that catalogue compounds match their stated specification at the time of
          dispatch. We make no other warranties, express or implied, including merchantability
          or fitness for a particular purpose.
        </p>
      </Section>

      <Section title="12. Links & Site Availability">
        <p>
          Our site may link to third-party resources such as couriers or payment providers. We
          don&rsquo;t control those sites or their content and policies, and a link isn&rsquo;t an
          endorsement. We can&rsquo;t guarantee cellexalabs.com stays available or error-free, and
          may suspend it for maintenance or any reason without notice.
        </p>
      </Section>

      <Section title="13. Limitation of Liability">
        <p>
          To the extent permitted by UAE law, our aggregate liability under any order is capped
          at the price paid for the affected goods.
        </p>
      </Section>

      <Section title="14. Suspending or Ending Access">
        <p>
          We can suspend or end your access at any time, with or without notice, for any breach
          of these Terms or any other reason. The licence in Section 2 ends with it, but the
          research use, warranty, liability, governing law, and dispute resolution sections
          still apply.
        </p>
      </Section>

      <Section title="15. Governing Law">
        <p>
          These terms are governed by the laws of the United Arab Emirates. Disputes are subject
          to the exclusive jurisdiction of the UAE courts.
        </p>
      </Section>

      <Section title="16. Changes">
        <p>
          We may update these terms periodically. The current version always lives at
          cellexalabs.com/terms with a last-updated date.
        </p>
      </Section>

      <div className="surface-card mt-10 p-6">
        <h2 className="mb-3 text-base font-semibold text-plum-deep">Questions</h2>
        <p className="text-sm leading-relaxed text-ink-soft">
          Questions on these terms? Message us on WhatsApp at{" "}
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-rosegold-deep underline-offset-4 hover:underline"
          >
            {WHATSAPP_DISPLAY}
          </a>
          <br />
          <strong className="font-semibold text-plum-deep">WhatsApp:</strong> {WHATSAPP_DISPLAY}
        </p>
      </div>

      <p className="mt-8 text-center text-xs text-ink-soft/70">
        <Link href="/privacy-policy" className="underline-offset-4 hover:text-plum hover:underline">
          Privacy Notice
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
