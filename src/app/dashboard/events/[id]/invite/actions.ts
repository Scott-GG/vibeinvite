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
    .select("id, first_name, last_name, email, access_token")
    .eq("event_id", eventId)
    .not("email", "is", null);

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
  const results: PromiseSettledResult<unknown>[] = [];
  for (const guest of guests) {
    const result = await Promise.allSettled([
      sendInvitationEmail({
        to: guest.email!,
        guestName: guest.first_name,
        eventTitle: event.title,
        eventDate,
        eventLocation: event.location_name ?? undefined,
        inviteUrl: `${baseUrl}/invitation/${guest.access_token}`,
        hostName,
        theme,
      }),
    ]);
    results.push(result[0]);
    // 150ms delay between sends to stay under Resend's 10/s limit
    await new Promise((r) => setTimeout(r, 150));
  }

  const succeeded = results.filter((r) => r.status === "fulfilled").length;
  const failed = results.filter((r) => r.status === "rejected").length;

  revalidatePath(`/dashboard/events/${eventId}/invite`);
  return { succeeded, failed };
}
