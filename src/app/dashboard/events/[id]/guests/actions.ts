"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function addGuest(eventId: string, formData: FormData) {
  const supabase = await createClient();

  const first_name = formData.get("first_name") as string;
  const last_name = formData.get("last_name") as string;
  const email = formData.get("email") as string;
  const phone = formData.get("phone") as string;
  const plus_one_allowed = formData.get("plus_one_allowed") === "on";

  const { error } = await supabase.from("guests").insert({
    event_id: eventId,
    first_name,
    last_name,
    email: email || null,
    phone: phone || null,
    plus_one_allowed,
  });

  if (error) throw new Error(error.message);
  revalidatePath(`/dashboard/events/${eventId}/guests`);
}

export async function updateGuest(
  eventId: string,
  guestId: string,
  formData: FormData,
) {
  const supabase = await createClient();

  const first_name = formData.get("first_name") as string;
  const last_name = formData.get("last_name") as string;
  const email = formData.get("email") as string;
  const phone = formData.get("phone") as string;
  const plus_one_allowed = formData.get("plus_one_allowed") === "on";

  const { error } = await supabase
    .from("guests")
    .update({
      first_name,
      last_name,
      email: email || null,
      phone: phone || null,
      plus_one_allowed,
    })
    .eq("id", guestId);

  if (error) throw new Error(error.message);
  revalidatePath(`/dashboard/events/${eventId}/guests`);
}

export async function deleteGuest(eventId: string, guestId: string) {
  const supabase = await createClient();

  const { error } = await supabase.from("guests").delete().eq("id", guestId);
  if (error) throw new Error(error.message);
  revalidatePath(`/dashboard/events/${eventId}/guests`);
}

export async function importGuests(
  eventId: string,
  guests: { first_name: string; last_name: string; email?: string; phone?: string }[],
) {
  const supabase = await createClient();

  const { error } = await supabase.from("guests").insert(
    guests.map((g) => ({
      event_id: eventId,
      first_name: g.first_name,
      last_name: g.last_name,
      email: g.email || null,
      phone: g.phone || null,
    })),
  );

  if (error) throw new Error(error.message);
  revalidatePath(`/dashboard/events/${eventId}/guests`);
}
