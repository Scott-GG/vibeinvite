import type { Metadata } from "next";
import Link from "next/link";
import { Italiana, Cormorant_Garamond, Great_Vibes, Jost, Geist_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { OrganizationSchema, WebSiteSchema } from "@/lib/schema";
import "./globals.css";

const italiana = Italiana({
  weight: "400",
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
});

const cormorantGaramond = Cormorant_Garamond({
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-serif",
  subsets: ["latin"],
  display: "swap",
});

const greatVibes = Great_Vibes({
  weight: "400",
  variable: "--font-script",
  subsets: ["latin"],
  display: "swap",
});

const jost = Jost({
  weight: ["300", "400", "500"],
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
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
  },
  alternates: {
    canonical: siteUrl,
  },
  icons: {
    icon: "/favicon.ico",
  },
};

const productLinks = [
  { href: "/#features", label: "Features" },
  { href: "/#themes", label: "Themes" },
  { href: "/pricing", label: "Pricing" },
  { href: "/blog", label: "Blog" },
];

const legalLinks = [
  { href: "/terms", label: "Terms" },
  { href: "/privacy", label: "Privacy" },
  { href: "/refund", label: "Refunds" },
];

const supportLinks = [
  { href: "/contact", label: "Contact" },
  { href: "/pricing", label: "FAQ" },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${jost.variable} ${cormorantGaramond.variable} ${italiana.variable} ${greatVibes.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col font-sans">
        <OrganizationSchema />
        <WebSiteSchema />
        <div className="flex-1">{children}</div>

        {/* Brand Footer */}
        <footer className="bg-deep text-cream/70">
          <div className="mx-auto max-w-6xl px-6 py-16">
            <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
              {/* Brand */}
              <div>
                <Link href="/" className="font-display text-2xl text-gold">
                  VibeInvite
                </Link>
                <p className="mt-3 text-sm leading-relaxed text-cream/50">
                  The invitation your guests will remember.
                </p>
              </div>

              {/* Product */}
              <div>
                <h4 className="mb-3 text-xs font-medium uppercase tracking-widest text-cream/40">
                  Product
                </h4>
                <ul className="space-y-2">
                  {productLinks.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-sm text-cream/60 transition-colors hover:text-gold"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Legal */}
              <div>
                <h4 className="mb-3 text-xs font-medium uppercase tracking-widest text-cream/40">
                  Legal
                </h4>
                <ul className="space-y-2">
                  {legalLinks.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-sm text-cream/60 transition-colors hover:text-gold"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Support */}
              <div>
                <h4 className="mb-3 text-xs font-medium uppercase tracking-widest text-cream/40">
                  Support
                </h4>
                <ul className="space-y-2">
                  {supportLinks.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-sm text-cream/60 transition-colors hover:text-gold"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-12 border-t border-gold/10 pt-6 text-center">
              <p className="text-xs text-cream/30">
                &copy; {new Date().getFullYear()} VibeInvite. All rights reserved.
              </p>
            </div>
          </div>
        </footer>

        <Toaster />
      </body>
    </html>
  );
}
