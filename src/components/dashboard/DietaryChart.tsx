"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const COLORS = [
  "#8b6914",
  "#c9a96e",
  "#e0cda7",
  "#a0a0a0",
  "#d4a574",
  "#b8c5b0",
  "#d4a5a5",
  "#6b8f89",
];

export function DietaryChart({ eventId }: { eventId: string }) {
  const [data, setData] = useState<{ name: string; value: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function fetch() {
      const { data: guests } = await supabase
        .from("guests")
        .select("dietary_restrictions")
        .eq("event_id", eventId)
        .eq("status", "accepted")
        .not("dietary_restrictions", "is", null);

      if (guests && guests.length > 0) {
        // Count dietary restrictions
        const counts: Record<string, number> = {};
        for (const g of guests) {
          const key = g.dietary_restrictions || "Unspecified";
          counts[key] = (counts[key] || 0) + 1;
        }
        setData(
          Object.entries(counts).map(([name, value]) => ({ name, value })),
        );
      }

      setLoading(false);
    }

    fetch();

    // Subscribe to realtime changes
    const channel = supabase
      .channel(`dietary-${eventId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "guests", filter: `event_id=eq.${eventId}` },
        () => fetch(),
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [eventId]);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Dietary Breakdown</CardTitle>
          <CardDescription>Loading...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Dietary Breakdown</CardTitle>
          <CardDescription>
            No dietary data yet. Guest preferences will appear here as they
            RSVP.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Dietary Breakdown</CardTitle>
        <CardDescription>
          Meal preferences of attending guests
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={3}
              dataKey="value"
            >
              {data.map((_, i) => (
                <Cell
                  key={i}
                  fill={COLORS[i % COLORS.length]}
                  stroke="none"
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
