import Link from "next/link";
import { PlusCircle, CalendarDays, MapPin, Clock } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: events } = await supabase
    .from("events")
    .select("*")
    .eq("user_id", user!.id)
    .order("created_at", { ascending: false });

  const hasEvents = events && events.length > 0;

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
            <Link key={event.id} href={`/dashboard/events/${event.id}`}>
              <Card className="h-full transition-shadow hover:shadow-md">
                <CardHeader>
                  <CardTitle className="text-lg">{event.title}</CardTitle>
                  <CardDescription className="capitalize">
                    {event.event_type}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <CalendarDays className="h-4 w-4" />
                      <span>
                        {new Date(event.event_date).toLocaleDateString(
                          "en-US",
                          {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          },
                        )}
                      </span>
                    </div>
                    {event.location_name && (
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        <span>{event.location_name}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>
                        {new Date(event.event_date).toLocaleTimeString(
                          "en-US",
                          {
                            hour: "numeric",
                            minute: "2-digit",
                          },
                        )}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
