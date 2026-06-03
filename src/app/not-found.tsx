import type { Metadata } from "next";
import Link from "next/link";
import { Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "Page Not Found — VibeInvite",
  robots: { index: false, follow: true },
};

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-stone-50 px-6">
      <div className="text-center">
        <Sparkles className="mx-auto h-12 w-12 text-gold" />
        <p className="mt-4 font-display text-6xl tracking-wider text-stone-300">
          404
        </p>
        <h1 className="mt-4 font-serif text-2xl font-semibold text-stone-900">
          Page Not Found
        </h1>
        <p className="mt-2 text-stone-500">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link
          href="/"
          className="mt-8 inline-block rounded-full bg-stone-900 px-6 py-2.5 text-sm font-medium text-cream transition-colors hover:bg-stone-800"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
