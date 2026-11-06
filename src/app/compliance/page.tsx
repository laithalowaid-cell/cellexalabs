import type { Metadata } from "next";
import { WHATSAPP_NUMBER, WHATSAPP_DISPLAY } from "@/lib/constants";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Compliance",
  description: "Research-use-only statement, age verification, and restricted-use policy for Cellexa Labs.",
};

export default function CompliancePage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <p className="eyebrow mb-4 text-rosegold-deep">Legal</p>
      <h1 className="font-display text-4xl font-semibold leading-tight text-plum-deep">
        Research Use Only, Without Exception.
      </h1>
      <p className="mt-3 border-b border-line pb-8 text-sm text-ink-soft">
        Last updated 13 June 2026
      </p>

      <p className="mt-8 text-sm leading-relaxed text-ink-soft">
        Cellexa Labs sells laboratory research compounds to qualified researchers. The terms
        below govern every order on the platform.
      </p>

      <Section title="Research-Use-Only Statement">
        <p>
          All products sold by Cellexa Labs are intended for laboratory research use only.
          They are not intended for human consumption, therapeutic use, diagnostic application,
          or veterinary use. Products must be handled by qualified researchers in appropriate
          laboratory environments. Cellexa Labs makes no medical, therapeutic, or diagnostic
          claims.
        </p>
      </Section>

      <Section title="Research-Use-Only Acknowledgement">
        <p className="text-xs uppercase tracking-[0.14em] text-ink-soft/70">
          Last updated 29 May 2026 · Effective 29 May 2026
        </p>
        <p>
          This Acknowledgement must be affirmatively accepted via a mandatory, unchecked-by-default
          checkbox shown when you first enter this website. It is a binding contractual term, not
          a formality, and access to the storefront is conditional on accepting it.
        </p>
        <p>By ticking the acknowledgement box when you first enter this website, you irrevocably confirm and agree that:</p>
        <ul>
          <li>I am at least twenty-one (21) years of age, or the age of majority in my jurisdiction, whichever is greater.</li>
          <li>
            I have read, understood, and accept Cellexa Labs&rsquo;{" "}
            <Link href="/terms" className="text-rosegold-deep underline-offset-4 hover:underline">Terms</Link>,
            Shipping Policy, Returns Policy,{" "}
            <Link href="/privacy-policy" className="text-rosegold-deep underline-offset-4 hover:underline">Privacy Policy</Link>,
            and this Compliance &amp; Research-Use-Only Policy.
          </li>
          <li>
            I am purchasing these products solely for in vitro laboratory research use. I will not
            administer, ingest, inject, inhale, apply, or otherwise introduce any product into the
            body of a human or animal.
          </li>
          <li>
            I understand these products are not pharmaceutical drugs, dietary supplements,
            cosmetics, food, or medical devices, and have not been evaluated or approved by the
            FDA, EMA, MOHAP, DHA, DOH, or any equivalent regulatory authority for human or
            veterinary use.
          </li>
          <li>
            My purchase, possession, importation, and use of these products is lawful in my
            jurisdiction, and I bear sole responsibility for compliance with all applicable laws.
          </li>
          <li>
            I am not an employee, agent, or representative of any regulatory authority,
            intellectual-property enforcement firm, or law-enforcement agency acting in an
            investigative capacity.
          </li>
          <li>
            I assume all risk associated with my use of the products, and I release, indemnify,
            and hold harmless Cellexa Labs, its directors, officers, employees, suppliers, and
            affiliates from any and all claims arising from such use.
          </li>
          <li>
            Any dispute will be resolved by binding arbitration seated in the United Arab
            Emirates, and I waive any right to participate in any class or collective action.
          </li>
        </ul>
        <p>
          If you do not agree to every item above, do not tick the box, do not enter the
          storefront, and do not place an order.
        </p>
      </Section>

      <Section title="Age Verification">
        <p>
          The Cellexa Labs storefront is restricted to visitors 21 years and older. The
          acknowledgement and age-confirmation checkbox above is presented on first visit and
          must be accepted before you can browse or order.
        </p>
      </Section>

      <Section title="Restricted Use">
        <ul>
          <li>No resale to the general public.</li>
          <li>No re-labelling, repackaging, or compounding for human use.</li>
          <li>No supply to facilities lacking appropriate biosafety controls.</li>
          <li>No use in any context that implies a therapeutic claim.</li>
          <li>
            No misuse of the website itself, including scraping, automated ordering, or
            fraudulent accounts. See the Acceptable Use section of our{" "}
            <Link href="/terms" className="text-rosegold-deep underline-offset-4 hover:underline">Terms</Link>.
          </li>
        </ul>
      </Section>

      <Section title="Jurisdiction">
        <p>
          Cellexa Labs is incorporated in the United Arab Emirates and ships within the UAE.
          The catalogue, terms, and disclaimers are governed by the laws of the United Arab
          Emirates.
        </p>
      </Section>

      <div className="surface-card mt-10 p-6">
        <h2 className="mb-3 text-base font-semibold text-plum-deep">Reporting Concerns</h2>
        <p className="text-sm leading-relaxed text-ink-soft">
          If you have a compliance concern, a misuse you&rsquo;ve witnessed, a counterfeit Cellexa
          Peptides vial in circulation, or a regulatory question, message us on WhatsApp at{" "}
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-rosegold-deep underline-offset-4 hover:underline"
          >
            {WHATSAPP_DISPLAY}
          </a>
          . Reports are read by the founding team.
        </p>
      </div>

      <p className="mt-8 text-center text-sm font-medium text-plum-deep">
        The short version: If you&rsquo;re not a researcher and you&rsquo;re not running this in a lab,
        Cellexa Labs isn&rsquo;t for you. We don&rsquo;t flex on this.
      </p>

      <p className="mt-8 text-center text-xs text-ink-soft/70">
        <Link href="/terms" className="underline-offset-4 hover:text-plum hover:underline">
          Terms of Sale
        </Link>
        {" · "}
        <Link href="/privacy-policy" className="underline-offset-4 hover:text-plum hover:underline">
          Privacy Notice
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
