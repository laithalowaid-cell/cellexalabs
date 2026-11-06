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
    ];
  },
};

export default nextConfig;
