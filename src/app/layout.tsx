import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://vibeinvite.bzwl.club";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "VibeInvite — Premium Digital Invitations",
    template: "%s — VibeInvite",
  },
  description:
    "Create stunning, paper-like digital invitations with wax-sealed envelope animations, AI-crafted copy, and effortless RSVP tracking. Perfect for weddings, galas, and milestone celebrations.",
  keywords: [
    "digital invitations",
    "online invitations",
    "wedding invitations",
    "premium invitations",
    "RSVP management",
    "digital invite",
    "event invitations",
    "paperless invitations",
    "invitation maker",
    "AI invitation writer",
  ],
  authors: [{ name: "VibeInvite" }],
  creator: "VibeInvite",
  publisher: "VibeInvite",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "VibeInvite",
    title: "VibeInvite — Premium Digital Invitations",
    description:
      "Create stunning, paper-like digital invitations with wax-sealed envelope animations. The invitation is the first moment your guests will remember.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "VibeInvite — Premium Digital Invitations",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "VibeInvite — Premium Digital Invitations",
    description:
      "Create stunning, paper-like digital invitations with wax-sealed envelope animations.",
    images: ["/og-image.png"],
  },
  alternates: {
    canonical: siteUrl,
  },
  icons: {
    icon: "/favicon.ico",
  },
};

const footerLinks = [
  { href: "/terms", label: "Terms" },
  { href: "/privacy", label: "Privacy" },
  { href: "/refund", label: "Refunds" },
  { href: "/contact", label: "Contact" },
  { href: "/pricing", label: "Pricing" },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <div className="flex-1">{children}</div>
        <footer className="border-t bg-white py-6 text-center">
          <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-1">
            {footerLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-xs text-stone-400 transition-colors hover:text-stone-600"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <p className="mt-3 text-xs text-stone-400">
            &copy; {new Date().getFullYear()} VibeInvite. All rights reserved.
          </p>
        </footer>
        <Toaster />
        <Analytics />
      </body>
    </html>
  );
}
