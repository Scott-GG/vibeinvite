import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { CalendarDays, Clock, ArrowLeft } from "lucide-react";
import { ArticleSchema } from "@/lib/schema";
import { getPostBySlug, getRelatedPosts } from "../data/posts";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return { title: "Post Not Found" };

  return {
    title: `${post.title} — VibeInvite Blog`,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.publishedAt,
      tags: post.tags,
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const related = getRelatedPosts(slug);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://vibeinvite.bzwl.club";

  return (
    <>
      <ArticleSchema
        title={post.title}
        description={post.description}
        publishedAt={post.publishedAt}
        author={post.author}
        url={`${siteUrl}/blog/${post.slug}`}
      />

      <article>
        <Link
          href="/blog"
          className="mb-6 inline-flex items-center gap-1 text-sm text-stone-500 hover:text-stone-800 transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Blog
        </Link>

        <div className="flex flex-wrap items-center gap-3 text-xs text-stone-500 mt-4">
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

        <h1 className="mt-4 font-serif text-3xl font-semibold tracking-tight text-stone-900 sm:text-4xl">
          {post.title}
        </h1>
        <p className="mt-3 text-lg leading-relaxed text-stone-500">{post.description}</p>

        <div className="mt-8 text-stone-700 leading-relaxed space-y-4 [&_h2]:font-serif [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-stone-900 [&_h2]:mt-8 [&_h2]:mb-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1 [&_blockquote]:border-l-4 [&_blockquote]:border-amber-300 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-stone-600 [&_blockquote]:my-4">
          {post.content}
        </div>

        {/* CTA */}
        <div className="mt-10 rounded-2xl bg-stone-900 p-8 text-center">
          <p className="font-serif text-xl text-cream">
            Ready to create your own stunning invitation?
          </p>
          <p className="mt-2 text-sm text-cream/60">
            Start with a free account. Choose a theme, customize every detail, and send in minutes.
          </p>
          <Link
            href="/login"
            className="mt-4 inline-block rounded-full bg-gold px-6 py-2.5 text-sm font-medium text-stone-900 transition-colors hover:bg-gold-light"
          >
            Get Started Free
          </Link>
        </div>

        {/* Related Posts */}
        {related.length > 0 && (
          <div className="mt-12 border-t border-stone-200 pt-8">
            <h2 className="font-serif text-xl font-semibold text-stone-900">Related Articles</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {related.map((r) => (
                <Link
                  key={r.slug}
                  href={`/blog/${r.slug}`}
                  className="rounded-lg border bg-white p-4 text-sm transition-all hover:border-amber-300 hover:shadow-sm"
                >
                  <p className="font-medium text-stone-900">{r.title}</p>
                  <p className="mt-1 line-clamp-2 text-xs text-stone-500">{r.description}</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </article>
    </>
  );
}
