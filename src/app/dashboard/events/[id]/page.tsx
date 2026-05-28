import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarDays, MapPin, Users, Send, Table } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { createClient, requireUser } from "@/lib/supabase/server";
import { RealtimeStats } from "@/components/dashboard/RealtimeStats";
import { DietaryChart } from "@/components/dashboard/DietaryChart";
import { AiCopywriter } from "@/components/dashboard/AiCopywriter";
import { UpgradeButton } from "@/app/dashboard/billing/upgrade-button";
import { DeleteEventButton } from "./delete-button";

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const user = await requireUser();

  const { data: event } = await supabase
    .from("events")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (!event) notFound();

  const { data: profile } = await supabase
    .from("profiles")
    .select("subscription_tier")
    .eq("id", user.id)
    .maybeSingle();

  const isFree = (profile?.subscription_tier ?? "free") === "free" && !event.is_pro;

  // Fetch guest stats for initial render
  const { data: allGuests } = await supabase
    .from("guests")
    .select("status")
    .eq("event_id", id);

  const initialStats = {
    total: allGuests?.length ?? 0,
    attending: allGuests?.filter((g) => g.status === "accepted").length ?? 0,
    declined: allGuests?.filter((g) => g.status === "declined").length ?? 0,
    pending: allGuests?.filter((g) => g.status === "pending").length ?? 0,
  };

  return (
    <div className="p-6 lg:p-8">
      <Link
        href="/dashboard"
        className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "mb-4")}
      >
        <ArrowLeft className="mr-1 h-4 w-4" />
        Back to Events
      </Link>

      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            {event.title}
          </h1>
          <p className="capitalize text-muted-foreground">
            {event.event_type}
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            href={`/dashboard/events/${id}/guests`}
            className={buttonVariants({ variant: "outline" })}
          >
            <Users className="mr-2 h-4 w-4" />
            Manage Guests
          </Link>
          <Link
            href={`/dashboard/events/${id}/invite`}
            className={buttonVariants({})}
          >
            <Send className="mr-2 h-4 w-4" />
            Send Invites
          </Link>
          {isFree ? (
            <UpgradeButton
              type="pro_event"
              eventId={id}
              label="Unlock Pro — $29"
            />
          ) : (
            <Link
              href={`/dashboard/events/${id}/seating`}
              className={buttonVariants({ variant: "secondary" })}
            >
              <Table className="mr-2 h-4 w-4" />
              Seating
            </Link>
          )}
          <DeleteEventButton eventId={id} />
        </div>
      </div>

      {/* Realtime RSVP Stats */}
      <div className="mb-8">
        <RealtimeStats eventId={id} initialStats={initialStats} />
      </div>

      <div className="mb-8 grid gap-6 lg:grid-cols-3">
        {/* Dietary Chart */}
        <div className="lg:col-span-1">
          <DietaryChart eventId={id} />
        </div>

        {/* Event Details */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Event Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <CalendarDays className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">
                    {new Date(event.event_date).toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(event.event_date).toLocaleTimeString("en-US", {
                      hour: "numeric",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>

              {event.location_name && (
                <>
                  <Separator />
                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{event.location_name}</p>
                      {event.location_address && (
                        <p className="text-sm text-muted-foreground">
                          {event.location_address}
                        </p>
                      )}
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* AI Copywriter */}
      {isFree ? (
        <div className="mt-8 rounded-xl border-2 border-dashed border-stone-200 p-8 text-center">
          <h3 className="font-semibold text-stone-700">AI Copywriter</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Generate beautiful invitation copy with AI. Upgrade to Pro or
            Unlimited to unlock.
          </p>
          <div className="mt-4 flex items-center justify-center gap-3">
            <UpgradeButton
              type="pro_event"
              eventId={id}
              label="Unlock Pro — $29"
            />
            <UpgradeButton
              type="subscription"
              label="Go Unlimited — $9.99/mo"
            />
          </div>
        </div>
      ) : (
        <div className="mt-8">
          <AiCopywriter
            eventId={id}
            eventTitle={event.title}
            eventType={event.event_type}
            eventDate={new Date(event.event_date).toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
            eventLocation={event.location_name ?? undefined}
          />
        </div>
      )}
    </div>
  );
}
