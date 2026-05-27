import Link from "next/link";
import { Check, ArrowRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const plans = [
  {
    name: "Starter",
    price: "$0",
    period: "forever",
    bestFor: "Trying it out",
    description: "Everything you need for a small, intimate gathering.",
    features: [
      "Up to 15 guests",
      "Classic Elegance theme",
      "RSVP tracking & management",
      "Email invitations",
      "Real-time guest stats",
    ],
    cta: "Get Started Free",
    href: "/login",
    highlight: false,
  },
  {
    name: "Signature",
    price: "$29",
    period: "per event",
    bestFor: "One unforgettable event",
    description: "Premium themes, unlimited guests, and AI that writes for you.",
    features: [
      "Unlimited guests",
      "All 6 premium themes",
      "AI invitation copywriter",
      "Smart seating chart",
      "Dietary preference tracking",
      "Guest data export",
      "Wax-seal envelope animation",
    ],
    cta: "Create Event First",
    href: "/login",
    highlight: true,
  },
  {
    name: "Host",
    price: "$9.99",
    period: "per month",
    bestFor: "Serial hosts & planners",
    description: "Every feature, every event — all year. Built for people who host often.",
    features: [
      "Everything in Signature",
      "Unlimited events",
      "Priority email support",
      "Early access to new themes",
      "Custom domain support",
      "Background music for invitations",
    ],
    cta: "Subscribe Now",
    href: "/login",
    highlight: false,
  },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-50 to-white">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4">
        <Link href="/" className="text-lg font-semibold tracking-tight">
          VibeInvite
        </Link>
        <Link
          href="/login"
          className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
        >
          Sign In
        </Link>
      </header>

      {/* Hero */}
      <section className="px-6 pb-12 pt-16 text-center">
        <span className="inline-block rounded-full border border-amber-200 bg-amber-50 px-4 py-1 text-xs font-medium tracking-wide text-amber-800 uppercase">
          Pricing
        </span>
        <h1 className="mt-4 font-serif text-4xl font-semibold tracking-tight text-stone-900">
          Choose the right plan for your event
        </h1>
        <p className="mx-auto mt-3 max-w-lg text-stone-500">
          Start free. Upgrade when you need more guests, premium themes, and
          AI-powered copy. No hidden fees, cancel anytime.
        </p>
      </section>

      {/* Pricing Cards */}
      <section className="mx-auto max-w-5xl px-6 pb-24">
        <div className="grid gap-8 md:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={cn(
                "relative flex flex-col rounded-2xl border bg-white p-8 shadow-sm transition-shadow hover:shadow-lg",
                plan.highlight &&
                  "border-amber-300 ring-2 ring-amber-100 shadow-xl",
              )}
            >
              {plan.highlight && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-amber-100 px-4 py-0.5 text-xs font-medium text-amber-800">
                  Most Popular
                </span>
              )}

              <div className="mb-2">
                <span className="text-xs font-medium tracking-wide text-stone-400 uppercase">
                  {plan.bestFor}
                </span>
              </div>

              <div className="mb-4">
                <h3 className="text-xl font-semibold">{plan.name}</h3>
                <p className="mt-1 text-sm leading-relaxed text-stone-500">
                  {plan.description}
                </p>
              </div>

              <div className="mb-6">
                <span className="text-4xl font-bold tracking-tight">
                  {plan.price}
                </span>
                <span className="text-stone-400"> /{plan.period}</span>
              </div>

              <ul className="mb-8 flex-1 space-y-3">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                    <span className="text-stone-600">{f}</span>
                  </li>
                ))}
              </ul>

              <Link
                href={plan.href}
                className={cn(
                  buttonVariants({
                    variant: plan.highlight ? "default" : "outline",
                  }),
                  "w-full",
                )}
              >
                {plan.cta}
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
