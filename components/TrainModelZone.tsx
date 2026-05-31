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
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useCallback, useState, useEffect, useRef } from "react";
import { useDropzone } from "react-dropzone";
import { SubmitHandler, useForm } from "react-hook-form";
import { FaFemale, FaImages, FaMale, FaRainbow } from "react-icons/fa";
import * as z from "zod";
import { fileUploadFormSchema } from "@/types/zod";
import { ImageInspector } from "./ImageInspector";
import { ImageInspectionResult, aggregateCharacteristics } from "@/lib/imageInspection";
import { TIERS, isTier, type Tier } from "@/lib/tiers";
import { createBrowserClient } from "@supabase/ssr";
import Image from "next/image";

type FormInput = z.infer<typeof fileUploadFormSchema>;

const stripeIsConfigured = process.env.NEXT_PUBLIC_STRIPE_IS_ENABLED === "true";
const creemIsConfigured = process.env.NEXT_PUBLIC_CREEM_IS_ENABLED === "true";

// Minimum and maximum number of images
const MIN_IMAGES = 4;
const MAX_IMAGES = 10;
// Maximum total size in bytes (4.5MB)
const MAX_TOTAL_SIZE = 4.5 * 1024 * 1024;

interface FileObject {
  file: File;
  id: string;  // unique ID for React key and URL management
  previewUrl: string;
  loadError?: boolean;  // track if image failed to load
}

export default function TrainModelZone({ packSlug }: { packSlug: string }) {
  const [fileObjects, setFileObjects] = useState<FileObject[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [userTier, setUserTier] = useState<Tier>('starter'); // ⭐ 用户当前套餐
  const { toast } = useToast();
  const router = useRouter();
  // Track characteristics by file ID to avoid race conditions
  const characteristicsMapRef = useRef<Map<string, ImageInspectionResult>>(new Map());
  // Keep a ref to fileObjects for cleanup (avoids stale closure)
  const fileObjectsRef = useRef<FileObject[]>([]);

  const form = useForm<FormInput>({
    resolver: zodResolver(fileUploadFormSchema),
    defaultValues: {
      name: "",
      type: "man",
      dataConsent: false,
    },
  });

  // Sync ref with state
  useEffect(() => {
    fileObjectsRef.current = fileObjects;
  }, [fileObjects]);

  // ⭐ Fetch user tier from Supabase on mount
  useEffect(() => {
    async function fetchTier() {
      try {
        const supabase = createBrowserClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;

        const { data: credits } = await supabase
          .from('credits')
          .select('tier')
          .eq('user_id', session.user.id)
          .single();

        if (credits?.tier && isTier(credits.tier)) {
          setUserTier(credits.tier);
        }
      } catch (e) {
        // Silently fallback to starter
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
    (acceptedFiles: File[]) => {
      // Use functional state update to avoid stale closure issues
      setFileObjects(prev => {
        // Check for duplicate file names against CURRENT state
        const existingNames = new Set(prev.map(fo => fo.file.name));
        const newFiles = acceptedFiles.filter(
          (file: File) => !existingNames.has(file.name)
        );

        if (newFiles.length === 0) {
          toast({
            title: "Duplicate file names",
            description: "All selected files were already added.",
            duration: 5000,
          });
          return prev; // no change
        }

        if (newFiles.length + prev.length > MAX_IMAGES) {
          toast({
            title: "Too many images",
            description: `You can only upload up to ${MAX_IMAGES} images. Currently have ${prev.length}.`,
            duration: 5000,
          });
          return prev; // no change
        }

        const totalSize = prev.reduce((acc, fo) => acc + fo.file.size, 0);
        const newSize = newFiles.reduce((acc, file) => acc + file.size, 0);

        if (totalSize + newSize > MAX_TOTAL_SIZE) {
          toast({
            title: "Images exceed size limit",
            description: `The total combined size cannot exceed ${MAX_TOTAL_SIZE / 1024 / 1024}MB.`,
            duration: 5000,
          });
          return prev; // no change
        }

        // Create FileObjects with unique IDs and preview URLs
        const newFileObjects: FileObject[] = newFiles.map((file, index) => ({
          file,
          id: `${file.name}-${Date.now()}-${index}-${Math.random().toString(36).substring(2, 11)}`,
          previewUrl: URL.createObjectURL(file),
        }));

        const totalCount = prev.length + newFileObjects.length;
        // Use setTimeout to show toast after state update (toast is stable ref)
        setTimeout(() => {
          toast({
            title: "Images selected",
            description: `${newFiles.length} image(s) added. ${totalCount} total.`,
            duration: 3000,
          });
        }, 0);

        return [...prev, ...newFileObjects];
      });
    },
    [toast]
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

  const handleInspectionComplete = useCallback(
    (result: ImageInspectionResult, fileId: string) => {
      characteristicsMapRef.current.set(fileId, result);
      // No need to trigger re-render here — characteristics are only
      // read when submitting, so we just keep the ref up to date.
    },
    []
  );

  const trainModel = useCallback(async () => {
    // Read current fileObjects from ref to avoid stale closure
    const currentFileObjects = fileObjectsRef.current;

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
    try {
      const supabaseCheck = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );
      const { data: { session } } = await supabaseCheck.auth.getSession();
      if (session) {
        const { data: credits } = await supabaseCheck
          .from('credits')
          .select('credits')
          .eq('user_id', session.user.id)
          .single();
        
        if (!credits || credits.credits < 1) {
          toast({
            title: "No credits available",
            description: "You don't have enough credits to start training. Please purchase a plan first.",
            duration: 8000,
          });
          return;
        }
      }
    } catch (e) {
      // Credit check failed — continue anyway (server will validate)
      console.warn("Credit pre-check failed, will validate server-side:", e);
    }

    setIsLoading(true);
    const totalFiles = currentFileObjects.length;
    const loadingToast = toast({
      title: `Step 1/3: Uploading images (0/${totalFiles})...`,
      description: "Please wait while we upload your photos.",
      duration: Infinity,
    });

    try {
      // ⭐ 并行上传 + 逐张进度更新
      let completedUploads = 0;
      const uploadPromises = currentFileObjects.map(async (fileObj) => {
        const formData = new FormData();
        formData.append("file", fileObj.file);
        formData.append("fileName", fileObj.file.name);

        const response = await fetch("/astria/train-model/image-upload", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to upload image");
        }

        const data = await response.json();
        
        // ⭐ 每张上传完成时更新进度
        completedUploads++;
        loadingToast.update({
          id: loadingToast.id,
          title: `Step 1/3: Uploading images (${completedUploads}/${totalFiles})...`,
          description: `Uploaded ${completedUploads} of ${totalFiles} photos.`,
          duration: Infinity,
        });
        
        return data.url;
      });

      const storageUrls = await Promise.all(uploadPromises);

      // Update toast to step 2
      loadingToast.update({
        id: loadingToast.id,
        title: "Step 2/3: Starting AI training...",
        description: "This usually takes about 30 minutes. You can close this page and we'll email you when ready!",
        duration: Infinity, // keep showing until we dismiss
      });

      const aggregatedCharacteristics = aggregateCharacteristics(
        Array.from(characteristicsMapRef.current.values())
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

      setIsLoading(false);

      if (!response.ok) {
        loadingToast.dismiss();
        let responseMessage = `HTTP error! status: ${response.status}`;
        let responseDetails = '';
        try {
          const responseData = await response.json();
          responseMessage = responseData.message || responseMessage;
          responseDetails = responseData.details || '';
        } catch {
          responseMessage = 'Server timeout or error — please try again.';
        }
        
        // 显示详细错误信息
        const detailedMessage = (
          <div className="flex flex-col gap-4">
            <div>{responseMessage}</div>
            {responseDetails && (
              <div className="text-sm text-gray-500">
                Details: {responseDetails}
              </div>
            )}

          </div>
        );
        
        toast({
          title: "Error",
          description: detailedMessage,
          duration: 8000,
        });
        return;
      }

      // Update toast to step 3
      loadingToast.update({
        id: loadingToast.id,
        title: "✓ Model queued for training!",
        description: "You can close this page now. We'll email you when your headshots are ready (~30 mins). Redirecting...",
      });

      // Clean up preview URLs before navigating away
      currentFileObjects.forEach(fo => {
        try { URL.revokeObjectURL(fo.previewUrl); } catch {}
      });

      setTimeout(() => {
        loadingToast.dismiss();
        router.push("/overview");
      }, 1000);
    } catch (error: any) {
      setIsLoading(false);
      loadingToast.dismiss();
      // 显示尽可能详细的错误信息
      const message = error?.response?.data?.message 
        || error?.response?.data?.error 
        || error?.message 
        || "Upload failed";
      // 在控制台打印完整错误对象，方便 Vercel 日志排查
      console.error("=== TRAIN MODEL CATCH ===");
      console.error("Error message:", error?.message);
      console.error("Error response status:", error?.response?.status);
      console.error("Error response data:", error?.response?.data);
      console.error("Full error object:", error);
      
      toast({
        title: "Train Failed",
        description: String(message).substring(0, 200),
        duration: 8000,
      });
    }
  }, [form, packSlug, toast, router]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/png": [".png"],
      "image/jpeg": [".jpg", ".jpeg"],
    },
  });

  const modelType = form.watch("type");

  return (
    <div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="rounded-md flex flex-col gap-8"
        >
          {/* ⭐ Tier Info Badge */}
          <div className="flex items-center gap-2 p-3 rounded-md bg-muted/50 border">
            <Badge variant="secondary" className="text-xs">
              {tierInfo.name}
            </Badge>
            <span className="text-sm text-muted-foreground">
              {tierInfo.imageCount} HD headshots
            </span>
          </div>

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="w-full rounded-md">
                <FormLabel>Name</FormLabel>
                <FormDescription>
                  Give your model a name so you can easily identify it later.
                </FormDescription>
                <FormControl>
                  <Input
                    placeholder="e.g. Natalie Headshots"
                    {...field}
                    className="max-w-screen-sm"
                    autoComplete="off"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex flex-col gap-4">
            <FormLabel>Type</FormLabel>
            <FormDescription>
              Select the type of headshots you want to generate.
            </FormDescription>
            <RadioGroup
              defaultValue={modelType}
              className="grid grid-cols-3 gap-4"
              value={modelType}
              onValueChange={(value) => {
                form.setValue("type", value);
              }}
            >
              <div>
                <RadioGroupItem
                  value="man"
                  id="man"
                  className="peer sr-only"
                  aria-label="man"
                />
                <Label
                  htmlFor="man"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  <FaMale className="mb-3 h-6 w-6" />
                  Man
                </Label>
              </div>

              <div>
                <RadioGroupItem
                  value="woman"
                  id="woman"
                  className="peer sr-only"
                  aria-label="woman"
                />
                <Label
                  htmlFor="woman"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  <FaFemale className="mb-3 h-6 w-6" />
                  Woman
                </Label>
              </div>
              <div>
                <RadioGroupItem
                  value="person"
                  id="person"
                  className="peer sr-only"
                  aria-label="person"
                />
                <Label
                  htmlFor="person"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  <FaRainbow className="mb-3 h-6 w-6" />
                  Unisex
                </Label>
              </div>
            </RadioGroup>
          </div>
          <div
            {...getRootProps()}
            className=" rounded-md justify-center align-middle cursor-pointer flex flex-col gap-4"
          >
            <FormDescription>
              Upload 4-10 images of the person you want to generate headshots
              for.
            </FormDescription>
            <div className="outline-dashed outline-2 outline-gray-100 hover:outline-blue-500 w-full h-full rounded-md p-4 flex justify-center align-middle">
              <input {...getInputProps()} />
              {isDragActive ? (
                <p className="self-center">Drop the files here ...</p>
              ) : (
                <div className="flex justify-center flex-col items-center gap-2">
                  <FaImages size={32} className="text-gray-700" />
                  <p className="self-center">
                    Drag &apos;n&apos; drop some files here, or click to select files.
                  </p>
                </div>
              )}
            </div>
          </div>
          {fileObjects.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {fileObjects.map((fileObj) => {
                return (
                  <div key={fileObj.id} className="flex flex-col gap-1 w-full">
                    {/* Image thumbnail with fixed aspect ratio container */}
                    <div className="relative w-full aspect-square rounded-md overflow-hidden bg-muted">
                      {fileObj.loadError ? (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs p-2 text-center">
                          Failed to load preview
                        </div>
                      ) : (
                        <Image
                          src={fileObj.previewUrl}
                          fill
                          className="object-cover"
                          alt="Preview"
                          unoptimized
                          onError={() => handleImageError(fileObj.id)}
                        />
                      )}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => removeFile(fileObj)}
                    >
                      Remove
                    </Button>
                    <ImageInspector
                      file={fileObj.file}
                      fileId={fileObj.id}
                      type={form.getValues("type")}
                      onInspectionComplete={(result) => handleInspectionComplete(result, fileObj.id)}
                    />
                  </div>
                );
              })}
            </div>
          )}

          <FormField
            control={form.control}
            name="dataConsent"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 hover:bg-accent/50 transition-colors">
                <FormControl>
                  <div className="flex items-center h-10">
                    <input
                      type="checkbox"
                      checked={field.value}
                      onChange={field.onChange}
                      className="h-6 w-6 mt-0 cursor-pointer accent-primary"
                      style={{ minWidth: '24px', minHeight: '24px' }}
                    />
                  </div>
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="text-sm font-normal cursor-pointer">
                    I agree to the <a href="/privacy" className="text-primary hover:underline" target="_blank">Privacy Policy</a>. I understand that:
                    <ul className="list-disc pl-6 mt-2 space-y-1 text-xs text-muted-foreground">
                      <li>My photos will only be used to generate AI headshots</li>
                      <li>Original photos will be automatically deleted within 7 days</li>
                      <li>Generated headshots will be stored for 30 days, then automatically deleted</li>
                      <li>I have the consent of the person(s) in the photos</li>
                    </ul>
                  </FormLabel>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading || fileObjects.length < MIN_IMAGES}
          >
            Train Model{(stripeIsConfigured || creemIsConfigured) && <span className="ml-1">(1 Credit)</span>}
            {fileObjects.length < MIN_IMAGES && (
              <span className="ml-2 text-sm">
                ({fileObjects.length}/{MIN_IMAGES} images)
              </span>
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}
