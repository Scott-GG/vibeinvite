"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CountdownTimer } from "./CountdownTimer";
import { getTheme, type ThemeConfig } from "@/lib/themes";

type EnvelopeState = "sealed" | "cracking" | "opening" | "card-reveal" | "open";

interface EnvelopeUXProps {
  eventTitle: string;
  eventType: string;
  hostName?: string;
  coverImage?: string;
  eventDate?: Date;
  theme?: string;
  children: React.ReactNode;
}

// Crack line fragments for seal breaking animation
function generateCrackLines() {
  return Array.from({ length: 6 }, (_, i) => ({
    id: i,
    angle: (i / 6) * 360 + Math.random() * 30,
    length: 18 + Math.random() * 20,
    delay: Math.random() * 0.08,
  }));
}

// Seal fragments that fly outward
function generateFragments() {
  return Array.from({ length: 10 }, (_, i) => ({
    id: i,
    x: (Math.random() - 0.5) * 120,
    y: (Math.random() - 0.5) * 120,
    rotation: (Math.random() - 0.5) * 360,
    scale: 0.3 + Math.random() * 0.5,
    delay: Math.random() * 0.15,
  }));
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
      Array.from({ length: 15 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        delay: Math.random() * 2,
        duration: Math.random() * 3 + 3,
        size: Math.random() * 3 + 1,
        opacity: Math.random() * 0.3 + 0.05,
      })),
    [],
  );

  const crackLines = useMemo(() => generateCrackLines(), []);
  const fragments = useMemo(() => generateFragments(), []);

  const handleSealClick = useCallback(() => {
    if (state === "sealed") {
      setState("cracking");
      // Auto-advance through animation stages
      setTimeout(() => setState("opening"), 400);
      setTimeout(() => setState("card-reveal"), 950);
      setTimeout(() => setState("open"), 1550);
    }
  }, [state]);

  if (state === "open") {
    return (
      <div
        className="relative flex min-h-screen items-start justify-center px-4 py-8 sm:py-16"
        style={{ background: t.openBg }}
      >
        {/* Floating gold particles */}
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
                  y: "-100vh",
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

        {/* Hero banner */}
        {coverImage ? (
          <div className="absolute top-0 left-0 right-0 h-64 overflow-hidden">
            <img src={coverImage} alt="" className="h-full w-full object-cover opacity-40" />
          </div>
        ) : (
          <div className={`absolute top-0 left-0 right-0 h-48 bg-gradient-to-b ${t.heroGradient}`} />
        )}

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="relative z-10 w-full max-w-lg"
        >
          {eventDate && (
            <div className="mb-8">
              <p className={`mb-3 text-center font-sans text-xs tracking-[0.25em] uppercase ${t.cardSubtitle}`}>
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
      className="flex min-h-screen items-center justify-center px-4"
      style={{ background: t.openBg }}
    >
      <div className="relative w-full max-w-md">
        {/* ── Envelope Body ── */}
        <motion.div
          className="relative overflow-hidden rounded-2xl shadow-2xl"
          style={{ aspectRatio: "4/3", backgroundColor: t.envelopeBg }}
          animate={
            state === "cracking" || state === "opening" || state === "card-reveal"
              ? { scale: 1.02 }
              : { y: [0, -6, 0], scale: 1 }
          }
          transition={
            state === "sealed"
              ? { y: { duration: 3, repeat: Infinity, ease: "easeInOut" }, scale: { duration: 0 } }
              : { duration: 0.3 }
          }
        >
          {/* Texture layer */}
          <div
            className="absolute inset-0 opacity-[0.15]"
            style={{
              backgroundImage: `radial-gradient(${t.envelopeTexture} 1px, transparent 1px)`,
              backgroundSize: "20px 20px",
            }}
          />

          {/* Cover or gradient */}
          {coverImage ? (
            <img src={coverImage} alt="" className="absolute inset-0 h-full w-full object-cover opacity-30" />
          ) : (
            <div className={`absolute inset-0 bg-gradient-to-br ${t.heroGradient}`} />
          )}

          {/* Border */}
          <div className="absolute inset-3 rounded-lg border" style={{ borderColor: t.envelopeBorder }} />

          {/* Liner */}
          <div className={`absolute inset-6 rounded bg-gradient-to-br ${t.envelopeLiner}`} />

          {/* Preview text (visible behind flap) */}
          <div className="absolute inset-0 flex flex-col items-center justify-center p-8 opacity-50">
            {hostName && (
              <p className="mb-1 font-sans text-xs tracking-[0.2em] uppercase" style={{ color: isDark ? "#b0a090" : "#6b5744" }}>
                {hostName}
              </p>
            )}
            <p className="font-serif text-xl italic" style={{ color: isDark ? "#e0d5c0" : "#5c4c3c" }}>
              {eventTitle}
            </p>
            <p className="mt-1 font-sans text-xs tracking-wider capitalize" style={{ color: isDark ? "#b0a090" : "#6b5744" }}>
              {eventType}
            </p>
          </div>

          {/* ── Envelope Flap (3D perspective) ── */}
          <motion.div
            className="absolute top-0 left-0 right-0 z-10 origin-top"
            style={{ height: "55%", perspective: "800px" }}
            animate={
              state === "opening" || state === "card-reveal"
                ? { rotateX: -180 }
                : { rotateX: 0 }
            }
            transition={
              state === "opening" || state === "card-reveal"
                ? { delay: 0.05, duration: 1.2, ease: [0.76, 0, 0.24, 1] }
                : { duration: 0 }
            }
          >
            {/* Flap triangle shape */}
            <div
              className="h-full w-full shadow-md"
              style={{
                background: t.envelopeFlap,
                clipPath: "polygon(0 0, 50% 100%, 100% 0)",
                borderRadius: "12px 12px 0 0",
              }}
            >
              <div
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage: `radial-gradient(${t.envelopeFlapTexture} 1px, transparent 1px)`,
                  backgroundSize: "16px 16px",
                }}
              />
            </div>

            {/* ── Wax Seal ── */}
            <div className="absolute bottom-0 left-1/2 z-20 -translate-x-1/2 translate-y-1/2">
              <AnimatePresence>
                {(state === "sealed" || state === "cracking") && (
                  <motion.div className="relative flex h-20 w-20 items-center justify-center">
                    {/* Glow ring */}
                    <motion.div
                      className="absolute inset-0 rounded-full"
                      style={{ background: `radial-gradient(circle, ${t.particleColor}33 0%, transparent 100%)` }}
                      animate={
                        state === "cracking"
                          ? { scale: [1, 1.6, 0], opacity: [0.6, 0.8, 0] }
                          : { scale: [1, 1.08, 1], opacity: [0.5, 0.7, 0.5] }
                      }
                      transition={
                        state === "cracking"
                          ? { duration: 0.4 }
                          : { duration: 2, repeat: Infinity, ease: "easeInOut" }
                      }
                    />

                    {/* Main seal button */}
                    <motion.button
                      animate={
                        state === "cracking"
                          ? { scale: [1, 1.08, 0], opacity: [1, 1, 0] }
                          : { scale: 1 }
                      }
                      transition={
                        state === "cracking"
                          ? { duration: 0.35 }
                          : { duration: 0 }
                      }
                      whileHover={state === "sealed" ? { scale: 1.08 } : undefined}
                      whileTap={state === "sealed" ? { scale: 0.95 } : undefined}
                      onClick={handleSealClick}
                      className="relative z-10 flex h-16 w-16 cursor-pointer items-center justify-center rounded-full shadow-lg"
                      style={{ background: t.sealOuter }}
                      aria-label="Open invitation"
                    >
                      {/* Inner ring */}
                      <div className={`flex h-10 w-10 items-center justify-center rounded-full border ${t.sealInner}`}>
                        <span className="font-display text-xl drop-shadow" style={{ color: t.sealIcon.includes("amber") ? "#faf3e0" : "#faf3e0" }}>
                          V
                        </span>
                      </div>
                      {/* Highlight reflection */}
                      <div className={`absolute top-2 left-3 h-3 w-3 rounded-full blur-[1px] ${t.sealHighlight}`} />
                    </motion.button>

                    {/* Crack lines (show during cracking) */}
                    {state === "cracking" && (
                      <div className="absolute inset-0 z-5">
                        {crackLines.map((line) => (
                          <motion.div
                            key={line.id}
                            className="absolute top-1/2 left-1/2"
                            style={{
                              width: 1.5,
                              height: line.length,
                              background: `linear-gradient(to bottom, ${isDark ? "#f0e8d8" : "#8b6914"}66, transparent)`,
                              transformOrigin: "top center",
                              transform: `rotate(${line.angle}deg)`,
                            }}
                            initial={{ scaleY: 0, opacity: 0 }}
                            animate={{ scaleY: 1, opacity: 1 }}
                            transition={{ delay: line.delay, duration: 0.12 }}
                          />
                        ))}
                      </div>
                    )}

                    {/* Flying fragments */}
                    {state === "cracking" && (
                      <div className="absolute inset-0 z-15">
                        {fragments.map((frag) => (
                          <motion.div
                            key={frag.id}
                            className="absolute top-1/2 left-1/2 rounded-full"
                            style={{
                              width: 8,
                              height: 8,
                              background: t.sealOuter,
                              boxShadow: `0 0 4px ${t.particleColor}66`,
                            }}
                            initial={{ x: 0, y: 0, rotate: 0, scale: 1, opacity: 1 }}
                            animate={{
                              x: frag.x,
                              y: frag.y,
                              rotate: frag.rotation,
                              scale: 0,
                              opacity: 0,
                            }}
                            transition={{ delay: frag.delay, duration: 0.5, ease: "easeOut" }}
                          />
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>

        {/* ── Hint text ── */}
        <AnimatePresence>
          {state === "sealed" && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-6 text-center font-script text-lg italic animate-breathe"
              style={{ color: t.accentColor }}
            >
              ✦ Tap the seal to open your invitation ✦
            </motion.p>
          )}
        </AnimatePresence>

        {/* ── Card sliding out of envelope ── */}
        <AnimatePresence>
          {(state === "opening" || state === "card-reveal") && (
            <motion.div
              initial={{ opacity: 0, y: 0, scale: 0.9 }}
              animate={
                state === "card-reveal"
                  ? { opacity: 1, y: -30, scale: 1 }
                  : { opacity: 0.5, y: -10, scale: 0.95 }
              }
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
              className={`absolute bottom-0 left-4 right-4 z-20 rounded-xl p-8 shadow-2xl ${t.cardBg}`}
              style={{ border: `1px solid ${isDark ? "#3a3530" : "#e0d5c5"}` }}
            >
              <div className="space-y-3 text-center">
                <div className="mx-auto h-1 w-12 rounded-full" style={{ background: t.accentColor, opacity: 0.3 }} />
                <p className="font-serif text-lg italic" style={{ color: isDark ? "#e0d5c0" : "#5c4c3c" }}>
                  Opening your invitation...
                </p>
                {/* Animated shimmer bar */}
                <div className="mx-auto h-0.5 w-32 overflow-hidden rounded-full bg-stone-200/30">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: t.accentColor }}
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ delay: 0.2, duration: 0.8, ease: "easeInOut" }}
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
