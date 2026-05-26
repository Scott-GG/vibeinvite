"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function addTable(
  eventId: string,
  data: { table_name: string; capacity: number },
) {
  const supabase = await createClient();

  const { error } = await supabase.from("tables").insert({
    event_id: eventId,
    table_name: data.table_name,
    capacity: data.capacity,
  });

  if (error) throw new Error(error.message);
  revalidatePath(`/dashboard/events/${eventId}/seating`);
}

export async function removeTable(eventId: string, tableId: string) {
  const supabase = await createClient();

  // Unassign guests first
  await supabase
    .from("guests")
    .update({ table_id: null })
    .eq("table_id", tableId);

  const { error } = await supabase
    .from("tables")
    .delete()
    .eq("id", tableId);

  if (error) throw new Error(error.message);
  revalidatePath(`/dashboard/events/${eventId}/seating`);
}

export async function assignGuestToTable(
  eventId: string,
  guestId: string,
  tableId: string | null,
) {
  const supabase = await createClient();

  if (tableId) {
    // Check capacity
    const { data: table } = await supabase
      .from("tables")
      .select("capacity")
      .eq("id", tableId)
      .single();

    if (table) {
      const { count } = await supabase
        .from("guests")
        .select("*", { count: "exact", head: true })
        .eq("table_id", tableId);

      if (count !== null && count >= table.capacity) {
        throw new Error("Table is full");
      }
    }
  }

  const { error } = await supabase
    .from("guests")
    .update({ table_id: tableId })
    .eq("id", guestId);

  if (error) throw new Error(error.message);
  revalidatePath(`/dashboard/events/${eventId}/seating`);
}
