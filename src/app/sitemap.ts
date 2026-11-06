import type { MetadataRoute } from "next";
import { PRODUCTS } from "@/lib/products";

const SITE_URL = "https://cellexalabs.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    { path: "", priority: 1 },
    { path: "/shop", priority: 0.9 },
    { path: "/bundles", priority: 0.85 },
    { path: "/calculator", priority: 0.7 },
    { path: "/about", priority: 0.5 },
    { path: "/compliance", priority: 0.4 },
    { path: "/terms", priority: 0.3 },
    { path: "/privacy-policy", priority: 0.3 },
  ].map(({ path, priority }) => ({
    url: `${SITE_URL}${path}`,
    changeFrequency: "weekly" as const,
    priority,
  }));

  const productRoutes = PRODUCTS.map((p) => ({
    url: `${SITE_URL}/shop/${p.id}`,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [...staticRoutes, ...productRoutes];
}
