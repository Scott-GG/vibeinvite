import { paypalFetch } from "@/lib/paypal";
import { createAdminClient } from "@/lib/supabase/admin";
import { getUserSafe } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const user = await getUserSafe();
  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { orderID } = await request.json();
  if (!orderID) {
    return Response.json({ error: "Missing orderID" }, { status: 400 });
  }

  // Capture the order
  const res = await paypalFetch(
    `/v2/checkout/orders/${orderID}/capture`,
    { method: "POST" },
  );

  const data = await res.json();

  if (!res.ok || data.status !== "COMPLETED") {
    return Response.json(
      { error: data, status: data.status },
      { status: res.ok ? 400 : res.status },
    );
  }

  // Parse custom_id: "userId::type::eventId"
  const purchaseUnit = data.purchase_units?.[0];
  const customId = purchaseUnit?.payments?.captures?.[0]?.custom_id ?? "";
  const [, type, eventId] = customId.split("::");

  const supabase = createAdminClient();
  const captureId = purchaseUnit?.payments?.captures?.[0]?.id ?? orderID;

  if (type === "pro_event" && eventId) {
    // Store purchase and unlock the event
    const { error: purchaseError } = await supabase.from("purchases").insert({
      user_id: user.id,
      event_id: eventId,
      paypal_order_id: captureId,
      amount: 2900,
      purchase_type: "pro_event",
      status: "completed",
    });

    if (purchaseError) {
      console.error("Failed to insert purchase:", purchaseError);
    }

    // Unlock the event
    const { error: eventError } = await supabase
      .from("events")
      .update({ is_pro: true })
      .eq("id", eventId);

    if (eventError) {
      console.error("Failed to unlock event:", eventError);
    }
  } else if (type === "subscription") {
    const { error: purchaseError } = await supabase.from("purchases").insert({
      user_id: user.id,
      paypal_order_id: captureId,
      amount: 999,
      purchase_type: "subscription",
      status: "completed",
    });

    if (purchaseError) {
      console.error("Failed to insert purchase:", purchaseError);
    }

    // Grant unlimited access
    await supabase
      .from("profiles")
      .update({ subscription_tier: "unlimited" })
      .eq("id", user.id);
  }

  return Response.json({
    status: "COMPLETED",
    capture_id: captureId,
  });
}
