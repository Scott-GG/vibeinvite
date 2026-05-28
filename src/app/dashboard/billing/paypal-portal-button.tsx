"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export function PayPalPortalButton({
  customerId: paypalSubscriptionId,
  label = "Manage Subscription",
}: {
  customerId: string;
  label?: string;
}) {
  const [canceling, setCanceling] = useState(false);

  async function handleCancel() {
    if (!confirm("Are you sure you want to cancel your subscription?")) return;

    setCanceling(true);
    try {
      const res = await fetch("/api/paypal/cancel-subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subscriptionID: paypalSubscriptionId }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error?.message ?? "Failed to cancel");
      }
      toast.success("Subscription cancelled. Access remains until end of billing period.");
      setTimeout(() => window.location.reload(), 1500);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to cancel");
    }
    setCanceling(false);
  }

  return (
    <button
      type="button"
      onClick={handleCancel}
      disabled={canceling}
      className="inline-flex w-full items-center justify-center rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {canceling ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : null}
      {canceling ? "Cancelling..." : "Cancel Subscription"}
    </button>
  );
}
