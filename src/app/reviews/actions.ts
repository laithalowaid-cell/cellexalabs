"use server";

import { randomUUID } from "node:crypto";
import { cookies, headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { PRODUCTS } from "@/lib/products";
import { EMIRATES } from "@/lib/checkout";
import {
  ADMIN_COOKIE,
  MAX_PENDING,
  adminToken,
  approve,
  isValidAdminCookie,
  isValidKey,
  pendingCount,
  rejectPending,
  reviewsEnabled,
  savePending,
  takeRateLimit,
  unpublish,
  type Review,
} from "@/lib/reviews";

export type ReviewFormState = {
  status: "idle" | "sent" | "error";
  message?: string;
  fieldErrors?: Partial<Record<"name" | "rating" | "text" | "consent", string>>;
};

/** Plain text only: strip control characters and anything that looks like markup or a link. */
function clean(value: FormDataEntryValue | null, max: number): string {
  if (typeof value !== "string") return "";
  return value
    .normalize("NFKC")
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F\u200B-\u200F\u2028-\u202E\u2066-\u2069]/g, "")
    .replace(/[<>]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, max);
}

const LINK_RE = /(https?:\/\/|www\.|\.[a-z]{2,}\/)/i;

/** A customer submits a review. It is stored privately and shown only after the owner approves it. */
export async function submitReview(_prev: ReviewFormState, form: FormData): Promise<ReviewFormState> {
  // Honeypot: a field people never see. Bots fill it in; pretend success and drop it.
  if (clean(form.get("cl_hp_extra"), 100)) return { status: "sent" };

  const name = clean(form.get("name"), 40);
  const emirateRaw = clean(form.get("emirate"), 40);
  const emirate = (EMIRATES as readonly string[]).includes(emirateRaw) ? emirateRaw : "";
  const productIdRaw = clean(form.get("product"), 80);
  const product = PRODUCTS.find((p) => p.id === productIdRaw);
  const rating = Number(form.get("rating"));
  const text = clean(form.get("text"), 600);
  const consent = form.get("consent") === "yes";

  const fieldErrors: ReviewFormState["fieldErrors"] = {};
  if (name.length < 2) fieldErrors.name = "Please add the name you'd like shown (2 to 40 characters).";
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) fieldErrors.rating = "Please choose a rating from 1 to 5.";
  if (text.length < 20) fieldErrors.text = "Please write at least 20 characters.";
  else if (LINK_RE.test(text) || LINK_RE.test(name)) fieldErrors.text = "Please leave out links and web addresses.";
  if (!consent) fieldErrors.consent = "Please confirm the statement above to send your review.";
  if (Object.keys(fieldErrors).length) return { status: "error", fieldErrors };

  if (!reviewsEnabled()) {
    return { status: "error", message: "Reviews are not open yet. Please try again later." };
  }

  try {
    if ((await pendingCount()) >= MAX_PENDING) {
      return { status: "error", message: "We have a lot of reviews to read right now. Please try again in a few days." };
    }
    const h = await headers();
    const ip = (h.get("x-forwarded-for") ?? "").split(",")[0].trim() || h.get("x-real-ip") || "unknown";
    if (!(await takeRateLimit(ip))) {
      return { status: "error", message: "Thanks, we already have a review from you this hour. Please try again later." };
    }

    const review: Review = {
      id: randomUUID(),
      name,
      emirate,
      productId: product?.id ?? "",
      productName: product?.name ?? "",
      rating,
      text,
      createdAt: new Date().toISOString(),
    };
    await savePending(review);
    return { status: "sent" };
  } catch {
    return { status: "error", message: "Something went wrong sending your review. Please try again." };
  }
}

/* ---------------- Owner actions (each one checks the owner cookie) ---------------- */

async function requireOwner() {
  const jar = await cookies();
  if (!isValidAdminCookie(jar.get(ADMIN_COOKIE)?.value)) throw new Error("Unauthorized");
}

function refreshPublicPages(productId?: string) {
  revalidatePath("/");
  if (productId) revalidatePath(`/shop/${productId}`);
}

export async function ownerLogin(_prev: { error?: string }, form: FormData): Promise<{ error?: string }> {
  const key = typeof form.get("key") === "string" ? (form.get("key") as string) : "";
  if (!isValidKey(key)) {
    // Slow down guessing.
    await new Promise((r) => setTimeout(r, 1200));
    return { error: "That key is not right." };
  }
  const jar = await cookies();
  jar.set(ADMIN_COOKIE, adminToken()!, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  redirect("/reviews/manage");
}

export async function ownerLogout() {
  const jar = await cookies();
  jar.delete(ADMIN_COOKIE);
  redirect("/reviews/manage");
}

export async function approveReview(form: FormData) {
  await requireOwner();
  const id = String(form.get("id") ?? "");
  const productId = String(form.get("productId") ?? "");
  await approve(id);
  refreshPublicPages(productId);
  revalidatePath("/reviews/manage");
}

export async function deleteReview(form: FormData) {
  await requireOwner();
  await rejectPending(String(form.get("id") ?? ""));
  revalidatePath("/reviews/manage");
}

export async function unpublishReview(form: FormData) {
  await requireOwner();
  const productId = String(form.get("productId") ?? "");
  await unpublish(String(form.get("id") ?? ""));
  refreshPublicPages(productId);
  revalidatePath("/reviews/manage");
}
