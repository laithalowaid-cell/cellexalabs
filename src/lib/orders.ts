// Order records. Server-only: imported by the orders API route and the
// private orders page, never by browser code.
//
// Orders are saved as one small JSON file each in a private Vercel Blob store
// (connected to the project, which provides BLOB_READ_WRITE_TOKEN). When that
// token is absent — local development — they are written to .data/orders.

import { createHash, timingSafeEqual } from "node:crypto";
import { promises as fs } from "node:fs";
import path from "node:path";
import { get, list, put } from "@vercel/blob";
import { BUNDLES } from "./bundles";
import { EMIRATES, PAYMENT_METHODS } from "./checkout";
import { PRODUCTS } from "./products";
import { cartTotals } from "./promos";

export const ORDER_STATUSES = [
  "New",
  "Confirmed",
  "Sent to supplier",
  "Delivered",
  "Cancelled",
] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];

export interface OrderLine {
  productId: string;
  name: string;
  variantLabel: string;
  unitPrice: number;
  qty: number;
  /** False when the price sent by the browser doesn't match the catalogue. */
  priceOk: boolean;
}

export interface Order {
  ref: string;
  createdAt: string; // ISO time
  status: OrderStatus;
  statusAt: string;
  customer: {
    name: string;
    phone: string;
    emirate: string;
    address: string;
    payment: string;
  };
  lines: OrderLine[];
  subtotal: number;
  discountPercent: number;
  discount: number;
  total: number;
  freeDelivery: boolean;
}

const REF_RE = /^CL-[A-Za-z0-9-]{8,40}$/;
const PREFIX = "orders/";
const LOCAL_DIR = path.join(process.cwd(), ".data", "orders");
const MAX_LINES = 40;

const blobOn = () => Boolean(process.env.BLOB_READ_WRITE_TOKEN);
/** Production must never fall back to the server's throwaway disk. */
export const storageReady = () => blobOn() || process.env.NODE_ENV !== "production";

function catalogPrice(productId: string, variantLabel: string): number | null {
  if (productId.startsWith("bundle-")) {
    return BUNDLES.find((b) => `bundle-${b.id}` === productId)?.price ?? null;
  }
  const v = PRODUCTS.find((p) => p.id === productId)?.variants.find(
    (x) => x.label === variantLabel
  );
  return v?.price ?? null;
}

const str = (v: unknown, max: number) =>
  typeof v === "string" ? v.trim().slice(0, max) : "";

/** Turns whatever the browser sent into a clean order, or says why not. */
export function buildOrder(body: unknown): { order: Order } | { error: string } {
  if (!body || typeof body !== "object") return { error: "Invalid order." };
  const b = body as Record<string, unknown>;

  const ref = str(b.ref, 60);
  if (!REF_RE.test(ref)) return { error: "Invalid order reference." };

  const d = (b.details ?? {}) as Record<string, unknown>;
  const customer = {
    name: str(d.name, 120),
    phone: str(d.phone, 30),
    emirate: str(d.emirate, 40),
    address: str(d.address, 500),
    payment: str(d.payment, 40),
  };
  if (customer.name.length < 2) return { error: "Name is missing." };
  const digits = customer.phone.replace(/\D/g, "");
  if (digits.length < 9 || digits.length > 15) return { error: "Phone is missing." };
  if (!EMIRATES.includes(customer.emirate as (typeof EMIRATES)[number]))
    return { error: "Emirate is missing." };
  if (customer.address.length < 10) return { error: "Address is missing." };
  if (!PAYMENT_METHODS.some((p) => p.value === customer.payment))
    return { error: "Payment method is missing." };

  if (!Array.isArray(b.cart) || b.cart.length === 0 || b.cart.length > MAX_LINES)
    return { error: "Cart is empty." };

  const lines: OrderLine[] = [];
  for (const raw of b.cart as Record<string, unknown>[]) {
    const productId = str(raw?.productId, 80);
    const variantLabel = str(raw?.variantLabel, 200);
    const qty = Number(raw?.qty);
    const unitPrice = Number(raw?.unitPrice);
    if (!productId || !Number.isInteger(qty) || qty < 1 || qty > 99)
      return { error: "Cart line is invalid." };
    if (!Number.isFinite(unitPrice) || unitPrice < 0 || unitPrice > 100000)
      return { error: "Cart line is invalid." };
    const real = catalogPrice(productId, variantLabel);
    // Unknown products are refused; a wrong price is kept but flagged.
    if (real === null) return { error: "Cart has an unknown product." };
    lines.push({
      productId,
      name: str(raw?.name, 120),
      variantLabel,
      unitPrice,
      qty,
      priceOk: real === unitPrice,
    });
  }

  const subtotal = lines.reduce((s, l) => s + l.unitPrice * l.qty, 0);
  const t = cartTotals(subtotal, lines.reduce((n, l) => n + l.qty, 0));
  const now = new Date().toISOString();

  return {
    order: {
      ref,
      createdAt: now,
      status: "New",
      statusAt: now,
      customer,
      lines,
      subtotal,
      discountPercent: t.discountPercent,
      discount: t.discount,
      total: t.total,
      freeDelivery: t.freeDelivery,
    },
  };
}

async function readOrder(ref: string): Promise<Order | null> {
  if (blobOn()) {
    const res = await get(`${PREFIX}${ref}.json`, { access: "private", useCache: false });
    if (!res || !res.stream) return null;
    return (await new Response(res.stream).json()) as Order;
  }
  try {
    return JSON.parse(await fs.readFile(path.join(LOCAL_DIR, `${ref}.json`), "utf8"));
  } catch {
    return null;
  }
}

async function writeOrder(order: Order): Promise<void> {
  const json = JSON.stringify(order, null, 2);
  if (blobOn()) {
    await put(`${PREFIX}${order.ref}.json`, json, {
      access: "private",
      contentType: "application/json",
      addRandomSuffix: false,
      allowOverwrite: true,
    });
    return;
  }
  await fs.mkdir(LOCAL_DIR, { recursive: true });
  await fs.writeFile(path.join(LOCAL_DIR, `${order.ref}.json`), json);
}

/** Saves a new order. The same reference sent twice is kept once. */
export async function saveOrder(order: Order): Promise<"saved" | "duplicate"> {
  if (await readOrder(order.ref)) return "duplicate";
  await writeOrder(order);
  return "saved";
}

/** Every order, newest first. */
export async function listOrders(): Promise<Order[]> {
  let refs: string[] = [];
  if (blobOn()) {
    let cursor: string | undefined;
    do {
      const page = await list({ prefix: PREFIX, cursor, limit: 1000 });
      refs.push(...page.blobs.map((x) => x.pathname.slice(PREFIX.length, -".json".length)));
      cursor = page.hasMore ? page.cursor : undefined;
    } while (cursor);
  } else {
    try {
      refs = (await fs.readdir(LOCAL_DIR))
        .filter((f) => f.endsWith(".json"))
        .map((f) => f.slice(0, -5));
    } catch {}
  }
  const orders = (await Promise.all(refs.map((r) => readOrder(r).catch(() => null)))).filter(
    (o): o is Order => o !== null
  );
  return orders.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function setOrderStatus(ref: string, status: OrderStatus): Promise<boolean> {
  if (!REF_RE.test(ref) || !ORDER_STATUSES.includes(status)) return false;
  const order = await readOrder(ref);
  if (!order) return false;
  await writeOrder({ ...order, status, statusAt: new Date().toISOString() });
  return true;
}

// ---- Access to the private orders page and feed ----

export const ADMIN_COOKIE = "cl_orders_admin";
const sha = (s: string) => createHash("sha256").update(s).digest();

export const adminConfigured = () => Boolean(process.env.ORDERS_ADMIN_PASSWORD);

export function passwordMatches(candidate: string): boolean {
  const real = process.env.ORDERS_ADMIN_PASSWORD;
  if (!real || !candidate) return false;
  return timingSafeEqual(sha(candidate), sha(real));
}

/** Value kept in the login cookie — a fingerprint, never the password itself. */
export function sessionValue(): string {
  return sha(`cl-orders:${process.env.ORDERS_ADMIN_PASSWORD ?? ""}`).toString("hex");
}

export function sessionValid(cookie: string | undefined): boolean {
  if (!adminConfigured() || !cookie) return false;
  const want = Buffer.from(sessionValue());
  const got = Buffer.from(cookie);
  return got.length === want.length && timingSafeEqual(got, want);
}
