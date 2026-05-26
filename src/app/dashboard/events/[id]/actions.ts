"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function saveInvitationMessage(eventId: string, message: string) {
  const supabase = await createClient();

  // Fetch current config
  const { data: event } = await supabase
    .from("events")
    .select("config")
    .eq("id", eventId)
    .single();

  const currentConfig =
    typeof event?.config === "object" && event.config !== null
      ? (event.config as Record<string, unknown>)
      : {};

  const { error } = await supabase
    .from("events")
    .update({
      config: { ...currentConfig, invitation_message: message },
    })
    .eq("id", eventId);

  if (error) throw new Error(error.message);

  revalidatePath(`/dashboard/events/${eventId}`);
  revalidatePath(`/invitation/[token]`, "layout");
}
