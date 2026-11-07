import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
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
