import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  formatBlogDate,
  getAllPosts,
  getAllPostSlugs,
  getCoverImageUrl,
  getPostBySlug,
  extractBlogFaqsFromMarkdown,
} from "@/lib/blog";
import BlogPostBody from "@/components/blog/BlogPostBody";
import BlogPostCta from "@/components/blog/BlogPostCta";
import BlogSampleStrip from "@/components/blog/BlogSampleStrip";
import BlogCoverImage from "@/components/blog/BlogCoverImage";
import BlogAuthorBio from "@/components/blog/BlogAuthorBio";
import BlogRelatedPosts from "@/components/blog/BlogRelatedPosts";
import { getBlogArticleJsonLd } from "@/lib/json-ld";
import { ArrowLeft, Clock } from "lucide-react";

type Props = {
  params: { slug: string };
};

export function generateStaticParams() {
  return getAllPostSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = getPostBySlug(params.slug);
  if (!post) return {};

  const url = `https://snapprohead.com/blog/${post.slug}`;
  const ogImage = getCoverImageUrl(post.coverImage);

  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: url },
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.date,
      modifiedTime: post.updated ?? post.date,
      url,
      images: [{ url: ogImage, width: 1200, height: 630, alt: post.coverImageAlt }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: [ogImage],
    },
  };
}

export const revalidate = 3600;

export default function BlogPostPage({ params }: Props) {
  const post = getPostBySlug(params.slug);
  if (!post) notFound();

  const allPosts = getAllPosts();
  const wordCount = post.content.trim().split(/\s+/).filter(Boolean).length;
  const faqs = extractBlogFaqsFromMarkdown(post.content);

  const jsonLd = getBlogArticleJsonLd({
    title: post.title,
    description: post.description,
    slug: post.slug,
    datePublished: post.date,
    dateModified: post.updated,
    imageUrl: getCoverImageUrl(post.coverImage),
    wordCount,
    faqs,
  });

  const showSampleStrip = post.slug === "best-ai-headshot-generators-2026";

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero cover — full-bleed within container */}
      <div className="border-b bg-muted/30">
        <div className="container px-4 md:px-6 py-6 md:py-8">
          <Link
            href="/blog"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Blog
          </Link>
          <div className="relative aspect-[21/9] md:aspect-[2.4/1] w-full max-w-5xl mx-auto overflow-hidden rounded-2xl border shadow-lg">
            <BlogCoverImage
              src={post.coverImage}
              alt={post.coverImageAlt}
              priority
              className="absolute inset-0 h-full w-full"
              sizes="100vw"
            />
          </div>
        </div>
      </div>

      <article className="container px-4 md:px-6 py-10 md:py-14">
        <div className="mx-auto max-w-3xl">
          <header className="mb-10">
            <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground mb-4">
              <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                {post.category}
              </span>
              <time dateTime={post.date}>{formatBlogDate(post.date)}</time>
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {post.readingTimeMinutes} min read
              </span>
            </div>

            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-[2.75rem] leading-[1.15] text-balance">
              {post.title}
            </h1>

            <p className="mt-5 text-lg md:text-xl text-muted-foreground leading-relaxed">
              {post.description}
            </p>

            <p className="mt-6 pt-6 border-t text-sm text-muted-foreground">
              By{" "}
              <span className="font-medium text-foreground">{post.author}</span>
            </p>
          </header>

          {showSampleStrip && <BlogSampleStrip />}

          <BlogPostBody content={post.content} />
          <BlogAuthorBio author={post.author} />
          <BlogRelatedPosts currentSlug={post.slug} posts={allPosts} />
          <BlogPostCta />
        </div>
      </article>
    </>
  );
}
