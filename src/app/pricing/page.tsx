import Link from "next/link";
import { Check, ArrowRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Perfect for trying it out",
    features: [
      "Up to 15 guests per event",
      "Classic invitation theme",
      "RSVP management",
      "Email invitations",
    ],
    cta: "Get Started Free",
    href: "/login",
    highlight: false,
  },
  {
    name: "Pro Event",
    price: "$29",
    period: "per event",
    description: "Make it unforgettable",
    features: [
      "Unlimited guests",
      "All premium themes",
      "AI copywriter",
      "Smart seating chart",
      "Dietary preferences",
      "Data export",
    ],
    cta: "Create Event First",
    href: "/login",
    highlight: true,
  },
  {
    name: "Unlimited",
    price: "$9.99",
    period: "per month",
    description: "For hosts and planners",
    features: [
      "Everything in Pro",
      "Unlimited events",
      "Priority support",
      "Early access to new features",
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
      <section className="px-6 pb-16 pt-16 text-center">
        <h1 className="text-4xl font-semibold tracking-tight text-stone-900">
          Simple, transparent pricing
        </h1>
        <p className="mx-auto mt-4 max-w-lg text-muted-foreground">
          Choose the right plan for your event. Upgrade anytime — no hidden
          fees.
        </p>
      </section>

      {/* Pricing Cards */}
      <section className="mx-auto max-w-5xl px-6 pb-24">
        <div className="grid gap-8 md:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={cn(
                "relative flex flex-col rounded-2xl border bg-white p-8 shadow-sm transition-shadow hover:shadow-md",
                plan.highlight &&
                  "border-amber-300 ring-2 ring-amber-100 shadow-lg",
              )}
            >
              {plan.highlight && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-amber-100 px-3 py-0.5 text-xs font-medium text-amber-800">
                  Most Popular
                </span>
              )}
              <div className="mb-6">
                <h3 className="text-lg font-semibold">{plan.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {plan.description}
                </p>
              </div>
              <div className="mb-6">
                <span className="text-4xl font-bold tracking-tight">
                  {plan.price}
                </span>
                <span className="text-muted-foreground"> /{plan.period}</span>
              </div>
              <ul className="mb-8 flex-1 space-y-3">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                    {f}
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

      {/* Footer */}
      <footer className="border-t py-8 text-center text-xs text-muted-foreground">
        Powered by VibeInvite — Premium Digital Invitations
      </footer>
    </div>
  );
}
