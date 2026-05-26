"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CountdownTimer } from "./CountdownTimer";
import { getTheme, type ThemeConfig } from "@/lib/themes";

type EnvelopeState = "sealed" | "opening" | "open";

interface EnvelopeUXProps {
  eventTitle: string;
  eventType: string;
  hostName?: string;
  coverImage?: string;
  eventDate?: Date;
  theme?: string;
  children: React.ReactNode;
}

export function EnvelopeUX({
  eventTitle,
  eventType,
  hostName,
  coverImage,
  eventDate,
  theme: themeId = "classic",
  children,
}: EnvelopeUXProps) {
  const [state, setState] = useState<EnvelopeState>("sealed");
  const [mounted, setMounted] = useState(false);
  const t: ThemeConfig = getTheme(themeId);
  const isDark = themeId === "midnight";

  useEffect(() => {
    setMounted(true);
  }, []);

  const floatingParticles = useMemo(
    () =>
      Array.from({ length: 12 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        delay: Math.random() * 1.5,
        duration: Math.random() * 2 + 2,
        size: Math.random() * 4 + 2,
        opacity: Math.random() * 0.3 + 0.1,
      })),
    [],
  );

  const handleSealClick = useCallback(() => {
    if (state === "sealed") {
      setState("opening");
    }
  }, [state]);

  if (state === "open") {
    return (
      <div
        className={`relative flex min-h-screen items-start justify-center px-4 py-8 sm:py-16 ${t.openBg}`}
        style={{
          background: `linear-gradient(135deg, var(--tw-gradient-stops))`,
        }}
      >
        {/* Floating particles */}
        {mounted && (
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
                  backgroundColor: t.particleColor,
                }}
                initial={{ y: 0, opacity: 0 }}
                animate={{
                  y: "-80vh",
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
        )}

        {/* Hero: cover image or themed gradient banner */}
        {coverImage ? (
          <div className="absolute top-0 left-0 right-0 h-64 overflow-hidden">
            <img
              src={coverImage}
              alt=""
              className="h-full w-full object-cover opacity-40"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-transparent" />
          </div>
        ) : (
          <div
            className={`absolute top-0 left-0 right-0 h-48 bg-gradient-to-b ${t.heroGradient}`}
          />
        )}

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative z-10 w-full max-w-lg"
        >
          {eventDate && (
            <div className="mb-8">
              <p
                className={`mb-3 text-center text-xs tracking-[0.2em] uppercase ${t.cardSubtitle}`}
              >
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
    <div
      className={`flex min-h-screen items-center justify-center px-4 ${t.openBg}`}
    >
      <div className="relative w-full max-w-md">
        {/* Envelope Body */}
        <motion.div
          className="relative overflow-hidden rounded-xl shadow-2xl"
          style={{ aspectRatio: "4/3", backgroundColor: t.envelopeBg }}
          animate={
            state === "opening"
              ? { scale: 1.02 }
              : { scale: 1 }
          }
        >
          {/* Envelope texture */}
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `radial-gradient(${t.envelopeTexture} 1px, transparent 1px)`,
              backgroundSize: "20px 20px",
            }}
          />

          {/* Cover Image or gradient */}
          {coverImage ? (
            <img
              src={coverImage}
              alt=""
              className="absolute inset-0 h-full w-full object-cover opacity-30"
            />
          ) : (
            <div
              className={`absolute inset-0 bg-gradient-to-br ${t.heroGradient}`}
            />
          )}

          {/* Envelope border */}
          <div
            className="absolute inset-3 rounded-lg border"
            style={{ borderColor: t.envelopeBorder }}
          />

          {/* Envelope liner */}
          <div
            className={`absolute inset-6 rounded bg-gradient-to-br ${t.envelopeLiner}`}
          />

          {/* Event preview text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center p-8 opacity-60">
            {hostName && (
              <p
                className={`mb-1 text-xs tracking-[0.2em] uppercase ${t.cardSubtitle}`}
                style={{ fontFamily: t.fontClass === "font-sans" ? undefined : "serif" }}
              >
                {hostName}
              </p>
            )}
            <p
              className={`text-lg italic ${t.cardTitle}`}
              style={{ fontFamily: t.fontClass === "font-sans" ? undefined : "serif" }}
            >
              {eventTitle}
            </p>
            <p
              className={`mt-1 text-xs tracking-wider capitalize ${t.cardSubtitle}`}
            >
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
                background: t.envelopeFlap,
                clipPath: "polygon(0 0, 50% 100%, 100% 0)",
              }}
            >
              <div
                className="absolute inset-0 rounded-t-xl opacity-20"
                style={{
                  backgroundImage: `radial-gradient(${t.envelopeFlapTexture} 1px, transparent 1px)`,
                  backgroundSize: "16px 16px",
                }}
              />
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
                style={{ background: t.sealOuter }}
                aria-label="Open invitation"
              >
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full border ${t.sealInner}`}
                >
                  <span className={`font-serif text-xl drop-shadow ${t.sealIcon}`}>
                    ✦
                  </span>
                </div>
                <div
                  className={`absolute top-2 left-2 h-4 w-4 rounded-full blur-[2px] ${t.sealHighlight}`}
                />
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
          className={`mt-6 text-center font-serif text-sm italic ${isDark ? "text-stone-400" : "text-stone-500"}`}
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
              className={`absolute bottom-0 left-4 right-4 z-20 rounded-t-lg p-6 shadow-xl ${t.cardBg}`}
            >
              <p
                className={`text-center text-lg italic ${t.cardSubtitle}`}
                style={{ fontFamily: t.fontClass === "font-sans" ? undefined : "serif" }}
              >
                Opening...
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
