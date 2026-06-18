import { Database } from "./supabase";

export type modelRow = Database["public"]["Tables"]["models"]["Row"];
export type sampleRow = Database["public"]["Tables"]["samples"]["Row"];

export type modelRowWithSamples = modelRow & {
  samples: sampleRow[];
};

export type imageRow = Database["public"]["Tables"]["images"]["Row"];

/** Minimal fields for gallery grids (avoids requiring created_at on server selects). */
export type galleryImageRow = Pick<imageRow, "id" | "uri" | "modelId">;

export type creditsRow = Database["public"]["Tables"]["credits"]["Row"];
