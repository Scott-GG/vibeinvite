import type { Metadata } from "next";
import Link from "next/link";
import { Check, ArrowRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Pricing — Simple, Transparent Pricing | VibeInvite",
  description:
    "Start free with 15 guests. Upgrade to Pro ($12/mo) for unlimited guests, all 6 premium themes, AI copywriting, and more.",
  openGraph: {
    title: "VibeInvite Pricing — Start Free, Upgrade When You Need More",
    description:
      "Free: $0 forever. Pro: $12/month. Team: $29/month. All plans include wax-sealed envelope animations and effortless RSVP tracking.",
  },
};

const plans = [
  {
    name: "Free",
    priceMonthly: 0,
    bestFor: "Trying it out",
    description: "Everything you need for a small, intimate gathering.",
    features: [
      "Up to 15 guests",
      "1 theme (Classic Elegance)",
      "RSVP tracking & management",
      "Email invitations",
      "Real-time guest stats",
    ],
    cta: "Get Started Free",
    href: "/login",
    highlight: false,
  },
  {
    name: "Pro",
    priceMonthly: 12,
    bestFor: "Most popular",
    description: "All themes, unlimited guests, AI-powered copy — for hosts who want the best.",
    features: [
      "Unlimited guests",
      "All 6 premium themes",
      "AI invitation copywriter",
      "CSV bulk guest import",
      "Dietary preference tracking",
      "Seating chart & table assignment",
      "Guest data export (CSV/Excel)",
      "Send reminders to pending guests",
      "Wax-seal envelope animation",
    ],
    cta: "Start Free Trial",
    href: "/login",
    highlight: true,
  },
  {
    name: "Team",
    priceMonthly: 29,
    bestFor: "Planners & businesses",
    description: "For wedding planners, event coordinators, and teams managing multiple events.",
    features: [
      "Everything in Pro",
      "Unlimited events",
      "Priority email support",
      "Early access to new themes",
      "Custom domain support",
      "Team members (up to 5)",
      "Background music for invitations",
    ],
    cta: "Contact Sales",
    href: "/contact",
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
      <section className="px-6 pb-8 pt-16 text-center">
        <span className="inline-block rounded-full border border-amber-200 bg-amber-50 px-4 py-1 text-xs font-medium tracking-wide text-amber-800 uppercase">
          Pricing
        </span>
        <h1 className="mt-4 font-serif text-4xl font-semibold tracking-tight text-stone-900">
          Simple, transparent pricing
        </h1>
        <p className="mx-auto mt-3 max-w-lg text-stone-500">
          Start free. Upgrade when you need more guests, premium themes, and
          AI-powered copy. Cancel anytime, no hidden fees.
        </p>
      </section>

      {/* Pricing Cards */}
      <section className="mx-auto max-w-5xl px-6 pb-16">
        <div className="grid gap-8 md:grid-cols-3">
          {plans.map((plan) => {
            const annualPrice = Math.round(plan.priceMonthly * 12 * 0.8);
            const annualMonthly = (annualPrice / 12).toFixed(0);

            return (
            <div
              key={plan.name}
              className={cn(
                "relative flex flex-col rounded-2xl border bg-white p-8 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg",
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

              <div className="mb-2">
                {plan.priceMonthly === 0 ? (
                  <span className="text-4xl font-bold tracking-tight">$0</span>
                ) : (
                  <>
                    <span className="text-4xl font-bold tracking-tight">
                      ${plan.priceMonthly}
                    </span>
                    <span className="text-stone-400">/mo</span>
                  </>
                )}
              </div>

              {plan.priceMonthly > 0 && (
                <div className="mb-6">
                  <p className="text-xs text-stone-400">
                    or <span className="font-medium text-stone-600">${annualMonthly}/mo</span> billed annually
                    <span className="ml-1 rounded bg-emerald-100 px-1.5 py-0.5 text-[10px] font-medium text-emerald-700">
                      Save 20%
                    </span>
                  </p>
                  <p className="mt-0.5 text-xs text-stone-400">
                    ${annualPrice}/year
                  </p>
                </div>
              )}

              {plan.priceMonthly === 0 && <div className="mb-6" />}

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
            );
          })}
        </div>

        {/* FAQ */}
        <div className="mx-auto mt-20 max-w-2xl">
          <h2 className="text-center font-serif text-2xl font-semibold tracking-tight text-stone-900">
            Frequently asked questions
          </h2>
          <div className="mt-10 space-y-6">
            {[
              {
                q: "Can I cancel my Pro subscription anytime?",
                a: "Absolutely. Cancel anytime from your Billing page. You'll retain access until the end of your billing period. No hidden fees, no lock-in.",
              },
              {
                q: "Do my guests need to create an account to RSVP?",
                a: "No! Each guest receives a unique, secure link. They can RSVP, indicate dietary preferences, and add a plus-one — all without signing up.",
              },
              {
                q: "Can I switch from monthly to annual billing?",
                a: "Yes. Switch anytime from your Billing settings. You'll save 20% with annual billing and the change takes effect at the start of your next billing cycle.",
              },
              {
                q: "What payment methods do you accept?",
                a: "We process payments securely through PayPal. All major credit and debit cards are accepted — Visa, Mastercard, American Express, and more.",
              },
              {
                q: "Is there a free trial for Pro?",
                a: "You can start with the Free plan to try the core experience. When you're ready, upgrade to Pro — if you cancel within 7 days, you won't be charged.",
              },
              {
                q: "Can I use VibeInvite for multiple events?",
                a: "Free and Pro support one active event at a time. The Team plan supports unlimited events and is designed for planners managing multiple celebrations.",
              },
            ].map((faq) => (
              <div key={faq.q}>
                <h3 className="font-medium text-stone-900">{faq.q}</h3>
                <p className="mt-1 text-sm leading-relaxed text-stone-500">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
