"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, Sparkles, Users, Mail, ChevronDown, Star } from "lucide-react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

function FadeInSection({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      variants={fadeUp}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      className={className}
    >
      {children}
    </motion.div>
  );
}

const scenarios = [
  {
    title: "Weddings",
    description:
      "Capture the romance with elegant, paper-like invitations. From save-the-dates to RSVPs — all in one place.",
    gradient: "from-rose-100 via-stone-50 to-amber-50",
    accent: "bg-rose-200",
    icon: "💒",
  },
  {
    title: "Galas & Benefits",
    description:
      "Set the tone for a black-tie evening. Bold typography, gold accents, and effortless guest tracking for hundreds.",
    gradient: "from-stone-200 via-amber-50 to-stone-100",
    accent: "bg-amber-300",
    icon: "🥂",
  },
  {
    title: "Milestone Parties",
    description:
      "Birthdays, anniversaries, graduations — make every milestone feel like a once-in-a-lifetime celebration.",
    gradient: "from-violet-100 via-stone-50 to-rose-50",
    accent: "bg-violet-200",
    icon: "🎉",
  },
];

const testimonials = [
  {
    quote:
      "Our wedding guests couldn't stop talking about the invitation. It felt like opening a real envelope.",
    author: "Sarah & James",
    detail: "Wedding, 120 guests",
  },
  {
    quote:
      "I planned a 200-person gala and the RSVP tracking saved me hours of back-and-forth. Absolutely seamless.",
    author: "Michael Chen",
    detail: "Charity Gala, 200 guests",
  },
  {
    quote:
      "The AI copywriter wrote invitation text that was more eloquent than anything I could have come up with. Worth every penny.",
    author: "Priya Kapoor",
    detail: "Birthday Celebration, 60 guests",
  },
];

const templates = [
  { id: "classic", name: "Classic Elegance", description: "Timeless black & white with gold", colors: ["#1a1a1a", "#f7f3ed", "#c9a96e"] },
  { id: "romantic", name: "Romantic Garden", description: "Soft blush & sage green", colors: ["#d4a5a5", "#fdf6f0", "#b8c5b0"] },
  { id: "modern", name: "Modern Minimal", description: "Clean lines, bold type", colors: ["#2d2d2d", "#fafafa", "#e8e8e8"] },
  { id: "midnight", name: "Midnight Noir", description: "Dramatic black & gold", colors: ["#0d0d0d", "#1a1510", "#c9a96e"] },
  { id: "botanical", name: "Botanical", description: "Earthy greens & neutrals", colors: ["#3a5a40", "#f7f3ec", "#a3b18a"] },
  { id: "coastal", name: "Coastal", description: "Ocean blues & sandy beiges", colors: ["#457b9d", "#faf9f5", "#a8dadc"] },
];

const demoSteps = [
  {
    step: "1",
    title: "Create your event",
    description: "Pick a date, choose a theme from 6 designer templates, and set the tone in under 2 minutes.",
  },
  {
    step: "2",
    title: "Add your guests",
    description: "Import contacts or add manually. Each guest gets a unique, secure invitation link — no login required.",
  },
  {
    step: "3",
    title: "Send & track RSVPs",
    description: "Send beautifully formatted emails with one click. Watch RSVPs roll in with real-time stats on your dashboard.",
  },
];

const faqs = [
  {
    question: "How many guests can I invite on the free plan?",
    answer: "Up to 15 guests with the free Starter plan. Upgrade to Signature ($29/event) for unlimited guests on a single event, or Host ($9.99/month) for unlimited guests across unlimited events.",
  },
  {
    question: "Do my guests need to create an account to RSVP?",
    answer: "No! Each guest receives a unique, secure link. They can RSVP, indicate dietary preferences, and add a plus-one — all without signing up.",
  },
  {
    question: "Can I customize the invitation design?",
    answer: "Yes. Choose from 6 premium themes — Classic Elegance, Romantic Garden, Modern Minimal, Midnight Noir, Botanical, and Coastal. Pro themes unlock with Signature or Host plans.",
  },
  {
    question: "How does email delivery work?",
    answer: "We use Resend for reliable email delivery. Invitations land in your guests' inboxes — not spam. You can also share invitation links via SMS, WhatsApp, or any messaging app.",
  },
  {
    question: "Can I cancel my Host subscription anytime?",
    answer: "Absolutely. Cancel anytime from your Billing page. You'll retain access until the end of your billing period. No hidden fees, no lock-in.",
  },
  {
    question: "What payment methods do you accept?",
    answer: "We process payments securely through PayPal. All major credit and debit cards are accepted — Visa, Mastercard, American Express, and more.",
  },
];

function AnimatedCounter({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center">
      <div className="font-serif text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">
        {value}
      </div>
      <div className="mt-1 text-sm text-stone-500">{label}</div>
    </div>
  );
}

function FAQSection({ faqs }: { faqs: { question: string; answer: string }[] }) {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  return (
    <section className="bg-white px-6 py-20">
      <div className="mx-auto max-w-2xl">
        <FadeInSection>
          <h2 className="text-center font-serif text-2xl font-semibold tracking-tight text-stone-900 sm:text-3xl">
            Frequently asked questions
          </h2>
          <p className="mx-auto mt-3 max-w-md text-center text-stone-500">
            Everything you need to know about VibeInvite.
          </p>
        </FadeInSection>

        <div className="mt-14 divide-y">
          {faqs.map((faq, i) => (
            <div key={faq.question} className="py-5">
              <button
                onClick={() => setOpenIdx(openIdx === i ? null : i)}
                className="flex w-full cursor-pointer items-center justify-between gap-3 text-left"
              >
                <span className="font-medium text-stone-900">{faq.question}</span>
                <motion.div
                  animate={{ rotate: openIdx === i ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown className="h-4 w-4 shrink-0 text-stone-400" />
                </motion.div>
              </button>
              <AnimatePresence initial={false}>
                {openIdx === i && (
                  <motion.div
                    key="content"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <p className="pt-3 text-sm leading-relaxed text-stone-500">{faq.answer}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function LandingPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        name: "VibeInvite",
        url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://vibeinvite.bzwl.club",
        description:
          "Premium digital invitation platform with wax-sealed envelope animations, AI copywriting, and effortless RSVP tracking.",
        logo: `${process.env.NEXT_PUBLIC_SITE_URL ?? "https://vibeinvite.bzwl.club"}/og-image.png`,
        sameAs: [],
      },
      {
        "@type": "WebSite",
        name: "VibeInvite",
        url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://vibeinvite.bzwl.club",
        description:
          "Create stunning, paper-like digital invitations for weddings, galas, and milestone celebrations.",
        potentialAction: {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: `${process.env.NEXT_PUBLIC_SITE_URL ?? "https://vibeinvite.bzwl.club"}/?s={search_term_string}`,
          },
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@type": "FAQPage",
        mainEntity: faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: faq.answer,
          },
        })),
      },
    ],
  };

  return (
    <div className="flex min-h-screen flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Nav */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="sticky top-0 z-50 flex items-center justify-between border-b bg-white/80 px-6 py-4 backdrop-blur"
      >
        <span className="text-lg font-semibold tracking-tight text-stone-900">
          VibeInvite
        </span>
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="text-sm font-medium text-stone-600 transition-colors hover:text-stone-900"
          >
            Sign In
          </Link>
          <Link href="/login" className={cn(buttonVariants({ size: "sm" }))}>
            Get Started Free
          </Link>
        </div>
      </motion.header>

      {/* Hero */}
      <section className="relative overflow-hidden px-6 pb-20 pt-16 sm:pt-24 lg:pt-32">
        <div className="absolute inset-0 bg-[radial-gradient(#d4c5b2_1px,transparent_1px)] bg-[length:24px_24px] opacity-15" />
        <div className="absolute top-1/3 right-0 -translate-y-1/2 translate-x-1/4 h-96 w-96 rounded-full bg-amber-100/30 blur-3xl" />
        <div className="absolute bottom-0 left-0 -translate-x-1/4 h-80 w-80 rounded-full bg-rose-100/20 blur-3xl" />

        <div className="relative mx-auto max-w-3xl text-center">
          <motion.span
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="inline-block rounded-full border border-amber-200 bg-amber-50 px-4 py-1 text-xs font-medium tracking-wide text-amber-800 uppercase"
          >
            Premium Digital Invitations
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="mt-6 font-serif text-4xl font-semibold tracking-tight text-stone-900 sm:text-5xl lg:text-6xl"
          >
            Invitations worth
            <br />
            <span className="bg-gradient-to-r from-amber-700 via-amber-600 to-stone-700 bg-clip-text text-transparent">
              framing on the wall
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.6 }}
            className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-stone-500"
          >
            The ritual of paper, delivered digitally. Open a wax-sealed
            envelope, RSVP in one tap, and let AI craft words that match the
            occasion.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="mt-8 flex items-center justify-center gap-3"
          >
            <Link
              href="/login"
              className={cn(
                buttonVariants({ size: "lg" }),
                "h-12 px-8 text-base",
              )}
            >
              Create Your First Invitation
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
            <Link
              href="/pricing"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "h-12 px-8 text-base",
              )}
            >
              View Pricing
            </Link>
          </motion.div>

          {/* Envelope preview */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.8, ease: "easeOut" }}
            className="mx-auto mt-16 max-w-sm"
          >
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="relative overflow-hidden rounded-2xl shadow-2xl"
              style={{ aspectRatio: "4/3" }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-stone-100 via-amber-50 to-stone-200" />
              <div className="absolute inset-0 bg-[radial-gradient(#d4c5b2_1px,transparent_1px)] bg-[length:16px_16px] opacity-20" />
              <div className="absolute inset-3 rounded-lg border border-stone-300/40" />
              <div className="absolute inset-6 rounded bg-gradient-to-br from-amber-100/40 via-transparent to-stone-200/30" />

              <div className="absolute bottom-1/3 left-1/2 z-10 flex h-14 w-14 -translate-x-1/2 translate-y-1/2 items-center justify-center rounded-full shadow-lg"
                style={{ background: "radial-gradient(circle at 40% 40%, #c9a96e, #8b6914)" }}>
                <span className="font-serif text-lg text-amber-100 drop-shadow">✦</span>
              </div>

              <div className="absolute top-0 left-0 right-0 z-10 origin-top"
                style={{
                  height: "50%",
                  background: "linear-gradient(180deg, #e8dccf 0%, #dfceb8 100%)",
                  clipPath: "polygon(0 0, 50% 100%, 100% 0)",
                }}>
              </div>

              <div className="absolute inset-0 flex flex-col items-center justify-center p-8 opacity-50">
                <p className="font-serif text-sm tracking-[0.2em] text-stone-500 uppercase">You are invited</p>
                <p className="mt-1 font-serif text-xl italic text-stone-600">Sarah & John&apos;s Wedding</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Social proof stats */}
      <section className="border-y bg-stone-50 px-6 py-12">
        <div className="mx-auto max-w-3xl">
          <div className="grid grid-cols-3 gap-8">
            <AnimatedCounter value="50K+" label="Invitations Sent" />
            <AnimatedCounter value="200K+" label="Guests Managed" />
            <AnimatedCounter value="99.8%" label="Email Delivery Rate" />
          </div>
        </div>
      </section>

      {/* Feature highlights */}
      <section className="border-b bg-white px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <FadeInSection>
            <h2 className="text-center font-serif text-2xl font-semibold tracking-tight text-stone-900 sm:text-3xl">
              The unboxing experience paper deserves
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-center text-stone-500">
              Every invitation feels like it arrived in a hand-addressed envelope.
            </p>
          </FadeInSection>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mt-14 grid gap-10 sm:grid-cols-3"
          >
            {[
              {
                icon: <Mail className="h-6 w-6 text-amber-700" />,
                title: "Wax-Sealed Envelope",
                desc: "Guests tap a wax seal to reveal their invitation — just like opening a real envelope. The animation is smooth, tactile, and unforgettable.",
              },
              {
                icon: <Sparkles className="h-6 w-6 text-amber-700" />,
                title: "AI-Crafted Copy",
                desc: "Not sure what to write? Our AI generates warm, personal invitation prose that matches your event's tone — romantic, formal, or playful.",
              },
              {
                icon: <Users className="h-6 w-6 text-amber-700" />,
                title: "Zero-Friction RSVP",
                desc: "Guests respond in one tap. Dietary preferences, plus-ones, seating — all collected automatically. Real-time stats on your dashboard.",
              },
            ].map((f) => (
              <motion.div
                key={f.title}
                variants={fadeUp}
                className="text-center"
              >
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100">
                  {f.icon}
                </div>
                <h3 className="mb-2 font-semibold text-stone-900">{f.title}</h3>
                <p className="text-sm leading-relaxed text-stone-500">{f.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-stone-50 px-6 py-20">
        <div className="mx-auto max-w-4xl">
          <FadeInSection>
            <h2 className="text-center font-serif text-2xl font-semibold tracking-tight text-stone-900 sm:text-3xl">
              How it works
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-center text-stone-500">
              From idea to inbox in three simple steps.
            </p>
          </FadeInSection>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mt-14 space-y-8"
          >
            {demoSteps.map((step, i) => (
              <motion.div
                key={step.title}
                variants={{
                  hidden: { opacity: 0, x: i % 2 === 0 ? -30 : 30 },
                  visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: "easeOut" } },
                }}
                className="flex items-start gap-6"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-stone-900 text-lg font-bold text-white shadow-lg">
                  {step.step}
                </div>
                <div className="flex-1 rounded-2xl border bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
                  <h3 className="font-semibold text-stone-900">{step.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-stone-500">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <FadeInSection>
            <div className="mt-10 text-center">
              <Link
                href="/login"
                className={cn(buttonVariants({ size: "lg" }), "h-12 px-8 text-base")}
              >
                Start Creating Now
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </FadeInSection>
        </div>
      </section>

      {/* Scenarios */}
      <section className="bg-white px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <FadeInSection>
            <h2 className="text-center font-serif text-2xl font-semibold tracking-tight text-stone-900 sm:text-3xl">
              Designed for every occasion
            </h2>
          </FadeInSection>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mt-14 grid gap-6 sm:grid-cols-3"
          >
            {scenarios.map((s) => (
              <motion.div
                key={s.title}
                variants={fadeUp}
                whileHover={{ y: -4 }}
                className={`rounded-2xl bg-gradient-to-br ${s.gradient} border p-8 shadow-sm transition-shadow hover:shadow-lg`}
              >
                <span className="text-3xl">{s.icon}</span>
                <h3 className="mt-4 font-semibold text-stone-900">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-stone-500">{s.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Template showcase */}
      <section className="bg-stone-50 px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <FadeInSection>
            <h2 className="text-center font-serif text-2xl font-semibold tracking-tight text-stone-900 sm:text-3xl">
              6 themes, endless style
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-center text-stone-500">
              From timeless gold to bold midnight — find the perfect look for your event.
            </p>
          </FadeInSection>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
          >
            {templates.map((t) => (
              <motion.div
                key={t.id}
                variants={fadeUp}
                whileHover={{ y: -4 }}
                className="overflow-hidden rounded-2xl border bg-white shadow-sm transition-shadow hover:shadow-lg"
              >
                <div className="flex h-16">
                  {t.colors.map((c) => (
                    <div key={c} className="flex-1" style={{ backgroundColor: c }} />
                  ))}
                </div>
                <div className="p-5">
                  <h3 className="font-semibold text-stone-900">{t.name}</h3>
                  <p className="mt-1 text-sm text-stone-500">{t.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <FadeInSection>
            <div className="mt-10 text-center">
              <Link
                href="/login"
                className={cn(buttonVariants({ variant: "outline", size: "lg" }), "h-12 px-8 text-base")}
              >
                Explore All Templates
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </FadeInSection>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-white px-6 py-20">
        <div className="mx-auto max-w-4xl">
          <FadeInSection>
            <h2 className="text-center font-serif text-2xl font-semibold tracking-tight text-stone-900 sm:text-3xl">
              Hosts love the experience
            </h2>
          </FadeInSection>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mt-14 grid gap-8 sm:grid-cols-3"
          >
            {testimonials.map((t) => (
              <motion.div
                key={t.author}
                variants={fadeUp}
                whileHover={{ y: -4 }}
                className="rounded-2xl border bg-stone-50/50 p-8 transition-shadow hover:shadow-md"
              >
                <div className="mb-4 flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <blockquote className="font-serif text-base italic leading-relaxed text-stone-700">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                <div className="mt-4">
                  <p className="font-semibold text-stone-900">{t.author}</p>
                  <p className="text-sm text-stone-500">{t.detail}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Pricing summary */}
      <section className="bg-stone-50 px-6 py-20">
        <div className="mx-auto max-w-5xl text-center">
          <FadeInSection>
            <h2 className="font-serif text-2xl font-semibold tracking-tight text-stone-900 sm:text-3xl">
              Simple, transparent pricing
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-stone-500">
              Start free. Upgrade when you need more.
            </p>
          </FadeInSection>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mt-14 grid gap-8 sm:grid-cols-3"
          >
            {[
              { name: "Starter", price: "$0", period: "forever", desc: "Up to 15 guests, classic theme, email invites, RSVP tracking.", cta: "Get Started", highlight: false },
              { name: "Signature", price: "$29", period: "per event", desc: "Unlimited guests, all 6 themes, AI copywriter, seating chart, dietary tracking.", cta: "Get Started", highlight: true },
              { name: "Host", price: "$9.99", period: "per month", desc: "Everything in Signature, unlimited events, priority support, early access.", cta: "Subscribe", highlight: false },
            ].map((plan) => (
              <motion.div
                key={plan.name}
                variants={fadeUp}
                whileHover={{ y: -4 }}
                className={cn(
                  "flex flex-col rounded-2xl border bg-white p-8 text-left shadow-sm transition-shadow hover:shadow-lg",
                  plan.highlight && "border-amber-300 ring-2 ring-amber-100 shadow-lg",
                )}
              >
                {plan.highlight && (
                  <span className="-mt-10 mb-4 self-center rounded-full bg-amber-100 px-4 py-0.5 text-xs font-medium text-amber-800">
                    Most Popular
                  </span>
                )}
                <h3 className="font-semibold text-stone-900">{plan.name}</h3>
                <div className="mt-2">
                  <span className="text-3xl font-bold tracking-tight">{plan.price}</span>
                  <span className="text-stone-400"> /{plan.period}</span>
                </div>
                <p className="mt-4 flex-1 text-sm leading-relaxed text-stone-500">{plan.desc}</p>
                <Link
                  href="/login"
                  className={cn(
                    buttonVariants({ variant: plan.highlight ? "default" : "outline" }),
                    "mt-6 w-full",
                  )}
                >
                  {plan.cta}
                </Link>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <Link
              href="/pricing"
              className="mt-8 inline-flex items-center text-sm font-medium text-amber-700 transition-colors hover:text-amber-800"
            >
              Compare all features →
            </Link>
          </motion.div>
        </div>
      </section>

      {/* FAQ */}
      <FAQSection faqs={faqs} />

      {/* CTA */}
      <section className="relative overflow-hidden bg-stone-900 px-6 py-20 text-center">
        <div className="absolute top-0 right-0 h-64 w-64 translate-x-1/3 -translate-y-1/3 rounded-full bg-amber-500/10 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-64 w-64 -translate-x-1/3 translate-y-1/3 rounded-full bg-amber-500/5 blur-3xl" />

        <FadeInSection>
          <h2 className="font-serif text-2xl font-semibold tracking-tight text-white sm:text-3xl">
            Ready to create something beautiful?
          </h2>
          <p className="mx-auto mt-3 max-w-md text-stone-400">
            Start free. Upgrade when you need premium themes, unlimited guests, and AI copywriting.
          </p>
          <div className="mt-8 flex items-center justify-center gap-3">
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Link
                href="/login"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "h-12 bg-amber-600 px-8 text-base text-white hover:bg-amber-700",
                )}
              >
                Get Started Free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Link
                href="/pricing"
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "h-12 border-stone-700 bg-transparent px-8 text-base text-stone-300 hover:bg-stone-800 hover:text-white",
                )}
              >
                View Pricing
              </Link>
            </motion.div>
          </div>
        </FadeInSection>
      </section>
    </div>
  );
}
