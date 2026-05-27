"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { sendInvitationEmail } from "@/lib/email";

export async function sendToGuest(
  eventId: string,
  guestId: string,
  hostName?: string,
  theme?: string,
) {
  const supabase = await createClient();

  const { data: guest } = await supabase
    .from("guests")
    .select("first_name, last_name, email, access_token")
    .eq("id", guestId)
    .single();

  if (!guest || !guest.email) {
    throw new Error("Guest has no email address");
  }

  const { data: event } = await supabase
    .from("events")
    .select("title, event_date, location_name")
    .eq("id", eventId)
    .single();

  if (!event) throw new Error("Event not found");

  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const inviteUrl = `${baseUrl}/invitation/${guest.access_token}`;

  const eventDate = new Date(event.event_date).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  await sendInvitationEmail({
    to: guest.email,
    guestName: guest.first_name,
    eventTitle: event.title,
    eventDate,
    eventLocation: event.location_name ?? undefined,
    inviteUrl,
    hostName,
    theme,
  });

  revalidatePath(`/dashboard/events/${eventId}/invite`);
}

export async function sendToAll(
  eventId: string,
  hostName?: string,
  theme?: string,
) {
  const supabase = await createClient();

  const { data: event } = await supabase
    .from("events")
    .select("title, event_date, location_name")
    .eq("id", eventId)
    .single();

  if (!event) throw new Error("Event not found");

  const { data: guests } = await supabase
    .from("guests")
    .select("id, first_name, last_name, email, access_token, status")
    .eq("event_id", eventId)
    .not("email", "is", null)
    .neq("status", "sent");

  if (!guests || guests.length === 0) {
    throw new Error("No guests with email addresses to send to");
  }

  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  const eventDate = new Date(event.event_date).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Send sequentially with a small delay to respect Resend rate limits
  let succeeded = 0;
  let failed = 0;
  for (const guest of guests) {
    try {
      await sendInvitationEmail({
        to: guest.email!,
        guestName: guest.first_name,
        eventTitle: event.title,
        eventDate,
        eventLocation: event.location_name ?? undefined,
        inviteUrl: `${baseUrl}/invitation/${guest.access_token}`,
        hostName,
        theme,
      });

      // Mark as sent
      await supabase
        .from("guests")
        .update({ status: "sent", updated_at: new Date().toISOString() })
        .eq("id", guest.id);

      succeeded++;
    } catch {
      failed++;
    }
    // 800ms delay between sends — Resend free tier limits to ~1-2/s
    await new Promise((r) => setTimeout(r, 800));
  }

  revalidatePath(`/dashboard/events/${eventId}/invite`);
  return { succeeded, failed };
}

export async function scheduleSend(eventId: string, scheduledAt: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("events")
    .update({ scheduled_send_at: scheduledAt })
    .eq("id", eventId)
    .select("scheduled_send_at")
    .single();

  if (error) throw new Error(error.message);

  revalidatePath(`/dashboard/events/${eventId}/invite`);
  return { scheduledAt: data.scheduled_send_at };
}

export async function cancelScheduledSend(eventId: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("events")
    .update({ scheduled_send_at: null })
    .eq("id", eventId);

  if (error) throw new Error(error.message);

  revalidatePath(`/dashboard/events/${eventId}/invite`);
}
