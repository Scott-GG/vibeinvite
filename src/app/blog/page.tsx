import type { Metadata } from "next";
import Link from "next/link";
import { CalendarDays, Clock, ArrowRight } from "lucide-react";
import { ArticleSchema } from "@/lib/schema";
import { getAllPosts } from "./data/posts";

export const metadata: Metadata = {
  title: "Digital Invitation Tips & Wedding Planning Blog | VibeInvite",
  description:
    "Expert guides on digital wedding invitations, RSVP etiquette, invitation wording, and event planning. Tips and trends for modern hosts.",
  openGraph: {
    title: "Digital Invitation Tips & Wedding Planning Blog",
    description:
      "Expert guides on digital wedding invitations, RSVP etiquette, invitation wording, and event planning.",
  },
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <div>
      <h1 className="font-serif text-3xl font-semibold tracking-tight text-stone-900 sm:text-4xl">
        The VibeInvite Blog
      </h1>
      <p className="mt-3 text-stone-500">
        Digital invitation tips, wedding planning guides, and etiquette advice for modern hosts.
      </p>

      <div className="mt-10 space-y-8">
        {posts.map((post) => (
          <article key={post.slug}>
            <Link
              href={`/blog/${post.slug}`}
              className="group block rounded-2xl border bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
            >
              <div className="flex items-center gap-3 text-xs text-stone-500">
                <span className="rounded-full bg-amber-100 px-2.5 py-0.5 font-medium text-amber-800">
                  {post.category}
                </span>
                <span className="flex items-center gap-1">
                  <CalendarDays className="h-3 w-3" />
                  {new Date(post.publishedAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {post.readingTime}
                </span>
              </div>

              <h2 className="mt-3 font-serif text-xl font-semibold text-stone-900 transition-colors group-hover:text-amber-700">
                {post.title}
              </h2>
              <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-stone-500">
                {post.description}
              </p>
              <div className="mt-4 flex items-center gap-1 text-sm font-medium text-amber-700">
                Read article <ArrowRight className="h-3.5 w-3.5" />
              </div>
            </Link>
          </article>
        ))}
      </div>

      {posts.length === 0 && (
        <div className="py-20 text-center">
          <p className="text-stone-500">Articles coming soon. Check back shortly.</p>
        </div>
      )}
    </div>
  );
}
