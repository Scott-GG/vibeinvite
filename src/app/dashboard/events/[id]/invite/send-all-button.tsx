"use client";

import { useState } from "react";
import { Send, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { sendToAll } from "./actions";

export function SendAllButton({
  eventId,
  theme,
  disabled,
  guestCount,
}: {
  eventId: string;
  theme: string;
  disabled: boolean;
  guestCount: number;
}) {
  const [sending, setSending] = useState(false);

  async function handleSend() {
    setSending(true);
    try {
      const result = await sendToAll(eventId, undefined, theme);
      toast.success(
        `Sent to ${result.succeeded} guest${result.succeeded !== 1 ? "s" : ""}${result.failed > 0 ? ` (${result.failed} failed)` : ""}`,
      );
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to send");
    }
    setSending(false);
  }

  const isDisabled = disabled || sending;

  return (
    <button
      type="button"
      onClick={handleSend}
      disabled={isDisabled}
      className="inline-flex w-full items-center justify-center rounded-lg bg-stone-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {sending ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <Send className="mr-2 h-4 w-4" />
      )}
      {sending ? "Sending..." : `Send to All (${guestCount})`}
    </button>
  );
}
