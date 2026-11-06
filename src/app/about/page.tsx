import type { Metadata } from "next";
import { WHATSAPP_NUMBER, WHATSAPP_DISPLAY } from "@/lib/constants";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About & Research Use",
  description:
    "Cellexa Labs is a UAE research-supply business providing research-grade materials to qualified researchers, third-party tested with certificates of analysis on request.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <p className="eyebrow mb-4 text-rosegold-deep">About</p>
      <h1 className="font-display text-4xl font-semibold leading-tight text-plum-deep">
        About &amp; Research-Use Positioning
      </h1>
      <p className="mt-3 border-b border-line pb-8 text-sm text-ink-soft">
        Who we are, how we test, and the research-only basis on which we supply.
      </p>

      <Section title="Who We Are">
        <p>
          Cellexa Labs is a United Arab Emirates research-supply business. We provide
          research-grade materials to qualified researchers and institutions for in vitro
          laboratory research. We are a supplier of research reference materials — not a
          pharmacy, clinic, or manufacturer of consumer health products.
        </p>
      </Section>

      <Section title="Research Use Only">
        <p>
          Every product we supply is intended strictly for laboratory research use. Our materials
          are not drugs, foods, cosmetics, or medical devices; they are not for human or animal
          consumption, and they have not been evaluated by the FDA, EMA, MOHAP, DHA, DOH, or any
          equivalent regulatory authority. We make no medical, therapeutic, or diagnostic claims,
          and our product information describes each material&rsquo;s identity and chemistry for
          research verification only. See our{" "}
          <Link href="/compliance" className="text-rosegold-deep underline-offset-4 hover:underline">
            Compliance policy
          </Link>{" "}
          for the full research-use acknowledgement.
        </p>
      </Section>

      <Section title="Testing &amp; Quality Standards">
        <p>
          Materials are independently third-party tested for identity and purity by HPLC and mass
          spectrometry, to a minimum specification of 99% purity. A batch-specific Certificate of
          Analysis is available on request for every lot supplied — each product page links to its{" "}
          <span className="font-medium text-plum-deep">Certificate of Analysis</span> reference,
          and the batch COA PDF can be requested against your order reference.
        </p>
      </Section>

      <Section title="Sourcing &amp; Transparency">
        <p>
          Products are supplied as lyophilised powder in sealed, single-use research vials, stored
          and shipped cold-chain where appropriate. We publish each material&rsquo;s CAS number,
          molecular formula and mass, sequence, purity specification, and storage conditions so
          researchers can verify what they receive. Where a standard product identifier does not
          exist for a research material, we say so rather than assign a misleading one.
        </p>
      </Section>

      <div className="surface-card mt-10 p-6">
        <h2 className="mb-3 text-base font-semibold text-plum-deep">Contact</h2>
        <p className="text-sm leading-relaxed text-ink-soft">
          Questions about our materials, testing, or a certificate of analysis? Message us on WhatsApp at{" "}
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-rosegold-deep underline-offset-4 hover:underline"
          >
            {WHATSAPP_DISPLAY}
          </a>
          . Cellexa Labs · United Arab Emirates.
        </p>
      </div>

      <p className="mt-8 text-center text-xs text-ink-soft/70">
        <Link href="/compliance" className="underline-offset-4 hover:text-plum hover:underline">
          Compliance
        </Link>
        {" · "}
        <Link href="/terms" className="underline-offset-4 hover:text-plum hover:underline">
          Terms of Sale
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
      <div className="space-y-3 text-sm leading-relaxed text-ink-soft">{children}</div>
    </div>
  );
}
