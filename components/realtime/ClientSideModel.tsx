"use client";

import { Icons } from "@/components/icons";
import { Database } from "@/types/supabase";
import { modelRow, galleryImageRow } from "@/types/utils";
import { createBrowserClient } from "@supabase/ssr";
import { useEffect, useState, useMemo, useCallback, useRef } from "react";
import Image from "next/image";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Progress } from "../ui/progress";
import { getTierInfo, ESTIMATED_DELIVERY_MINUTES } from "@/lib/tiers";
import { trainingProgressEmailHint } from "@/lib/email-notifications";
import { logger } from "@/lib/logger";
import { MODEL_IMAGES_PAGE_SIZE } from "@/lib/model-images";
import { galleryImageUrl, trainingSampleImageUrl, fullSizeImageUrl } from "@/lib/image-url";
import { HeadshotGalleryImage } from "@/components/HeadshotGalleryImage";
import { HeadshotLightbox } from "@/components/HeadshotLightbox";
import { useToast } from "@/components/ui/use-toast";
import { saveBlobToDevice, ZIP_STORE_OPTIONS } from "@/lib/headshot-download";
import { useMobileDownloadProfile } from "@/hooks/use-mobile-download";
import JSZip from "jszip";

export const revalidate = 0;

type WritableFileHandle = {
  createWritable(): Promise<{
    write(data: Blob): Promise<void>;
    close(): Promise<void>;
  }>;
};

type DirectoryHandle = WritableFileHandle & {
  getFileHandle(name: string, opts: { create: boolean }): Promise<WritableFileHandle>;
};

type SaveTarget =
  | { mode: "zip-file"; handle: WritableFileHandle; filename: string }
  | { mode: "directory"; handle: DirectoryHandle };

/** Ask where to save before any network download. */
async function promptSaveTarget(filename: string): Promise<SaveTarget | "cancelled" | null> {
  if (typeof window === "undefined") return null;

  const w = window as unknown as {
    showSaveFilePicker?: (opts: object) => Promise<WritableFileHandle>;
    showDirectoryPicker?: (opts: object) => Promise<DirectoryHandle>;
  };

  if (w.showSaveFilePicker) {
    try {
      const handle = await w.showSaveFilePicker({
        suggestedName: filename,
        types: [{ description: "ZIP Archive", accept: { "application/zip": [".zip"] } }],
      });
      return { mode: "zip-file", handle, filename };
    } catch (err: unknown) {
      if (err instanceof DOMException && err.name === "AbortError") return "cancelled";
    }
  }

  if (w.showDirectoryPicker) {
    try {
      const handle = await w.showDirectoryPicker({ mode: "readwrite" });
      return { mode: "directory", handle };
    } catch (err: unknown) {
      if (err instanceof DOMException && err.name === "AbortError") return "cancelled";
    }
  }

  return null;
}

function TrainingProgressBanner({ model, actualImageCount }: { model: modelRow; actualImageCount?: number }) {
  const [progress, setProgress] = useState(0);
  const [elapsed, setElapsed] = useState(0);

  const generated = actualImageCount ?? model.images_generated ?? 0;
  const total = model.total_images ?? 0;
  const ESTIMATED_TRAINING = ESTIMATED_DELIVERY_MINUTES;
  const isGenerating = total > 0 && generated > 0;

  useEffect(() => {
    if (isGenerating) {
      const pct = Math.round((generated / total) * 100);
      setProgress(pct);
      return;
    }

    const update = () => {
      if (!model.created_at) return;
      const start = new Date(model.created_at).getTime();
      const elapsedMs = Date.now() - start;
      const mins = Math.floor(elapsedMs / 60000);
      const pct = Math.min(Math.round((mins / ESTIMATED_TRAINING) * 100), 80);
      setProgress(pct);
      setElapsed(mins);
    };
    update();
    const interval = setInterval(update, 5000);
    return () => clearInterval(interval);
  }, [model.created_at, isGenerating, generated, total]);

  const remaining = isGenerating
    ? total - generated
    : Math.max(ESTIMATED_TRAINING - elapsed, 0);

  return (
    <div className="rounded-lg border bg-card p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          {progress < 100 ? (
            <Icons.spinner className="h-4 w-4 animate-spin text-primary" />
          ) : (
            <span className="text-green-500">&#10003;</span>
          )}
          <span className="font-medium text-sm">
            {isGenerating
              ? `Generating Images (${generated}/${total})`
              : "Training in Progress"}
          </span>
        </div>
        <span className="text-xs text-muted-foreground">
          {isGenerating
            ? `${remaining} images remaining`
            : `~${remaining} min remaining`}
        </span>
      </div>
      <Progress value={progress} className="h-3" />
      <p className="text-xs text-muted-foreground mt-2">
        {isGenerating
          ? `AI is generating your headshots. ${generated} of ${total} images ready — you can close this page.`
          : trainingProgressEmailHint()}
      </p>
    </div>
  );
}

function TierBadge({ tier }: { tier?: string }) {
  const tierInfo = getTierInfo(tier || 'starter');
  return (
    <div className="flex items-center gap-2 mb-3">
      <Badge variant="secondary" className="text-xs font-medium">
        {tierInfo.name} Plan
      </Badge>
      <span className="text-xs text-muted-foreground">
        {tierInfo.imageCount} HD headshots · {tierInfo.estimatedTime}
      </span>
    </div>
  );
}

type ClientSideModelProps = {
  serverModel: modelRow;
  serverImages: galleryImageRow[];
  totalImageCount: number;
  samples: galleryImageRow[];
};

export default function ClientSideModel({
  serverModel,
  serverImages,
  totalImageCount: initialTotalImageCount,
  samples,
}: ClientSideModelProps) {
  const [model, setModel] = useState<modelRow>(serverModel);
  const [images, setImages] = useState<galleryImageRow[]>(serverImages);
  const [totalImageCount, setTotalImageCount] = useState(initialTotalImageCount);
  const [loadingMore, setLoadingMore] = useState(false);
  const [downloadKind, setDownloadKind] = useState<"batch" | "all" | null>(null);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [downloadStatus, setDownloadStatus] = useState<string | null>(null);
  const [mobileBatchOffset, setMobileBatchOffset] = useState(0);
  const downloadLockRef = useRef(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const loadMoreSentinelRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const { isMobileDownload, preferBatchDownload, batchSize: mobileBatchSize, isIos } =
    useMobileDownloadProfile();

  const supabase = useMemo(() => {
    try {
      return createBrowserClient<Database>(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );
    } catch (e) {
      logger.error("ClientSideModel: Failed to create Supabase client:", e);
      return null;
    }
  }, []);

  const modelId = serverModel.id;
  const imagesRef = useRef(images);
  imagesRef.current = images;

  useEffect(() => {
    if (!supabase) return;

    const channel = supabase
      .channel(`realtime-model-${modelId}`)
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "models", filter: `id=eq.${modelId}` },
        (payload: { new: modelRow }) => {
          setModel(payload.new);
        }
      )
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "images", filter: `modelId=eq.${modelId}` },
        (payload: { new: galleryImageRow }) => {
          setImages((prev) => {
            if (prev.some((img) => img.id === payload.new.id)) return prev;
            return [...prev, payload.new];
          });
          setTotalImageCount((prev) => prev + 1);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, modelId]);

  // Poll while training/generating — fallback if Realtime misses an event
  useEffect(() => {
    if (!supabase) return;

    const isActive =
      model.status === "processing" ||
      model.status === "pending" ||
      model.status === "finished";

    if (!isActive) return;

    const poll = async () => {
      const { data: freshModel } = await supabase
        .from("models")
        .select("*")
        .eq("id", modelId)
        .single();

      if (freshModel) setModel(freshModel);

      const currentImages = imagesRef.current;
      const lastId = currentImages.length
        ? Math.max(...currentImages.map((img) => img.id))
        : 0;

      const { data: newImages } = await supabase
        .from("images")
        .select("id, uri, modelId")
        .eq("modelId", modelId)
        .gt("id", lastId)
        .order("id", { ascending: true });

      if (newImages?.length) {
        setImages((prev) => {
          const existingIds = new Set(prev.map((img) => img.id));
          const merged = [...prev, ...newImages.filter((img) => !existingIds.has(img.id))];
          return merged.length === prev.length ? prev : merged;
        });
      }

      const { count } = await supabase
        .from("images")
        .select("*", { count: "exact", head: true })
        .eq("modelId", modelId);

      if (count != null) {
        setTotalImageCount(count);
      }
    };

    const interval = setInterval(poll, 15000);
    return () => clearInterval(interval);
  }, [supabase, modelId, model.status]);

  const fetchAllImages = useCallback(async (): Promise<galleryImageRow[]> => {
    if (!supabase) return images;
    if (images.length >= totalImageCount) return images;

      const { data, error } = await supabase
        .from("images")
        .select("id, uri, modelId")
        .eq("modelId", model.id)
        .order("id", { ascending: true });

    if (error) {
      logger.error("Failed to fetch all images:", error);
      return images;
    }

    return data ?? images;
  }, [supabase, images, totalImageCount, model.id]);

  const loadMore = useCallback(async (): Promise<number> => {
    if (!supabase || loadingMore || images.length >= totalImageCount) return 0;

    setLoadingMore(true);
    try {
      const from = images.length;
      const to = from + MODEL_IMAGES_PAGE_SIZE - 1;
      const { data, error } = await supabase
        .from("images")
        .select("id, uri, modelId")
        .eq("modelId", model.id)
        .order("id", { ascending: true })
        .range(from, to);

      if (error) {
        logger.error("Failed to load more images:", error);
        return 0;
      }

      if (data?.length) {
        setImages((prev) => {
          const existingIds = new Set(prev.map((img) => img.id));
          const next = data.filter((img) => !existingIds.has(img.id));
          return next.length ? [...prev, ...next] : prev;
        });
        return data.length;
      }
      return 0;
    } finally {
      setLoadingMore(false);
    }
  }, [supabase, loadingMore, images.length, totalImageCount, model.id]);

  useEffect(() => {
    if (!supabase) return;
    const hasMoreImages = images.length < totalImageCount;
    if (!hasMoreImages || loadingMore) return;
    const el = loadMoreSentinelRef.current;
    if (!el) return;
    if (!window.matchMedia("(max-width: 640px)").matches) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) loadMore();
      },
      { rootMargin: "200px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [supabase, images.length, totalImageCount, loadingMore, loadMore]);

  useEffect(() => {
    const mayBeStuck =
      model.status === "processing" ||
      model.status === "pending" ||
      (model.status === "finished" &&
        (model.total_images ?? 0) > 0 &&
        totalImageCount < (model.total_images ?? 0));

    if (!mayBeStuck) return;

    const runReconcile = async () => {
      try {
        const res = await fetch(`/api/models/${model.id}/reconcile`, {
          method: "POST",
        });
        if (!res.ok) return;
        const data = (await res.json()) as {
          reconciled?: boolean;
          completed?: boolean;
        };
        if (data.reconciled || data.completed) {
          window.location.reload();
        }
      } catch {
        // non-blocking background check
      }
    };

    void runReconcile();
    const interval = window.setInterval(runReconcile, 60_000);
    return () => window.clearInterval(interval);
  }, [model.id, model.status, model.total_images, totalImageCount]);

  const releaseDownloadLock = useCallback(() => {
    downloadLockRef.current = false;
    setDownloadKind(null);
    setDownloadProgress(0);
    setDownloadStatus(null);
  }, []);

  const handleDownloadMobileBatch = useCallback(async () => {
    if (downloadLockRef.current) return;

    downloadLockRef.current = true;
    setDownloadKind("batch");
    setDownloadProgress(0);

    const part = Math.floor(mobileBatchOffset / mobileBatchSize) + 1;
    const zipName = `headshots-${model.name?.replace(/\s+/g, "-") || "export"}-part-${part}.zip`;
    setDownloadStatus(`Preparing batch ${part} → ${zipName}`);

    try {
      const allImages = await fetchAllImages();
      const batch = allImages.slice(
        mobileBatchOffset,
        mobileBatchOffset + mobileBatchSize
      );

      if (!batch.length) {
        toast({
          title: "All batches downloaded",
          description: "You’ve saved every headshot in this set.",
        });
        return;
      }

      setDownloadStatus(`Fetching ${batch.length} photos for batch ${part}…`);

      const zip = new JSZip();
      let fetched = 0;

      for (let i = 0; i < batch.length; i++) {
        const img = batch[i];
        try {
          const res = await fetch(fullSizeImageUrl(img.uri));
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          const blob = await res.blob();
          const ext = img.uri.split(".").pop()?.split("?")[0] || "jpg";
          zip.file(`headshot-${mobileBatchOffset + i + 1}.${ext}`, blob);
          fetched += 1;
          setDownloadProgress(Math.round(((i + 1) / batch.length) * 90));
        } catch (e) {
          logger.warn(`Batch fetch failed for image ${mobileBatchOffset + i + 1}:`, e);
        }
      }

      if (fetched === 0) {
        toast({
          title: "Download failed",
          description: "Could not fetch images. Try again or download individually.",
          variant: "destructive",
        });
        return;
      }

      setDownloadStatus(
        isIos
          ? `Opening Share sheet for ${zipName}…`
          : `Saving ${zipName}…`
      );
      setDownloadProgress(95);
      const zipBlob = await zip.generateAsync(ZIP_STORE_OPTIONS);
      const saveResult = await saveBlobToDevice(zipBlob, zipName);

      if (saveResult === "cancelled") return;

      setMobileBatchOffset((prev) => prev + mobileBatchSize);
      toast({
        title: saveResult === "shared" ? "Batch ready to save" : "Batch download started",
        description:
          saveResult === "shared"
            ? `${zipName} — choose Save to Files or another app, then tap batch again for the next part.`
            : `${zipName} — check your Downloads folder. Tap batch again for the next part.`,
      });
    } catch (e) {
      logger.error("Mobile batch download failed:", e);
      toast({
        title: "Download failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      releaseDownloadLock();
    }
  }, [
    fetchAllImages,
    isIos,
    mobileBatchOffset,
    mobileBatchSize,
    model.name,
    releaseDownloadLock,
    toast,
  ]);

  const handleDownloadAll = useCallback(async () => {
    if (!images.length || downloadLockRef.current) return;

    downloadLockRef.current = true;
    setDownloadKind("all");
    setDownloadProgress(0);

    const zipName = `headshots-${model.name?.replace(/\s+/g, "-") || "export"}-${Date.now()}.zip`;
    setDownloadStatus("Choose where to save, or confirm to use Downloads folder…");

    try {
      // Lock before dialogs so batch download cannot start in parallel.
      const saveTarget = await promptSaveTarget(zipName);
      if (saveTarget === "cancelled") return;

      if (saveTarget === null) {
        const ok = window.confirm(
          "Your browser cannot show a save dialog here. The ZIP will download to your default Downloads folder.\n\nContinue?"
        );
        if (!ok) return;
      }

      const allImages = await fetchAllImages();
      const total = allImages.length;

      if (preferBatchDownload && total > mobileBatchSize) {
        toast({
          title: "Use batch download on mobile",
          description: `Saving all ${total} photos at once can crash the browser. Use the batch button (${mobileBatchSize} photos per ZIP).`,
          variant: "destructive",
        });
        return;
      }

      setDownloadStatus(`Fetching all ${total} photos into ${zipName}…`);

      if (saveTarget?.mode === "directory") {
        for (let i = 0; i < total; i++) {
          const img = allImages[i];
          try {
            const res = await fetch(fullSizeImageUrl(img.uri));
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const blob = await res.blob();
            const ext = img.uri.split(".").pop()?.split("?")[0] || "jpg";
            const fileHandle = await saveTarget.handle.getFileHandle(`headshot-${i + 1}.${ext}`, { create: true });
            const writable = await fileHandle.createWritable();
            await writable.write(blob);
            await writable.close();
            setDownloadProgress(Math.round(((i + 1) / total) * 100));
          } catch (e) {
            logger.warn(`Failed to save image ${i + 1}:`, e);
          }
        }
        setDownloadStatus(`Saved ${total} headshots to the folder you selected.`);
        toast({ title: "Download complete", description: `${total} headshots saved to the folder you selected.` });
      } else {
        const zip = new JSZip();
        let fetched = 0;

        for (let i = 0; i < total; i++) {
          const img = allImages[i];
          try {
            const res = await fetch(fullSizeImageUrl(img.uri));
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const blob = await res.blob();
            const ext = img.uri.split(".").pop()?.split("?")[0] || "jpg";
            zip.file(`headshot-${i + 1}.${ext}`, blob);
            fetched += 1;
            setDownloadProgress(Math.round(((i + 1) / total) * 90));
          } catch (e) {
            logger.warn(`Failed to fetch image ${i + 1}:`, e);
          }
        }

        if (fetched === 0) {
          toast({
            title: "Download failed",
            description: "Could not fetch any images. Try downloading individually.",
            variant: "destructive",
          });
          return;
        }

        setDownloadProgress(95);
        setDownloadStatus(`Saving ${zipName}…`);
        const zipBlob = await zip.generateAsync(ZIP_STORE_OPTIONS);

        if (saveTarget?.mode === "zip-file") {
          const writable = await saveTarget.handle.createWritable();
          await writable.write(zipBlob);
          await writable.close();
          toast({
            title: "Download complete",
            description:
              fetched < total
                ? `Saved ${fetched} of ${total} images (${total - fetched} skipped).`
                : `Saved as ${saveTarget.filename}`,
          });
        } else {
          const url = URL.createObjectURL(zipBlob);
          const a = document.createElement("a");
          a.href = url;
          a.download = zipName;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
          setDownloadStatus(`${zipName} → your Downloads folder`);
          toast({
            title: "Download started",
            description:
              fetched < total
                ? `${zipName}: ${fetched} of ${total} images (${total - fetched} could not be fetched). Check Downloads.`
                : `${zipName} — check your browser's Downloads folder.`,
          });
        }
      }

      if (allImages.length > images.length) {
        setImages(allImages);
      }
    } catch (e) {
      logger.error("Download all failed:", e);
      toast({
        title: "Download failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      releaseDownloadLock();
    }
  }, [
    images.length,
    fetchAllImages,
    isMobileDownload,
    preferBatchDownload,
    mobileBatchSize,
    model.name,
    releaseDownloadLock,
    toast,
  ]);

  const handleDownloadSingle = useCallback(async (image: galleryImageRow, index: number) => {
    const ext = image.uri.split('.').pop()?.split('?')[0] || 'jpg';
    const filename = `headshot-${index + 1}.${ext}`;

    try {
      // ⭐ 优先使用 File System Access API：先让用户选保存位置，再下载
      if (typeof window !== 'undefined' && 'showSaveFilePicker' in window) {
        try {
          const handle = await (window as any).showSaveFilePicker({
            suggestedName: filename,
            types: [{
              description: 'Image',
              accept: { 'image/jpeg': [`.${ext}`], 'image/png': [`.${ext}`] },
            }],
          });

          // 用户已选择位置，现在才下载
          const res = await fetch(fullSizeImageUrl(image.uri));
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          const blob = await res.blob();

          const writable = await handle.createWritable();
          await writable.write(blob);
          await writable.close();
          toast({
            title: "Download started",
            description: `Saved ${filename}`,
            duration: 4000,
          });
          return;
        } catch (fsErr: any) {
          if (fsErr.name === 'AbortError') return;
          logger.warn('showSaveFilePicker failed, falling back to direct download:', fsErr);
        }
      }

      const res = await fetch(fullSizeImageUrl(image.uri));
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const blob = await res.blob();
      const saveResult = await saveBlobToDevice(blob, filename, {
        preferShare: isMobileDownload,
      });
      if (saveResult === "cancelled") return;
      toast({
        title: saveResult === "shared" ? "Ready to save" : "Download started",
        description:
          saveResult === "shared"
            ? `Choose Save to Files or Photos for ${filename}.`
            : `Saved ${filename}`,
        duration: 4000,
      });
    } catch (e) {
      logger.error(`Failed to download image ${index + 1}:`, e);
      toast({
        title: "Download failed",
        description: "Could not save this photo. Check your connection and try again.",
        variant: "destructive",
        duration: 6000,
      });
    }
  }, [isMobileDownload, toast]);

  if (!supabase) {
    return <div className="p-4 text-destructive">Missing Supabase configuration.</div>;
  }

  const modelTier: string = (model as { tier?: string }).tier || 'starter';
  const hasMore = images.length < totalImageCount;
  const lightboxTotal = Math.max(totalImageCount, images.length);

  const handleLightboxNext = useCallback(async () => {
    if (lightboxIndex === null) return;
    if (lightboxIndex < images.length - 1) {
      setLightboxIndex(lightboxIndex + 1);
      return;
    }
    if (images.length < totalImageCount && !loadingMore) {
      const added = await loadMore();
      if (added > 0) {
        setLightboxIndex((current) => (current !== null ? current + 1 : current));
      }
    }
  }, [lightboxIndex, images.length, totalImageCount, loadingMore, loadMore]);

  const handleLightboxPrev = useCallback(() => {
    setLightboxIndex((i) => (i !== null && i > 0 ? i - 1 : i));
  }, []);

  const showingCount = Math.min(images.length, totalImageCount);
  const showResults = images.length > 0;
  const showMobileBatchDownload =
    preferBatchDownload && totalImageCount > mobileBatchSize;
  const hideDownloadAllOnMobile =
    preferBatchDownload && totalImageCount > mobileBatchSize;
  const isDownloading = downloadKind !== null;
  const batchRemaining = Math.min(
    mobileBatchSize,
    Math.max(totalImageCount - mobileBatchOffset, 0)
  );
  const batchPart = Math.floor(mobileBatchOffset / mobileBatchSize) + 1;

  // ⭐ 兜底：如果所有图片已生成完毕，即使 model.status 还是 "finished" 也隐藏进度条
  const allImagesReady = totalImageCount > 0 && totalImageCount >= (model.total_images ?? 0);
  const showProgress =
    model.status === "processing" ||
    model.status === "pending" ||
    (model.status === "finished" && !allImagesReady);

  return (
    <div id="train-model-container" className="w-full">
      <div className="flex w-full flex-col gap-6 sm:gap-8 mt-2 sm:mt-4">
        {showProgress && (
          <TrainingProgressBanner model={model} actualImageCount={totalImageCount} />
        )}
        {model.status === "failed" && (
          <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4">
            <div className="flex items-center gap-2">
              <span className="text-destructive text-lg">&#10007;</span>
              <span className="font-medium text-sm text-destructive">Training Failed</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              The AI training did not complete. We&apos;ve emailed you with next steps and returned your credit. Try again with different or higher quality photos.
            </p>
          </div>
        )}
        <TierBadge tier={modelTier} />
        <div className="flex flex-col gap-8">
          {samples && samples.length > 0 && (
            <div className="flex w-full flex-col gap-2">
              <h2 className="text-xl">Training Data</h2>
              <div className="grid grid-cols-4 gap-2 sm:flex sm:flex-row sm:gap-3 sm:flex-wrap">
                {samples.map((sample) => (
                  <div key={sample.id} className="relative aspect-square w-full sm:w-24 sm:h-24 md:w-28 md:h-28 shrink-0 overflow-hidden rounded-md bg-muted">
                    <Image
                      key={sample.id}
                      src={trainingSampleImageUrl(sample.uri, 280)}
                      className="object-contain object-top"
                      alt="Training sample"
                      fill
                      sizes="112px"
                      loading="lazy"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
          <div className="flex flex-col w-full rounded-md">
            {showResults && (
              <div className="flex flex-1 flex-col gap-3 sm:gap-2">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <h2 className="text-lg font-semibold sm:text-xl">
                      {model.status === "completed" ? "Results" : "Your headshots"}
                    </h2>
                    {showProgress && (
                      <p className="mt-0.5 text-xs text-primary">
                        More photos arrive as generation continues — refresh isn&apos;t needed.
                      </p>
                    )}
                    {totalImageCount > 0 && (
                      <>
                        <p className="mt-0.5 text-xs text-muted-foreground sm:hidden">
                          {showingCount} of {totalImageCount} · Tap image for full size
                        </p>
                        <p className="mt-0.5 hidden text-xs text-muted-foreground sm:block">
                          Showing {showingCount} of {totalImageCount} · Click any image for full size
                        </p>
                      </>
                    )}
                  </div>
                  <div className="flex w-full flex-col gap-2 sm:w-auto">
                    {showMobileBatchDownload && (
                      <Button
                        type="button"
                        variant="default"
                        size="sm"
                        onClick={handleDownloadMobileBatch}
                        disabled={isDownloading}
                        className="h-10 w-full shrink-0 sm:hidden"
                      >
                        {downloadKind === "batch"
                          ? `Batch ${batchPart}: ${downloadProgress}%`
                          : `Download batch (${batchRemaining} photos)`}
                      </Button>
                    )}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleDownloadAll}
                      disabled={isDownloading}
                      className={`h-10 w-full shrink-0 sm:h-9 sm:w-auto${hideDownloadAllOnMobile ? " hidden sm:inline-flex" : ""}`}
                    >
                      {downloadKind === "all"
                        ? downloadProgress > 0
                          ? `Download all: ${downloadProgress}%`
                          : "Preparing download all…"
                        : `Download All (${totalImageCount})`}
                    </Button>
                    {isDownloading && downloadStatus && (
                      <p className="text-xs font-medium text-primary sm:max-w-xs">
                        {downloadStatus}
                      </p>
                    )}
                    {showMobileBatchDownload && !isDownloading && (
                      <p className="text-xs text-muted-foreground sm:hidden">
                        {isIos
                          ? `Download in batches of ${mobileBatchSize}. Tap Share → Save to Files or Photos.`
                          : `Download in batches of ${mobileBatchSize} to avoid browser memory limits.`}
                      </p>
                    )}
                  </div>
                </div>
                <div className="grid min-w-0 grid-cols-2 gap-2 [&>*]:min-w-0 sm:flex sm:flex-row sm:flex-wrap sm:gap-3">
                  {images.map((image, index) => (
                    <div key={image.id} className="min-w-0">
                      <HeadshotGalleryImage
                        uri={image.uri}
                        alt={`Generated headshot ${index + 1}`}
                        index={index}
                        onView={() => setLightboxIndex(index)}
                        onDownload={() => handleDownloadSingle(image, index)}
                      />
                    </div>
                  ))}
                </div>
                {hasMore && (
                  <>
                    <div ref={loadMoreSentinelRef} className="h-1 sm:hidden" aria-hidden />
                    <div className="hidden justify-center pt-1 sm:flex sm:pt-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="default"
                        onClick={loadMore}
                        disabled={loadingMore}
                        className="min-h-11 w-full max-w-sm sm:min-h-9 sm:w-auto"
                      >
                        {loadingMore ? (
                          <>
                            <Icons.spinner className="h-4 w-4 animate-spin mr-2" />
                            Loading...
                          </>
                        ) : (
                          `Load more (${totalImageCount - images.length} remaining)`
                        )}
                      </Button>
                    </div>
                    {loadingMore && (
                      <p className="text-center text-xs text-muted-foreground sm:hidden">
                        Loading more headshots…
                      </p>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <HeadshotLightbox
        open={lightboxIndex !== null}
        uri={lightboxIndex !== null ? images[lightboxIndex]?.uri ?? null : null}
        alt={
          lightboxIndex !== null
            ? `Generated headshot ${lightboxIndex + 1}`
            : "Generated headshot"
        }
        index={lightboxIndex ?? 0}
        total={lightboxTotal}
        onClose={() => setLightboxIndex(null)}
        onPrev={handleLightboxPrev}
        onNext={handleLightboxNext}
        onDownload={() => {
          if (lightboxIndex === null) return;
          const image = images[lightboxIndex];
          if (image) handleDownloadSingle(image, lightboxIndex);
        }}
      />
    </div>
  );
}
