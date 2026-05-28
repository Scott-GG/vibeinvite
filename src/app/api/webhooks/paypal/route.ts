import { createAdminClient } from "@/lib/supabase/admin";
import { paypalFetch } from "@/lib/paypal";

export async function POST(request: Request) {
  const body = await request.text();

  // Verify PayPal webhook signature
  const verification = await verifySignature(body, request.headers);

  if (!verification) {
    return Response.json({ error: "Invalid signature" }, { status: 401 });
  }

  const event = JSON.parse(body);
  const eventType = event.event_type;

  const supabase = createAdminClient();

  switch (eventType) {
    // One-time payment completed
    case "PAYMENT.CAPTURE.COMPLETED": {
      const resource = event.resource;
      const customId = resource.custom_id ?? "";
      const [, type, eventId] = customId.split("::");
      const userId = customId ? resource.custom_id.split("::")[0] : null;

      if (!userId) break;

      if (type === "pro_event" && eventId) {
        await supabase.from("purchases").insert({
          user_id: userId,
          event_id: eventId,
          paypal_order_id: resource.id,
          amount: Math.round(Number(resource.amount?.value ?? "29") * 100),
          purchase_type: "pro_event",
          status: "completed",
        });

        await supabase
          .from("events")
          .update({ is_pro: true })
          .eq("id", eventId);
      }
      break;
    }

    // Subscription activated
    case "BILLING.SUBSCRIPTION.ACTIVATED": {
      const resource = event.resource;
      const userId = resource.custom_id;

      if (!userId) break;

      await supabase
        .from("profiles")
        .update({
          subscription_tier: "unlimited",
          paypal_subscriber_id: resource.subscriber?.payer_id ?? null,
        })
        .eq("id", userId);

      await supabase.from("purchases").insert({
        user_id: userId,
        paypal_order_id: resource.id,
        amount: 999,
        purchase_type: "subscription",
        status: "completed",
      });
      break;
    }

    // Subscription cancelled or expired
    case "BILLING.SUBSCRIPTION.CANCELLED":
    case "BILLING.SUBSCRIPTION.EXPIRED": {
      const resource = event.resource;
      const userId = resource.custom_id;

      if (!userId) break;

      await supabase
        .from("profiles")
        .update({ subscription_tier: "free" })
        .eq("id", userId);
      break;
    }
  }

  return Response.json({ received: true });
}

async function verifySignature(
  body: string,
  headers: Headers,
): Promise<boolean> {
  const webhookId = process.env.PAYPAL_WEBHOOK_ID!;

  const verificationPayload = {
    auth_algo: headers.get("paypal-auth-algo") ?? "",
    cert_url: headers.get("paypal-cert-url") ?? "",
    transmission_id: headers.get("paypal-transmission-id") ?? "",
    transmission_sig: headers.get("paypal-transmission-sig") ?? "",
    transmission_time: headers.get("paypal-transmission-time") ?? "",
    webhook_id: webhookId,
    webhook_event: JSON.parse(body),
  };

  try {
    const res = await paypalFetch("/v1/notifications/verify-webhook-signature", {
      method: "POST",
      body: JSON.stringify(verificationPayload),
    });

    const data = await res.json();
    return data.verification_status === "SUCCESS";
  } catch {
    return false;
  }
}
