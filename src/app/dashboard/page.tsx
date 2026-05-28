import Link from "next/link";
import { PlusCircle, CalendarDays } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
