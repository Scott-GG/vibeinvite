import Link from "next/link";
import { Users, ChevronRight, Mail, Phone } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";

const statusLabels: Record<string, string> = {
  accepted: "Attending",
  declined: "Declined",
  pending: "Pending",
};

const statusColors: Record<
  string,
  "default" | "secondary" | "destructive" | "outline"
> = {
  accepted: "default",
  declined: "destructive",
  pending: "outline",
};

export default async function GuestsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: events } = await supabase
    .from("events")
    .select("id, title, event_date")
    .eq("user_id", user!.id)
    .order("event_date", { ascending: true });

  if (!events || events.length === 0) {
    return (
      <div className="p-6 lg:p-8">
        <h1 className="text-2xl font-semibold tracking-tight">Guests</h1>
        <p className="text-muted-foreground">
          Manage all your guests across events
        </p>
        <div className="mt-16 text-center">
          <Users className="mx-auto mb-4 h-12 w-12 text-muted-foreground/50" />
          <p className="text-muted-foreground">
            Create an event first to start adding guests.
          </p>
          <Link
            href="/dashboard/events/new"
            className="mt-4 inline-block text-sm font-medium text-stone-900 underline"
          >
            Create Event
          </Link>
        </div>
      </div>
    );
  }

  // Fetch guests for each event
  const eventGuests = await Promise.all(
    events.map(async (event) => {
      const { data: guests } = await supabase
        .from("guests")
        .select("id, first_name, last_name, email, phone, status")
        .eq("event_id", event.id)
        .order("first_name", { ascending: true });
      return { event, guests: guests ?? [] };
    }),
  );

  const totalGuests = eventGuests.reduce((sum, eg) => sum + eg.guests.length, 0);

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">Guests</h1>
        <p className="text-muted-foreground">
          {totalGuests} total guest{totalGuests !== 1 ? "s" : ""} across{" "}
          {events.length} event{events.length !== 1 ? "s" : ""}
        </p>
      </div>

      <div className="space-y-6">
        {eventGuests.map(({ event, guests }) => (
          <Card key={event.id}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">{event.title}</CardTitle>
                  <CardDescription>
                    {new Date(event.event_date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                    {" — "}
                    {guests.length} guest{guests.length !== 1 ? "s" : ""}
                  </CardDescription>
                </div>
                <Link
                  href={`/dashboard/events/${event.id}/guests`}
                  className="flex items-center gap-1 text-sm text-stone-500 hover:text-stone-900"
                >
                  Manage
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {guests.length === 0 ? (
                <p className="py-4 text-center text-sm text-muted-foreground">
                  No guests yet.{" "}
                  <Link
                    href={`/dashboard/events/${event.id}/guests`}
                    className="underline"
                  >
                    Add guests
                  </Link>
                </p>
              ) : (
                <div className="divide-y rounded-lg border">
                  {guests.slice(0, 5).map((guest) => (
                    <div
                      key={guest.id}
                      className="flex items-center justify-between px-3 py-2.5"
                    >
                      <div>
                        <span className="text-sm font-medium">
                          {guest.first_name} {guest.last_name}
                        </span>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          {guest.email && (
                            <span className="flex items-center gap-1">
                              <Mail className="h-3 w-3" /> {guest.email}
                            </span>
                          )}
                          {guest.phone && (
                            <span className="flex items-center gap-1">
                              <Phone className="h-3 w-3" /> {guest.phone}
                            </span>
                          )}
                        </div>
                      </div>
                      <Badge
                        variant={statusColors[guest.status] ?? "outline"}
                      >
                        {statusLabels[guest.status] ?? guest.status}
                      </Badge>
                    </div>
                  ))}
                  {guests.length > 5 && (
                    <div className="px-3 py-2 text-center text-xs text-muted-foreground">
                      +{guests.length - 5} more guests —{" "}
                      <Link
                        href={`/dashboard/events/${event.id}/guests`}
                        className="underline"
                      >
                        view all
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
