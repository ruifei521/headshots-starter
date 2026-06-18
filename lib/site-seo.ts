import type { Metadata } from "next";

export const SITE_URL = "https://snapprohead.com";
export const OG_IMAGE = `${SITE_URL}/hero.png`;

export function buildPageOpenGraph(input: {
  title: string;
  description: string;
  path?: string;
}): NonNullable<Metadata["openGraph"]> {
  const url = input.path ? `${SITE_URL}${input.path}` : SITE_URL;

  return {
    title: input.title,
    description: input.description,
    url,
    siteName: "SnapProHead",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "SnapProHead — AI professional headshot examples",
      },
    ],
  };
}

export function buildPageTwitter(input: {
  title: string;
  description: string;
}): NonNullable<Metadata["twitter"]> {
  return {
    card: "summary_large_image",
    title: input.title,
    description: input.description,
    images: [OG_IMAGE],
  };
}
