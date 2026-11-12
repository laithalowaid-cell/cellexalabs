// Checkout details collected before the order is handed to WhatsApp.
// They are written into the message the customer sends from their own
// WhatsApp account, and a copy of the order is saved through /api/orders so
// it shows on the private orders page.

export const EMIRATES = [
  "Abu Dhabi",
  "Dubai",
  "Sharjah",
  "Ajman",
  "Umm Al Quwain",
  "Ras Al Khaimah",
  "Fujairah",
] as const;

export const PAYMENT_METHODS = [
  {
    value: "Bank Transfer",
    hint: "We'll send our bank details on WhatsApp once you place your order.",
  },
  {
    value: "Cash on Delivery",
    hint: "Pay in cash when the courier hands over your order.",
  },
] as const;

export interface CheckoutDetails {
  name: string;
  phone: string;
  emirate: string;
  address: string;
  payment: string;
}

export const EMPTY_DETAILS: CheckoutDetails = {
  name: "",
  phone: "",
  emirate: "",
  address: "",
  payment: "",
};

export type CheckoutErrors = Partial<Record<keyof CheckoutDetails, string>>;

/** Returns a field->message map; empty object means the form is valid. */
export function validateCheckout(d: CheckoutDetails): CheckoutErrors {
  const e: CheckoutErrors = {};

  if (d.name.trim().length < 2) e.name = "Please enter your full name.";

  const digits = d.phone.replace(/\D/g, "");
  if (digits.length < 9 || digits.length > 15)
    e.phone = "Please enter a mobile number we can reach you on.";

  if (!EMIRATES.includes(d.emirate as (typeof EMIRATES)[number]))
    e.emirate = "Please select an emirate.";

  if (d.address.trim().length < 10)
    e.address = "Please give a full address we can deliver to.";

  if (!PAYMENT_METHODS.some((p) => p.value === d.payment))
    e.payment = "Please choose a payment method.";

  return e;
}
