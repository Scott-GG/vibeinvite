import { paypalFetch } from "@/lib/paypal";
import { getUserSafe } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const user = await getUserSafe();
  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const planId = process.env.PAYPAL_HOST_PLAN_ID;
  if (!planId) {
    return Response.json(
      { error: "Subscription plan not configured" },
      { status: 400 },
    );
  }

  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  const payload = {
    plan_id: planId,
    subscriber: {
      email_address: user.email,
    },
    custom_id: user.id,
    application_context: {
      brand_name: "VibeInvite",
      return_url: `${baseUrl}/dashboard/billing?subscription=success`,
      cancel_url: `${baseUrl}/dashboard/billing?subscription=cancelled`,
      user_action: "SUBSCRIBE_NOW",
    },
  };

  const res = await paypalFetch("/v1/billing/subscriptions", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  const data = await res.json();

  if (!res.ok) {
    return Response.json({ error: data }, { status: res.status });
  }

  // Find the approval link
  const approvalLink = data.links?.find(
    (l: { rel: string }) => l.rel === "approve",
  );

  return Response.json({
    subscriptionID: data.id,
    approvalUrl: approvalLink?.href ?? null,
  });
}
