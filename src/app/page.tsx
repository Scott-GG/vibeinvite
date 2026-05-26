import Link from "next/link";
import { ArrowRight, Sparkles, Users, Palette, Mail } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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
];

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Nav */}
      <header className="flex items-center justify-between px-6 py-4">
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
          <Link
            href="/login"
            className={cn(buttonVariants({ size: "sm" }))}
          >
            Get Started
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden px-6 pb-20 pt-16 sm:pt-24 lg:pt-32">
        {/* Background texture */}
        <div className="absolute inset-0 bg-[radial-gradient(#d4c5b2_1px,transparent_1px)] bg-[length:24px_24px] opacity-15" />
        <div className="absolute top-1/3 right-0 -translate-y-1/2 translate-x-1/4 h-96 w-96 rounded-full bg-amber-100/30 blur-3xl" />
        <div className="absolute bottom-0 left-0 -translate-x-1/4 h-80 w-80 rounded-full bg-rose-100/20 blur-3xl" />

        <div className="relative mx-auto max-w-3xl text-center">
          <span className="inline-block rounded-full border border-amber-200 bg-amber-50 px-4 py-1 text-xs font-medium tracking-wide text-amber-800 uppercase">
            Premium Digital Invitations
          </span>

          <h1 className="mt-6 font-serif text-4xl font-semibold tracking-tight text-stone-900 sm:text-5xl lg:text-6xl">
            Invitations worth
            <br />
            <span className="bg-gradient-to-r from-amber-700 via-amber-600 to-stone-700 bg-clip-text text-transparent">
              framing on the wall
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-stone-500">
            The ritual of paper, delivered digitally. Open a wax-sealed
            envelope, RSVP in one tap, and let AI craft words that match the
            occasion.
          </p>

          <div className="mt-8 flex items-center justify-center gap-3">
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
          </div>

          {/* Envelope preview */}
          <div className="mx-auto mt-16 max-w-sm">
            <div className="relative overflow-hidden rounded-2xl shadow-2xl" style={{ aspectRatio: "4/3" }}>
              <div className="absolute inset-0 bg-gradient-to-br from-stone-100 via-amber-50 to-stone-200" />
              <div className="absolute inset-0 bg-[radial-gradient(#d4c5b2_1px,transparent_1px)] bg-[length:16px_16px] opacity-20" />
              <div className="absolute inset-3 rounded-lg border border-stone-300/40" />
              <div className="absolute inset-6 rounded bg-gradient-to-br from-amber-100/40 via-transparent to-stone-200/30" />

              {/* Wax seal */}
              <div className="absolute bottom-1/3 left-1/2 z-10 flex h-14 w-14 -translate-x-1/2 translate-y-1/2 items-center justify-center rounded-full shadow-lg"
                style={{ background: "radial-gradient(circle at 40% 40%, #c9a96e, #8b6914)" }}>
                <span className="font-serif text-lg text-amber-100 drop-shadow">✦</span>
              </div>

              {/* Flap */}
              <div className="absolute top-0 left-0 right-0 z-10 origin-top"
                style={{
                  height: "50%",
                  background: "linear-gradient(180deg, #e8dccf 0%, #dfceb8 100%)",
                  clipPath: "polygon(0 0, 50% 100%, 100% 0)",
                }}>
              </div>

              <div className="absolute inset-0 flex flex-col items-center justify-center p-8 opacity-50">
                <p className="font-serif text-sm tracking-[0.2em] text-stone-500 uppercase">
                  You are invited
                </p>
                <p className="mt-1 font-serif text-xl italic text-stone-600">
                  Sarah & John&apos;s Wedding
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature highlights */}
      <section className="border-y bg-white px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-center font-serif text-2xl font-semibold tracking-tight text-stone-900 sm:text-3xl">
            The unboxing experience paper deserves
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-center text-stone-500">
            Every invitation feels like it arrived in a hand-addressed envelope.
          </p>

          <div className="mt-14 grid gap-10 sm:grid-cols-3">
            {[
              {
                icon: (
                  <Mail className="h-6 w-6 text-amber-700" />
                ),
                title: "Wax-Sealed Envelope",
                desc: "Guests tap a wax seal to reveal their invitation — just like opening a real envelope. The animation is smooth, tactile, and unforgettable.",
              },
              {
                icon: (
                  <Sparkles className="h-6 w-6 text-amber-700" />
                ),
                title: "AI-Crafted Copy",
                desc: "Not sure what to write? Our AI generates warm, personal invitation prose that matches your event's tone — romantic, formal, or playful.",
              },
              {
                icon: (
                  <Users className="h-6 w-6 text-amber-700" />
                ),
                title: "Zero-Friction RSVP",
                desc: "Guests respond in one tap. Dietary preferences, plus-ones, seating — all collected automatically. Real-time stats on your dashboard.",
              },
            ].map((f) => (
              <div key={f.title} className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100">
                  {f.icon}
                </div>
                <h3 className="mb-2 font-semibold text-stone-900">{f.title}</h3>
                <p className="text-sm leading-relaxed text-stone-500">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Scenarios */}
      <section className="bg-stone-50 px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-center font-serif text-2xl font-semibold tracking-tight text-stone-900 sm:text-3xl">
            Designed for every occasion
          </h2>

          <div className="mt-14 grid gap-6 sm:grid-cols-3">
            {scenarios.map((s) => (
              <div
                key={s.title}
                className={`rounded-2xl bg-gradient-to-br ${s.gradient} border p-8 shadow-sm transition-shadow hover:shadow-md`}
              >
                <span className="text-3xl">{s.icon}</span>
                <h3 className="mt-4 font-semibold text-stone-900">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-stone-500">
                  {s.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social proof */}
      <section className="bg-white px-6 py-20">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-center font-serif text-2xl font-semibold tracking-tight text-stone-900 sm:text-3xl">
            Hosts love the experience
          </h2>

          <div className="mt-14 grid gap-8 sm:grid-cols-2">
            {testimonials.map((t) => (
              <div
                key={t.author}
                className="rounded-2xl border bg-stone-50/50 p-8"
              >
                <div className="mb-4 flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-amber-400">
                      ★
                    </span>
                  ))}
                </div>
                <blockquote className="font-serif text-lg italic leading-relaxed text-stone-700">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                <div className="mt-4">
                  <p className="font-semibold text-stone-900">{t.author}</p>
                  <p className="text-sm text-stone-500">{t.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-stone-900 px-6 py-20 text-center">
        <h2 className="font-serif text-2xl font-semibold tracking-tight text-white sm:text-3xl">
          Ready to create something beautiful?
        </h2>
        <p className="mx-auto mt-3 max-w-md text-stone-400">
          Start free. Upgrade when you need premium themes, unlimited guests, and AI copywriting.
        </p>
        <Link
          href="/login"
          className={cn(
            buttonVariants({ size: "lg" }),
            "mt-8 h-12 bg-amber-600 px-8 text-base text-white hover:bg-amber-700",
          )}
        >
          Get Started Free
          <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white py-8 text-center text-xs text-stone-400">
        <span className="font-medium text-stone-500">VibeInvite</span>
        &nbsp;&mdash; Premium Digital Invitations. Crafted for moments that
        matter.
      </footer>
    </div>
  );
}
