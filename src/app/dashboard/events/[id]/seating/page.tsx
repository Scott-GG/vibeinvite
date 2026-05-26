import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { createClient, requireUser } from "@/lib/supabase/server";
import { SeatingCanvas } from "@/components/seating/SeatingCanvas";
import { UpgradeButton } from "@/app/dashboard/billing/upgrade-button";

export default async function SeatingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const user = await requireUser();

  const { data: event } = await supabase
    .from("events")
    .select("title, is_pro")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  const { data: profile } = await supabase
    .from("profiles")
    .select("subscription_tier")
    .eq("id", user.id)
    .maybeSingle();

  const isFree = (profile?.subscription_tier ?? "free") === "free" && !event?.is_pro;

  if (isFree) {
    return (
      <div className="p-6 lg:p-8">
        <Link
          href={`/dashboard/events/${id}`}
          className={cn(
            buttonVariants({ variant: "ghost", size: "sm" }),
            "mb-2",
          )}
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back
        </Link>
        <div className="mt-16 flex flex-col items-center justify-center text-center">
          <h2 className="text-xl font-semibold text-stone-700">Seating Chart</h2>
          <p className="mt-2 max-w-md text-muted-foreground">
            Drag-and-drop seating arrangement is a Pro feature. Upgrade to unlock
            seating charts for your events.
          </p>
          <div className="mt-6 flex items-center gap-3">
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
      </div>
    );
  }

  const { data: tables } = await supabase
    .from("tables")
    .select("*")
    .eq("event_id", id)
    .order("table_name", { ascending: true });

  const { data: guests } = await supabase
    .from("guests")
    .select("id, first_name, last_name, table_id")
    .eq("event_id", id)
    .eq("status", "accepted")
    .order("first_name", { ascending: true });

  return (
    <div className="p-6 lg:p-8">
      <Link
        href={`/dashboard/events/${id}`}
        className={cn(
          buttonVariants({ variant: "ghost", size: "sm" }),
          "mb-2",
        )}
      >
        <ArrowLeft className="mr-1 h-4 w-4" />
        Back
      </Link>
      <h1 className="text-2xl font-semibold tracking-tight">
        {event?.title ?? "Event"} — Seating Chart
      </h1>
      <p className="text-muted-foreground">
        Drag attending guests to their assigned tables
      </p>

      <div className="mt-6">
        <SeatingCanvas
          eventId={id}
          tables={tables ?? []}
          guests={guests ?? []}
        />
      </div>
    </div>
  );
}
