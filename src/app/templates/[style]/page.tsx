import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Palette } from "lucide-react";
import { getAllThemes } from "@/lib/themes";

const styleInfo = {
  modern: {
    title: "Modern Minimalist Digital Invitation Templates",
    description:
      "Clean lines, bold typography, and contemporary elegance. Perfect for urban weddings and modern celebrations.",
    keywords: ["modern invitations", "minimalist digital invites", "contemporary wedding invitations", "clean invitation design"],
  },
  floral: {
    title: "Romantic Floral Digital Invitation Templates",
    description:
      "Soft botanical illustrations, garden-inspired palettes, and romantic flourishes for weddings and spring celebrations.",
    keywords: ["floral invitations", "romantic wedding invites", "garden party invitations", "botanical invitation design"],
  },
  classic: {
    title: "Classic Elegant Digital Invitation Templates",
    description:
      "Timeless typography, traditional layouts, and refined gold accents. For formal weddings and black-tie events.",
    keywords: ["classic invitations", "elegant wedding invites", "traditional invitation templates", "formal digital invitations"],
  },
  dark: {
    title: "Dark Luxe Digital Invitation Templates",
    description:
      "Bold dark backgrounds, gold foil accents, and dramatic contrast. For evening galas and sophisticated celebrations.",
    keywords: ["dark luxury invitations", "black tie invites", "evening event invitations", "luxe digital invitations"],
  },
};

type StyleKey = keyof typeof styleInfo;

export function generateStaticParams() {
  return Object.keys(styleInfo).map((style) => ({ style }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ style: string }>;
}): Promise<Metadata> {
  const { style } = await params;
  const data = styleInfo[style as StyleKey];
  if (!data) return { title: "Page Not Found" };

  return {
    title: data.title,
    description: data.description,
    keywords: data.keywords,
    openGraph: {
      title: data.title,
      description: data.description,
    },
  };
}

export default async function TemplateStylePage({
  params,
}: {
  params: Promise<{ style: string }>;
}) {
  const { style } = await params;
  const data = styleInfo[style as StyleKey];
  if (!data) return null;

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Hero */}
      <section className="bg-stone-900 px-6 py-20 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gold/20">
          <Palette className="h-8 w-8 text-gold" />
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
          Try This Style <ArrowRight className="h-4 w-4" />
        </Link>
      </section>

      {/* All Themes */}
      <section className="mx-auto max-w-5xl px-6 py-16">
        <h2 className="text-center font-serif text-2xl font-semibold text-stone-900">
          Explore All Premium Themes
        </h2>
        <p className="mt-2 text-center text-sm text-stone-500">
          6 designer-crafted themes for every occasion
        </p>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {getAllThemes().map((theme) => (
            <div
              key={theme.id}
              className="rounded-2xl border bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
            >
              <div
                className="h-32 rounded-xl"
                style={{ background: `linear-gradient(135deg, ${theme.envelopeBg}, ${theme.sealOuter})` }}
              />
              <h3 className="mt-4 font-semibold text-stone-900">{theme.name}</h3>
              <p className="mt-1 text-xs text-stone-500">{theme.emotion}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-stone-900 px-6 py-16 text-center">
        <p className="font-serif text-2xl text-cream">
          Pick your theme and start creating
        </p>
        <p className="mt-2 text-sm text-cream/50">
          Every theme includes wax-sealed envelope animation. Free for your first 15 guests.
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
