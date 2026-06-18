import Image from "next/image";
import Link from "next/link";

type Props = {
  author: string;
};

export default function BlogAuthorBio({ author }: Props) {
  return (
    <aside className="my-10 rounded-2xl border bg-muted/30 p-6 md:p-8">
      <div className="flex flex-col sm:flex-row gap-5 sm:items-start">
        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full border-2 border-background shadow-sm bg-primary/10">
          <Image
            src="/hero.png"
            alt=""
            fill
            className="object-cover"
            unoptimized
          />
        </div>
        <div className="text-sm md:text-base space-y-2">
          <p className="font-semibold text-foreground text-base md:text-lg">
            Written by {author}
          </p>
          <p className="text-muted-foreground leading-relaxed">
            The SnapProHead editorial team tests AI headshot tools the way
            professionals use them — uploading real selfies, timing delivery,
            and judging output for LinkedIn, firm bios, and team directories.
            We disclose when we review our own product and link to independent
            alternatives when they fit your use case better.
          </p>
          <Link
            href="/about"
            className="inline-flex text-primary font-medium hover:underline"
          >
            About SnapProHead →
          </Link>
        </div>
      </div>
    </aside>
  );
}
