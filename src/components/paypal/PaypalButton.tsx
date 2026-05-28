"use client";

import { PayPalButtons } from "@paypal/react-paypal-js";
import { toast } from "sonner";

export function PaypalButton({
  type,
  eventId,
  onSuccess,
  onError,
}: {
  type: "pro_event" | "subscription";
  eventId?: string;
  onSuccess?: (data: unknown) => void;
  onError?: (error: unknown) => void;
}) {
  async function createOrder() {
    const res = await fetch("/api/paypal/create-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, eventId }),
    });
    const data = await res.json();
    if (!res.ok) {
      toast.error(data.error?.message ?? "Failed to create order");
      throw new Error(data.error?.message ?? "Failed to create order");
    }
    return data.id;
  }

  async function onApprove(data: { orderID: string }) {
    const res = await fetch("/api/paypal/capture-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderID: data.orderID }),
    });
    const result = await res.json();
    if (!res.ok || result.status !== "COMPLETED") {
      toast.error("Payment failed. Please try again.");
      onError?.(result.error);
      return;
    }
    toast.success("Payment successful!");
    onSuccess?.(result);
  }

  return (
    <PayPalButtons
      style={{
        layout: "vertical",
        color: "gold",
        shape: "rect",
        label: type === "subscription" ? "subscribe" : "pay",
      }}
      createOrder={createOrder}
      onApprove={onApprove}
      onError={(err) => {
        toast.error("Payment error. Please try again.");
        onError?.(err);
      }}
      onCancel={() => {
        toast.error("Payment cancelled");
      }}
    />
  );
}
