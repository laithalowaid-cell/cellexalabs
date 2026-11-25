import type { Metadata } from "next";
import { Archivo, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { StoreProvider } from "@/lib/store";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AgeGate from "@/components/AgeGate";
import CartDrawer from "@/components/CartDrawer";
import WhatsAppFAB from "@/components/WhatsAppFAB";
import { Engine } from "@/engine/next";

// Display: Archivo, set expanded like the wide-tracked caps on the pen labels.
const display = Archivo({
  variable: "--font-display",
  subsets: ["latin"],
  axes: ["wdth"],
  display: "swap",
});

const text = Geist({ variable: "--font-text", subsets: ["latin"], display: "swap" });
const mono = Geist_Mono({ variable: "--font-data", subsets: ["latin"], display: "swap" });

// Runs before first paint: hidden-until-revealed styles only apply when JS and motion are on.
const FLAGS = `document.documentElement.classList.add('js');if(!matchMedia('(prefers-reduced-motion: reduce)').matches)document.documentElement.classList.add('motion')`;

const SITE_URL = "https://cellexalabs.com";
const TITLE = "Cellexa Labs — Premium Research Peptides · UAE";
const DESCRIPTION =
  "Premium research-grade peptides, third-party tested to a minimum 99% purity. Pens & vials with fast delivery across the UAE.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: TITLE,
    // Sub-pages set their own title; this keeps the brand suffix consistent.
    template: "%s | Cellexa Labs",
  },
  description: DESCRIPTION,
  applicationName: "Cellexa Labs",
  alternates: { canonical: "/" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    type: "website",
    url: SITE_URL,
    siteName: "Cellexa Labs",
    locale: "en_AE",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Cellexa Labs" }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: ["/og.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${text.variable} ${mono.variable} h-full`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: FLAGS }} />
      </head>
      <body className="flex min-h-full flex-col antialiased">
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        {/* White-out page transition: a snow panel with the summit line rising on it */}
        <div id="curtain" aria-hidden="true">
          <div className="curtain__panel">
            <svg className="curtain__peak" viewBox="0 0 600 140" preserveAspectRatio="none">
              <path d="M0 140 L120 92 L170 104 L262 34 L300 52 L338 10 L392 66 L430 58 L500 98 L600 80 L600 140 Z" />
            </svg>
          </div>
        </div>
        <StoreProvider>
          <AgeGate />
          {/* Research-Use-Only notice — visible above the fold on every page */}
          <p
            role="note"
            className="bg-plum-deep px-4 py-1.5 text-center text-[0.68rem] font-medium leading-snug text-white"
          >
            Research Use Only — for laboratory research use, not for human consumption. Not
            evaluated by any regulatory authority.
          </p>
          <Header />
          <main id="main" tabIndex={-1} className="flex-1">
            {children}
          </main>
          <Footer />
          <CartDrawer />
          <WhatsAppFAB />
        </StoreProvider>
        <Engine />
      </body>
    </html>
  );
}
