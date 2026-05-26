"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CountdownTimer } from "./CountdownTimer";

type EnvelopeState = "sealed" | "opening" | "open";

interface EnvelopeUXProps {
  eventTitle: string;
  eventType: string;
  hostName?: string;
  coverImage?: string;
  eventDate?: Date;
  children: React.ReactNode;
}

const floatingParticles = Array.from({ length: 12 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  delay: Math.random() * 1.5,
  duration: Math.random() * 2 + 2,
  size: Math.random() * 4 + 2,
  opacity: Math.random() * 0.3 + 0.1,
}));

export function EnvelopeUX({
  eventTitle,
  eventType,
  hostName,
  coverImage,
  eventDate,
  children,
}: EnvelopeUXProps) {
  const [state, setState] = useState<EnvelopeState>("sealed");

  const handleSealClick = useCallback(() => {
    if (state === "sealed") {
      setState("opening");
    }
  }, [state]);

  if (state === "open") {
    return (
      <div className="relative flex min-h-screen items-start justify-center bg-stone-100 px-4 py-8 sm:py-16">
        {/* Floating particles background */}
        <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden>
          {floatingParticles.map((p) => (
            <motion.div
              key={p.id}
              className="absolute rounded-full"
              style={{
                left: `${p.x}%`,
                bottom: -10,
                width: p.size,
                height: p.size,
                backgroundColor: "#c9a96e",
              }}
              initial={{ y: 0, opacity: 0 }}
              animate={{
                y: -(window.innerHeight * 0.8),
                opacity: [0, p.opacity, 0],
              }}
              transition={{
                duration: p.duration,
                delay: p.delay,
                repeat: Infinity,
                ease: "linear",
              }}
            />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-full max-w-lg"
        >
          {eventDate && (
            <div className="mb-8">
              <p className="mb-3 text-center text-xs tracking-[0.2em] text-stone-400 uppercase">
                The celebration begins in
              </p>
              <CountdownTimer eventDate={eventDate} />
            </div>
          )}
          {children}
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-stone-100 px-4">
      <div className="relative w-full max-w-md">
        {/* Envelope Body */}
        <motion.div
          className="relative overflow-hidden rounded-xl shadow-2xl"
          style={{ aspectRatio: "4/3", background: "#f7f3ed" }}
          animate={
            state === "opening"
              ? { scale: 1.02 }
              : { scale: 1 }
          }
        >
          {/* Envelope texture */}
          <div className="absolute inset-0 bg-[radial-gradient(#d4c5b2_1px,transparent_1px)] bg-[length:20px_20px] opacity-20" />

          {/* Cover Image or gradient */}
          {coverImage ? (
            <img
              src={coverImage}
              alt=""
              className="absolute inset-0 h-full w-full object-cover opacity-30"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-stone-200 via-stone-100 to-amber-100/50" />
          )}

          {/* Envelope border */}
          <div className="absolute inset-3 rounded-lg border border-stone-300/50" />

          {/* Envelope liner */}
          <div className="absolute inset-6 rounded bg-gradient-to-br from-amber-100/40 via-transparent to-stone-200/30" />

          {/* Event preview text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center p-8 opacity-60">
            {hostName && (
              <p className="mb-1 font-serif text-xs tracking-[0.2em] text-stone-500 uppercase">
                {hostName}
              </p>
            )}
            <p className="font-serif text-lg italic text-stone-600">
              {eventTitle}
            </p>
            <p className="mt-1 text-xs tracking-wider text-stone-500 capitalize">
              {eventType}
            </p>
          </div>

          {/* Envelope Flap */}
          <motion.div
            className="absolute top-0 left-0 right-0 z-10 origin-top"
            style={{ height: "55%" }}
            animate={
              state === "opening"
                ? {
                    rotateX: -180,
                    transition: { delay: 0.35, duration: 1.2, ease: [0.76, 0, 0.24, 1] },
                  }
                : { rotateX: 0 }
            }
          >
            {/* Flap triangle */}
            <div
              className="h-full w-full rounded-b-none rounded-t-xl shadow-md"
              style={{
                background: "linear-gradient(180deg, #e8dccf 0%, #dfceb8 100%)",
                clipPath: "polygon(0 0, 50% 100%, 100% 0)",
              }}
            >
              <div className="absolute inset-0 rounded-t-xl bg-[radial-gradient(#c4b393_1px,transparent_1px)] bg-[length:16px_16px] opacity-20" />
            </div>

            {/* Wax Seal */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2">
              <motion.button
                animate={
                  state === "opening"
                    ? { scale: 0, opacity: 0 }
                    : { scale: 1, opacity: 1 }
                }
                transition={{ duration: 0.25 }}
                whileHover={state === "sealed" ? { scale: 1.08 } : undefined}
                whileTap={state === "sealed" ? { scale: 0.95 } : undefined}
                onClick={handleSealClick}
                className="relative flex h-16 w-16 cursor-pointer items-center justify-center rounded-full shadow-lg"
                style={{
                  background:
                    "radial-gradient(circle at 40% 40%, #c9a96e, #8b6914)",
                }}
                aria-label="Open invitation"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-amber-300/40 bg-amber-100/10">
                  <span className="font-serif text-xl text-amber-100 drop-shadow">
                    ✦
                  </span>
                </div>
                <div className="absolute top-2 left-2 h-4 w-4 rounded-full bg-white/15 blur-[2px]" />
              </motion.button>
            </div>
          </motion.div>
        </motion.div>

        {/* Instruction text */}
        <motion.p
          animate={
            state === "opening"
              ? { opacity: 0 }
              : { opacity: 1 }
          }
          transition={{ delay: 0.8 }}
          className="mt-6 text-center font-serif text-sm italic text-stone-500"
        >
          Tap the wax seal to open your invitation
        </motion.p>

        {/* Card sliding out after flap opens */}
        <AnimatePresence>
          {state === "opening" && (
            <motion.div
              initial={{ opacity: 0, y: -60 }}
              animate={{ opacity: 1, y: -20 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 1.5, duration: 0.7, ease: "easeOut" }}
              onAnimationComplete={() => setState("open")}
              className="absolute bottom-0 left-4 right-4 z-20 rounded-t-lg bg-white p-6 shadow-xl"
            >
              <p className="text-center font-serif text-lg italic text-stone-400">
                Opening...
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
