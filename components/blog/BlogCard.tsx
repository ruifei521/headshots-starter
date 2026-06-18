import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import type { BlogPostMeta } from "@/lib/blog";
import { formatBlogDate } from "@/lib/blog";
import BlogCoverImage from "@/components/blog/BlogCoverImage";

export default function BlogCard({
  post,
  featured = false,
}: {
  post: BlogPostMeta;
  featured?: boolean;
}) {
  return (
    <article
      className={`group relative flex flex-col overflow-hidden rounded-2xl border bg-card shadow-sm transition-all hover:shadow-lg hover:border-primary/20 ${
        featured ? "md:flex-row md:min-h-[280px]" : ""
      }`}
    >
      <div
        className={
          featured
            ? "relative w-full md:w-[42%] shrink-0 aspect-[16/10] md:aspect-auto md:min-h-full"
            : "relative aspect-[16/10] w-full"
        }
      >
        <BlogCoverImage
          src={post.coverImage}
          alt={post.coverImageAlt}
          priority={featured}
          className="absolute inset-0 h-full w-full"
          sizes={
            featured
              ? "(max-width: 768px) 100vw, 420px"
              : "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 400px"
          }
        />
      </div>

      <div className={`flex flex-1 flex-col p-6 ${featured ? "md:p-8 md:justify-center" : ""}`}>
        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground mb-3">
          <span className="rounded-full bg-primary/10 px-2.5 py-0.5 font-medium text-primary">
            {post.category}
          </span>
          <time dateTime={post.date}>{formatBlogDate(post.date)}</time>
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {post.readingTimeMinutes} min read
          </span>
        </div>

        <h2
          className={`font-bold tracking-tight group-hover:text-primary transition-colors ${
            featured ? "text-2xl md:text-3xl leading-snug" : "text-xl leading-snug"
          }`}
        >
          <Link href={`/blog/${post.slug}`} className="after:absolute after:inset-0">
            {post.title}
          </Link>
        </h2>

        <p
          className={`mt-3 flex-1 text-muted-foreground leading-relaxed ${
            featured ? "text-base line-clamp-4" : "text-sm line-clamp-3"
          }`}
        >
          {post.description}
        </p>

        <p className="mt-5 inline-flex items-center text-sm font-medium text-primary">
          Read article
          <ArrowRight className="ml-1.5 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </p>
      </div>
    </article>
  );
}
