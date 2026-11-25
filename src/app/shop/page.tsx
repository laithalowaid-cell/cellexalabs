import type { Metadata } from "next";
import ShopClient, { type FilterForm } from "@/components/ShopClient";

export const metadata: Metadata = {
  title: "All compounds",
  description: "Every Cellexa Labs research peptide in pre-filled pens and sealed vials, with doses and AED prices. Third-party tested, delivered across the UAE.",
  alternates: { canonical: "/shop" },
};
import { Focus } from "@/lib/products";

const VALID: Focus[] = ["weightloss", "growth", "recovery", "antiaging", "wellness"];
const VALID_FORMS: FilterForm[] = ["pen", "vial", "bundle"];

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ focus?: string; form?: string }>;
}) {
  const { focus, form } = await searchParams;
  const initialFocus = focus && VALID.includes(focus as Focus) ? (focus as Focus) : undefined;
  const initialForm = form && VALID_FORMS.includes(form as FilterForm) ? (form as FilterForm) : undefined;
  return (
    <ShopClient
      key={`${initialFocus ?? "all"}-${initialForm ?? "all"}`}
      initialFocus={initialFocus}
      initialForm={initialForm}
    />
  );
}
