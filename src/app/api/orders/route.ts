import {
  adminConfigured,
  buildOrder,
  listOrders,
  passwordMatches,
  saveOrder,
  storageReady,
} from "@/lib/orders";

// Called by the checkout when the customer taps "Send Order on WhatsApp".
export async function POST(request: Request) {
  let body: unknown;
  try {
    const text = await request.text();
    if (text.length > 20000) return Response.json({ error: "Too large." }, { status: 413 });
    body = JSON.parse(text);
  } catch {
    return Response.json({ error: "Invalid order." }, { status: 400 });
  }

  const built = buildOrder(body);
  if ("error" in built) return Response.json({ error: built.error }, { status: 400 });
  if (!storageReady())
    return Response.json({ error: "Order storage is not set up." }, { status: 503 });

  try {
    const result = await saveOrder(built.order);
    return Response.json({ ok: true, ref: built.order.ref, result });
  } catch (e) {
    console.error("Order could not be saved", built.order.ref, e);
    return Response.json({ error: "Order could not be saved." }, { status: 500 });
  }
}

// Private feed of all orders, for the owner's dashboard. Needs the orders
// password as "Authorization: Bearer <password>".
export async function GET(request: Request) {
  if (!adminConfigured())
    return Response.json({ error: "Orders password is not set." }, { status: 503 });
  const auth = request.headers.get("authorization") ?? "";
  if (!passwordMatches(auth.replace(/^Bearer\s+/i, "")))
    return Response.json({ error: "Not allowed." }, { status: 401 });
  return Response.json(
    { orders: await listOrders() },
    { headers: { "Cache-Control": "no-store" } }
  );
}
