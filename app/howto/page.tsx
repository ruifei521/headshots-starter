import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Photo Upload Guide — AI Headshots",
  description:
    "How to choose selfies for AI headshot training. Good and bad examples, plus tips for studio-quality results.",
  alternates: {
    canonical: "https://snapprohead.com/howto",
  },
};

export default function HowToPage() {
  return (
    <div className="container max-w-4xl py-12 md:py-16 px-4">
      <Link
        href="/"
        className="text-sm text-primary hover:underline mb-6 inline-block"
      >
        ← Back to home
      </Link>
      <h1 className="text-3xl font-bold mb-3">Photo upload guide</h1>
      <p className="text-muted-foreground mb-10 max-w-2xl">
        Upload 4–10 clear selfies. Better input photos mean better AI headshots.
        Training usually takes about 25 minutes after upload.
      </p>

      <div className="grid md:grid-cols-2 gap-10 mb-12">
        <section>
          <h2 className="text-xl font-semibold mb-4 text-green-700 dark:text-green-400">
            Good examples
          </h2>
          <div className="flex gap-2 mb-4 flex-wrap">
            {["good-1", "good-2", "good-3"].map((name) => (
              <Image
                key={name}
                src={`/howto/${name}.avif`}
                alt="Good selfie example"
                width={120}
                height={96}
                className="rounded max-h-24 w-auto"
              />
            ))}
          </div>
          <ul className="list-disc pl-5 space-y-2 text-sm text-muted-foreground">
            <li>Shoulders-up or waist-up, facing the camera</li>
            <li>Good lighting, natural expression</li>
            <li>Different days, outfits, and backgrounds</li>
            <li>One person per photo, no filters</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4 text-red-700 dark:text-red-400">
            Avoid these
          </h2>
          <div className="flex gap-2 mb-4 flex-wrap">
            {["cropped", "funny-faces", "sunglasses"].map((name) => (
              <Image
                key={name}
                src={`/howto/${name}.avif`}
                alt="Bad selfie example"
                width={120}
                height={96}
                className="rounded max-h-24 w-auto"
              />
            ))}
          </div>
          <ul className="list-disc pl-5 space-y-2 text-sm text-muted-foreground">
            <li>Sunglasses, hats, or heavy filters</li>
            <li>Group shots or cropped faces</li>
            <li>Same outfit on the same day for every photo</li>
            <li>AI-generated images or funny faces</li>
          </ul>
        </section>
      </div>

      <div className="flex flex-wrap gap-3">
        <Link href="/pricing">
          <Button>Get headshots from $29</Button>
        </Link>
        <Link href="/headshots">
          <Button variant="outline">Browse styles</Button>
        </Link>
      </div>
    </div>
  );
}
