"use client";

import { Expand, Download } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { headshotGalleryImageUrl } from "@/lib/image-url";
import { cn } from "@/lib/utils";

type Props = {
  uri: string;
  alt: string;
  index: number;
  onView: () => void;
  onDownload: () => void;
};

/** Lazy-mount thumbnail — only fetch when near viewport. */
export function HeadshotGalleryImage({ uri, alt, index, onView, onDownload }: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    const node = rootRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px 0px" }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const thumbSrc = headshotGalleryImageUrl(uri);
  const [src, setSrc] = useState(thumbSrc);

  useEffect(() => {
    setSrc(headshotGalleryImageUrl(uri));
  }, [uri]);

  return (
    <div
      ref={rootRef}
      className="group relative aspect-[4/5] w-full min-w-0 overflow-hidden rounded-md bg-muted sm:w-44 sm:shrink-0 md:w-52"
    >
      {shouldLoad ? (
        // Native img avoids Next/Image fill layout bugs in mobile WebKit grid cells.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover object-top pointer-events-none"
          onError={() => setSrc(uri)}
        />
      ) : (
        <div className="absolute inset-0 animate-pulse bg-muted" aria-hidden />
      )}
      {shouldLoad && (
        <button
          type="button"
          onClick={onView}
          className="absolute inset-0 cursor-pointer rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 active:scale-[0.98] transition-transform"
          title="View full-size image"
          aria-label={`View full-size: ${alt}`}
        >
          {/* Tap hint — always visible on touch, hover on desktop */}
          <span
            className={cn(
              "absolute bottom-2 left-2 flex items-center gap-1 rounded-md bg-black/55 px-2 py-1 text-[10px] font-medium text-white backdrop-blur-sm",
              "opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity"
            )}
          >
            <Expand className="h-3 w-3" aria-hidden />
            View
          </span>
        </button>
      )}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onDownload();
        }}
        className={cn(
          "absolute top-1.5 right-1.5 z-10 flex h-11 w-11 min-h-[44px] min-w-[44px] items-center justify-center rounded-md bg-black/60 text-white",
          "hover:bg-black/80 active:bg-black/90",
          "opacity-100 sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100 transition-opacity"
        )}
        title={`Download headshot ${index + 1}`}
        aria-label={`Download headshot ${index + 1}`}
      >
        <Download className="h-4 w-4" aria-hidden />
      </button>
    </div>
  );
}
