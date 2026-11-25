import type { NextConfig } from "next";

// Browser security headers on every response.
// - CSP: scripts, styles, fonts and images only from this site (inline allowed for Next.js and the theme script).
//   No other site may frame the pages. Forms may only post back to this site.
const CSP = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'" + (process.env.NODE_ENV === "development" ? " 'unsafe-eval'" : ""),
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self' data:",
  "connect-src 'self'",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
  "upgrade-insecure-requests",
].join("; ");

const SECURITY_HEADERS = [
  { key: "Content-Security-Policy", value: CSP },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin-allow-popups" },
];

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },
  poweredByHeader: false,
  async headers() {
    return [
      { source: "/:path*", headers: SECURITY_HEADERS },
      // The owner's review page is never cached or indexed.
      {
        source: "/reviews/manage",
        headers: [
          { key: "Cache-Control", value: "no-store" },
          { key: "X-Robots-Tag", value: "noindex, nofollow" },
        ],
      },
    ];
  },
  async redirects() {
    return [
      // Cycle Tracker was removed — send old bookmarks/indexed URLs home.
      // Next emits 308 (permanent) here, which search engines treat like a 301.
      {
        source: "/tracker",
        destination: "/",
        permanent: true,
      },
      // Tirzepatide removed from the catalogue — redirect its old product URL.
      {
        source: "/shop/tirzepatide",
        destination: "/shop",
        permanent: true,
      },
      // SLU-PP-223 was a typo — the product is SLU-PP-332.
      {
        source: "/shop/slu-pp-223",
        destination: "/shop/slu-pp-332",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
