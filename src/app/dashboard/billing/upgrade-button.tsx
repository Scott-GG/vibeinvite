"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { PaypalButton } from "@/components/paypal/PaypalButton";
import { PaypalProvider } from "@/components/paypal/PaypalProvider";

export function UpgradeButton({
  type,
  label,
  eventId,
}: {
  type: "pro_event" | "subscription";
  label: string;
  eventId?: string;
  userId?: string;
  userEmail?: string;
}) {
  const [showPaypal, setShowPaypal] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubscribe() {
    setLoading(true);
    try {
      const res = await fetch("/api/paypal/create-subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventId }),
      });
      const data = await res.json();
      if (data.approvalUrl) {
        window.location.href = data.approvalUrl;
      } else if (data.error) {
        toast.error(data.error?.message ?? "Failed to create subscription");
      }
    } catch {
      toast.error("Network error");
    }
    setLoading(false);
  }

  if (type === "subscription") {
    return (
      <button
        type="button"
        onClick={handleSubscribe}
        disabled={loading}
        className="inline-flex w-full items-center justify-center rounded-lg bg-stone-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : null}
        {loading ? "Redirecting..." : label}
      </button>
    );
  }

  if (!showPaypal) {
    return (
      <button
        type="button"
        onClick={() => setShowPaypal(true)}
        className="inline-flex w-full items-center justify-center rounded-lg bg-[#0070ba] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#005ea6]"
      >
        {label}
      </button>
    );
  }

  return (
    <PaypalProvider clientId={process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID!}>
      <PaypalButton
        type={type}
        eventId={eventId}
        onSuccess={() => {
          toast.success("Payment successful! Refreshing...");
          setTimeout(() => window.location.reload(), 1500);
        }}
      />
    </PaypalProvider>
  );
}
