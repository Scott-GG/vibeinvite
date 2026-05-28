import { paypalFetch } from "@/lib/paypal";
import { createAdminClient } from "@/lib/supabase/admin";
import { getUserSafe } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const user = await getUserSafe();
  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { subscriptionID } = await request.json();
  if (!subscriptionID) {
    return Response.json(
      { error: "Missing subscriptionID" },
      { status: 400 },
    );
  }

  const res = await paypalFetch(
    `/v1/billing/subscriptions/${subscriptionID}/cancel`,
    {
      method: "POST",
      body: JSON.stringify({ reason: "Cancelled by user" }),
    },
  );

  if (!res.ok) {
    const data = await res.json();
    return Response.json({ error: data }, { status: res.status });
  }

  // Downgrade user
  const supabase = createAdminClient();
  await supabase
    .from("profiles")
    .update({ subscription_tier: "free" })
    .eq("id", user.id);

  return Response.json({ status: "cancelled" });
}
