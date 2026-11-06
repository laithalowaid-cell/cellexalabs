import Link from "next/link";
import { Logo } from "./Logo";
import { WHATSAPP_NUMBER, WHATSAPP_DISPLAY } from "@/lib/constants";
import { FOCUS_META, Focus } from "@/lib/products";
import { WhatsAppIcon, GlobeIcon } from "./icons";

const FOCUS_KEYS: Focus[] = ["weightloss", "growth", "recovery", "antiaging", "wellness"];

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-line bg-blush/40">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-4 lg:px-8">
        <div className="md:col-span-1">
          <Logo size={24} />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-ink-soft">
            Premium research-grade peptides, third-party tested to a minimum 99% purity, with
            fast discreet delivery across the UAE.
          </p>
        </div>

        <div>
          <h4 className="eyebrow text-plum-deep">Categories</h4>
          <ul className="mt-4 space-y-2.5">
            {FOCUS_KEYS.map((k) => (
              <li key={k}>
                <Link
                  href={`/shop?focus=${k}`}
                  className="text-sm text-ink-soft transition-colors hover:text-plum"
                >
                  {FOCUS_META[k].short}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="eyebrow text-plum-deep">Explore</h4>
          <ul className="mt-4 space-y-2.5">
            <li><Link href="/shop" className="text-sm text-ink-soft hover:text-plum">Shop All</Link></li>
            <li><Link href="/bundles" className="text-sm text-ink-soft hover:text-plum">Bundle Deals</Link></li>
            <li><Link href="/calculator" className="text-sm text-ink-soft hover:text-plum">Dosing Calculator</Link></li>
            <li><Link href="/about" className="text-sm text-ink-soft hover:text-plum">About &amp; Research Use</Link></li>
            <li><Link href="/affiliates" className="text-sm text-ink-soft hover:text-plum">Affiliate Program</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="eyebrow text-plum-deep">Order & Enquiries</h4>
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-plum hover:text-rosegold-deep"
          >
            <WhatsAppIcon width={18} height={18} />
            {WHATSAPP_DISPLAY}
          </a>
          <p className="mt-3 flex items-center gap-2 text-sm text-ink-soft">
            <GlobeIcon width={16} height={16} />
            Fast delivery · UAE
          </p>
        </div>
      </div>

      <div className="border-t border-line">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <p className="rounded-xl bg-white/70 px-4 py-3 text-center text-[0.7rem] leading-relaxed text-ink-soft">
            <strong className="text-ink">For Laboratory Research Use Only</strong> — All Cellexa
            Peptides products are intended for in vitro laboratory research and are not for human
            consumption, therapeutic, diagnostic, or veterinary use.
          </p>
          <p className="mt-2 text-center text-[0.7rem] leading-relaxed text-ink-soft">
            Shipped from the United Arab Emirates.
          </p>
          <p className="mt-4 text-center text-xs text-ink-soft/70">
            © {new Date().getFullYear()} Cellexa Labs · Premium Research Peptides · UAE.
            {" · "}
            <Link
              href="/privacy-policy"
              className="underline-offset-4 hover:text-plum hover:underline"
            >
              Privacy Notice
            </Link>
            {" · "}
            <Link
              href="/terms"
              className="underline-offset-4 hover:text-plum hover:underline"
            >
              Terms of Sale
            </Link>
            {" · "}
            <Link
              href="/compliance"
              className="underline-offset-4 hover:text-plum hover:underline"
            >
              Compliance
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
