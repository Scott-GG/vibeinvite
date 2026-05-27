import { createClient } from "@supabase/supabase-js";
import { sendInvitationEmail } from "@/lib/email";

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  const secret = process.env.CRON_SECRET;

  if (!secret) {
    return Response.json({ error: "CRON_SECRET not configured" }, { status: 500 });
  }

  if (authHeader !== `Bearer ${secret}`) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Use service role for cron since there's no user session
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );

  const now = new Date().toISOString();

  // Find all events whose scheduled time has arrived
  const { data: events, error: eventError } = await supabase
    .from("events")
    .select("id, title, event_date, location_name, user_id, config")
    .not("scheduled_send_at", "is", null)
    .lte("scheduled_send_at", now);

  if (eventError) {
    return Response.json({ error: eventError.message }, { status: 500 });
  }

  if (!events || events.length === 0) {
    return Response.json({ processed_events: 0, sent_guests: 0 });
  }

  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  let totalSent = 0;

  for (const event of events) {
    // Get guests with emails that haven't been sent yet
    const { data: guests, error: guestError } = await supabase
      .from("guests")
      .select("id, first_name, last_name, email, access_token")
      .eq("event_id", event.id)
      .not("email", "is", null)
      .neq("status", "sent");

    if (guestError || !guests || guests.length === 0) {
      // Clear schedule if no guests to send to
      await supabase
        .from("events")
        .update({ scheduled_send_at: null })
        .eq("id", event.id);
      continue;
    }

    const eventDate = new Date(event.event_date).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const themeConfig =
      typeof event.config === "object" && event.config !== null
        ? (event.config as Record<string, unknown>)
        : {};
    const theme = (themeConfig?.theme as string) ?? "classic";

    // Get host name from profile
    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name")
      .eq("id", event.user_id)
      .single();

    const hostName = profile?.full_name ?? undefined;

    // Send sequentially with delay to respect Resend rate limits
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

        // Mark this guest as sent
        await supabase
          .from("guests")
          .update({ status: "sent", updated_at: now })
          .eq("id", guest.id);

        totalSent++;
      } catch {
        // Skip failed sends — they'll be retried on next cron tick
        continue;
      }

      // 800ms delay between sends
      await new Promise((r) => setTimeout(r, 800));
    }

    // Clear the scheduled time so we don't resend
    await supabase
      .from("events")
      .update({ scheduled_send_at: null })
      .eq("id", event.id);
  }

  return Response.json({
    processed_events: events.length,
    sent_guests: totalSent,
  });
}
