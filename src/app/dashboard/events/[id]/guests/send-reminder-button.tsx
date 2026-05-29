"use client";

import { useState } from "react";
import { Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { sendReminders } from "./actions";

export function SendReminderButton({
  eventId,
  pendingCount,
}: {
  eventId: string;
  pendingCount: number;
}) {
  const [sending, setSending] = useState(false);

  async function handleSend() {
    setSending(true);
    try {
      await sendReminders(eventId);
      toast.success(`Reminder sent to ${pendingCount} guest${pendingCount !== 1 ? "s" : ""}`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to send reminders");
    }
    setSending(false);
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleSend}
      disabled={sending}
    >
      {sending ? (
        <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
      ) : (
        <Send className="mr-1.5 h-3.5 w-3.5" />
      )}
      {sending ? "Sending..." : "Send Reminder"}
    </Button>
  );
}
