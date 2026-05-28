"use client";

import { useState } from "react";
import Link from "next/link";
import { Trash2, Loader2, CalendarDays, MapPin } from "lucide-react";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { deleteEvent } from "@/app/dashboard/events/[id]/actions";

const themeAccents: Record<string, string> = {
  classic: "bg-amber-200",
  romantic: "bg-rose-200",
  modern: "bg-stone-300",
  midnight: "bg-amber-400",
  botanical: "bg-emerald-200",
  coastal: "bg-sky-200",
};

function daysUntil(dateStr: string) {
  const now = new Date();
  const then = new Date(dateStr);
  const diff = then.getTime() - now.getTime();
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
  if (days < 0) return "Past";
  if (days === 0) return "Today";
  if (days === 1) return "1 day to go";
  return `${days} days to go`;
}

interface EventCardProps {
  event: {
    id: string;
    title: string;
    event_type: string;
    event_date: string;
    location_name: string | null;
    config: unknown;
  };
  counts: { total: number; attending: number };
}

export function EventCard({ event, counts }: EventCardProps) {
  const [deleting, setDeleting] = useState(false);
  const [open, setOpen] = useState(false);

  const config =
    typeof event.config === "object" && event.config !== null
      ? (event.config as Record<string, unknown>)
      : {};
  const theme = (config?.theme as string) ?? "classic";
  const progressPct =
    counts.total > 0
      ? Math.round((counts.attending / counts.total) * 100)
      : 0;
  const remaining = daysUntil(event.event_date);
  const isMidnight = theme === "midnight";

  async function handleDelete() {
    setDeleting(true);
    try {
      await deleteEvent(event.id);
      toast.success(`"${event.title}" deleted`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to delete event");
    }
    setDeleting(false);
    setOpen(false);
  }

  return (
    <div className="group/card relative">
      {/* Delete button — positioned absolutely on top-right */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger
          render={
            <Button
              variant="ghost"
              size="icon-xs"
              className="absolute top-2.5 right-2.5 z-10 opacity-0 transition-opacity group-hover/card:opacity-100"
            />
          }
        >
          <Trash2 className="h-3.5 w-3.5 text-stone-400 transition-colors hover:text-rose-600" />
        </DialogTrigger>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete Event</DialogTitle>
            <DialogDescription>
              Delete &ldquo;{event.title}&rdquo;? This will also remove all
              guests and RSVP data. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleting}
            >
              {deleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {deleting ? "Deleting..." : "Delete Event"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Link href={`/dashboard/events/${event.id}`}>
        <Card
          className={cn(
            "h-full overflow-hidden border-stone-200/60 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg",
          )}
        >
          {/* Theme gradient accent at top */}
          <div
            className={cn(
              "h-1.5 w-full",
              themeAccents[theme] ?? "bg-amber-200",
            )}
          />

          <CardHeader className="pb-2">
            {/* Countdown badge */}
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs tracking-wide text-stone-400 capitalize">
                {event.event_type}
              </span>
              <span
                className={cn(
                  "rounded-full px-2 py-0.5 text-[10px] font-medium",
                  remaining === "Past"
                    ? "bg-stone-100 text-stone-500"
                    : remaining === "Today"
                      ? "bg-rose-100 text-rose-700"
                      : "bg-amber-100 text-amber-800",
                )}
              >
                {remaining}
              </span>
            </div>
            <CardTitle
              className={cn("text-lg", isMidnight && "text-stone-100")}
            >
              {event.title}
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-3">
            <div
              className={cn(
                "space-y-1.5 text-sm",
                isMidnight ? "text-stone-400" : "text-muted-foreground",
              )}
            >
              <div className="flex items-center gap-2">
                <CalendarDays className="h-3.5 w-3.5" />
                <span>
                  {new Date(event.event_date).toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
              {event.location_name && (
                <div className="flex items-center gap-2">
                  <MapPin className="h-3.5 w-3.5" />
                  <span>{event.location_name}</span>
                </div>
              )}
            </div>

            {/* RSVP Progress bar */}
            {counts.total > 0 && (
              <div>
                <div className="mb-1 flex items-center justify-between text-xs">
                  <span
                    className={cn(
                      isMidnight ? "text-stone-400" : "text-stone-500",
                    )}
                  >
                    RSVP: {counts.attending}/{counts.total}
                  </span>
                  <span className="text-emerald-600 font-medium">
                    {progressPct}%
                  </span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-stone-100">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-emerald-500 transition-all"
                    style={{ width: `${progressPct}%` }}
                  />
                </div>
              </div>
            )}

            {counts.total === 0 && (
              <p
                className={cn(
                  "text-xs italic",
                  isMidnight ? "text-stone-500" : "text-stone-400",
                )}
              >
                No guests invited yet
              </p>
            )}
          </CardContent>
        </Card>
      </Link>
    </div>
  );
}
