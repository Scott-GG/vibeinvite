"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface Stats {
  total: number;
  attending: number;
  declined: number;
  pending: number;
}

export function RealtimeStats({
  eventId,
  initialStats,
}: {
  eventId: string;
  initialStats: Stats;
}) {
  const [stats, setStats] = useState<Stats>(initialStats);
  const supabase = createClient();

  useEffect(() => {
    const channel = supabase
      .channel(`guests-${eventId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "guests",
          filter: `event_id=eq.${eventId}`,
        },
        async () => {
          // Re-fetch counts on any change
          const { data } = await supabase
            .from("guests")
            .select("status", { count: "exact" })
            .eq("event_id", eventId);

          if (data) {
            setStats({
              total: data.length,
              attending: data.filter((g) => g.status === "accepted").length,
              declined: data.filter((g) => g.status === "declined").length,
              pending: data.filter((g) => g.status === "pending").length,
            });
          }
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [eventId]);

  return (
    <div className="grid gap-4 sm:grid-cols-4">
      {[
        { label: "Total Invited", value: stats.total, color: "text-stone-900" },
        { label: "Attending", value: stats.attending, color: "text-emerald-600" },
        { label: "Declined", value: stats.declined, color: "text-rose-600" },
        { label: "Pending", value: stats.pending, color: "text-amber-600" },
      ].map((s) => (
        <Card key={s.label}>
          <CardHeader className="pb-2">
            <CardDescription>{s.label}</CardDescription>
            <CardTitle className={`text-3xl ${s.color}`}>
              {s.value}
            </CardTitle>
          </CardHeader>
        </Card>
      ))}
    </div>
  );
}
