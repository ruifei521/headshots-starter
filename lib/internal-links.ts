import type { HeadshotProfessionSlug } from "@/lib/profession-metadata";

export type BlogGuideSlug =
  | "best-ai-headshot-generators-2026"
  | "ai-headshots-for-doctors-guide-2026"
  | "ai-headshots-for-lawyers-guide-2026"
  | "ai-headshots-for-realtors-guide-2026";

export type BlogGuide = {
  slug: BlogGuideSlug;
  title: string;
  professions: HeadshotProfessionSlug[];
};

/** Industry guides and comparisons — keep in sync with content/blog */
export const BLOG_GUIDES: BlogGuide[] = [
  {
    slug: "best-ai-headshot-generators-2026",
    title: "Best AI Headshot Generators (2026 Comparison)",
    professions: ["ai-headshot-generator", "linkedin", "professional"],
  },
  {
    slug: "ai-headshots-for-doctors-guide-2026",
    title: "AI Headshots for Doctors: Complete Guide",
    professions: ["doctor", "dentist", "nurse"],
  },
  {
    slug: "ai-headshots-for-lawyers-guide-2026",
    title: "AI Headshots for Lawyers: Complete Guide",
    professions: ["lawyer", "consultant", "corporate"],
  },
  {
    slug: "ai-headshots-for-realtors-guide-2026",
    title: "AI Headshots for Realtors: Complete Guide",
    professions: ["realtor", "business", "professional"],
  },
];

export const PROFESSION_LABELS: Record<HeadshotProfessionSlug, string> = {
  accountant: "Accountant",
  actor: "Actor",
  "ai-headshot-generator": "AI Headshot Generator",
  "ai-professional-portrait": "AI Professional Portrait",
  architect: "Architect",
  business: "Business",
  "c-suite": "C-Suite",
  consultant: "Consultant",
  corporate: "Corporate",
  dentist: "Dentist",
  doctor: "Doctor",
  executive: "Executive",
  lawyer: "Lawyer",
  linkedin: "LinkedIn",
  nurse: "Nurse",
  portfolio: "Portfolio",
  professional: "Professional",
  "professional-headshot-photographer": "Headshot Photographer",
  realtor: "Realtor",
  startup: "Startup",
  teacher: "Teacher",
};

/** Related profession pages for internal linking */
export const PROFESSION_RELATED: Record<HeadshotProfessionSlug, HeadshotProfessionSlug[]> = {
  accountant: ["consultant", "corporate", "business", "linkedin"],
  actor: ["portfolio", "linkedin", "professional", "executive"],
  "ai-headshot-generator": ["linkedin", "professional", "corporate", "executive"],
  "ai-professional-portrait": ["linkedin", "professional", "executive", "corporate"],
  architect: ["corporate", "portfolio", "linkedin", "executive"],
  business: ["startup", "executive", "linkedin", "realtor"],
  "c-suite": ["executive", "corporate", "consultant", "linkedin"],
  consultant: ["lawyer", "corporate", "executive", "linkedin"],
  corporate: ["executive", "business", "consultant", "linkedin"],
  dentist: ["doctor", "nurse", "professional", "linkedin"],
  doctor: ["dentist", "nurse", "executive", "linkedin"],
  executive: ["c-suite", "corporate", "consultant", "linkedin"],
  lawyer: ["consultant", "corporate", "executive", "linkedin"],
  linkedin: ["professional", "executive", "corporate", "ai-headshot-generator"],
  nurse: ["doctor", "dentist", "teacher", "linkedin"],
  portfolio: ["actor", "professional", "linkedin", "executive"],
  professional: ["linkedin", "business", "executive", "corporate"],
  "professional-headshot-photographer": [
    "ai-headshot-generator",
    "professional",
    "linkedin",
    "executive",
  ],
  realtor: ["business", "professional", "linkedin", "executive"],
  startup: ["business", "executive", "linkedin", "c-suite"],
  teacher: ["professional", "linkedin", "nurse", "corporate"],
};

export const HOMEPAGE_FEATURED_PROFESSIONS: HeadshotProfessionSlug[] = [
  "linkedin",
  "lawyer",
  "doctor",
  "realtor",
  "executive",
  "corporate",
  "consultant",
  "nurse",
  "teacher",
  "startup",
  "dentist",
  "ai-headshot-generator",
];

export function getGuidesForProfession(
  slug: HeadshotProfessionSlug | null
): BlogGuide[] {
  if (!slug) return BLOG_GUIDES;
  const matched = BLOG_GUIDES.filter((g) => g.professions.includes(slug));
  return matched.length > 0 ? matched : BLOG_GUIDES.slice(0, 2);
}

export function getRelatedProfessions(
  slug: HeadshotProfessionSlug | null
): HeadshotProfessionSlug[] {
  if (!slug) return HOMEPAGE_FEATURED_PROFESSIONS.slice(0, 8);
  return PROFESSION_RELATED[slug] ?? HOMEPAGE_FEATURED_PROFESSIONS.slice(0, 4);
}
