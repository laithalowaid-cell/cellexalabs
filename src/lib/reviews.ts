import "server-only";
import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { del, get, list, put } from "@vercel/blob";

/**
 * Customer reviews, stored in the private Vercel Blob store "cellexalabs-reviews".
 *
 *   reviews/pending/<id>.json   waiting for the owner to approve (never shown publicly)
 *   reviews/published.json      approved reviews, shown on the site as testimonials
 *   reviews/limits/<hash>       one marker per visitor per hour (spam limit)
 *
 * Everything here runs on the server. The store is private: nothing in it can be read
 * from a browser, only through these functions.
 */

export interface Review {
  id: string;
  name: string;
  emirate: string;
  productId: string;
  productName: string;
  rating: number;
  text: string;
  createdAt: string;
}

const PENDING = "reviews/pending/";
const PUBLISHED = "reviews/published.json";
const LIMITS = "reviews/limits/";
/** Stop accepting new reviews while this many are waiting, so the store cannot be flooded. */
export const MAX_PENDING = 200;

export const reviewsEnabled = () => Boolean(process.env.BLOB_READ_WRITE_TOKEN);

async function readJson<T>(pathname: string): Promise<T | null> {
  try {
    const res = await get(pathname, { access: "private", useCache: false });
    if (!res || res.statusCode !== 200) return null;
    return JSON.parse(await new Response(res.stream).text()) as T;
  } catch {
    return null;
  }
}

async function writeJson(pathname: string, data: unknown) {
  await put(pathname, JSON.stringify(data), {
    access: "private",
    contentType: "application/json",
    addRandomSuffix: false,
    allowOverwrite: true,
  });
}

/** Approved reviews, newest first. Empty when storage is not configured (local development). */
export async function getPublished(): Promise<Review[]> {
  if (!reviewsEnabled()) return [];
  const data = await readJson<Review[]>(PUBLISHED);
  return Array.isArray(data) ? data : [];
}

export async function getPending(): Promise<Review[]> {
  if (!reviewsEnabled()) return [];
  const { blobs } = await list({ prefix: PENDING, limit: MAX_PENDING });
  const items = await Promise.all(blobs.map((b) => readJson<Review>(b.pathname)));
  return items
    .filter((r): r is Review => Boolean(r))
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function pendingCount(): Promise<number> {
  const { blobs } = await list({ prefix: PENDING, limit: MAX_PENDING });
  return blobs.length;
}

export async function savePending(review: Review) {
  await writeJson(`${PENDING}${review.id}.json`, review);
}

const ID_RE = /^[a-f0-9-]{36}$/;

export async function approve(id: string) {
  if (!ID_RE.test(id)) return;
  const review = await readJson<Review>(`${PENDING}${id}.json`);
  if (!review) return;
  const published = await getPublished();
  if (!published.some((r) => r.id === id)) published.unshift(review);
  await writeJson(PUBLISHED, published);
  await del(`${PENDING}${id}.json`);
}

export async function rejectPending(id: string) {
  if (!ID_RE.test(id)) return;
  await del(`${PENDING}${id}.json`);
}

export async function unpublish(id: string) {
  if (!ID_RE.test(id)) return;
  const published = await getPublished();
  await writeJson(
    PUBLISHED,
    published.filter((r) => r.id !== id),
  );
}

/**
 * Spam limit: one review per visitor per hour. The visitor's IP address is never stored,
 * only a salted one-way hash of it, which expires from use after the hour.
 */
export async function takeRateLimit(ip: string): Promise<boolean> {
  const salt = process.env.REVIEWS_ADMIN_KEY ?? "cellexa";
  const hour = new Date().toISOString().slice(0, 13);
  const key = createHash("sha256").update(`${salt}:${ip}:${hour}`).digest("hex").slice(0, 32);
  const path = `${LIMITS}${hour}-${key}`;
  const { blobs } = await list({ prefix: path, limit: 1 });
  if (blobs.length > 0) return false;
  await put(path, "1", { access: "private", addRandomSuffix: false, allowOverwrite: true, contentType: "text/plain" });
  return true;
}

/* ---------------- Owner access ---------------- */

export const ADMIN_COOKIE = "cl_reviews_admin";

/** The cookie holds a signature derived from the key, never the key itself. */
export function adminToken(): string | null {
  const key = process.env.REVIEWS_ADMIN_KEY;
  if (!key || key.length < 16) return null;
  return createHmac("sha256", key).update("cellexa-reviews-admin-v1").digest("hex");
}

function safeEqual(a: string, b: string) {
  const ha = createHash("sha256").update(a).digest();
  const hb = createHash("sha256").update(b).digest();
  return timingSafeEqual(ha, hb);
}

export function isValidKey(candidate: string): boolean {
  const key = process.env.REVIEWS_ADMIN_KEY;
  if (!key || key.length < 16) return false;
  return safeEqual(candidate, key);
}

export function isValidAdminCookie(value: string | undefined): boolean {
  const token = adminToken();
  if (!token || !value) return false;
  return safeEqual(value, token);
}
