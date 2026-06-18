import Image from "next/image";

const SAMPLES = [
  { src: "/gallery-images/01.jpg", alt: "AI headshot — corporate style" },
  { src: "/gallery-images/08.jpg", alt: "AI headshot — LinkedIn style" },
  { src: "/gallery-images/17.jpg", alt: "AI headshot — professional lighting" },
  { src: "/gallery-images/24.jpg", alt: "AI headshot — studio background" },
];

/** Example outputs strip for comparison articles */
export default function BlogSampleStrip() {
  return (
    <div className="my-10 not-prose">
      <p className="text-sm font-medium text-muted-foreground mb-3 text-center">
        Sample AI headshots created with SnapProHead
      </p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {SAMPLES.map((img) => (
          <div
            key={img.src}
            className="relative aspect-[3/4] overflow-hidden rounded-xl border bg-muted shadow-sm"
          >
            <Image
              src={img.src}
              alt={img.alt}
              fill
              sizes="(max-width: 768px) 50vw, 200px"
              className="object-cover"
              unoptimized
            />
          </div>
        ))}
      </div>
    </div>
  );
}
