import Link from "next/link";
import { PlusCircle, CalendarDays, Users, Clock, PartyPopper, ArrowRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { createClient, requireUser } from "@/lib/supabase/server";
import { EventCard } from "@/app/dashboard/event-card";

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
  let totalGuests = 0;
  let pendingRsvps = 0;
  let upcomingWeek = 0;

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
        totalGuests++;
        if (g.status === "accepted") {
          guestCounts[g.event_id].attending++;
        }
        if (g.status === "pending") {
          pendingRsvps++;
        }
      }
    }

    // Count events in the next 7 days
    const now = new Date();
    const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    upcomingWeek = events!.filter((e) => {
      const d = new Date(e.event_date);
      return d >= now && d <= nextWeek;
    }).length;
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6 flex items-center justify-between">
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

      {/* Stats bar */}
      {hasEvents && (
        <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            {
              label: "Total Events",
              value: events!.length,
              icon: CalendarDays,
              color: "text-stone-700",
            },
            {
              label: "Total Guests",
              value: totalGuests,
              icon: Users,
              color: "text-stone-700",
            },
            {
              label: "Pending RSVPs",
              value: pendingRsvps,
              icon: Clock,
              color: "text-amber-600",
            },
            {
              label: "Upcoming (7d)",
              value: upcomingWeek,
              icon: PartyPopper,
              color: "text-emerald-600",
            },
          ].map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.label} className="transition-shadow hover:shadow-sm">
                <CardContent className="flex items-center gap-3 p-4">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-stone-100">
                    <Icon className={`h-4.5 w-4.5 ${stat.color}`} />
                  </div>
                  <div>
                    <p className="text-lg font-bold tracking-tight">
                      {stat.value}
                    </p>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Empty state */}
      {!hasEvents && (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-20">
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-stone-100">
              <PartyPopper className="h-10 w-10 text-stone-400" />
            </div>
            <CardTitle className="mb-2 text-xl">
              Create your first invitation
            </CardTitle>
            <CardDescription className="mb-2 max-w-sm text-center">
              Send beautiful, wax-sealed invitations your guests will love.
              Track RSVPs in real time — all from one dashboard.
            </CardDescription>
            <div className="mb-8 flex items-center gap-2 text-xs text-stone-400">
              <span className="flex items-center gap-1">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400" />
                Easy setup
              </span>
              <Separator orientation="vertical" className="h-3" />
              <span className="flex items-center gap-1">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400" />
                No design skills needed
              </span>
              <Separator orientation="vertical" className="h-3" />
              <span className="flex items-center gap-1">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400" />
                Free to start
              </span>
            </div>
            <Link
              href="/dashboard/events/new"
              className={buttonVariants({ size: "lg" })}
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Create New Event
            </Link>
          </CardContent>
        </Card>
      )}

      {/* Event cards */}
      {hasEvents && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {events!.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              counts={guestCounts[event.id] ?? { total: 0, attending: 0 }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
