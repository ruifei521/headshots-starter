"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Download, Loader2, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { fullSizeImageUrl } from "@/lib/image-url";

type Props = {
  open: boolean;
  uri: string | null;
  alt: string;
  index: number;
  total: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  onDownload: () => void;
};

const SWIPE_THRESHOLD = 48;

export function HeadshotLightbox({
  open,
  uri,
  alt,
  index,
  total,
  onClose,
  onPrev,
  onNext,
  onDownload,
}: Props) {
  const [loading, setLoading] = useState(true);
  const touchStartX = useRef<number | null>(null);
  const fullSrc = uri ? fullSizeImageUrl(uri) : null;
  const hasPrev = index > 0;
  const hasNext = index < total - 1;

  useEffect(() => {
    if (open && uri) setLoading(true);
  }, [open, uri]);

  // Lock body scroll when open (especially on mobile)
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!open) return;
      if (e.key === "ArrowLeft" && hasPrev) onPrev();
      if (e.key === "ArrowRight" && hasNext) onNext();
    },
    [open, hasPrev, hasNext, onPrev, onNext]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  const onTouchStart = (clientX: number) => {
    touchStartX.current = clientX;
  };

  const onTouchEnd = (clientX: number) => {
    if (touchStartX.current === null) return;
    const diff = clientX - touchStartX.current;
    if (diff > SWIPE_THRESHOLD && hasPrev) onPrev();
    else if (diff < -SWIPE_THRESHOLD && hasNext) onNext();
    touchStartX.current = null;
  };

  return (
    <Dialog open={open} onOpenChange={(next) => !next && onClose()}>
      <DialogContent
        className={cn(
          "flex flex-col gap-0 border-0 bg-black text-white shadow-2xl p-0 overflow-hidden",
          // Mobile: true full-screen
          "fixed inset-0 z-50 h-[100dvh] w-full max-w-none translate-x-0 translate-y-0 rounded-none",
          "sm:inset-auto sm:left-[50%] sm:top-[50%] sm:h-auto sm:max-h-[96vh] sm:w-[min(96vw,1200px)] sm:max-w-[96vw] sm:translate-x-[-50%] sm:translate-y-[-50%] sm:rounded-lg sm:gap-3 sm:p-4",
          "[&>button:last-child]:hidden"
        )}
      >
        <DialogTitle className="sr-only">
          {alt} — full resolution preview
        </DialogTitle>

        {/* Top bar — mobile friendly close */}
        <div className="flex shrink-0 items-center justify-between gap-2 px-3 py-3 pt-[max(0.75rem,env(safe-area-inset-top))] sm:px-0 sm:py-0 sm:pt-0">
          <span className="text-sm text-white/80 sm:hidden">
            {index + 1} / {total}
          </span>
          <span className="hidden sm:inline text-sm text-white/80">
            Full resolution preview
          </span>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-11 w-11 shrink-0 text-white hover:bg-white/10 hover:text-white sm:absolute sm:right-4 sm:top-4 sm:h-10 sm:w-10"
            onClick={onClose}
            aria-label="Close preview"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Image + swipe */}
        <div
          className="relative flex min-h-0 flex-1 items-center justify-center px-2 sm:min-h-[50vh] sm:px-8"
          onTouchStart={(e) => onTouchStart(e.touches[0].clientX)}
          onTouchEnd={(e) => onTouchEnd(e.changedTouches[0].clientX)}
        >
          {hasPrev && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute left-1 z-10 hidden h-11 w-11 text-white hover:bg-white/10 hover:text-white sm:flex"
              onClick={onPrev}
              aria-label="Previous headshot"
            >
              <ChevronLeft className="h-7 w-7" />
            </Button>
          )}

          {fullSrc ? (
            <>
              {loading && (
                <Loader2 className="absolute h-8 w-8 animate-spin text-white/70" aria-hidden />
              )}
              <img
                src={fullSrc}
                alt={alt}
                className={cn(
                  "max-h-[calc(100dvh-11rem)] w-auto max-w-full object-contain sm:max-h-[78vh]",
                  loading ? "opacity-0" : "opacity-100",
                  "transition-opacity select-none"
                )}
                draggable={false}
                onLoad={() => setLoading(false)}
                onError={() => setLoading(false)}
              />
            </>
          ) : null}

          {hasNext && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-1 z-10 hidden h-11 w-11 text-white hover:bg-white/10 hover:text-white sm:flex"
              onClick={onNext}
              aria-label="Next headshot"
            >
              <ChevronRight className="h-7 w-7" />
            </Button>
          )}
        </div>

        {/* Bottom actions — thumb zone on mobile */}
        <div
          className={cn(
            "flex shrink-0 flex-col gap-3 border-t border-white/10 px-3 py-3",
            "pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:flex-row sm:items-center sm:justify-between sm:border-0 sm:px-0 sm:pb-0"
          )}
        >
          <p className="hidden text-sm text-white/70 sm:block">
            {index + 1} / {total} · Swipe or use arrow keys to browse
          </p>
          <p className="text-center text-xs text-white/60 sm:hidden">
            Swipe left or right to browse
          </p>

          <div className="flex items-center justify-center gap-2 sm:justify-end">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-11 w-11 text-white hover:bg-white/10 hover:text-white disabled:opacity-30 sm:hidden"
              onClick={onPrev}
              disabled={!hasPrev}
              aria-label="Previous headshot"
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
            <Button
              type="button"
              variant="secondary"
              size="default"
              className="min-h-11 flex-1 gap-2 sm:flex-none sm:min-h-9"
              onClick={onDownload}
            >
              <Download className="h-4 w-4" />
              Download
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-11 w-11 text-white hover:bg-white/10 hover:text-white disabled:opacity-30 sm:hidden"
              onClick={onNext}
              disabled={!hasNext}
              aria-label="Next headshot"
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
