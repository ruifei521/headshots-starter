import fs from "fs";
import path from "path";
import matter from "gray-matter";

const BLOG_DIR = path.join(process.cwd(), "content/blog");

const SITE_URL = "https://snapprohead.com";
const DEFAULT_COVER = "/gallery-images/12.jpg";

export type BlogPostMeta = {
  slug: string;
  title: string;
  description: string;
  date: string;
  updated?: string;
  readingTimeMinutes: number;
  coverImage: string;
  coverImageAlt: string;
  category: string;
  author: string;
};

export function getCoverImageUrl(coverImage: string): string {
  if (coverImage.startsWith("http")) return coverImage;
  return `${SITE_URL}${coverImage.startsWith("/") ? coverImage : `/${coverImage}`}`;
}

export type BlogPost = BlogPostMeta & {
  content: string;
};

function readingTimeMinutes(content: string): number {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

function parseFile(filename: string): BlogPost {
  const slug = filename.replace(/\.md$/, "");
  const raw = fs.readFileSync(path.join(BLOG_DIR, filename), "utf8");
  const { data, content } = matter(raw);

  const title = String(data.title ?? slug);
  const description = String(data.description ?? "");
  const date = String(data.date ?? new Date().toISOString().slice(0, 10));
  const updated = data.updated ? String(data.updated) : undefined;

  const coverImage = data.coverImage
    ? String(data.coverImage)
    : DEFAULT_COVER;

  return {
    slug,
    title,
    description,
    date,
    updated,
    readingTimeMinutes: readingTimeMinutes(content),
    coverImage,
    coverImageAlt: String(data.coverImageAlt ?? title),
    category: String(data.category ?? "Guides"),
    author: String(data.author ?? "SnapProHead Team"),
    content,
  };
}

export function getAllPosts(): BlogPostMeta[] {
  if (!fs.existsSync(BLOG_DIR)) return [];

  return fs
    .readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((f) => {
      const post = parseFile(f);
      const { content: _c, ...meta } = post;
      return meta;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getPostBySlug(slug: string): BlogPost | null {
  if (!fs.existsSync(BLOG_DIR)) return null;
  const filePath = path.join(BLOG_DIR, `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;
  return parseFile(`${slug}.md`);
}

export function getAllPostSlugs(): string[] {
  return getAllPosts().map((p) => p.slug);
}

export function formatBlogDate(isoDate: string): string {
  return new Date(isoDate).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export type BlogFaqItem = {
  question: string;
  answer: string;
};

/** Parse ALL FAQ blocks from blog markdown (## FAQ / ## Frequently asked questions).
 *  Uses RegExp.exec() loop to capture every FAQ section — not just the first one.
 *  Deduplicates questions that appear in multiple sections (case-insensitive). */
export function extractBlogFaqsFromMarkdown(content: string): BlogFaqItem[] {
  const faqHeadingGlobal = /^##\s+(?:FAQ|Frequently asked questions)\s*$/gim;
  const faqs: BlogFaqItem[] = [];
  const seen = new Set<string>();

  let match: RegExpExecArray | null;
  while ((match = faqHeadingGlobal.exec(content)) !== null) {
    if (match.index == null) continue;

    const faqSection = content.slice(match.index + match[0].length);
    const endMatch = faqSection.match(/^##\s+/m);
    const faqBody = endMatch?.index != null ? faqSection.slice(0, endMatch.index) : faqSection;

    const blocks = faqBody.split(/^###\s+/m).slice(1);

    for (let i = 0; i < blocks.length; i++) {
      const block = blocks[i];
      const newline = block.indexOf("\n");
      if (newline === -1) continue;

      const question = block.slice(0, newline).trim();
      let answer = block
        .slice(newline + 1)
        .trim()
        .replace(/\*\*/g, "")
        .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
        .replace(/\s+/g, " ")
        .trim();

      if (!question || !answer) continue;

      // Skip duplicate questions (first occurrence wins)
      const key = question.toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);

      faqs.push({ question, answer });
    }
  }

  return faqs;
}
