"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export interface RsvpPayload {
  guestId: string;
  status: "accepted" | "declined";
  plus_one_name?: string;
  dietary_restrictions?: string;
}

export async function submitRsvp(payload: RsvpPayload) {
  const supabase = await createClient();

  const update: Record<string, unknown> = {
    status: payload.status,
    updated_at: new Date().toISOString(),
  };

  if (payload.status === "accepted") {
    if (payload.plus_one_name) {
      update.plus_one_count = 1;
    }
    if (payload.dietary_restrictions) {
      update.dietary_restrictions = payload.dietary_restrictions;
    }
  }

  const { error } = await supabase
    .from("guests")
    .update(update)
    .eq("id", payload.guestId);

  if (error) throw new Error(error.message);

  revalidatePath(`/invitation/${payload.guestId}`);
}
