import type { Metadata } from "next";
import { Inter, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import { StoreProvider } from "@/lib/store";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AgeGate from "@/components/AgeGate";
import CartDrawer from "@/components/CartDrawer";
import WhatsAppFAB from "@/components/WhatsAppFAB";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

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
    <html lang="en" className={`${inter.variable} ${cormorant.variable} h-full`}>
      <body className="flex min-h-full flex-col antialiased">
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
          <main className="flex-1">{children}</main>
          <Footer />
          <CartDrawer />
          <WhatsAppFAB />
        </StoreProvider>
      </body>
    </html>
  );
}
