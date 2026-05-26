import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, Plus } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { createClient, requireUser } from "@/lib/supabase/server";
import { SeatingCanvas } from "@/components/seating/SeatingCanvas";

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

  // Gate: free users cannot access seating
  const { data: profile } = await supabase
    .from("profiles")
    .select("subscription_tier")
    .eq("id", user.id)
    .single();

  const isFree = (profile?.subscription_tier ?? "free") === "free" && !event?.is_pro;
  if (isFree) redirect("/dashboard/billing");

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
