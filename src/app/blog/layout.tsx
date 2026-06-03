import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Blog — VibeInvite",
  description:
    "Wedding invitation tips, etiquette guides, digital invitation trends, and event planning resources from the VibeInvite team.",
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-stone-50">
      <div className="mx-auto max-w-3xl px-6 py-12 sm:py-16">
        <nav className="mb-8 flex items-center gap-2 text-sm text-stone-500">
          <Link href="/" className="hover:text-stone-800">
            Home
          </Link>
          <span>/</span>
          <span className="text-stone-800">Blog</span>
        </nav>
        {children}
      </div>
    </div>
  );
}
