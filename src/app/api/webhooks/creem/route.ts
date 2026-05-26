import { Webhook } from "@creem_io/nextjs";
import { createAdminClient } from "@/lib/supabase/admin";

export const POST = Webhook({
  webhookSecret: process.env.CREEM_WEBHOOK_SECRET!,

  // One-time payment completed (Pro Event upgrade)
  onCheckoutCompleted: async ({ product, customer, metadata, order }) => {
    const supabase = createAdminClient();
    const userId = (metadata as Record<string, unknown> | undefined)
      ?.referenceId as string | undefined;
    const eventId = (metadata as Record<string, unknown> | undefined)
      ?.eventId as string | undefined;
    const purchaseType = (metadata as Record<string, unknown> | undefined)
      ?.type as string | undefined;

    if (!userId) return;

    // Store Creem customer ID for portal
    if (customer?.id) {
      await supabase
        .from("profiles")
        .update({ creem_customer_id: customer.id })
        .eq("id", userId);
    }

    if (purchaseType === "pro_event" && eventId) {
      // Record purchase
      await supabase.from("purchases").insert({
        user_id: userId,
        event_id: eventId,
        creem_checkout_id: order?.id ?? "",
        amount: order?.amount ?? 2900,
        purchase_type: "pro_event",
        status: "completed",
      });

      // Unlock event
      await supabase
        .from("events")
        .update({ is_pro: true })
        .eq("id", eventId);
    }

    if (purchaseType === "subscription") {
      await supabase.from("purchases").insert({
        user_id: userId,
        creem_checkout_id: order?.id ?? "",
        amount: order?.amount ?? 999,
        purchase_type: "subscription",
        status: "completed",
      });
    }
  },

  // Subscription active/trialing/paid → grant access
  onGrantAccess: async ({ reason, product, customer, metadata }) => {
    const supabase = createAdminClient();
    const userId = (metadata as Record<string, unknown> | undefined)
      ?.referenceId as string | undefined;

    if (!userId) return;

    console.log(
      `[creem] Granting access to ${customer?.email} for ${product.name} (reason: ${reason})`,
    );

    await supabase
      .from("profiles")
      .update({ subscription_tier: "unlimited" })
      .eq("id", userId);

    if (customer?.id) {
      await supabase
        .from("profiles")
        .update({ creem_customer_id: customer.id })
        .eq("id", userId);
    }
  },

  // Subscription paused/expired → revoke access
  onRevokeAccess: async ({ reason, customer, metadata }) => {
    const supabase = createAdminClient();
    const userId = (metadata as Record<string, unknown> | undefined)
      ?.referenceId as string | undefined;

    if (!userId) return;

    console.log(
      `[creem] Revoking access from ${customer?.email} (reason: ${reason})`,
    );

    await supabase
      .from("profiles")
      .update({ subscription_tier: "free" })
      .eq("id", userId);
  },

  // Subscription canceled → downgrade
  onSubscriptionCanceled: async ({ customer, metadata }) => {
    const supabase = createAdminClient();
    const userId = (metadata as Record<string, unknown> | undefined)
      ?.referenceId as string | undefined;

    if (!userId) return;

    console.log(`[creem] Subscription canceled for ${customer?.email}`);

    await supabase
      .from("profiles")
      .update({ subscription_tier: "free" })
      .eq("id", userId);
  },
});
