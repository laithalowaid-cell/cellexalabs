"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  ADMIN_COOKIE,
  ORDER_STATUSES,
  passwordMatches,
  sessionValid,
  sessionValue,
  setOrderStatus,
  type OrderStatus,
} from "@/lib/orders";

export async function login(formData: FormData) {
  const password = String(formData.get("password") ?? "");
  if (!passwordMatches(password)) redirect("/admin/orders?wrong=1");
  (await cookies()).set(ADMIN_COOKIE, sessionValue(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/admin",
    maxAge: 60 * 60 * 24 * 30,
  });
  redirect("/admin/orders");
}

export async function logout() {
  (await cookies()).delete({ name: ADMIN_COOKIE, path: "/admin" });
  redirect("/admin/orders");
}

export async function changeStatus(formData: FormData) {
  if (!sessionValid((await cookies()).get(ADMIN_COOKIE)?.value)) redirect("/admin/orders");
  const status = String(formData.get("status") ?? "") as OrderStatus;
  if (ORDER_STATUSES.includes(status))
    await setOrderStatus(String(formData.get("ref") ?? ""), status);
  redirect("/admin/orders");
}
