import type { Metadata } from "next";
import LandingPage from "./landing-page";

export const metadata: Metadata = {
  title: "VibeInvite — Premium Digital Invitations | Wax-Sealed Envelopes",
  description:
    "Create stunning, paper-like digital invitations with wax-sealed envelope animations and effortless RSVP tracking. 6 designer themes, AI copywriting. Start free.",
  openGraph: {
    title: "VibeInvite — The Invitation Your Guests Will Remember",
    description:
      "Create stunning, paper-like digital invitations with wax-sealed envelope animations. 6 designer themes, AI copywriting, effortless RSVPs.",
  },
};

export default function Page() {
  return <LandingPage />;
}
