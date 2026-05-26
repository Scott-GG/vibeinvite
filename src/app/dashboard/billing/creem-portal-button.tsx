"use client";

import { CreemPortal } from "@creem_io/nextjs";

export function CreemPortalButton({
  customerId,
  label = "Manage Subscription",
}: {
  customerId: string;
  label?: string;
}) {
  return (
    <CreemPortal customerId={customerId} portalPath="/api/creem/portal">
      <button className="inline-flex w-full items-center justify-center rounded-lg bg-stone-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-stone-800">
        {label}
      </button>
    </CreemPortal>
  );
}
