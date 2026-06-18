"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { memo, useCallback, useState, useEffect, useRef } from "react";
import { useDropzone } from "react-dropzone";
import { SubmitHandler, useForm } from "react-hook-form";
import { FaFemale, FaImages, FaMale } from "react-icons/fa";
import * as z from "zod";
import { fileUploadFormSchema } from "@/types/zod";
import { ImageInspectionResult, aggregateCharacteristics } from "@/lib/imageInspection";
import { DEFAULT_INSPECTION_RESULT } from "@/lib/image-inspection-labels";
import { TRAIN_CONSENT_BULLETS } from "@/lib/data-retention-policy";
import { uploadTrainingImages } from "@/lib/upload-images";
import type { InspectionUiStatus } from "@/lib/image-inspection-labels";
import { useUploadInspectionQueue } from "@/lib/use-upload-inspection-queue";
import { getUploadInspectionBlocker } from "@/lib/upload-inspection-guards";
import { TIERS, isTier, type Tier, ESTIMATED_DELIVERY_MINUTES, ESTIMATED_DELIVERY_LABEL } from "@/lib/tiers";
import { TRAINING_FINISH_EMAIL_SHORT } from "@/lib/email-notifications";
import { getUploadErrorHints } from "@/lib/upload-errors";
import {
  TRAIN_SET_NAME_DESCRIPTION,
  TRAIN_SET_NAME_LABEL,
  TRAIN_SET_NAME_PLACEHOLDER,
} from "@/lib/marketing-copy";
import { cn } from "@/lib/utils";
import { createBrowserClient } from "@supabase/ssr";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import {
  compressImagesForUpload,
  MAX_SINGLE_UPLOAD_BYTES,
} from "@/lib/client-image-compress";

type FormInput = z.infer<typeof fileUploadFormSchema>;

// Minimum and maximum number of images
const MIN_IMAGES = 4;
const MAX_IMAGES = 10;
// After client-side compression, allow larger total payload (iPhone photos)
const MAX_TOTAL_SIZE = 12 * 1024 * 1024;

interface FileObject {
  file: File;
  id: string;
  previewUrl: string;
  loadError?: boolean;
}

type DropResult =
  | { ok: true; next: FileObject[]; added: number; total: number }
  | { ok: false; title: string; description: string };

function buildDropResult(prev: FileObject[], acceptedFiles: File[]): DropResult {
  const existingNames = new Set(prev.map((fo) => fo.file.name));
  const newFiles = acceptedFiles.filter((file) => !existingNames.has(file.name));

  if (newFiles.length === 0) {
    return {
      ok: false,
      title: "Duplicate file names",
      description: "All selected files were already added.",
    };
  }

  if (newFiles.length + prev.length > MAX_IMAGES) {
    return {
      ok: false,
      title: "Too many images",
      description: `You can only upload up to ${MAX_IMAGES} images. Currently have ${prev.length}.`,
    };
  }

  const totalSize = prev.reduce((acc, fo) => acc + fo.file.size, 0);
  const newSize = newFiles.reduce((acc, file) => acc + file.size, 0);

  if (totalSize + newSize > MAX_TOTAL_SIZE) {
    return {
      ok: false,
      title: "Images exceed size limit",
      description: `The total combined size cannot exceed ${MAX_TOTAL_SIZE / 1024 / 1024}MB.`,
    };
  }

  const newFileObjects: FileObject[] = newFiles.map((file, index) => ({
    file,
    id: `${file.name}-${Date.now()}-${index}-${Math.random().toString(36).substring(2, 11)}`,
    previewUrl: URL.createObjectURL(file),
  }));

  const next = [...prev, ...newFileObjects];
  return { ok: true, next, added: newFiles.length, total: next.length };
}

function formatPhotosAddedToast(added: number, total: number): string {
  const addedText = added === 1 ? "1 photo added" : `${added} photos added`;
  const countText = `${total} of ${MAX_IMAGES} selected`;

  if (total >= MAX_IMAGES) {
    return `${addedText}. ${countText} — you can start training.`;
  }
  if (total >= MIN_IMAGES) {
    return `${addedText}. ${countText}.`;
  }
  return `${addedText}. ${countText} (need at least ${MIN_IMAGES}).`;
}

function PreviewInspectionStatus({ status }: { status?: InspectionUiStatus }) {
  if (!status || status.state === "idle") {
    return <div className="min-h-[18px]" aria-hidden />;
  }
  if (status.state === "checking") {
    return (
      <div className="flex min-h-[18px] items-center gap-1.5 text-xs text-muted-foreground">
        <Loader2 className="h-3 w-3 shrink-0 animate-spin" />
        Checking...
      </div>
    );
  }
  if (status.issues.length === 0) {
    return (
      <div className="flex min-h-[18px] items-center gap-1.5 text-xs text-green-600">
        <CheckCircle2 className="h-3 w-3 shrink-0" />
        Looks good for training
      </div>
    );
  }
  return (
    <div className="min-h-[18px] space-y-0.5">
      {status.issues.map((issue) => (
        <div
          key={issue}
          className="flex items-start gap-1 text-xs text-amber-600"
        >
          <AlertCircle className="mt-0.5 h-3 w-3 shrink-0" />
          <span>{issue}</span>
        </div>
      ))}
    </div>
  );
}

/** Stable preview tile with parent-managed inspection status. */
const UploadPreviewThumb = memo(function UploadPreviewThumb({
  fileObj,
  inspection,
  onRemove,
  onImageError,
}: {
  fileObj: FileObject;
  inspection?: InspectionUiStatus;
  onRemove: (fileObj: FileObject) => void;
  onImageError: (fileId: string) => void;
}) {
  return (
    <div className="flex flex-col gap-1 w-full">
      <div className="relative w-full aspect-square rounded-md overflow-hidden bg-muted">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={fileObj.previewUrl}
          alt="Preview"
          className={`h-full w-full object-cover ${fileObj.loadError ? "opacity-0" : ""}`}
          onError={() => onImageError(fileObj.id)}
        />
        {fileObj.loadError && (
          <div className="absolute inset-0 flex items-center justify-center p-2 text-center text-xs text-muted-foreground">
            Failed to load preview
          </div>
        )}
      </div>
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="w-full"
        onClick={() => onRemove(fileObj)}
      >
        Remove
      </Button>
      <PreviewInspectionStatus status={inspection} />
    </div>
  );
});

export default function TrainModelZone({ packSlug }: { packSlug: string }) {
  const [fileObjects, setFileObjects] = useState<FileObject[]>([]);
  const [inspectionStatus, setInspectionStatus] = useState<
    Record<string, InspectionUiStatus>
  >({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isCompressing, setIsCompressing] = useState(false);
  const [userTier, setUserTier] = useState<Tier>('starter'); // ⭐ 用户当前套餐
  const [tierLoading, setTierLoading] = useState<boolean>(true); // ⭐ 新增：tier 加载状态
  const { toast } = useToast();

  const showNoCreditsToast = useCallback(() => {
    toast({
      title: "No credits available",
      description: "Purchase a plan to start training your AI headshots.",
      duration: 10000,
      action: (
        <ToastAction
          altText="View pricing plans"
          onClick={() => {
            window.location.href = "/pricing";
          }}
        >
          View plans
        </ToastAction>
      ),
    });
  }, [toast]);
  // Track characteristics by file ID to avoid race conditions
  const characteristicsMapRef = useRef<Map<string, ImageInspectionResult>>(new Map());
  const isSubmittingRef = useRef(false);
  // Keep a ref to fileObjects for cleanup (avoids stale closure)
  const fileObjectsRef = useRef<FileObject[]>([]);

  const form = useForm<FormInput>({
    resolver: zodResolver(fileUploadFormSchema),
    defaultValues: {
      name: "",
      type: "",
      dataConsent: false,
    },
  });

  // Sync ref with state
  useEffect(() => {
    fileObjectsRef.current = fileObjects;
  }, [fileObjects]);

  const modelType = form.watch("type");
  const modelName = form.watch("name");
  const dataConsent = form.watch("dataConsent");
  const hasSelectedType = modelType === "man" || modelType === "woman";
  const hasName = (modelName?.trim().length ?? 0) > 0;
  const hasEnoughImages = fileObjects.length >= MIN_IMAGES;
  const inspectionBlocker = getUploadInspectionBlocker(
    fileObjects.map((f) => f.id),
    inspectionStatus
  );
  const canTrain =
    hasEnoughImages &&
    hasSelectedType &&
    hasName &&
    dataConsent &&
    !isLoading &&
    !inspectionBlocker;

  const trainBlocker = (() => {
    if (isLoading) return null;
    if (inspectionBlocker) return inspectionBlocker;
    if (!hasEnoughImages) {
      return `Upload at least ${MIN_IMAGES} photos (${fileObjects.length}/${MIN_IMAGES})`;
    }
    if (!hasSelectedType) return "Select Man or Woman above to continue";
    if (!hasName) return "Enter a name for this headshot set above to continue";
    if (!dataConsent) return "Agree to the privacy terms below to continue";
    return null;
  })();

  const handleInspectionResult = useCallback(
    (fileId: string, result: ImageInspectionResult) => {
      characteristicsMapRef.current.set(fileId, result);
    },
    []
  );

  useUploadInspectionQueue(
    fileObjects,
    hasSelectedType ? modelType : null,
    handleInspectionResult,
    setInspectionStatus
  );

  // ⭐ Fetch user tier from Supabase on mount
  useEffect(() => {
    async function fetchTier() {
      try {
        const supabase = createBrowserClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          setTierLoading(false);
          return;
        }

        const { data: credits } = await supabase
          .from('credits')
          .select('tier')
          .eq('user_id', session.user.id)
          .order('id', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (credits?.tier && isTier(credits.tier)) {
          setUserTier(credits.tier);
        }
      } catch (e) {
        // Silently fallback to starter
        if (process.env.NODE_ENV === 'development') {
          console.warn('Failed to fetch user tier:', e);
        }
      } finally {
        setTierLoading(false);
      }
    }
    fetchTier();
  }, []);

  // ⭐ Get tier display info
  const tierInfo = TIERS[userTier];

  // Cleanup ALL preview URLs on unmount using ref (not stale closure)
  useEffect(() => {
    return () => {
      fileObjectsRef.current.forEach(fo => {
        try { URL.revokeObjectURL(fo.previewUrl); } catch {}
      });
    };
  }, []);

  const onSubmit: SubmitHandler<FormInput> = () => {
    trainModel();
  };

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (isCompressing) return;
      setIsCompressing(true);
      try {
        const { files: compressed, rejected } = await compressImagesForUpload(acceptedFiles);

        if (rejected.length > 0) {
          toast({
            title:
              rejected.length === acceptedFiles.length
                ? "Photos could not be added"
                : "Some photos skipped",
            description: rejected.map((r) => `${r.name}: ${r.reason}`).join(" "),
            duration: 10000,
          });
        }

        if (compressed.length === 0) {
          return;
        }

        const result = buildDropResult(fileObjectsRef.current, compressed);
        if (!result.ok) {
          toast({
            title: result.title,
            description: result.description,
            duration: 5000,
          });
          return;
        }

        setFileObjects(result.next);
        toast({
          title: "Photos added",
          description: formatPhotosAddedToast(result.added, result.total),
          duration: 4000,
        });
      } finally {
        setIsCompressing(false);
      }
    },
    [toast, isCompressing]
  );

  const removeFile = useCallback(
    (fileObject: FileObject) => {
      // Revoke the object URL to free memory
      try { URL.revokeObjectURL(fileObject.previewUrl); } catch {}

      // Remove from fileObjects
      setFileObjects(prev => prev.filter(fo => fo.id !== fileObject.id));

      // Remove from characteristics map
      characteristicsMapRef.current.delete(fileObject.id);
    },
    []
  );

  // Handle image load error — mark as broken instead of showing blank
  const handleImageError = useCallback((fileId: string) => {
    setFileObjects(prev =>
      prev.map(fo => fo.id === fileId ? { ...fo, loadError: true } : fo)
    );
  }, []);

  const trainModel = useCallback(async () => {
    if (isSubmittingRef.current) return;

    // Read current fileObjects from ref to avoid stale closure
    const currentFileObjects = fileObjectsRef.current;

    const preUploadInspectionBlocker = getUploadInspectionBlocker(
      currentFileObjects.map((fo) => fo.id),
      inspectionStatus
    );
    if (preUploadInspectionBlocker) {
      toast({
        title: "Photos need attention",
        description: preUploadInspectionBlocker,
        duration: 8000,
      });
      return;
    }

    // Block oversize files before hitting Vercel (~4.5MB body limit)
    const oversize = currentFileObjects.filter(
      (fo) => fo.file.size > MAX_SINGLE_UPLOAD_BYTES
    );
    if (oversize.length > 0) {
      toast({
        title: "Photo too large to upload",
        description: `${oversize.map((fo) => fo.file.name).join(", ")} — remove and re-add, or choose a smaller photo.`,
        duration: 8000,
      });
      return;
    }

    // Validate minimum images
    if (currentFileObjects.length < MIN_IMAGES) {
      toast({
        title: "Not enough images",
        description: `Please upload at least ${MIN_IMAGES} images. Currently have ${currentFileObjects.length}.`,
        duration: 5000,
      });
      return;
    }

    // ⭐ Credit 前置检查：避免上传完才发现没 credit
    // 使用 getUser() 而非 getSession()，确保 JWT 有效；查询失败不阻断，服务端会最终验证
    try {
      const supabaseCheck = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );
      const { data: { user }, error: userError } = await supabaseCheck.auth.getUser();
      if (userError || !user) {
        // Session 无效 — 不阻断，服务端会验证
        if (process.env.NODE_ENV === 'development') console.warn("Credit pre-check: no valid user session");
      } else {
        const { data: credits, error: creditsError } = await supabaseCheck
          .from('credits')
          .select('credits')
          .eq('user_id', user.id)
          .order('id', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (creditsError) {
          // 查询出错 — 不阻断，服务端会验证
          if (process.env.NODE_ENV === 'development') console.warn("Credit pre-check query failed:", creditsError);
        } else if (!credits || (credits.credits ?? 0) < 1) {
          showNoCreditsToast();
          return;
        }
      }
    } catch (e) {
      // Credit check failed — continue anyway (server will validate)
      if (process.env.NODE_ENV === 'development') console.warn("Credit pre-check failed, will validate server-side:", e);
    }

    isSubmittingRef.current = true;
    setIsLoading(true);
    const totalFiles = currentFileObjects.length;
    const loadingToast = toast({
      title: `Step 1/3: Uploading images (0/${totalFiles})...`,
      description: "Please wait while we upload your photos.",
      duration: Infinity,
    });

    try {
      const storageUrls = await uploadTrainingImages(
        currentFileObjects.map((fileObj) => ({
          file: fileObj.file,
          fileName: fileObj.file.name,
        })),
        {
          concurrency: 3,
          maxRetries: 2,
          onProgress: (completed, total) => {
            loadingToast.update({
              id: loadingToast.id,
              title: `Step 1/3: Uploading images (${completed}/${total})...`,
              description: `Uploaded ${completed} of ${total} photos.`,
              duration: Infinity,
            });
          },
        }
      );

      loadingToast.update({
        id: loadingToast.id,
        title: "Step 2/3: Starting AI training...",
        description: `This usually takes about ${ESTIMATED_DELIVERY_MINUTES} minutes. You can close this page — ${TRAINING_FINISH_EMAIL_SHORT.toLowerCase()}.`,
        duration: Infinity,
      });

      const characteristicsValues = currentFileObjects.map((fileObj) =>
        characteristicsMapRef.current.get(fileObj.id) ?? DEFAULT_INSPECTION_RESULT
      );

      const aggregatedCharacteristics = aggregateCharacteristics(
        characteristicsValues
      );

      const payload = {
        urls: storageUrls,
        name: form.getValues("name").trim(),
        type: form.getValues("type"),
        pack: packSlug,
        characteristics: aggregatedCharacteristics
      };

      // Send the JSON payload to the "/astria/train-model" endpoint
      const response = await fetch("/astria/train-model", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      let responseData: { message?: string; details?: string; modelId?: number; queued?: boolean } = {};
      try {
        responseData = await response.json();
      } catch {
        if (!response.ok) {
          throw new Error("Server timeout or error — please try again.");
        }
      }

      if (!response.ok) {
        loadingToast.dismiss();
        if (response.status === 402 || responseData.message === "no_credits") {
          showNoCreditsToast();
          return;
        }
        const responseMessage =
          responseData.message ||
          (response.status === 422
            ? "Training could not be started. Please check your photos and try again."
            : `Something went wrong (${response.status}). Please try again.`);
        const responseDetails = responseData.details || "";

        toast({
          title: "Could not start training",
          description: (
            <div className="flex flex-col gap-2 text-sm">
              <p>{responseMessage}</p>
              {responseDetails && (
                <p className="text-muted-foreground">{responseDetails}</p>
              )}
            </div>
          ),
          duration: 10000,
        });
        return;
      }

      const redirectModelId = responseData.modelId;

      // Update toast to step 3
      loadingToast.update({
        id: loadingToast.id,
        title: "✓ Model queued for training!",
        description: responseData.queued
          ? `Training is starting — ${TRAINING_FINISH_EMAIL_SHORT.toLowerCase()} (${ESTIMATED_DELIVERY_LABEL}). Redirecting...`
          : `You can close this page now. ${TRAINING_FINISH_EMAIL_SHORT} (${ESTIMATED_DELIVERY_LABEL}). Redirecting...`,
      });

      // Clean up preview URLs before navigating away
      currentFileObjects.forEach(fo => {
        try { URL.revokeObjectURL(fo.previewUrl); } catch {}
      });

      setTimeout(() => {
        loadingToast.dismiss();
        window.location.href = redirectModelId
          ? `/overview/models/${redirectModelId}`
          : "/overview";
      }, 1000);
    } catch (error: unknown) {
      loadingToast.dismiss();
      const err = error as Error & { statusCode?: number; response?: { status?: number; data?: { message?: string; error?: string } } };
      let message =
        err?.response?.data?.message
        || err?.response?.data?.error
        || err?.message
        || "Upload failed";
      if (message.includes("status code")) {
        message = "Training could not be started. Please try again in a moment.";
      }
      const statusCode = err?.statusCode ?? err?.response?.status;
      const hints = getUploadErrorHints(String(message), statusCode);

      if (process.env.NODE_ENV === 'development') {
        console.error("=== TRAIN MODEL CATCH ===", error);
      }

      toast({
        title: "Could not start training",
        description: (
          <div className="flex flex-col gap-2 text-sm">
            <p>{String(message).substring(0, 200)}</p>
            <ul className="list-disc pl-4 space-y-1 text-muted-foreground">
              {hints.map((hint) => (
                <li key={hint}>{hint}</li>
              ))}
            </ul>
          </div>
        ),
        duration: 12000,
      });
    } finally {
      isSubmittingRef.current = false;
      setIsLoading(false);
    }
  }, [form, packSlug, toast, showNoCreditsToast, inspectionStatus]);

  const { getRootProps, getInputProps, open, isDragActive } = useDropzone({
    onDrop,
    noClick: false,
    noKeyboard: false,
    disabled: isCompressing || isLoading,
    accept: {
      "image/png": [".png"],
      "image/jpeg": [".jpg", ".jpeg"],
      "image/webp": [".webp"],
      "image/heic": [".heic"],
      "image/heif": [".heif"],
    },
  });

  return (
    <div className="notranslate" translate="no">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="rounded-md flex flex-col gap-8"
        >
          {/* ⭐ Tier Info Badge - 加载完成后才显示 */}
          {tierLoading ? (
            <div className="flex items-center gap-2 p-3 rounded-md bg-muted/50 border">
              <div className="h-5 w-16 bg-muted animate-pulse rounded" />
              <div className="h-5 w-32 bg-muted animate-pulse rounded" />
            </div>
          ) : (
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 p-3 rounded-md bg-muted/50 border">
              <Badge variant="secondary" className="text-xs shrink-0">
                {tierInfo.name} plan
              </Badge>
              <span className="text-sm text-muted-foreground">
                {tierInfo.marketingImageCount} HD headshots · {tierInfo.estimatedTime}
              </span>
            </div>
          )}

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="w-full rounded-md">
                <FormLabel>{TRAIN_SET_NAME_LABEL}</FormLabel>
                <FormDescription>
                  {TRAIN_SET_NAME_DESCRIPTION}
                </FormDescription>
                <FormControl>
                  <Input
                    placeholder={TRAIN_SET_NAME_PLACEHOLDER}
                    {...field}
                    value={field.value ?? ""}
                    className="max-w-screen-sm placeholder:text-muted-foreground/45 placeholder:font-normal"
                    autoComplete="off"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem className="w-full rounded-md border-2 border-dashed border-primary/30 bg-primary/5 p-4 sm:p-5">
                <FormLabel className="text-base font-bold">
                  Gender <span className="text-destructive">*</span>
                </FormLabel>
                <FormDescription className="text-sm">
                  Required — choose Man or Woman so we generate the right professional looks for you.
                </FormDescription>
                <FormControl>
                  <RadioGroup
                    className="mt-3 grid grid-cols-2 gap-4"
                    value={field.value || undefined}
                    onValueChange={field.onChange}
                  >
                    <div>
                      <RadioGroupItem
                        value="man"
                        id="man"
                        className="peer sr-only"
                        aria-label="Man"
                      />
                      <Label
                        htmlFor="man"
                        className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-muted bg-background p-3 transition-all hover:border-primary/60 hover:bg-accent/40 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/10 peer-data-[state=checked]:shadow-md [&:has([data-state=checked])]:border-primary [&:has([data-state=checked])]:bg-primary/10 [&:has([data-state=checked])]:shadow-md"
                      >
                        <FaMale className="mb-2 h-6 w-6 text-primary" />
                        <span className="text-base font-bold tracking-wide">Man</span>
                        <span className="mt-1 text-xs font-medium text-muted-foreground">
                          Men&apos;s suits &amp; shirts
                        </span>
                      </Label>
                    </div>

                    <div>
                      <RadioGroupItem
                        value="woman"
                        id="woman"
                        className="peer sr-only"
                        aria-label="Woman"
                      />
                      <Label
                        htmlFor="woman"
                        className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-muted bg-background p-3 transition-all hover:border-primary/60 hover:bg-accent/40 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/10 peer-data-[state=checked]:shadow-md [&:has([data-state=checked])]:border-primary [&:has([data-state=checked])]:bg-primary/10 [&:has([data-state=checked])]:shadow-md"
                      >
                        <FaFemale className="mb-2 h-6 w-6 text-primary" />
                        <span className="text-base font-bold tracking-wide">Woman</span>
                        <span className="mt-1 text-xs font-medium text-muted-foreground">
                          Women&apos;s blazers &amp; blouses
                        </span>
                      </Label>
                    </div>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

        </form>

        {/* Upload zone outside <form> — avoids React DOM errors with file input + previews */}
        <section aria-label="Photo upload" className="mt-8 flex flex-col gap-4">
          <p className="text-sm text-muted-foreground">
            Upload 4-10 images of the person you want to generate headshots for.
          </p>
          <div
            {...getRootProps()}
            className="flex flex-col gap-4 rounded-md"
          >
            <input {...getInputProps({ capture: "environment" })} />
            <div
              className={`outline-dashed outline-2 w-full min-h-[200px] rounded-md p-8 flex justify-center items-center cursor-pointer ${
                isDragActive
                  ? "outline-primary bg-primary/5"
                  : "outline-gray-100 hover:outline-blue-500"
              }`}
            >
              {isDragActive ? (
                <p className="font-medium text-primary">Drop the files here…</p>
              ) : isCompressing ? (
                <div className="flex flex-col items-center gap-3">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <p className="text-sm text-muted-foreground">Optimizing photos for upload…</p>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-3">
                  <FaImages size={32} className="text-gray-700" />
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={(e) => {
                      e.stopPropagation();
                      open();
                    }}
                    className="text-primary font-semibold text-lg hover:bg-transparent hover:text-primary/80 min-h-11"
                  >
                    Upload Your Photo
                  </Button>
                </div>
              )}
            </div>
          </div>

          {fileObjects.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {fileObjects.map((fileObj) => (
                <UploadPreviewThumb
                  key={fileObj.id}
                  fileObj={fileObj}
                  inspection={inspectionStatus[fileObj.id]}
                  onRemove={removeFile}
                  onImageError={handleImageError}
                />
              ))}
            </div>
          )}
        </section>

        {/* Privacy consent — before Train so users know it's required */}
        <FormField
          control={form.control}
          name="dataConsent"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 hover:bg-accent/50 transition-colors mt-8">
              <FormControl>
                <div className="flex items-center h-10">
                  <input
                    type="checkbox"
                    checked={field.value}
                    onChange={field.onChange}
                    className="h-6 w-6 mt-0 cursor-pointer accent-primary"
                    style={{ minWidth: '24px', minHeight: '24px' }}
                    id="dataConsent"
                  />
                </div>
              </FormControl>
              <div className="space-y-1 leading-none">
                <label htmlFor="dataConsent" className="text-sm font-normal cursor-pointer">
                  I agree to the <a href="/privacy" className="text-primary hover:underline" target="_blank">Privacy Policy</a>. I understand that:
                </label>
                <ul className="list-disc pl-6 mt-2 space-y-1 text-xs text-muted-foreground">
                  {TRAIN_CONSENT_BULLETS.map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />

        {trainBlocker && (
          <p className="mt-3 text-center text-sm text-amber-600">{trainBlocker}</p>
        )}

        {/* Train Model button — placed after upload + consent */}
        <Button
          type="button"
          size="lg"
          className={cn(
            "mt-4 w-full font-semibold transition-all",
            canTrain && "shadow-md"
          )}
          disabled={!canTrain || isCompressing}
          onClick={() => form.handleSubmit(onSubmit)()}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating headshots…
            </>
          ) : (
            "Create headshots"
          )}
        </Button>
      </Form>
    </div>
  );
}
