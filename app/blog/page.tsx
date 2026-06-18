import type { Metadata } from "next";
import { getAllPosts } from "@/lib/blog";
import BlogCard from "@/components/blog/BlogCard";
import BlogTrustBar from "@/components/blog/BlogTrustBar";
import { getBlogIndexJsonLd } from "@/lib/json-ld";

export const metadata: Metadata = {
  title: "Blog — AI Headshot Guides & Comparisons",
  description:
    "Expert guides on AI professional headshots, LinkedIn photos, generator comparisons, and tips to look your best on camera.",
  alternates: {
    canonical: "https://snapprohead.com/blog",
  },
};

export const revalidate = 3600;

export default function BlogIndexPage() {
  const posts = getAllPosts();
  const [featured, ...rest] = posts;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(getBlogIndexJsonLd()) }}
      />
      <div className="border-b bg-gradient-to-b from-muted/50 to-background">
        <div className="container px-4 md:px-6 py-14 md:py-20">
          <header className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-primary mb-3">
              SnapProHead Blog
            </p>
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Latest Headshot Photography Articles
            </h1>
            <p className="mt-4 text-muted-foreground text-lg md:text-xl leading-relaxed">
              Insights, comparisons, and practical tips for professional AI
              headshots — without the $200+ studio bill.
            </p>
          </header>
        </div>
      </div>

      <div className="container px-4 md:px-6 py-12 md:py-16">
        <BlogTrustBar />

        {posts.length === 0 ? (
          <p className="text-center text-muted-foreground">No articles yet.</p>
        ) : (
          <div className="mx-auto max-w-5xl space-y-10">
            {featured && (
              <section>
                <BlogCard post={featured} featured />
              </section>
            )}
            {rest.length > 0 && (
              <section className="grid gap-8 sm:grid-cols-2">
                {rest.map((post) => (
                  <BlogCard key={post.slug} post={post} />
                ))}
              </section>
            )}
          </div>
        )}
      </div>
    </>
  );
}
