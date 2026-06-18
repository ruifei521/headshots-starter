import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";
import type { BlogPostMeta } from "@/lib/blog";
import BlogCard from "@/components/blog/BlogCard";

type Props = {
  currentSlug: string;
  posts: BlogPostMeta[];
};

const LANDING_LINKS = [
  { href: "/headshots/linkedin", label: "LinkedIn headshots" },
  { href: "/headshots/lawyer", label: "Lawyer headshots" },
  { href: "/headshots/ai-headshot-generator", label: "AI headshot generator" },
  { href: "/examples", label: "Example gallery" },
] as const;

export default function BlogRelatedPosts({ currentSlug, posts }: Props) {
  const related = posts.filter((p) => p.slug !== currentSlug);

  return (
    <section className="mt-14 pt-10 border-t" aria-labelledby="read-next-heading">
      <h2
        id="read-next-heading"
        className="text-2xl font-bold tracking-tight mb-6"
      >
        Read next
      </h2>

      {related.length > 0 ? (
        <div className="grid gap-8 sm:grid-cols-2">
          {related.slice(0, 2).map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed bg-muted/20 p-8 md:p-10">
          <div className="flex items-start gap-3 mb-4">
            <BookOpen className="h-6 w-6 text-primary shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-foreground">
                More comparisons and guides are on the way
              </p>
              <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                We publish new articles on AI headshots, pricing, and
                profession-specific tips regularly. Browse the blog index or
                explore our use-case pages below.
              </p>
            </div>
          </div>
          <ul className="grid gap-2 sm:grid-cols-2 text-sm mb-6">
            {LANDING_LINKS.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="text-primary font-medium hover:underline"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
          <Link
            href="/blog"
            className="inline-flex items-center text-sm font-medium text-primary hover:underline"
          >
            Back to all articles
            <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
      )}
    </section>
  );
}
