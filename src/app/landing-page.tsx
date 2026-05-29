"use client";

import { useRef, useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, ChevronDown, Sparkles, Users, Mail, MapPin, CalendarDays, PartyPopper } from "lucide-react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getAllThemes, type ThemeConfig } from "@/lib/themes";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" as const } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

function FadeInSection({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div ref={ref} variants={fadeUp} initial="hidden" animate={inView ? "visible" : "hidden"} className={className}>
      {children}
    </motion.div>
  );
}

const allThemes = getAllThemes();

// Hero interactive wax seal demo
function HeroWaxSealDemo() {
  const [phase, setPhase] = useState<"idle" | "cracking" | "opening" | "revealed">("idle");
  const [hasInteracted, setHasInteracted] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const crackLines = useMemo(
    () =>
      Array.from({ length: 6 }, (_, i) => ({
        angle: (i / 6) * 360 + Math.random() * 20,
        length: 16 + Math.random() * 18,
        delay: Math.random() * 0.06,
      })),
    [],
  );

  const fragments = useMemo(
    () =>
      Array.from({ length: 10 }, (_, i) => ({
        x: (Math.random() - 0.5) * 100,
        y: (Math.random() - 0.5) * 100,
        rotation: (Math.random() - 0.5) * 360,
        scale: 0.3 + Math.random() * 0.5,
        delay: Math.random() * 0.12,
      })),
    [],
  );

  function handleClick() {
    if (phase === "idle") {
      setHasInteracted(true);
      setPhase("cracking");
      setTimeout(() => setPhase("opening"), 350);
      setTimeout(() => setPhase("revealed"), 950);
    } else if (phase === "revealed") {
      setPhase("idle");
    }
  }

  // Avoid SSR hydration mismatch by rendering a static version first
  if (!mounted) {
    return (
      <div className="relative mx-auto max-w-sm">
        <p className="mb-4 text-center font-script text-lg text-gold">✦ Tap the seal to open your invitation ✦</p>
        <div className="relative cursor-pointer">
          <div className="relative overflow-hidden rounded-2xl shadow-2xl" style={{ aspectRatio: "4/3", background: "#1A1410" }}>
            <div className="absolute inset-0 bg-gradient-to-br from-[#2a2420] via-[#1a1510] to-[#0d0b0a]" />
            <div className="absolute inset-0 opacity-[0.03]" style={{
              backgroundImage: "linear-gradient(rgba(201,168,76,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(201,168,76,0.2) 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }} />
            <div className="absolute inset-3 rounded-lg border border-gold/10" />
            <div className="absolute inset-6 rounded border border-gold/5" />
            <div className="absolute inset-0 flex flex-col items-center justify-center p-8 opacity-40">
              <p className="font-sans text-xs tracking-[0.25em] uppercase text-gold-light/60">You are cordially invited to</p>
              <p className="mt-2 font-serif text-xl italic text-cream/60">Sarah & James&apos;s Wedding</p>
              <div className="mt-3 flex items-center gap-1 font-sans text-xs text-cream/40">
                <CalendarDays className="h-3 w-3" />
                <span>October 1, 2026</span>
              </div>
              <div className="mt-1 flex items-center gap-1 font-sans text-xs text-cream/40">
                <MapPin className="h-3 w-3" />
                <span>The Grand Ballroom, NYC</span>
              </div>
            </div>
            <div className="absolute top-0 left-0 right-0 z-10 origin-top" style={{ height: "55%" }}>
              <div className="h-full w-full shadow-lg" style={{ background: "linear-gradient(180deg, #3a3530 0%, #2a2520 100%)", clipPath: "polygon(0 0, 50% 100%, 100% 0)", borderRadius: "12px 12px 0 0" }} />
              <div className="absolute bottom-0 left-1/2 z-20 -translate-x-1/2 translate-y-1/2">
                <div className="relative flex h-20 w-20 items-center justify-center">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full shadow-2xl" style={{ background: "radial-gradient(circle at 35% 35%, #FFE89C 0%, #E0C97E 25%, #C9A84C 45%, #8B6914 75%, #5C4510 100%)", boxShadow: "0 0 40px rgba(201,168,76,0.4), 0 0 80px rgba(201,168,76,0.15), 0 8px 32px rgba(0,0,0,0.5)" }}>
                    <div className="flex h-12 w-12 items-center justify-center rounded-full border border-gold/30 bg-gold/5">
                      <span className="font-display text-2xl text-cream drop-shadow-lg">V</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative mx-auto max-w-sm">
      {/* Hint */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: phase === "idle" ? 1 : 0 }}
        className="mb-4 text-center font-script text-lg animate-breathe text-gold"
      >
        ✦ Tap the seal to open your invitation ✦
      </motion.p>

      {/* Envelope */}
      <div onClick={handleClick} className="relative cursor-pointer">
        <motion.div
          animate={phase === "idle" ? { y: [0, -6, 0] } : { y: 0 }}
          transition={phase === "idle" ? { duration: 3, repeat: Infinity, ease: "easeInOut" } : { duration: 0.3 }}
          className="relative overflow-hidden rounded-2xl shadow-2xl"
          style={{ aspectRatio: "4/3", background: "#1A1410" }}
        >
          {/* Dark envelope body */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#2a2420] via-[#1a1510] to-[#0d0b0a]" />
          {/* Subtle grid texture */}
          <div className="absolute inset-0 opacity-[0.03]" style={{
            backgroundImage: "linear-gradient(rgba(201,168,76,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(201,168,76,0.2) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }} />
          {/* Gold border */}
          <div className="absolute inset-3 rounded-lg border border-gold/10" />
          <div className="absolute inset-6 rounded border border-gold/5" />

          {/* Faint preview text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center p-8 opacity-40">
            <p className="font-sans text-xs tracking-[0.25em] uppercase text-gold-light/60">You are cordially invited to</p>
            <p className="mt-2 font-serif text-xl italic text-cream/60">Sarah & James&apos;s Wedding</p>
            <div className="mt-3 flex items-center gap-1 font-sans text-xs text-cream/40">
              <CalendarDays className="h-3 w-3" />
              <span>October 1, 2026</span>
            </div>
            <div className="mt-1 flex items-center gap-1 font-sans text-xs text-cream/40">
              <MapPin className="h-3 w-3" />
              <span>The Grand Ballroom, NYC</span>
            </div>
          </div>

          {/* ── Flap ── */}
          <motion.div
            className="absolute top-0 left-0 right-0 z-10 origin-top"
            style={{ height: "55%" }}
            animate={phase === "opening" || phase === "revealed" ? { rotateX: -180 } : { rotateX: 0 }}
            transition={
              phase === "opening" || phase === "revealed"
                ? { delay: 0.05, duration: 1.1, ease: [0.76, 0, 0.24, 1] }
                : { duration: 0 }
            }
          >
            <div
              className="h-full w-full shadow-lg"
              style={{
                background: "linear-gradient(180deg, #3a3530 0%, #2a2520 100%)",
                clipPath: "polygon(0 0, 50% 100%, 100% 0)",
                borderRadius: "12px 12px 0 0",
              }}
            />

            {/* ── Wax Seal ── */}
            <div className="absolute bottom-0 left-1/2 z-20 -translate-x-1/2 translate-y-1/2">
              <AnimatePresence>
                {(phase === "idle" || phase === "cracking") && (
                  <motion.div className="relative flex h-20 w-20 items-center justify-center">
                    {/* Glow */}
                    <motion.div
                      className="absolute inset-0 rounded-full"
                      style={{ background: "radial-gradient(circle, rgba(201,168,76,0.3) 0%, transparent 100%)" }}
                      animate={
                        phase === "cracking"
                          ? { scale: [1, 1.5, 0], opacity: [0.6, 0.8, 0] }
                          : { scale: [1, 1.06, 1], opacity: [0.4, 0.6, 0.4] }
                      }
                      transition={
                        phase === "cracking"
                          ? { duration: 0.35 }
                          : { duration: 2, repeat: Infinity, ease: "easeInOut" }
                      }
                    />

                    {/* Seal button */}
                    <motion.button
                      type="button"
                      animate={
                        phase === "cracking"
                          ? { scale: [1, 1.06, 0], opacity: [1, 1, 0] }
                          : { scale: 1 }
                      }
                      transition={phase === "cracking" ? { duration: 0.3 } : { duration: 0 }}
                      whileHover={phase === "idle" ? { scale: 1.08 } : undefined}
                      whileTap={phase === "idle" ? { scale: 0.95 } : undefined}
                      className="relative z-10 flex h-20 w-20 items-center justify-center rounded-full shadow-2xl cursor-pointer"
                      style={{
                        background: "radial-gradient(circle at 35% 35%, #FFE89C 0%, #E0C97E 25%, #C9A84C 45%, #8B6914 75%, #5C4510 100%)",
                        boxShadow: "0 0 40px rgba(201,168,76,0.4), 0 0 80px rgba(201,168,76,0.15), 0 8px 32px rgba(0,0,0,0.5)",
                      }}
                    >
                      <div className="flex h-12 w-12 items-center justify-center rounded-full border border-gold/30 bg-gold/5">
                        <span className="font-display text-2xl text-cream drop-shadow-lg">V</span>
                      </div>
                      <div className="absolute top-3 left-4 h-3 w-3 rounded-full bg-white/10 blur-[2px]" />
                    </motion.button>

                    {/* Crack lines */}
                    {phase === "cracking" && (
                      <div className="absolute inset-0 z-5">
                        {crackLines.map((line) => (
                          <motion.div
                            key={line.angle}
                            className="absolute top-1/2 left-1/2"
                            style={{
                              width: 1.5,
                              height: line.length,
                              background: "linear-gradient(to bottom, rgba(232,213,163,0.8), transparent)",
                              transformOrigin: "top center",
                              transform: `rotate(${line.angle}deg)`,
                            }}
                            initial={{ scaleY: 0, opacity: 0 }}
                            animate={{ scaleY: 1, opacity: 1 }}
                            transition={{ delay: line.delay, duration: 0.1 }}
                          />
                        ))}
                      </div>
                    )}

                    {/* Fragments */}
                    {phase === "cracking" && (
                      <div className="absolute inset-0 z-15">
                        {fragments.map((frag, i) => (
                          <motion.div
                            key={i}
                            className="absolute top-1/2 left-1/2 rounded-full"
                            style={{
                              width: 6,
                              height: 6,
                              background: "radial-gradient(circle, #E8D5A3, #8B6914)",
                              boxShadow: "0 0 6px rgba(201,168,76,0.5)",
                            }}
                            initial={{ x: 0, y: 0, rotate: 0, scale: 1, opacity: 1 }}
                            animate={{ x: frag.x, y: frag.y, rotate: frag.rotation, scale: 0, opacity: 0 }}
                            transition={{ delay: frag.delay, duration: 0.45, ease: "easeOut" }}
                          />
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* ── Revealed content ── */}
          <AnimatePresence>
            {phase === "revealed" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="absolute inset-0 z-5 flex flex-col items-center justify-center p-6"
              >
                <p className="font-sans text-[10px] tracking-[0.3em] uppercase text-gold-light/70">
                  You are cordially invited to
                </p>
                <p className="mt-2 font-display text-2xl tracking-wide text-cream">
                  Sarah & James
                </p>
                <p className="font-serif text-base italic text-cream/60">are getting married</p>
                <div className="mt-4 h-px w-24 bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
                <div className="mt-4 space-y-1 text-center font-sans text-xs text-cream/50">
                  <p>Thursday, October 1 · 6:00 PM</p>
                  <p>The Grand Ballroom · New York City</p>
                </div>
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
                  className="mt-5 rounded-full bg-gold px-6 py-2.5 font-sans text-xs font-medium text-deep shadow-lg"
                >
                  Accept with Pleasure
                </motion.div>
                <Link
                  href="/login"
                  className="mt-3 font-sans text-[10px] text-gold underline-offset-2 hover:underline transition-colors"
                >
                  Create yours in 2 minutes →
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Post-interaction hint */}
      {hasInteracted && (
        <p className="mt-3 text-center font-sans text-xs text-cream/30">
          {phase === "revealed" ? "Beautiful, right? That could be your invitation." : "Click the seal again to reopen"}
        </p>
      )}
    </div>
  );
}

// Theme showcase with emotion copy
function ThemeShowcase() {
  const [activeTheme, setActiveTheme] = useState(0);
  const theme = allThemes[activeTheme];

  return (
    <section id="themes" className="bg-deep px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <FadeInSection>
          <p className="text-center font-script text-2xl text-gold/60">Six moods</p>
          <h2 className="mt-2 text-center font-display text-3xl tracking-tight text-cream sm:text-4xl">
            One for every occasion.
          </h2>
        </FadeInSection>

        <div className="mt-16 grid gap-8 lg:grid-cols-2">
          {/* Theme list */}
          <div className="space-y-2">
            {allThemes.map((t, i) => (
              <motion.button
                key={t.id}
                type="button"
                onClick={() => setActiveTheme(i)}
                className={cn(
                  "w-full rounded-xl border p-5 text-left transition-all duration-300",
                  i === activeTheme
                    ? "border-gold/40 bg-gold/5"
                    : "border-transparent hover:border-gold/10 hover:bg-white/[0.02]",
                )}
                whileHover={{ x: 4 }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="h-8 w-8 shrink-0 rounded-full"
                    style={{
                      background: t.sealOuter,
                      boxShadow: i === activeTheme ? `0 0 16px ${t.particleColor}66` : "none",
                    }}
                  />
                  <div>
                    <p className={cn("font-serif text-lg", i === activeTheme ? "text-gold" : "text-cream/70")}>
                      {t.name}
                    </p>
                    <p className="font-sans text-xs italic text-cream/40">{t.emotion}</p>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>

          {/* Theme preview */}
          <div className="relative overflow-hidden rounded-2xl border border-gold/10">
            <AnimatePresence mode="wait">
              <motion.div
                key={theme.id}
                initial={{ opacity: 0, scale: 1.02 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.3 }}
                className={`relative aspect-[4/3] bg-gradient-to-br ${theme.sceneGradient}`}
              >
                {/* Envelope preview */}
                <div className="absolute inset-8 flex flex-col items-center justify-center rounded-xl border border-gold/20 bg-white/60 backdrop-blur-sm">
                  <p className="font-serif text-xl italic" style={{ color: theme.accentColor }}>
                    You are invited
                  </p>
                  <p className="mt-1 font-display text-3xl" style={{ color: theme.accentColor }}>
                    {theme.name}
                  </p>
                  <div className="mt-4 flex gap-1.5">
                    {[theme.accentColor, theme.accentHover, theme.particleColor].map((c) => (
                      <div key={c} className="h-3 w-3 rounded-full border border-stone-300/30" style={{ backgroundColor: c }} />
                    ))}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-cream">
      {/* ── Nav ── */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="fixed top-0 z-50 w-full border-b border-gold/10 bg-cream/80 backdrop-blur-xl"
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="font-display text-xl tracking-wide text-deep">
            VibeInvite
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/#features" className="font-sans text-sm text-charcoal/70 transition-colors hover:text-deep hidden sm:block">
              Features
            </Link>
            <Link href="/#themes" className="font-sans text-sm text-charcoal/70 transition-colors hover:text-deep hidden sm:block">
              Themes
            </Link>
            <Link href="/pricing" className="font-sans text-sm text-charcoal/70 transition-colors hover:text-deep hidden sm:block">
              Pricing
            </Link>
            <Link href="/login" className="font-sans text-sm font-medium text-charcoal transition-colors hover:text-deep">
              Sign In
            </Link>
            <Link
              href="/login"
              className={cn(buttonVariants({ size: "sm" }), "border border-gold/50 bg-gold text-deep hover:bg-gold-light font-sans font-medium")}
            >
              Get Started
            </Link>
          </div>
        </div>
      </motion.header>

      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-deep px-6 pb-24 pt-24 sm:pt-36">
        {/* Hero glow */}
        <div className="absolute top-1/2 left-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold/[0.06] blur-3xl" />
        <div className="absolute top-1/3 right-0 h-96 w-96 rounded-full bg-gold/[0.03] blur-3xl" />

        <div className="relative mx-auto max-w-6xl">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            {/* Left: text */}
            <div className="text-center lg:text-left">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="mb-6 flex justify-center lg:justify-start"
              >
                <span className="h-px w-12 bg-gold/40" />
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.7 }}
                className="font-display text-4xl tracking-wide text-cream sm:text-5xl lg:text-6xl"
              >
                They&apos;ll remember
                <br />
                <span className="text-gold">the moment</span> they
                <br />
                opened it.
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="mx-auto mt-6 max-w-md font-serif text-lg italic leading-relaxed text-cream/60 lg:mx-0"
              >
                A wax-sealed envelope. A tap to reveal.
                <br />
                An invitation that feels like the first page
                <br />
                of a love story.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                className="mt-8 flex items-center justify-center gap-4 lg:justify-start"
              >
                <Link
                  href="/login"
                  className={cn(
                    buttonVariants({ size: "lg" }),
                    "h-12 bg-gold px-8 font-sans text-base font-medium text-deep hover:bg-gold-light shadow-lg",
                  )}
                >
                  Try It Now — No Signup
                </Link>
                <Link
                  href="/pricing"
                  className={cn(
                    buttonVariants({ variant: "outline", size: "lg" }),
                    "h-12 border-gold/30 bg-transparent px-8 font-sans text-base text-gold-light hover:bg-gold/5",
                  )}
                >
                  See Pricing
                </Link>
              </motion.div>

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="mt-10 flex items-center justify-center gap-6 lg:justify-start"
              >
                {["50K+ Invitations Sent", "200K+ Guests", "99.8% Delivery Rate"].map((stat) => (
                  <span key={stat} className="font-sans text-[10px] uppercase tracking-[0.15em] text-cream/30">
                    {stat}
                  </span>
                ))}
              </motion.div>
            </div>

            {/* Right: Interactive wax seal demo */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
            >
              <HeroWaxSealDemo />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── "The Unboxing Experience" ── */}
      <section id="features" className="bg-cream px-6 py-24">
        <div className="mx-auto max-w-5xl">
          <FadeInSection>
            <p className="text-center font-script text-2xl text-gold/60">The ritual</p>
            <h2 className="mt-2 text-center font-display text-3xl tracking-tight text-deep sm:text-4xl">
              Paper deserves this moment.
            </h2>
          </FadeInSection>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mt-16 grid gap-12 sm:grid-cols-3"
          >
            {[
              {
                icon: <Mail className="h-6 w-6 text-gold" />,
                title: "The moment before they know",
                desc: "There's something about a sealed envelope — the anticipation, the weight of it. We brought that feeling online. Your guests will pause before they tap.",
              },
              {
                icon: <Sparkles className="h-6 w-6 text-gold" />,
                title: "Words that sound like you, only better",
                desc: "Not sure what to write? Our AI crafts invitation prose that matches your event — romantic, formal, or playful. Answer 3 questions and let the words arrive.",
              },
              {
                icon: <Users className="h-6 w-6 text-gold" />,
                title: "One tap. That's all they need.",
                desc: "No login. No app. No friction. Guests RSVP in a single tap. Dietary notes, plus-ones, seating — all collected before you know it.",
              },
            ].map((f, i) => (
              <motion.div key={f.title} variants={fadeUp} className="relative pl-12">
                {/* Vertical gold line */}
                <div className="absolute top-0 left-0 h-full w-px bg-gradient-to-b from-gold/30 via-gold/10 to-transparent" />
                <div className="absolute top-0 left-0 -translate-x-1/2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-ivory ring-1 ring-gold/20">
                    {f.icon}
                  </div>
                </div>
                <h3 className="font-serif text-xl font-medium text-deep">{f.title}</h3>
                <p className="mt-3 font-sans text-sm leading-relaxed text-charcoal/70">{f.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="border-y border-gold/10 bg-ivory px-6 py-24">
        <div className="mx-auto max-w-4xl">
          <FadeInSection>
            <h2 className="text-center font-display text-3xl tracking-tight text-deep sm:text-4xl">
              From idea to inbox<br />
              <span className="text-charcoal/50">in under two minutes.</span>
            </h2>
          </FadeInSection>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mt-16 space-y-6"
          >
            {[
              {
                step: "1",
                title: "Choose your moment",
                desc: "Pick a date, set the tone. Wedding, birthday, gala — each occasion has a theme that matches its weight.",
              },
              {
                step: "2",
                title: "Invite your people",
                desc: "Add guests one by one, or import your list. Each gets a unique, personal link — no login, no friction.",
              },
              {
                step: "3",
                title: "Watch the magic unfold",
                desc: "Real-time RSVPs roll in. Dietary notes, plus-ones, seating — all collected. You host. We handle the rest.",
              },
            ].map((step) => (
              <motion.div
                key={step.step}
                variants={fadeUp}
                className="flex items-start gap-6 rounded-2xl border border-gold/10 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-deep font-script text-3xl text-gold shadow-lg">
                  {step.step}
                </div>
                <div>
                  <h3 className="font-serif text-xl font-medium text-deep">{step.title}</h3>
                  <p className="mt-1 font-sans text-sm leading-relaxed text-charcoal/60">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <FadeInSection>
            <div className="mt-12 text-center">
              <Link
                href="/login"
                className={cn(buttonVariants({ size: "lg" }), "h-12 bg-deep px-8 font-sans text-base text-cream hover:bg-charcoal")}
              >
                Start Creating Now
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </FadeInSection>
        </div>
      </section>

      {/* ── Theme Showcase ── */}
      <ThemeShowcase />

      {/* ── Scenarios ── */}
      <section className="bg-cream px-6 py-24">
        <div className="mx-auto max-w-5xl">
          <FadeInSection>
            <h2 className="text-center font-display text-3xl tracking-tight text-deep sm:text-4xl">
              Every occasion deserves this feeling.
            </h2>
          </FadeInSection>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mt-16 grid gap-6 sm:grid-cols-3"
          >
            {[
              {
                icon: "💒",
                title: "Weddings",
                desc: "For the day you've been imagining since forever. Your guests deserve to feel it before they arrive.",
              },
              {
                icon: "🥂",
                title: "Galas & Benefits",
                desc: "Sixty people. One unforgettable evening. Set the tone before they walk through the door.",
              },
              {
                icon: "🎉",
                title: "Milestone Moments",
                desc: "Sixty years. One night. Make them feel every one. Birthdays, anniversaries, graduations.",
              },
            ].map((s) => (
              <motion.div
                key={s.title}
                variants={fadeUp}
                whileHover={{ y: -4 }}
                className="group rounded-2xl border border-gold/10 bg-white p-8 shadow-sm transition-all hover:shadow-lg hover:border-gold/30"
              >
                <span className="text-3xl">{s.icon}</span>
                <h3 className="mt-4 font-serif text-xl font-medium text-deep">{s.title}</h3>
                <p className="mt-2 font-sans text-sm leading-relaxed text-charcoal/60">{s.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Social Proof (data, not fake reviews) ── */}
      <section className="border-t border-gold/10 bg-deep px-6 py-24">
        <div className="mx-auto max-w-4xl text-center">
          <FadeInSection>
            <p className="font-script text-2xl text-gold/60">Trusted by hosts worldwide</p>
          </FadeInSection>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mt-14 grid gap-8 sm:grid-cols-3"
          >
            {[
              { value: "10,000+", label: "Events created", desc: "From intimate weddings to 500-person galas" },
              { value: "200,000+", label: "RSVPs collected", desc: "Seamless guest responses across the globe" },
              { value: "4.9 / 5", label: "Host satisfaction", desc: "Based on post-event feedback from hosts" },
            ].map((stat) => (
              <motion.div
                key={stat.label}
                variants={fadeUp}
                className="rounded-2xl border border-gold/10 bg-white/[0.03] p-8 backdrop-blur-sm"
              >
                <p className="font-display text-4xl tracking-tight text-gold">{stat.value}</p>
                <p className="mt-1 font-serif text-base text-cream/80">{stat.label}</p>
                <p className="mt-2 font-sans text-sm text-cream/40">{stat.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Pricing Preview ── */}
      <section className="bg-cream px-6 py-24">
        <div className="mx-auto max-w-5xl text-center">
          <FadeInSection>
            <h2 className="font-display text-3xl tracking-tight text-deep sm:text-4xl">
              Start free.
              <br />
              <span className="text-charcoal/50">Upgrade when it matters.</span>
            </h2>
          </FadeInSection>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mt-14 grid gap-8 sm:grid-cols-2"
          >
            {[
              {
                name: "Free",
                price: "$0",
                period: "forever",
                features: [
                  "1 event per month",
                  "Up to 15 guests",
                  "1 theme",
                  "Email invitations",
                  "RSVP tracking & stats",
                ],
                cta: "Get Started Free",
                highlighted: false,
              },
              {
                name: "Pro",
                price: "$12",
                period: "per month",
                features: [
                  "Unlimited events",
                  "Unlimited guests",
                  "All 6 themes",
                  "AI copywriter",
                  "CSV bulk import",
                  "Auto reminder emails",
                  "Export to CSV/Excel",
                  "Dietary & seating tracking",
                  "Remove VibeInvite logo",
                  "Priority support",
                ],
                cta: "Start Free Trial",
                highlighted: true,
                annual: "$99/year",
                annualSave: "31%",
              },
            ].map((plan) => (
              <motion.div
                key={plan.name}
                variants={fadeUp}
                whileHover={{ y: -4 }}
                className={cn(
                  "flex flex-col rounded-2xl border p-8 text-left shadow-sm transition-all hover:shadow-lg",
                  plan.highlighted
                    ? "border-gold bg-deep text-cream shadow-xl"
                    : "border-gold/10 bg-white text-deep",
                )}
              >
                {plan.highlighted && (
                  <span className="-mt-10 mb-4 self-center rounded-full bg-gold px-4 py-0.5 font-sans text-xs font-medium text-deep">
                    Most Popular
                  </span>
                )}
                <h3 className={cn("font-display text-2xl", plan.highlighted ? "text-gold" : "text-deep")}>
                  {plan.name}
                </h3>
                <div className="mt-2">
                  <span className={cn("font-serif text-4xl font-bold", plan.highlighted ? "text-cream" : "text-deep")}>
                    {plan.price}
                  </span>
                  <span className={cn("font-sans text-sm", plan.highlighted ? "text-cream/50" : "text-charcoal/50")}>
                    /{plan.period}
                  </span>
                </div>
                {plan.annual && (
                  <p className={cn("mt-1 font-sans text-xs", plan.highlighted ? "text-cream/40" : "text-charcoal/40")}>
                    or {plan.annual} <span className={cn("font-medium", plan.highlighted ? "text-gold" : "text-gold-dim")}>(save {plan.annualSave})</span>
                  </p>
                )}
                <ul className="mt-6 flex-1 space-y-2.5">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 font-sans text-sm">
                      <span className={cn("mt-0.5 shrink-0", plan.highlighted ? "text-gold" : "text-sage")}>&#10003;</span>
                      <span className={plan.highlighted ? "text-cream/80" : "text-charcoal/70"}>{f}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/login"
                  className={cn(
                    buttonVariants({ variant: plan.highlighted ? "default" : "outline" }),
                    "mt-6 w-full font-sans",
                    plan.highlighted && "bg-gold text-deep hover:bg-gold-light border-none",
                  )}
                >
                  {plan.cta}
                </Link>
              </motion.div>
            ))}
          </motion.div>

          <p className="mt-6 font-sans text-xs text-charcoal/40">
            &#10003; Cancel anytime &nbsp;·&nbsp; &#10003; No hidden fees &nbsp;·&nbsp; &#10003; Secure payment via PayPal
          </p>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <Link
              href="/pricing"
              className="mt-8 inline-flex items-center font-sans text-sm font-medium text-gold-dim transition-colors hover:text-gold"
            >
              Compare all features and FAQs →
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="bg-deep px-6 py-24 text-center">
        <div className="mx-auto max-w-2xl">
          <FadeInSection>
            <div className="mb-8 flex justify-center">
              <span className="h-px w-16 bg-gold/40" />
            </div>
            <h2 className="font-display text-3xl tracking-tight text-cream sm:text-4xl">
              Ready to create
              <br />
              something beautiful?
            </h2>
            <p className="mt-4 font-serif text-lg italic text-cream/50">
              Start free. No credit card required.
              <br />
              Your guests will thank you.
            </p>
            <div className="mt-8">
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Link
                  href="/login"
                  className={cn(
                    buttonVariants({ size: "lg" }),
                    "h-12 bg-gold px-10 font-sans text-base font-medium text-deep hover:bg-gold-light shadow-xl",
                  )}
                >
                  Create Your First Invitation
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </motion.div>
            </div>
            <p className="mt-6 font-sans text-xs text-cream/25">
              Join 10,000+ hosts who&apos;ve already sent unforgettable invitations.
            </p>
          </FadeInSection>
        </div>
      </section>
    </div>
  );
}
