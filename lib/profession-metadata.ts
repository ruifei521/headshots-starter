import type { Metadata } from "next";
import { PROFESSION_OG_TAGLINE } from "@/lib/refund-policy";

const SITE = "https://snapprohead.com";
const OG_IMAGE = `${SITE}/hero.webp`;

type ProfessionConfig = {
  title: string;
  description: string;
  ogTitle?: string;
  ogDescription?: string;
};

/** All profession landing slugs under /headshots/[slug] */
export const HEADSHOT_PROFESSION_SLUGS = [
  "accountant",
  "actor",
  "ai-headshot-generator",
  "ai-professional-portrait",
  "architect",
  "business",
  "c-suite",
  "consultant",
  "corporate",
  "dentist",
  "doctor",
  "executive",
  "lawyer",
  "linkedin",
  "nurse",
  "portfolio",
  "professional",
  "professional-headshot-photographer",
  "realtor",
  "startup",
  "teacher",
] as const;

export type HeadshotProfessionSlug = (typeof HEADSHOT_PROFESSION_SLUGS)[number];

const PROFESSIONS: Record<HeadshotProfessionSlug, ProfessionConfig> = {
  accountant: {
    title: "Accountant Headshots – AI Portraits for Accounting Professionals",
    description:
      "Professional AI headshots for accountants. Build client trust on your firm website, LinkedIn, and business profiles. 40+ HD photos from $29 in ~25 minutes.",
    ogTitle: "Accountant Headshots – Professional AI Portraits",
    ogDescription: PROFESSION_OG_TAGLINE,
  },
  actor: {
    title: "Actor Headshots – AI Headshots for Actors & Performers",
    description:
      "AI actor headshots in ~25 minutes. Multiple looks for casting sites, agents, and portfolios. 40+ HD photos from $29.",
    ogTitle: "AI Actor Headshots – Casting-Ready Portraits",
    ogDescription:
      "Professional actor headshots without a studio session. Starting at $29.",
  },
  "ai-headshot-generator": {
    title: "AI Headshot Generator – Professional Photos in ~25 Minutes",
    description:
      "Use our AI headshot generator to create studio-style portraits from selfies. 40+ HD headshots from $29 — ideal for LinkedIn, resumes, and team pages.",
    ogTitle: "AI Headshot Generator – SnapProHead",
    ogDescription: PROFESSION_OG_TAGLINE,
  },
  "ai-professional-portrait": {
    title: "AI Professional Portrait – Studio-Quality Photos from Selfies",
    description:
      "AI professional portraits for LinkedIn, websites, and directories. Polished lighting and backgrounds from your phone photos. From $29 in ~25 minutes.",
    ogTitle: "AI Professional Portrait – SnapProHead",
    ogDescription:
      "Studio-quality AI portraits delivered in ~25 minutes. Starting at $29.",
  },
  architect: {
    title: "Architect Headshots – AI Portraits for Architects & Designers",
    description:
      "Professional AI headshots for architects. Showcase credibility on your firm site, LinkedIn, and design portfolio. 40+ HD photos from $29 in ~25 minutes.",
    ogTitle: "Architect Headshots – Professional AI Portraits",
    ogDescription: PROFESSION_OG_TAGLINE,
  },
  business: {
    title: "Business Headshots – AI Photos for Entrepreneurs & Owners",
    description:
      "AI business headshots for founders and business owners. Look credible on your website, pitch deck, and LinkedIn. 40+ HD portraits from $29 in ~25 minutes.",
    ogTitle: "Business Headshots – AI Professional Portraits",
    ogDescription:
      "Entrepreneur headshots without a photo studio. Starting at $29.",
  },
  "c-suite": {
    title: "C-Suite Headshots – Executive AI Portraits for Leaders",
    description:
      "Executive headshots for CEOs, CFOs, and senior leaders. Command authority with AI-generated portraits for press, investor updates, and company sites. From $29.",
    ogTitle: "C-Suite Headshots – Executive AI Portraits",
    ogDescription: PROFESSION_OG_TAGLINE,
  },
  consultant: {
    title: "Consultant Headshots – AI Portraits for Consultants",
    description:
      "Professional AI headshots for consultants. Build authority on proposals, your website, and LinkedIn. 40+ HD photos from $29 in ~25 minutes.",
    ogTitle: "Consultant Headshots – Professional AI Portraits",
    ogDescription: PROFESSION_OG_TAGLINE,
  },
  corporate: {
    title: "Corporate Headshots – AI Photos for Corporate Professionals",
    description:
      "AI corporate headshots for employees and teams. Consistent, professional portraits for intranets, email, and company directories. From $29 per person.",
    ogTitle: "Corporate Headshots – AI Professional Portraits",
    ogDescription:
      "Uniform corporate headshots in ~25 minutes. Starting at $29.",
  },
  dentist: {
    title: "Dentist Headshots – AI Portraits for Dental Professionals",
    description:
      "Professional AI headshots for dentists. Build trust on your practice website, Google Business Profile, and social media. From $29 for 40+ HD photos.",
    ogTitle: "Dentist Headshots – Professional AI Portraits",
    ogDescription: PROFESSION_OG_TAGLINE,
  },
  doctor: {
    title: "Doctor Headshots – AI Portraits for Medical Professionals",
    description:
      "AI doctor headshots for clinic websites, Healthgrades, and LinkedIn. Present a trustworthy, professional image patients expect. 40+ HD photos from $29.",
    ogTitle: "Doctor Headshots – Professional AI Portraits",
    ogDescription: PROFESSION_OG_TAGLINE,
  },
  executive: {
    title: "Executive Headshots – AI Portraits for Executives & Leaders",
    description:
      "Boardroom-quality AI executive headshots for leaders and senior professionals. Ideal for annual reports, speaking bios, and LinkedIn. From $29 in ~25 minutes.",
    ogTitle: "Executive Headshots – Boardroom-Quality AI Portraits",
    ogDescription:
      "Executive portraits that command respect. 40+ HD headshots from $29.",
  },
  lawyer: {
    title: "Lawyer Headshots – AI Photos for Attorneys & Law Firms",
    description:
      "AI lawyer headshots for firm websites, LinkedIn, and directories. Partner-quality, trustworthy portraits from selfies. 40+ HD photos from $29 in ~25 minutes.",
    ogTitle: "Lawyer Headshots – Professional AI Portraits for Attorneys",
    ogDescription: PROFESSION_OG_TAGLINE,
  },
  linkedin: {
    title: "LinkedIn Headshots – AI Profile Photos That Get Noticed",
    description:
      "AI LinkedIn headshots in ~25 minutes. Stand out to recruiters and clients with polished profile photos. 40+ HD headshots from $29.",
    ogTitle: "LinkedIn Headshots – AI Profile Photos",
    ogDescription:
      "Professional LinkedIn photos from selfies. Starting at $29.",
  },
  nurse: {
    title: "Nurse Headshots – AI Portraits for Nursing Professionals",
    description:
      "Professional AI headshots for nurses. Present a caring, competent image on hospital sites, LinkedIn, and healthcare directories. From $29 for 40+ HD photos.",
    ogTitle: "Nurse Headshots – Professional AI Portraits",
    ogDescription: PROFESSION_OG_TAGLINE,
  },
  portfolio: {
    title: "Portfolio Headshots – AI Photos for Creatives & Talent",
    description:
      "AI portfolio headshots for models, actors, and creatives. Multiple looks for comp cards, agencies, and personal sites. 40+ HD photos from $29 in ~25 minutes.",
    ogTitle: "Portfolio Headshots – AI Professional Portraits",
    ogDescription:
      "Creative portfolio headshots from selfies. Starting at $29.",
  },
  professional: {
    title: "Professional Headshots – AI Portraits for Your Career",
    description:
      "AI professional headshots for job seekers and career growth. Resume-ready portraits for LinkedIn, email, and applications. 40+ HD photos from $29 in ~25 minutes.",
    ogTitle: "Professional Headshots – AI Career Portraits",
    ogDescription: PROFESSION_OG_TAGLINE,
  },
  "professional-headshot-photographer": {
    title: "Professional Headshot Photographer Alternative – AI in ~25 Min",
    description:
      "Skip the studio booking: AI headshots that match professional photographer quality for LinkedIn and business use. 40+ HD portraits from $29 in ~25 minutes.",
    ogTitle: "AI Headshots vs Studio Photographer – SnapProHead",
    ogDescription:
      "Professional headshot results from selfies. Starting at $29.",
  },
  realtor: {
    title: "Realtor Headshots – AI Photos for Real Estate Agents",
    description:
      "AI realtor headshots for Zillow, Realtor.com, and MLS listings. Polished, approachable photos that help you win listings. 40+ HD headshots from $29.",
    ogTitle: "Realtor Headshots – AI Real Estate Agent Photos",
    ogDescription: PROFESSION_OG_TAGLINE,
  },
  startup: {
    title: "Startup Headshots – AI Portraits for Founders & Teams",
    description:
      "Professional AI headshots for startup founders and teams. Look investable on your site, pitch deck, and press. 40+ HD photos from $29 in ~25 minutes.",
    ogTitle: "Startup Headshots – Founder & Team AI Portraits",
    ogDescription: PROFESSION_OG_TAGLINE,
  },
  teacher: {
    title: "Teacher Headshots – AI Portraits for Educators",
    description:
      "Professional AI headshots for teachers. Build trust on school websites, staff directories, and social media. 40+ HD photos from $29 in ~25 minutes.",
    ogTitle: "Teacher Headshots – Professional AI Portraits",
    ogDescription: PROFESSION_OG_TAGLINE,
  },
};

export function getProfessionMetadata(slug: string): Metadata {
  const config = PROFESSIONS[slug as HeadshotProfessionSlug];
  if (!config) {
    const url = `${SITE}/headshots/${slug}`;
    return {
      title: "Professional AI Headshots | SnapProHead",
      description:
        "Professional AI headshots from your selfies. 40+ HD photos from $29 in ~25 minutes.",
      alternates: { canonical: url },
    };
  }

  const url = `${SITE}/headshots/${slug}`;
  const ogTitle = config.ogTitle ?? config.title;
  const ogDescription = config.ogDescription ?? config.description;

  return {
    title: config.title,
    description: config.description,
    alternates: { canonical: url },
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      url,
      images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: config.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description: ogDescription,
      images: [OG_IMAGE],
    },
  };
}
