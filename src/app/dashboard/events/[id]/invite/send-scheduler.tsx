"use client";

import { useState } from "react";
import { Clock, Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { scheduleSend, cancelScheduledSend } from "./actions";

export function SendScheduler({
  eventId,
  scheduledAt,
}: {
  eventId: string;
  scheduledAt: string | null;
}) {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [scheduling, setScheduling] = useState(false);
  const [canceling, setCanceling] = useState(false);
  const [currentScheduled, setCurrentScheduled] = useState(scheduledAt);

  async function handleSchedule() {
    if (!date || !time) {
      toast.error("Please select a date and time");
      return;
    }

    const local = new Date(`${date}T${time}:00`);
    if (isNaN(local.getTime())) {
      toast.error("Invalid date or time");
      return;
    }

    if (local <= new Date()) {
      toast.error("Scheduled time must be in the future");
      return;
    }

    setScheduling(true);
    try {
      const result = await scheduleSend(eventId, local.toISOString());
      setCurrentScheduled(result.scheduledAt);
      setDate("");
      setTime("");
      toast.success(
        `Scheduled for ${new Date(result.scheduledAt).toLocaleString("en-US", {
          dateStyle: "medium",
          timeStyle: "short",
        })}`,
      );
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to schedule");
    }
    setScheduling(false);
  }

  async function handleCancel() {
    setCanceling(true);
    try {
      await cancelScheduledSend(eventId);
      setCurrentScheduled(null);
      toast.success("Scheduled send cancelled");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to cancel");
    }
    setCanceling(false);
  }

  if (currentScheduled) {
    const formatted = new Date(currentScheduled).toLocaleString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      timeZoneName: "short",
    });

    return (
      <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
        <div className="flex items-center gap-2 text-sm font-medium text-amber-800">
          <Clock className="h-4 w-4" />
          Scheduled
        </div>
        <p className="mt-1 text-sm text-amber-700">{formatted}</p>
        <p className="mt-0.5 text-xs text-amber-600">
          Invitations will be sent automatically at this time.
        </p>
        <button
          type="button"
          onClick={handleCancel}
          disabled={canceling}
          className="mt-3 inline-flex items-center gap-1 rounded-md border border-amber-300 px-3 py-1 text-xs font-medium text-amber-800 transition-colors hover:bg-amber-100 disabled:opacity-50"
        >
          {canceling ? (
            <Loader2 className="h-3 w-3 animate-spin" />
          ) : (
            <X className="h-3 w-3" />
          )}
          Cancel Schedule
        </button>
      </div>
    );
  }

  const minDate = new Date().toISOString().slice(0, 16);

  return (
    <div className="rounded-lg border bg-white p-4">
      <div className="flex items-center gap-2 text-sm font-medium text-stone-700">
        <Clock className="h-4 w-4" />
        Schedule Send
      </div>
      <p className="mt-1 text-xs text-stone-500">
        Set a date and time to automatically send all invitations.
      </p>
      <div className="mt-3 space-y-2">
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          min={minDate.slice(0, 10)}
          className="block w-full rounded-lg border border-stone-200 px-3 py-2 text-sm focus:border-amber-300 focus:outline-none focus:ring-1 focus:ring-amber-300"
        />
        <input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          className="block w-full rounded-lg border border-stone-200 px-3 py-2 text-sm focus:border-amber-300 focus:outline-none focus:ring-1 focus:ring-amber-300"
        />
      </div>
      <button
        type="button"
        onClick={handleSchedule}
        disabled={scheduling || !date || !time}
        className="mt-3 inline-flex w-full items-center justify-center rounded-lg bg-amber-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-amber-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {scheduling ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Clock className="mr-2 h-4 w-4" />
        )}
        {scheduling ? "Scheduling..." : "Schedule Send"}
      </button>
    </div>
  );
}
