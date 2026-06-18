import Image from "next/image";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Components } from "react-markdown";

const proseClass =
  "prose prose-lg prose-neutral dark:prose-invert max-w-none " +
  "prose-headings:scroll-mt-24 prose-headings:font-bold prose-headings:tracking-tight " +
  "prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-4 prose-h2:pb-2 prose-h2:border-b prose-h2:border-border/60 " +
  "prose-h3:text-xl prose-h3:mt-8 " +
  "prose-p:leading-relaxed prose-p:text-foreground/90 " +
  "prose-a:text-primary prose-a:font-medium prose-a:no-underline hover:prose-a:underline " +
  "prose-strong:text-foreground " +
  "prose-li:marker:text-primary " +
  "prose-blockquote:border-primary prose-blockquote:bg-muted/40 prose-blockquote:rounded-r-lg prose-blockquote:py-1 prose-blockquote:not-italic " +
  "prose-img:rounded-xl prose-img:shadow-md prose-img:my-8 prose-img:mx-auto " +
  "prose-hr:border-border";

export default function BlogPostBody({ content }: { content: string }) {
  const components: Components = {
    a: ({ href, children }) => {
      const isInternal = href?.startsWith("/");
      if (isInternal && href) {
        return (
          <Link href={href} className="text-primary font-medium hover:underline">
            {children}
          </Link>
        );
      }
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary font-medium hover:underline"
        >
          {children}
        </a>
      );
    },
    img: ({ src, alt }) => {
      if (!src || typeof src !== "string") return null;
      return (
        <figure className="my-10 not-prose">
          <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl border bg-muted shadow-md">
            <Image
              src={src}
              alt={alt ?? ""}
              fill
              sizes="(max-width: 768px) 100vw, 720px"
              className="object-cover"
              unoptimized
            />
          </div>
          {alt ? (
            <figcaption className="mt-2 text-center text-sm text-muted-foreground">
              {alt}
            </figcaption>
          ) : null}
        </figure>
      );
    },
    table: ({ children }) => (
      <div className="my-10 not-prose overflow-x-auto rounded-xl border shadow-sm">
        <table className="w-full min-w-[540px] text-sm">{children}</table>
      </div>
    ),
    thead: ({ children }) => (
      <thead className="bg-muted/60 text-left text-foreground">{children}</thead>
    ),
    th: ({ children }) => (
      <th className="px-4 py-3 font-semibold border-b">{children}</th>
    ),
    td: ({ children }) => (
      <td className="px-4 py-3 border-b border-border/50 text-muted-foreground">
        {children}
      </td>
    ),
    tr: ({ children }) => (
      <tr className="even:bg-muted/20 hover:bg-muted/30 transition-colors">
        {children}
      </tr>
    ),
  };

  return (
    <div className={proseClass}>
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {content}
      </ReactMarkdown>
    </div>
  );
}
