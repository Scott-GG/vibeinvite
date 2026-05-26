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
  eventLocation?: string;
  plusOneAllowed: boolean;
  theme: string;
  coverImage?: string;
}

export function InvitationClient({
  guestId,
  guestName,
  eventTitle,
  eventType,
  eventDate,
  eventLocation,
  plusOneAllowed,
  theme: _theme,
  coverImage,
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
    >
      <RsvpForm
        guestName={guestName}
        plusOneAllowed={plusOneAllowed}
        dietaryOptions={dietaryOptions}
        eventTitle={eventTitle}
        eventDate={eventDate}
        eventLocation={eventLocation}
        onSubmit={handleRsvp}
      />
    </EnvelopeUX>
  );
}
