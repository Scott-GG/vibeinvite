"use client";

import { CreemCheckout } from "@creem_io/nextjs";

const PRO_PRODUCT_ID = process.env.NEXT_PUBLIC_CREEM_PRO_PRODUCT_ID!;
const UNLIMITED_PRODUCT_ID = process.env.NEXT_PUBLIC_CREEM_UNLIMITED_PRODUCT_ID!;

export function UpgradeButton({
  type,
  label,
  eventId,
  userId,
  userEmail,
}: {
  type: "pro_event" | "subscription";
  label: string;
  eventId?: string;
  userId: string;
  userEmail?: string;
}) {
  const isPro = type === "pro_event";
  const metadata: Record<string, unknown> = { type };
  if (eventId) metadata.eventId = eventId;

  return (
    <CreemCheckout
      productId={isPro ? PRO_PRODUCT_ID : UNLIMITED_PRODUCT_ID}
      referenceId={userId}
      customer={userEmail ? { email: userEmail } : undefined}
      metadata={metadata}
      successUrl={
        isPro
          ? `/dashboard/events/${eventId}?upgrade=success`
          : `/dashboard/billing?subscribe=success`
      }
      checkoutPath="/api/creem/checkout"
    >
      <button className="inline-flex w-full items-center justify-center rounded-lg bg-stone-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-50">
        {label}
      </button>
    </CreemCheckout>
  );
}
