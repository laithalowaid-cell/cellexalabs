@AGENTS.md

# Cellexa Labs website

Online shop for cellexalabs.com, selling to the UAE. Prices are in AED. Built with Next.js 16, React 19, TypeScript and Tailwind CSS 4.

There is no database, admin panel, or online payment. Products and prices live in code. Customers fill a cart and checkout form, and the order opens as a WhatsApp message to the business. The cart is stored in the visitor's browser. No environment variables are required.

## Working with the owner

The person you are helping owns this business and may not be a developer.

- Use plain language and describe changes by what customers will see.
- Before publishing, run the site and show the owner the change. Pushing to `main` updates the live site once Vercel is connected.
- Run `npm run build` before every push. A failed build will not go live, but it also blocks the update.
- Prices, discounts, payment options and legal pages affect real customers. Confirm the exact change with the owner before editing them.

## Commands

```bash
npm install      # first time only
npm run dev      # http://localhost:3100
npm run build    # production build check
npm run lint
```

## Where to change things

| To change | Edit |
| --- | --- |
| Products, prices, doses, descriptions | `src/lib/products.ts` |
| Product photos | `public/products/`, referenced by `image` on each variant in `products.ts` |
| Bundle deals | `src/lib/bundles.ts` |
| Multi-buy discounts, free delivery threshold, promo text | `src/lib/promos.ts` |
| WhatsApp number | `src/lib/constants.ts` |
| Payment options, emirates, checkout validation | `src/lib/checkout.ts` |
| Order form | `src/components/CheckoutForm.tsx` |
| Cart and order message | `src/components/CartDrawer.tsx`, `src/lib/store.tsx` |
| Homepage | `src/app/page.tsx` |
| Menu and footer | `src/components/Header.tsx`, `src/components/Footer.tsx` |
| Colours and shared styles | `src/app/globals.css` |
| Site title and social sharing text | `src/app/layout.tsx` |
| Affiliate commission and customer discount | `COMMISSION_PERCENT`, `CUSTOMER_DISCOUNT_PERCENT` in `src/app/affiliates/page.tsx` |
| Legal pages | `src/app/terms/`, `src/app/privacy-policy/`, `src/app/compliance/` |

Colour tokens keep older names (`plum`, `rosegold`) that do not match the current colours. Do not rename them unless asked.

## Details to keep in sync

- **Bundles** point to products by product `id` and the exact variant `label`. If you rename a product or dose, update `bundles.ts` too.
- **Removed pages:** add a redirect in `next.config.ts` so old links still work.
- **Domain:** `https://cellexalabs.com` is hardcoded in `src/app/layout.tsx`, `src/app/robots.ts`, `src/app/sitemap.ts`, `src/app/shop/[id]/page.tsx` and `src/app/api/feed/route.ts`. Change all of them if the domain changes.
- **Google Merchant feed:** `/api/feed` is generated from `products.ts`. `FEED_EXCLUDED_IDS` in `src/app/api/feed/route.ts` lists products left out of the feed but still sold on the site, after a Healthcare & Medicines policy violation. Check with the owner before changing it.

## Known issue

Section 8 of `src/app/terms/page.tsx` says payment is taken through card processors, but checkout only offers Bank Transfer and Cash on Delivery. The owner should decide the correct wording.
