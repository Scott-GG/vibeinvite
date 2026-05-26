import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { InvitationClient } from "./invitation-client";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const supabase = await createClient();

  const { data: guest } = await supabase
    .from("guests")
    .select("first_name, last_name, event_id")
    .eq("access_token", token)
    .single();

  if (!guest) return { title: "Invitation Not Found" };

  const { data: event } = await supabase
    .from("events")
    .select("title")
    .eq("id", guest.event_id)
    .single();

  return {
    title: `You are invited to ${event?.title ?? "an event"} — VibeInvite`,
    description: `${guest.first_name}, you are cordially invited. Open your premium digital invitation.`,
    openGraph: {
      title: "You are cordially invited...",
      description: `Open your invitation to ${event?.title ?? "a special event"}`,
    },
  };
}

export default async function InvitationPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const supabase = await createClient();

  const { data: guest } = await supabase
    .from("guests")
    .select("*")
    .eq("access_token", token)
    .single();

  if (!guest) notFound();

  const { data: event } = await supabase
    .from("events")
    .select("*")
    .eq("id", guest.event_id)
    .single();

  if (!event) notFound();

  const config =
    typeof event.config === "object" && event.config !== null
      ? (event.config as Record<string, unknown>)
      : {};

  const theme = (config?.theme as string) ?? "classic";
  const message = (config?.invitation_message as string) ?? undefined;
  const registryUrl = (config?.registry_url as string) ?? undefined;
  const dressCode = (config?.dress_code as string) ?? undefined;

  const eventDate = new Date(event.event_date);
  const eventTime = eventDate.getHours() !== 0 || eventDate.getMinutes() !== 0
    ? eventDate.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
      })
    : undefined;

  return (
    <InvitationClient
      guestId={guest.id}
      guestName={`${guest.first_name} ${guest.last_name}`}
      eventTitle={event.title}
      eventType={event.event_type}
      eventDate={eventDate.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })}
      eventDateRaw={eventDate}
      eventTime={eventTime}
      eventLocation={event.location_name ?? undefined}
      plusOneAllowed={guest.plus_one_allowed}
      theme={theme}
      coverImage={event.cover_image_url ?? undefined}
      message={message}
      registryUrl={registryUrl}
      dressCode={dressCode}
    />
  );
}
