"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

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
  const [loading, setLoading] = useState(false);

  async function handleUpgrade() {
    setLoading(true);
    try {
      const res = await fetch("/api/creem/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, eventId }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        toast.error(data.error ?? "Failed to create checkout");
        console.error("[upgrade]", data);
      }
    } catch {
      toast.error("Network error");
    }
    setLoading(false);
  }

  return (
    <button
      type="button"
      onClick={handleUpgrade}
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
