"use server";

import { revalidatePath } from "next/cache";
import { createClient, getUserSafe } from "@/lib/supabase/server";
import { Resend } from "resend";

const RESEND_FROM =
  process.env.RESEND_FROM_ADDRESS ?? "VibeInvite <onboarding@resend.dev>";

export async function addGuest(eventId: string, formData: FormData) {
  const supabase = await createClient();

  const first_name = formData.get("first_name") as string;
  const last_name = formData.get("last_name") as string;
  const email = formData.get("email") as string;
  const phone = formData.get("phone") as string;
  const plus_one_allowed = formData.get("plus_one_allowed") === "on";
  const dietary_restrictions = formData.get("dietary_restrictions") as string;
  const table_number = formData.get("table_number") as string;
  const notes = formData.get("notes") as string;

  const { error } = await supabase.from("guests").insert({
    event_id: eventId,
    first_name,
    last_name,
    email: email || null,
    phone: phone || null,
    plus_one_allowed,
    dietary_restrictions: dietary_restrictions || null,
    custom_responses: {
      table_number: table_number ? parseInt(table_number) : null,
      notes: notes || null,
    },
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
  const dietary_restrictions = formData.get("dietary_restrictions") as string;
  const table_number = formData.get("table_number") as string;
  const notes = formData.get("notes") as string;

  const { error } = await supabase
    .from("guests")
    .update({
      first_name,
      last_name,
      email: email || null,
      phone: phone || null,
      plus_one_allowed,
      dietary_restrictions: dietary_restrictions || null,
      custom_responses: {
        table_number: table_number ? parseInt(table_number) : null,
        notes: notes || null,
      },
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
  guests: { first_name: string; last_name: string; email?: string; phone?: string; dietary_restrictions?: string; table_number?: number }[],
) {
  const supabase = await createClient();

  const { error } = await supabase.from("guests").insert(
    guests.map((g) => ({
      event_id: eventId,
      first_name: g.first_name,
      last_name: g.last_name,
      email: g.email || null,
      phone: g.phone || null,
      dietary_restrictions: g.dietary_restrictions || null,
      custom_responses: {
        table_number: g.table_number || null,
      },
    })),
  );

  if (error) throw new Error(error.message);
  revalidatePath(`/dashboard/events/${eventId}/guests`);
}

export async function sendReminders(eventId: string) {
  const supabase = await createClient();

  // Fetch event details
  const { data: event } = await supabase
    .from("events")
    .select("title, event_date, config")
    .eq("id", eventId)
    .single();

  if (!event) throw new Error("Event not found");

  // Fetch pending guests who haven't been reminded in 24 hours
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

  const { data: pendingGuests } = await supabase
    .from("guests")
    .select("id, first_name, last_name, email, access_token, custom_responses")
    .eq("event_id", eventId)
    .eq("status", "pending")
    .not("email", "is", null);

  if (!pendingGuests || pendingGuests.length === 0) {
    throw new Error("No pending guests with email to remind");
  }

  // Filter out guests reminded within 24 hours
  const guestsToRemind = pendingGuests.filter((g) => {
    const responses = g.custom_responses as Record<string, unknown> | null;
    const lastReminded = responses?.last_reminded_at as string | undefined;
    if (!lastReminded) return true;
    return new Date(lastReminded) < new Date(oneDayAgo);
  });

  if (guestsToRemind.length === 0) {
    throw new Error("All pending guests were reminded within the last 24 hours");
  }

  // Send reminder emails
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  for (const guest of guestsToRemind) {
    const inviteLink = `${baseUrl}/invitation/${guest.access_token}`;

    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: RESEND_FROM,
      to: guest.email!,
      subject: `Reminder: You're invited to ${event.title}`,
      html: `
        <div style="font-family: Georgia, serif; max-width: 480px; margin: 0 auto;">
          <h2 style="color: #444;">Just a friendly reminder</h2>
          <p>Hi ${guest.first_name},</p>
          <p>This is a gentle reminder that you haven't RSVP'd to <strong>${event.title}</strong> yet. We'd love to know if you can make it!</p>
          <p style="margin: 24px 0;">
            <a href="${inviteLink}" style="background: #292524; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 500;">
              View Invitation & RSVP
            </a>
          </p>
          <p style="color: #888; font-size: 14px;">
            Event date: ${new Date(event.event_date).toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </p>
          <hr style="border: none; border-top: 1px solid #e8e8e8; margin: 24px 0;" />
          <p style="color: #aaa; font-size: 12px;">
            Sent via VibeInvite — beautiful digital invitations
          </p>
        </div>
      `,
    });

    // Record reminder send time
    const currentResponses = (guest.custom_responses as Record<string, unknown>) ?? {};
    await supabase
      .from("guests")
      .update({
        custom_responses: {
          ...currentResponses,
          last_reminded_at: new Date().toISOString(),
        },
      })
      .eq("id", guest.id);
  }

  revalidatePath(`/dashboard/events/${eventId}/guests`);
}
