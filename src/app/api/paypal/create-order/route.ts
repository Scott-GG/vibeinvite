import { paypalFetch } from "@/lib/paypal";
import { createClient, getUserSafe } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const user = await getUserSafe();
  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { type, eventId } = await request.json();

  // Product/plan IDs — you need to create these in PayPal dashboard
  const SIGNATURE_EVENT_PRICE = "29.00"; // $29 one-time
  const HOST_MONTHLY_PLAN_ID = process.env.PAYPAL_HOST_PLAN_ID; // Monthly plan

  let orderPayload: Record<string, unknown>;

  if (type === "pro_event") {
    orderPayload = {
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: { currency_code: "USD", value: SIGNATURE_EVENT_PRICE },
          description: "VibeInvite Signature — One Event",
          custom_id: `${user.id}::pro_event::${eventId ?? ""}`,
        },
      ],
      application_context: {
        brand_name: "VibeInvite",
        landing_page: "NO_PREFERENCE",
        user_action: "PAY_NOW",
      },
    };
  } else if (type === "subscription") {
    if (!HOST_MONTHLY_PLAN_ID) {
      return Response.json(
        { error: "Subscription plan not configured" },
        { status: 400 },
      );
    }
    orderPayload = {
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: { currency_code: "USD", value: "9.99" },
          description: "VibeInvite Host — Monthly Subscription",
          custom_id: `${user.id}::subscription::`,
        },
      ],
      application_context: {
        brand_name: "VibeInvite",
        landing_page: "NO_PREFERENCE",
        user_action: "SUBSCRIBE_NOW",
      },
    };
  } else {
    return Response.json({ error: "Invalid type" }, { status: 400 });
  }

  const res = await paypalFetch("/v2/checkout/orders", {
    method: "POST",
    body: JSON.stringify(orderPayload),
  });

  const data = await res.json();

  if (!res.ok) {
    return Response.json({ error: data }, { status: res.status });
  }

  return Response.json({ id: data.id, status: data.status });
}
