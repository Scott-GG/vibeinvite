import Link from "next/link";
import { PlusCircle, CalendarDays, MapPin } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { createClient, requireUser } from "@/lib/supabase/server";

const themeGradients: Record<string, string> = {
  classic: "from-stone-100 to-amber-50/60",
  romantic: "from-rose-50/60 to-stone-50",
  modern: "from-stone-200 to-stone-50",
  midnight: "from-stone-900 to-stone-800",
  botanical: "from-emerald-50/60 to-stone-50",
  coastal: "from-sky-50/60 to-amber-50/40",
};

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

export default async function DashboardPage() {
  const supabase = await createClient();
  const user = await requireUser();

  const { data: events } = await supabase
    .from("events")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const hasEvents = events && events.length > 0;

  // Fetch guest counts for all events
  let guestCounts: Record<string, { total: number; attending: number }> = {};
  if (hasEvents) {
    const { data: guests } = await supabase
      .from("guests")
      .select("event_id, status")
      .in(
        "event_id",
        events!.map((e) => e.id),
      );

    if (guests) {
      for (const g of guests) {
        if (!guestCounts[g.event_id]) {
          guestCounts[g.event_id] = { total: 0, attending: 0 };
        }
        guestCounts[g.event_id].total++;
        if (g.status === "accepted") {
          guestCounts[g.event_id].attending++;
        }
      }
    }
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Your Events
          </h1>
          <p className="text-muted-foreground">
            Manage your invitations and track RSVPs
          </p>
        </div>
        <Link href="/dashboard/events/new" className={buttonVariants({})}>
          <PlusCircle className="mr-2 h-4 w-4" />
          New Event
        </Link>
      </div>

      {!hasEvents && (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <CalendarDays className="mb-4 h-12 w-12 text-muted-foreground/50" />
            <CardTitle className="mb-1 text-xl">No events yet</CardTitle>
            <CardDescription className="mb-6">
              Create your first invitation to get started
            </CardDescription>
            <Link
              href="/dashboard/events/new"
              className={buttonVariants({})}
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Create Event
            </Link>
          </CardContent>
        </Card>
      )}

      {hasEvents && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {events!.map((event) => {
            const config =
              typeof event.config === "object" && event.config !== null
                ? (event.config as Record<string, unknown>)
                : {};
            const theme = (config?.theme as string) ?? "classic";
            const counts = guestCounts[event.id] ?? {
              total: 0,
              attending: 0,
            };
            const progressPct =
              counts.total > 0
                ? Math.round((counts.attending / counts.total) * 100)
                : 0;
            const remaining = daysUntil(event.event_date);
            const isMidnight = theme === "midnight";

            return (
              <Link key={event.id} href={`/dashboard/events/${event.id}`}>
                <Card
                  className={cn(
                    "group relative h-full overflow-hidden border-stone-200/60 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg",
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
                      className={cn(
                        "text-lg",
                        isMidnight && "text-stone-100",
                      )}
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
                          {new Date(event.event_date).toLocaleDateString(
                            "en-US",
                            {
                              weekday: "long",
                              month: "long",
                              day: "numeric",
                            },
                          )}
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
                              isMidnight
                                ? "text-stone-400"
                                : "text-stone-500",
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
                          isMidnight
                            ? "text-stone-500"
                            : "text-stone-400",
                        )}
                      >
                        No guests invited yet
                      </p>
                    )}
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
