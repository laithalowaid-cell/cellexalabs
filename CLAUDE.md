@AGENTS.md

# Cellexa Labs website

Online shop for cellexalabs.com, selling to the UAE. Prices are in AED. Built with Next.js 16, React 19, TypeScript and Tailwind CSS 4.

There is no database or online payment. Products and prices live in code. Customers fill a cart and checkout form, tick that they accept the Terms of Sale, Privacy Notice and Research Use Only policy, and the order opens as a WhatsApp message to the business. The cart is stored in the visitor's browser.

Customer reviews are the one stored feature: they are saved in a private Vercel Blob store (`cellexalabs-reviews`) and only appear on the site after the owner approves them at `/reviews/manage`. Two environment variables are set in Vercel: `BLOB_READ_WRITE_TOKEN` (added by the store) and `REVIEWS_ADMIN_KEY` (the owner's key for the approval page). Without them the site still builds and runs; the review form just says reviews are not open.

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
| Homepage hero pen, anatomy pen, vials shown | `HERO_PEN_ID`, `ANATOMY_PEN_ID`, `VIAL_IDS` at the top of `src/app/page.tsx` |
| Mountain hero, pen anatomy, pen range rows | `src/components/summit/` |
| Mountain images (three depth layers) | `public/mountain/` (rendered by a script, see DESIGN.md) |
| See-through pen and vial images | `public/pens/`, `public/vials/`, looked up by `src/lib/pens.ts`. Add a cut-out when you add a product photo, or the site falls back to the original photo |
| Smooth scroll, reveals, page transition | `src/engine/` (GSAP + Lenis). Text reveals use `data-split`, blocks use `data-reveal` |
| Design rules (colours, type, motion) | `DESIGN.md` |
| Reviews: form, testimonials, owner approval page | `src/components/ReviewForm.tsx`, `src/components/Testimonials.tsx`, `src/app/reviews/` (server actions, `/reviews/manage`), storage in `src/lib/reviews.ts` |
| Terms checkbox at checkout | `agreed` in `src/lib/checkout.ts`, the checkbox in `src/components/CheckoutForm.tsx` |
| Security headers (CSP and others) | `next.config.ts` |
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
