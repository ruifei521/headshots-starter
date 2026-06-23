import { MetadataRoute } from "next";
import fs from "fs";
import path from "path";

const SITE_URL = "https://snapprohead.com";

function getImageFiles(dir: string, basePath: string): string[] {
  const fullPath = path.join(process.cwd(), "public", dir);
  if (!fs.existsSync(fullPath)) return [];

  return fs
    .readdirSync(fullPath)
    .filter((f) => /\.(jpg|jpeg|png|webp|avif|gif)$/i.test(f))
    .map((f) => `${basePath}/${f}`);
}

export default function imageSitemap(): MetadataRoute.Sitemap {
  const images: { url: string; lastModified: Date }[] = [];

  // Gallery images
  getImageFiles("gallery-images", "/gallery-images").forEach((img) => {
    images.push({
      url: `${SITE_URL}${img}`,
      lastModified: new Date(),
    });
  });

  // Style pack images
  const packsDir = path.join(process.cwd(), "public", "packs");
  if (fs.existsSync(packsDir)) {
    fs.readdirSync(packsDir).forEach((pack) => {
      getImageFiles(`packs/${pack}`, `/packs/${pack}`).forEach((img) => {
        images.push({
          url: `${SITE_URL}${img}`,
          lastModified: new Date(),
        });
      });
    });
  }

  // Homepage images
  getImageFiles("homepage", "/homepage").forEach((img) => {
    images.push({
      url: `${SITE_URL}${img}`,
      lastModified: new Date(),
    });
  });

  return images.map((img) => ({
    url: img.url,
    lastModified: img.lastModified,
    changeFrequency: "monthly" as const,
    priority: 0.5,
    images: [
      {
        loc: img.url,
        title: `SnapProHead AI headshot example`,
        caption: `Professional AI-generated headshot example from SnapProHead`,
      },
    ],
  }));
}
