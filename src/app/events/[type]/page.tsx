import type { Metadata } from "next";
import Link from "next/link";
import { CalendarDays, Users, Sparkles, ArrowRight, PartyPopper, Heart, Gift, Star, Briefcase } from "lucide-react";
import { FAQPageSchema } from "@/lib/schema";

const eventTypes = {
  weddings: {
    title: "Premium Digital Wedding Invitations",
    description:
      "Create stunning digital wedding invitations with wax-sealed envelope animations, AI copywriting, and effortless RSVP tracking. Designed for modern couples who want an unforgettable first impression.",
    icon: Heart,
    keywords: ["digital wedding invitations", "online wedding invites", "wedding invitation maker", "elegant wedding invitations"],
    faqs: [
      { q: "Are digital wedding invitations appropriate for formal weddings?", a: "Yes! Modern digital invitations with premium designs and wax-sealed animations are increasingly popular for formal weddings. They deliver an elegant experience that rivals — and in many ways surpasses — printed invitations." },
      { q: "How much do digital wedding invitations cost?", a: "VibeInvite starts free for up to 15 guests. The Pro plan ($12/month) includes unlimited guests, all premium themes, AI copywriting, and full RSVP management. Compared to $500+ for printed invitations, it's a significant saving." },
      { q: "Can I customize the invitation design to match my wedding colors?", a: "Yes. Each theme is fully customizable — colors, fonts, imagery, and the personal message. You control every detail." },
    ],
  },
  galas: {
    title: "Elegant Digital Gala & Benefit Invitations",
    description:
      "Digital invitations worthy of your black-tie gala, charity benefit, or awards ceremony. Premium designs with wax-sealed envelopes and professional RSVP management.",
    icon: Star,
    keywords: ["gala invitations", "charity benefit invitations", "formal event invitations", "black tie invitations"],
    faqs: [
      { q: "Can I manage table assignments for a gala?", a: "Yes. VibeInvite Pro includes a seating chart tool for managing table assignments, perfect for formal galas and benefit dinners." },
      { q: "How do I track RSVPs for a large charity event?", a: "The real-time dashboard shows acceptances, declines, dietary preferences, and plus-ones for every guest. You can send automated reminders to pending guests." },
    ],
  },
  birthdays: {
    title: "Milestone Birthday Digital Invitations",
    description:
      "Celebrate milestone birthdays with style. Custom digital invitations for 30th, 40th, 50th, and beyond — with playful or elegant designs and zero-friction RSVPs.",
    icon: PartyPopper,
    keywords: ["birthday invitations", "milestone birthday invites", "digital birthday cards", "birthday party invitations"],
    faqs: [
      { q: "Can I use VibeInvite for a surprise party?", a: "Absolutely. The invitation can include special instructions for guests — like arrival time, parking directions, and the all-important 'shh, it's a surprise!' note." },
      { q: "How many guests can I invite for a birthday?", a: "The Free plan supports up to 15 guests. Pro ($12/mo) includes unlimited guests — perfect for large milestone celebrations." },
    ],
  },
  "baby-showers": {
    title: "Beautiful Digital Baby Shower Invitations",
    description:
      "Adorable and elegant baby shower invitations with wax-sealed envelopes. Collect RSVPs, meal preferences, and gift registry info — all in one place.",
    icon: Gift,
    keywords: ["baby shower invitations", "digital baby shower invites", "gender reveal invitations", "baby sprinkle invitations"],
    faqs: [
      { q: "Can guests see the gift registry from the invitation?", a: "Yes. You can include a registry link directly on your invitation and RSVP page. Guests can access it with one tap." },
      { q: "Is there a theme suitable for baby showers?", a: "Our Blush & Gold and Garden Party themes are particularly popular for baby showers. Both are soft, warm, and celebratory." },
    ],
  },
  corporate: {
    title: "Professional Corporate Event Invitations",
    description:
      "Host corporate galas, holiday parties, conferences, and team events with polished digital invitations. Professional design, easy RSVP management, and brand-consistent presentation.",
    icon: Briefcase,
    keywords: ["corporate event invitations", "business event invites", "company party invitations", "conference invitations"],
    faqs: [
      { q: "Can I white-label invitations for my company?", a: "The Wedding plan ($29/mo) includes white-labeling — remove VibeInvite branding for a fully custom-branded experience." },
      { q: "How do I send invitations to hundreds of employees?", a: "VibeInvite Pro supports CSV bulk import. Upload your employee list once and send invitations immediately. No per-guest fees." },
    ],
  },
};

type EventType = keyof typeof eventTypes;

export function generateStaticParams() {
  return Object.keys(eventTypes).map((type) => ({ type }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ type: string }>;
}): Promise<Metadata> {
  const { type } = await params;
  const data = eventTypes[type as EventType];
  if (!data) return { title: "Page Not Found" };

  return {
    title: data.title,
    description: data.description,
    keywords: data.keywords,
    openGraph: {
      title: data.title,
      description: data.description,
    },
    alternates: {
      canonical: `https://vibeinvite.bzwl.club/events/${type}`,
    },
  };
}

export default async function EventTypePage({
  params,
}: {
  params: Promise<{ type: string }>;
}) {
  const { type } = await params;
  const data = eventTypes[type as EventType];
  if (!data) return null;

  const Icon = data.icon;

  return (
    <div className="min-h-screen bg-stone-50">
      <FAQPageSchema questions={data.faqs} />

      {/* Hero */}
      <section className="bg-stone-900 px-6 py-20 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gold/20">
          <Icon className="h-8 w-8 text-gold" />
        </div>
        <h1 className="mt-6 font-display text-4xl tracking-wide text-cream sm:text-5xl">
          {data.title}
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-cream/60">
          {data.description}
        </p>
        <Link
          href="/login"
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-gold px-8 py-3 font-medium text-stone-900 transition-colors hover:bg-gold-light"
        >
          Create Your Invitation <ArrowRight className="h-4 w-4" />
        </Link>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-4xl px-6 py-16">
        <div className="grid gap-8 sm:grid-cols-3">
          {[
            { icon: Sparkles, title: "6 Premium Themes", desc: "Designer-crafted themes with animated wax-sealed envelopes." },
            { icon: Users, title: "Effortless RSVPs", desc: "Real-time tracking, dietary preferences, plus-one management." },
            { icon: CalendarDays, title: "Instant Delivery", desc: "Send in minutes. Guests open with delight on any device." },
          ].map((f) => (
            <div key={f.title} className="rounded-2xl border bg-white p-8 text-center shadow-sm">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100">
                <f.icon className="h-6 w-6 text-amber-700" />
              </div>
              <h2 className="mt-4 font-semibold text-stone-900">{f.title}</h2>
              <p className="mt-2 text-sm text-stone-500">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-3xl px-6 pb-20">
        <h2 className="font-serif text-2xl font-semibold text-stone-900 text-center mb-8">
          Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          {data.faqs.map((faq) => (
            <details key={faq.q} className="group rounded-xl border bg-white p-5">
              <summary className="cursor-pointer font-medium text-stone-900 group-open:text-amber-700">
                {faq.q}
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-stone-600">{faq.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-stone-900 px-6 py-16 text-center">
        <p className="font-serif text-2xl text-cream">
          Ready to invite your guests?
        </p>
        <p className="mt-2 text-sm text-cream/50">
          Start free. Upgrade when you need more.
        </p>
        <div className="mt-6 flex items-center justify-center gap-4">
          <Link
            href="/login"
            className="rounded-full bg-gold px-8 py-3 font-medium text-stone-900 transition-colors hover:bg-gold-light"
          >
            Get Started Free
          </Link>
          <Link
            href="/pricing"
            className="rounded-full border border-gold/30 px-8 py-3 font-medium text-cream transition-colors hover:bg-gold/10"
          >
            View Pricing
          </Link>
        </div>
      </section>
    </div>
  );
}
