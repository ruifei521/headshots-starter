type UploadFile = {
  file: File;
  fileName?: string;
};

type UploadOptions = {
  concurrency?: number;
  maxRetries?: number;
  onProgress?: (completed: number, total: number) => void;
};

const DEFAULT_CONCURRENCY = 3;
const DEFAULT_MAX_RETRIES = 2;

/** Upload training photos with limited concurrency and per-file retry (mobile-friendly). */
export async function uploadTrainingImages(
  files: UploadFile[],
  options: UploadOptions = {}
): Promise<string[]> {
  if (files.length === 0) return [];

  const concurrency = options.concurrency ?? DEFAULT_CONCURRENCY;
  const maxRetries = options.maxRetries ?? DEFAULT_MAX_RETRIES;
  const results: string[] = new Array(files.length);
  let completed = 0;
  let nextIndex = 0;

  async function uploadOne(index: number): Promise<void> {
    const { file, fileName } = files[index];
    let lastError: Error | null = null;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("fileName", fileName ?? file.name);

        const response = await fetch("/astria/train-model/image-upload", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          const err = new Error(
            (errorData as { error?: string }).error || "Failed to upload image"
          ) as Error & { statusCode?: number };
          err.statusCode = response.status;
          throw err;
        }

        const data = (await response.json()) as { url: string };
        results[index] = data.url;
        completed += 1;
        options.onProgress?.(completed, files.length);
        return;
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        if (attempt < maxRetries) {
          await new Promise((resolve) =>
            setTimeout(resolve, 400 * (attempt + 1))
          );
        }
      }
    }

    throw lastError ?? new Error(`Upload failed for ${file.name}`);
  }

  async function worker(): Promise<void> {
    while (true) {
      const index = nextIndex;
      nextIndex += 1;
      if (index >= files.length) break;
      await uploadOne(index);
    }
  }

  await Promise.all(
    Array.from({ length: Math.min(concurrency, files.length) }, () => worker())
  );

  return results;
}
