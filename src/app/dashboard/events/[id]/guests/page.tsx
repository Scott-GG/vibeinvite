import Link from "next/link";
import { ArrowLeft, Plus, Send, Trash2, UserPlus } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/server";
import { GuestTable } from "./guest-table";

export default async function GuestsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: event } = await supabase
    .from("events")
    .select("title, is_pro")
    .eq("id", id)
    .eq("user_id", user!.id)
    .single();

  // Check subscription tier
  const { data: profile } = await supabase
    .from("profiles")
    .select("subscription_tier")
    .eq("id", user!.id)
    .single();

  const isFree = (profile?.subscription_tier ?? "free") === "free" && !event?.is_pro;
  const MAX_FREE_GUESTS = 15;

  const { data: guests } = await supabase
    .from("guests")
    .select("*")
    .eq("event_id", id)
    .order("first_name", { ascending: true });

  const guestCount = guests?.length ?? 0;
  const canAddMore = !isFree || guestCount < MAX_FREE_GUESTS;

  const stats = {
    total: guests?.length ?? 0,
    attending: guests?.filter((g) => g.status === "accepted").length ?? 0,
    declined: guests?.filter((g) => g.status === "declined").length ?? 0,
    pending: guests?.filter((g) => g.status === "pending").length ?? 0,
  };

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
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
            {event?.title ?? "Event"} — Guest List
          </h1>
          <p className="text-muted-foreground">
            Manage your guests and track RSVPs
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            href={`/dashboard/events/${id}/invite`}
            className={buttonVariants({ variant: "outline" })}
          >
            <Send className="mr-2 h-4 w-4" />
            Send Invites
          </Link>
        </div>
      </div>

      {/* Stats cards */}
      <div className="mb-6 grid grid-cols-4 gap-3">
        {[
          { label: "Total", value: stats.total, color: "text-stone-900" },
          { label: "Attending", value: stats.attending, color: "text-emerald-600" },
          { label: "Declined", value: stats.declined, color: "text-rose-600" },
          { label: "Pending", value: stats.pending, color: "text-amber-600" },
        ].map((s) => (
          <Card key={s.label}>
            <CardHeader className="p-3 pb-1">
              <CardDescription className="text-xs">{s.label}</CardDescription>
              <CardTitle className={`text-xl ${s.color}`}>{s.value}</CardTitle>
            </CardHeader>
          </Card>
        ))}
      </div>

      {/* Guest list */}
      {isFree && guestCount >= MAX_FREE_GUESTS && (
        <div className="mb-4 rounded-lg bg-amber-50 p-3 text-sm text-amber-800">
          You&apos;ve reached the 15-guest limit on the Free plan.{" "}
          <a href="/dashboard/billing" className="font-medium underline">
            Upgrade to add more guests
          </a>
          .
        </div>
      )}
      <GuestTable eventId={id} guests={guests ?? []} canAddMore={canAddMore} />
    </div>
  );
}
