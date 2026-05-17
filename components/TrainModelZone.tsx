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
import { useToast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useCallback, useState, useEffect, useRef } from "react";
import { useDropzone } from "react-dropzone";
import { SubmitHandler, useForm } from "react-hook-form";
import { FaFemale, FaImages, FaMale, FaRainbow } from "react-icons/fa";
import * as z from "zod";
import { fileUploadFormSchema } from "@/types/zod";
import axios from "axios";
import { ImageInspector } from "./ImageInspector";
import { ImageInspectionResult, aggregateCharacteristics } from "@/lib/imageInspection";
import { createClient } from "@supabase/supabase-js";
import { Database } from "@/types/supabase";

type FormInput = z.infer<typeof fileUploadFormSchema>;

const stripeIsConfigured = process.env.NEXT_PUBLIC_STRIPE_IS_ENABLED === "true";

// Minimum and maximum number of images
const MIN_IMAGES = 4;
const MAX_IMAGES = 10;
// Maximum total size in bytes (4.5MB)
const MAX_TOTAL_SIZE = 4.5 * 1024 * 1024;

interface FileObject {
  file: File;
  id: string;  // unique ID for React key and URL management
  previewUrl: string;
}

export default function TrainModelZone({ packSlug }: { packSlug: string }) {
  const [fileObjects, setFileObjects] = useState<FileObject[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [characteristics, setCharacteristics] = useState<ImageInspectionResult[]>([]);
  const { toast } = useToast();
  const router = useRouter();
  // Track which file IDs have characteristics
  const characteristicsMapRef = useRef<Map<string, ImageInspectionResult>>(new Map());

  const form = useForm<FormInput>({
    resolver: zodResolver(fileUploadFormSchema),
    defaultValues: {
      name: "",
      type: "man",
      dataConsent: false,
    },
  });

  // Cleanup preview URLs on unmount
  useEffect(() => {
    return () => {
      fileObjects.forEach(fo => URL.revokeObjectURL(fo.previewUrl));
    };
  }, []);

  const onSubmit: SubmitHandler<FormInput> = () => {
    trainModel();
  };

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      // Check for duplicate file names
      const existingNames = new Set(fileObjects.map(fo => fo.file.name));
      const newFiles = acceptedFiles.filter(
        (file: File) => !existingNames.has(file.name)
      );

      if (newFiles.length === 0) {
        toast({
          title: "Duplicate file names",
          description: "All selected files were already added.",
          duration: 5000,
        });
        return;
      }

      if (newFiles.length + fileObjects.length > MAX_IMAGES) {
        toast({
          title: "Too many images",
          description: `You can only upload up to ${MAX_IMAGES} images. Currently have ${fileObjects.length}.`,
          duration: 5000,
        });
        return;
      }

      const totalSize = fileObjects.reduce((acc, fo) => acc + fo.file.size, 0);
      const newSize = newFiles.reduce((acc, file) => acc + file.size, 0);

      if (totalSize + newSize > MAX_TOTAL_SIZE) {
        toast({
          title: "Images exceed size limit",
          description: `The total combined size cannot exceed ${MAX_TOTAL_SIZE / 1024 / 1024}MB.`,
          duration: 5000,
        });
        return;
      }

      // Create FileObjects with unique IDs and preview URLs
      const newFileObjects: FileObject[] = newFiles.map((file) => ({
        file,
        id: `${file.name}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        previewUrl: URL.createObjectURL(file),
      }));

      setFileObjects(prev => [...prev, ...newFileObjects]);

      toast({
        title: "Images selected",
        description: `${newFiles.length} image(s) added. ${fileObjects.length + newFiles.length} total.`,
        duration: 3000,
      });
    },
    [fileObjects, toast]
  );

  const removeFile = useCallback(
    (fileObject: FileObject) => {
      // Revoke the object URL to free memory
      URL.revokeObjectURL(fileObject.previewUrl);
      
      // Remove from fileObjects
      setFileObjects(prev => prev.filter(fo => fo.id !== fileObject.id));
      
      // Remove from characteristics map
      characteristicsMapRef.current.delete(fileObject.id);
    },
    []
  );

  const handleInspectionComplete = (result: ImageInspectionResult, fileId: string) => {
    characteristicsMapRef.current.set(fileId, result);
    
    // Update characteristics array from map
    const allCharacteristics = Array.from(characteristicsMapRef.current.values());
    setCharacteristics(allCharacteristics);
  };

  const trainModel = useCallback(async () => {
    // Validate minimum images
    if (fileObjects.length < MIN_IMAGES) {
      toast({
        title: "Not enough images",
        description: `Please upload at least ${MIN_IMAGES} images. Currently have ${fileObjects.length}.`,
        duration: 5000,
      });
      return;
    }

    setIsLoading(true);

    try {
      // Upload all files in PARALLEL
      const uploadPromises = fileObjects.map(async (fileObj) => {
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
        return data.url;
      });

      const storageUrls = await Promise.all(uploadPromises);

      const aggregatedCharacteristics = aggregateCharacteristics(characteristics);

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
        const responseData = await response.json();
        const responseMessage: string = responseData.message;
        console.error("Something went wrong! ", responseMessage);
        const messageWithButton = (
          <div className="flex flex-col gap-4">
            {responseMessage}
            <a href="/get-credits">
              <Button size="sm">Get Credits</Button>
            </a>
          </div>
        );
        toast({
          title: "Something went wrong!",
          description: responseMessage.includes("Not enough credits")
            ? messageWithButton
            : responseMessage,
          duration: 5000,
        });
        return;
      }

      toast({
        title: "Model queued for training",
        description: "Your headshots are being generated. This usually takes about 30 minutes.",
        duration: 5000,
      });

      // Clean up preview URLs before navigating away
      fileObjects.forEach(fo => URL.revokeObjectURL(fo.previewUrl));
      
      router.push("/overview");
    } catch (error) {
      setIsLoading(false);
      const message = error instanceof Error ? error.message : "Upload failed";
      toast({
        title: "Upload failed",
        description: message,
        duration: 5000,
      });
    }
  }, [fileObjects, characteristics, form, packSlug, toast, router]);

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
            <FormLabel>Samples</FormLabel>
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
                    Drag 'n' drop some files here, or click to select files.
                  </p>
                </div>
              )}
            </div>
          </div>
          {fileObjects.length > 0 && (
            <div className="flex flex-row gap-4 flex-wrap">
              {fileObjects.map((fileObj) => {
                return (
                  <div key={fileObj.id} className="flex flex-col gap-1">
                    <div className="relative">
                      <img
                        src={fileObj.previewUrl}
                        className="rounded-md w-24 h-24 object-cover"
                        alt="Preview"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full mt-1"
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
                  </div>
                );
              })}
            </div>
          )}

          <FormField
            control={form.control}
            name="dataConsent"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <input
                    type="checkbox"
                    checked={field.value}
                    onChange={field.onChange}
                    className="h-4 w-4 mt-1 cursor-pointer"
                  />
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
            Train Model{stripeIsConfigured && <span className="ml-1">(1 Credit)</span>}
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
