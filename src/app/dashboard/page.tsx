import Link from "next/link";
import { PlusCircle, CalendarDays, Users, Clock, PartyPopper } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
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

    const now = new Date();
    const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    upcomingWeek = events!.filter((e) => {
      const d = new Date(e.event_date);
      return d >= now && d <= nextWeek;
    }).length;
  }

  return (
    <div className="p-6 lg:p-8" style={{ background: "#FAF7F2" }}>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1
            className="font-display text-3xl tracking-wide"
            style={{ color: "#1A1410" }}
          >
            Your Events
          </h1>
          <p style={{ color: "#8B7355" }} className="mt-1 font-sans text-sm">
            Manage your invitations and track RSVPs
          </p>
        </div>
        <Link
          href="/dashboard/events/new"
          className={buttonVariants({})}
          style={{ background: "#1A1410", color: "#FAF7F2" }}
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          New Event
        </Link>
      </div>

      {/* Stats bar — gold left border accent */}
      {hasEvents && (
        <div className="mb-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            {
              label: "Events",
              value: events!.length,
              icon: CalendarDays,
              color: "#C9A84C",
            },
            {
              label: "Guests Total",
              value: totalGuests,
              icon: Users,
              color: "#C9A84C",
            },
            {
              label: "Awaiting Reply",
              value: pendingRsvps,
              icon: Clock,
              color: "#C9853A",
            },
            {
              label: "This Week",
              value: upcomingWeek,
              icon: PartyPopper,
              color: "#4A7C59",
            },
          ].map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="group relative overflow-hidden rounded-xl transition-all hover:-translate-y-0.5"
                style={{
                  background: "#FFFFFF",
                  borderLeft: `4px solid ${stat.color}`,
                  boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                }}
              >
                {/* Hover gold shadow */}
                <div
                  className="absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100"
                  style={{
                    boxShadow: "0 4px 20px rgba(201,168,76,0.15)",
                  }}
                />
                <div className="relative flex items-center gap-4 p-5">
                  <div
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg"
                    style={{ background: `${stat.color}12` }}
                  >
                    <Icon className="h-5 w-5" style={{ color: stat.color }} />
                  </div>
                  <div>
                    <p
                      className="font-serif text-4xl font-light tracking-tight"
                      style={{ color: "#1A1410" }}
                    >
                      {stat.value}
                    </p>
                    <p
                      className="text-[11px] font-medium uppercase tracking-widest"
                      style={{ color: "#8B7355" }}
                    >
                      {stat.label}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Empty state — premium */}
      {!hasEvents && (
        <div className="flex flex-col items-center justify-center py-24">
          {/* Envelope illustration */}
          <div className="relative mb-10">
            <div
              className="relative mx-auto h-32 w-48 overflow-hidden rounded-xl"
              style={{
                background: "linear-gradient(135deg, #F5EFE3 0%, #E8DCCF 100%)",
                boxShadow: "0 8px 40px rgba(201,168,76,0.12)",
              }}
            >
              {/* Texture */}
              <div
                className="absolute inset-0 opacity-[0.12]"
                style={{
                  backgroundImage:
                    "radial-gradient(#C9A84C 1px, transparent 1px)",
                  backgroundSize: "16px 16px",
                }}
              />
              {/* Border */}
              <div
                className="absolute inset-3 rounded-md border"
                style={{ borderColor: "rgba(201,168,76,0.3)" }}
              />
              {/* Flap */}
              <div
                className="absolute top-0 left-0 right-0 z-10"
                style={{
                  height: "52%",
                  background:
                    "linear-gradient(180deg, #EDE2D0 0%, #E0D0B8 100%)",
                  clipPath: "polygon(0 0, 50% 100%, 100% 0)",
                }}
              />
              {/* Wax seal */}
              <div className="absolute bottom-0 left-1/2 z-20 -translate-x-1/2 translate-y-1/2">
                <div
                  className="flex h-14 w-14 items-center justify-center rounded-full shadow-lg"
                  style={{
                    background:
                      "radial-gradient(circle at 35% 35%, #E8C96B 0%, #C9A84C 30%, #8B6914 70%, #5C4510 100%)",
                  }}
                >
                  <span
                    className="font-display text-lg"
                    style={{ color: "#FAF3E0", textShadow: "0 1px 2px rgba(0,0,0,0.3)" }}
                  >
                    V
                  </span>
                </div>
              </div>
            </div>
            {/* Gold glow behind envelope */}
            <div
              className="absolute top-1/2 left-1/2 -z-10 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
              style={{ background: "rgba(201,168,76,0.12)" }}
            />
          </div>

          <h2
            className="mb-3 text-center font-display text-2xl tracking-wide"
            style={{ color: "#1A1410" }}
          >
            Your first invitation
            <br />
            is waiting to be made.
          </h2>
          <p
            className="mb-2 max-w-sm text-center font-sans text-sm leading-relaxed"
            style={{ color: "#8B7355" }}
          >
            Every great event starts with a moment of anticipation.
          </p>
          <div className="mb-10 flex items-center gap-2 text-xs" style={{ color: "#A89880" }}>
            <span className="flex items-center gap-1">
              <span
                className="inline-block h-1.5 w-1.5 rounded-full"
                style={{ background: "#4A7C59" }}
              />
              Easy setup
            </span>
            <Separator orientation="vertical" className="h-3" />
            <span className="flex items-center gap-1">
              <span
                className="inline-block h-1.5 w-1.5 rounded-full"
                style={{ background: "#4A7C59" }}
              />
              No design skills needed
            </span>
            <Separator orientation="vertical" className="h-3" />
            <span className="flex items-center gap-1">
              <span
                className="inline-block h-1.5 w-1.5 rounded-full"
                style={{ background: "#4A7C59" }}
              />
              Free to start
            </span>
          </div>
          <Link
            href="/dashboard/events/new"
            className={buttonVariants({ size: "lg" })}
            style={{ background: "#1A1410", color: "#FAF7F2" }}
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Your First Invitation
          </Link>
          <p className="mt-4 text-xs" style={{ color: "#A89880" }}>
            It takes less than 2 minutes.
          </p>
        </div>
      )}

      {/* Event cards */}
      {hasEvents && (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
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
