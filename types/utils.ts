import { Database } from "./supabase";

export type modelRow = Database["public"]["Tables"]["models"]["Row"];
export type sampleRow = Database["public"]["Tables"]["samples"]["Row"];

export type modelRowWithSamples = Omit<modelRow, 'images_generated' | 'total_images'> & {
  samples: sampleRow[];
};

export type imageRow = Database["public"]["Tables"]["images"]["Row"];

export type creditsRow = Database["public"]["Tables"]["credits"]["Row"];
