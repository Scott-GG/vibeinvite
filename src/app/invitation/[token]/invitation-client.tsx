"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";
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
  const [loading, setLoading] = useState(true);
  const [phase, setPhase] = useState<"logo" | "reveal">("logo");

  useEffect(() => {
    // Premium loading sequence
    const t1 = setTimeout(() => setPhase("reveal"), 1200);
    const t2 = setTimeout(() => setLoading(false), 2200);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  async function handleRsvp(data: RsvpFormData) {
    await submitRsvp({
      guestId,
      status: data.status,
      plus_one_name: data.plus_one_name,
      dietary_restrictions: data.dietary_restrictions,
    });
  }

  // Loading screen
  if (loading) {
    return (
      <div
        className="fixed inset-0 z-50 flex flex-col items-center justify-center"
        style={{ background: "#1A1410" }}
      >
        <AnimatePresence mode="wait">
          {phase === "logo" && (
            <motion.div
              key="logo"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <motion.div
                animate={{ opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="mx-auto mb-6 flex h-16 w-16 items-center justify-center"
              >
                <Sparkles className="h-8 w-8" style={{ color: "#C9A84C" }} />
              </motion.div>
              <h1
                className="font-display text-3xl tracking-wider"
                style={{ color: "#C9A84C" }}
              >
                VibeInvite
              </h1>
              <p
                className="mt-3 font-script text-lg"
                style={{ color: "#8B7355" }}
              >
                Something beautiful has arrived...
              </p>
            </motion.div>
          )}

          {phase === "reveal" && (
            <motion.div
              key="reveal"
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="text-center"
            >
              <div
                className="mx-auto h-36 w-56 overflow-hidden rounded-2xl shadow-2xl"
                style={{
                  background: "linear-gradient(180deg, #2A2520 0%, #1A1510 100%)",
                  border: "1px solid rgba(201,168,76,0.2)",
                }}
              >
                {/* Mini envelope preview */}
                <div className="relative h-full w-full">
                  <div
                    className="absolute inset-0 opacity-10"
                    style={{
                      backgroundImage: "radial-gradient(#C9A84C 1px, transparent 1px)",
                      backgroundSize: "14px 14px",
                    }}
                  />
                  {/* Seal */}
                  <div className="absolute bottom-1/3 left-1/2 z-10 -translate-x-1/2 translate-y-1/2">
                    <motion.div
                      className="flex h-12 w-12 items-center justify-center rounded-full shadow-lg"
                      style={{
                        background: "radial-gradient(circle at 35% 35%, #E8C96B 0%, #C9A84C 30%, #8B6914 70%, #5C4510 100%)",
                      }}
                      animate={{
                        boxShadow: [
                          "0 0 20px rgba(201,168,76,0.3)",
                          "0 0 40px rgba(201,168,76,0.6)",
                          "0 0 20px rgba(201,168,76,0.3)",
                        ],
                      }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <span className="font-serif text-base" style={{ color: "#FAF3E0" }}>V</span>
                    </motion.div>
                  </div>
                  {/* Flap */}
                  <div
                    className="absolute top-0 left-0 right-0"
                    style={{
                      height: "48%",
                      background: "linear-gradient(180deg, #3A3530 0%, #2A2520 100%)",
                      clipPath: "polygon(0 0, 50% 100%, 100% 0)",
                    }}
                  />
                </div>
              </div>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="mt-6 font-script text-xl italic"
                style={{ color: "#C9A84C" }}
              >
                You have a personal invitation
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
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
