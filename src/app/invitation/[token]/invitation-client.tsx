"use client";

import { EnvelopeUX } from "@/components/invitation/EnvelopeUX";
import { RsvpForm, type RsvpFormData } from "@/components/invitation/RsvpForm";
import { submitRsvp } from "./actions";

const dietaryOptions = [
  "No restrictions",
  "Vegetarian",
  "Vegan",
  "Gluten-free",
  "Halal",
  "Kosher",
];

interface InvitationClientProps {
  guestId: string;
  guestName: string;
  eventTitle: string;
  eventType: string;
  eventDate: string;
  eventDateRaw: Date;
  eventTime?: string;
  eventLocation?: string;
  plusOneAllowed: boolean;
  theme: string;
  coverImage?: string;
  message?: string;
  registryUrl?: string;
  dressCode?: string;
}

export function InvitationClient({
  guestId,
  guestName,
  eventTitle,
  eventType,
  eventDate,
  eventDateRaw,
  eventTime,
  eventLocation,
  plusOneAllowed,
  theme,
  coverImage,
  message,
  registryUrl,
  dressCode,
}: InvitationClientProps) {
  async function handleRsvp(data: RsvpFormData) {
    await submitRsvp({
      guestId,
      status: data.status,
      plus_one_name: data.plus_one_name,
      dietary_restrictions: data.dietary_restrictions,
    });
  }

  return (
    <EnvelopeUX
      eventTitle={eventTitle}
      eventType={eventType}
      coverImage={coverImage}
      eventDate={eventDateRaw}
      theme={theme}
    >
      <RsvpForm
        guestName={guestName}
        plusOneAllowed={plusOneAllowed}
        dietaryOptions={dietaryOptions}
        eventTitle={eventTitle}
        eventDate={eventDate}
        eventTime={eventTime}
        eventLocation={eventLocation}
        message={message}
        coverImage={coverImage}
        registryUrl={registryUrl}
        dressCode={dressCode}
        theme={theme}
        onSubmit={handleRsvp}
      />
    </EnvelopeUX>
  );
}
