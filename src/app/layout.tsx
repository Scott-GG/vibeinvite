import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "VibeInvite — Premium Digital Invitations",
  description:
    "Create stunning, paper-like digital invitations with effortless RSVP management for weddings, galas, and milestone celebrations.",
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
      </body>
    </html>
  );
}
