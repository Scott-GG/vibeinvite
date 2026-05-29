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
import { getTheme } from "@/lib/themes";

// Theme gradient bars — rich gradients per theme
const themeGradients: Record<string, string> = {
  classic: "bg-gradient-to-r from-amber-400 via-amber-300 to-cream",
  romantic: "bg-gradient-to-r from-rose-400 via-rose-300 to-blush",
  modern: "bg-gradient-to-r from-stone-700 via-stone-500 to-stone-300",
  midnight: "bg-gradient-to-r from-amber-600 via-gold to-amber-200",
  botanical: "bg-gradient-to-r from-emerald-600 via-sage to-green-200",
  coastal: "bg-gradient-to-r from-blue-500 via-sky-400 to-blue-200",
};

const themePreviewBg: Record<string, string> = {
  classic: "bg-gradient-to-br from-cream via-amber-50 to-stone-100",
  romantic: "bg-gradient-to-br from-rose-50 via-stone-50 to-green-50/30",
  modern: "bg-gradient-to-br from-stone-50 via-white to-stone-100",
  midnight: "bg-gradient-to-br from-stone-900 via-amber-950/30 to-stone-950",
  botanical: "bg-gradient-to-br from-green-50/30 via-stone-50 to-stone-100",
  coastal: "bg-gradient-to-br from-blue-50 via-stone-50 to-amber-50/30",
};

const themeAccent: Record<string, string> = {
  classic: "#8B6914",
  romantic: "#C97B7B",
  modern: "#1A1410",
  midnight: "#C9A84C",
  botanical: "#3A5A40",
  coastal: "#457B9D",
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
  const themeId = (config?.theme as string) ?? "classic";
  const t = getTheme(themeId);
  const progressPct =
    counts.total > 0
      ? Math.round((counts.attending / counts.total) * 100)
      : 0;
  const remaining = daysUntil(event.event_date);
  const isMidnight = themeId === "midnight";
  const accent = themeAccent[themeId] ?? "#C9A84C";

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
      {/* Delete button */}
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
            "h-full overflow-hidden border-stone-200/60 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg",
            isMidnight && "border-stone-700/40"
          )}
          style={
            isMidnight
              ? { background: "#2A2420" }
              : { background: "#FFFFFF" }
          }
        >
          {/* Theme gradient bar */}
          <div
            className={cn("h-2 w-full", themeGradients[themeId] ?? themeGradients.classic)}
          />

          <CardHeader className="pb-2">
            <div className="mb-2 flex items-center justify-between">
              <span
                className="rounded-full px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider"
                style={{
                  background: isMidnight ? "rgba(201,168,76,0.15)" : `${accent}15`,
                  color: isMidnight ? "#C9A84C" : accent,
                }}
              >
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
              className="font-serif text-xl italic tracking-wide"
              style={{ color: isMidnight ? "#E0D5C0" : "#1A1410" }}
            >
              {event.title}
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Date & Location */}
            <div className="space-y-1.5 text-sm" style={{ color: isMidnight ? "#A89880" : "#6B5744" }}>
              <div className="flex items-center gap-2">
                <CalendarDays className="h-3.5 w-3.5 shrink-0" />
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
                  <MapPin className="h-3.5 w-3.5 shrink-0" />
                  <span>{event.location_name}</span>
                </div>
              )}
            </div>

            {/* Mini invitation preview thumbnail */}
            <div
              className={cn(
                "mx-auto h-12 w-16 overflow-hidden rounded-md border shadow-sm",
                isMidnight ? "border-stone-600/40" : "border-stone-200/60"
              )}
            >
              <div className={cn("flex h-full items-center justify-center p-1", themePreviewBg[themeId] ?? themePreviewBg.classic)}>
                <div
                  className="h-1.5 w-10 rounded-full opacity-30"
                  style={{ background: accent }}
                />
              </div>
            </div>

            {/* RSVP Progress bar */}
            {counts.total > 0 ? (
              <div>
                <div className="mb-1 flex items-center justify-between text-xs">
                  <span style={{ color: isMidnight ? "#A89880" : "#8B7355" }}>
                    RSVP: {counts.attending}/{counts.total}
                  </span>
                  <span className="font-medium" style={{ color: "#4A7C59" }}>
                    {progressPct}%
                  </span>
                </div>
                <div
                  className="h-1.5 w-full overflow-hidden rounded-full"
                  style={{ background: isMidnight ? "#3D3530" : "#F5EFE3" }}
                >
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${progressPct}%`,
                      background: `linear-gradient(90deg, ${accent}99, ${accent})`,
                    }}
                  />
                </div>
              </div>
            ) : (
              <p
                className="text-center text-xs italic"
                style={{ color: isMidnight ? "#5C5040" : "#A89880" }}
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
