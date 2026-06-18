type ModelStatusInput = {
  status: string;
  images_generated?: number | null;
  total_images?: number | null;
};

/** Customer-facing status copy (not internal DB values). */
export function getModelStatusLabel(model: ModelStatusInput): string {
  const generated = model.images_generated ?? 0;
  const total = model.total_images ?? 0;

  switch (model.status) {
    case "processing":
      return "Creating headshots…";
    case "pending":
      return "Queued…";
    case "failed":
      return "Failed";
    case "completed":
      return "Ready";
    case "finished":
      if (total > 0 && generated > 0) {
        return `Generating ${generated}/${total}`;
      }
      return "Generating headshots…";
    default:
      return model.status;
  }
}

export function isModelGenerating(model: ModelStatusInput): boolean {
  return (
    model.status === "processing" ||
    model.status === "pending" ||
    model.status === "finished"
  );
}

export function isModelReady(model: ModelStatusInput): boolean {
  return model.status === "completed";
}
