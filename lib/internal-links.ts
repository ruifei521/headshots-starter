import type { HeadshotProfessionSlug } from "@/lib/profession-metadata";

export type BlogGuideSlug =
  | "best-ai-headshot-generators-2026"
  | "ai-headshots-for-doctors-guide-2026"
  | "ai-headshots-for-lawyers-guide-2026"
  | "ai-headshots-for-realtors-guide-2026"
  | "complete-guide-ai-headshots-2026"
  | "ai-headshots-for-teams-guide-2026"
  | "how-to-choose-ai-headshot-generator-2026"
  | "ai-headshots-for-sales-professionals-2026";

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
  {
    slug: "complete-guide-ai-headshots-2026",
    title: "Complete Guide to AI Headshots (2026)",
    professions: ["ai-headshot-generator", "linkedin", "professional", "corporate", "executive", "business"],
  },
  {
    slug: "ai-headshots-for-teams-guide-2026",
    title: "AI Headshots for Teams: Complete Guide",
    professions: ["corporate", "startup", "business", "executive"],
  },
  {
    slug: "how-to-choose-ai-headshot-generator-2026",
    title: "How to Choose the Best AI Headshot Generator",
    professions: ["ai-headshot-generator", "linkedin", "professional"],
  },
  {
    slug: "ai-headshots-for-sales-professionals-2026",
    title: "AI Headshots for Sales Professionals",
    professions: ["sales", "business", "realtor", "linkedin"],
  },
];

export const PROFESSION_LABELS: Record<HeadshotProfessionSlug, string> = {
  accountant: "Accountant",
  actor: "Actor",
  "ai-headshot-generator": "AI Headshot Generator",
  "ai-professional-portrait": "AI Professional Portrait",
  architect: "Architect",
  author: "Author",
  business: "Business",
  "c-suite": "C-Suite",
  consultant: "Consultant",
  corporate: "Corporate",
  dentist: "Dentist",
  doctor: "Doctor",
  engineer: "Engineer",
  executive: "Executive",
  finance: "Finance",
  lawyer: "Lawyer",
  linkedin: "LinkedIn",
  marketing: "Marketing",
  military: "Military",
  model: "Model",
  nurse: "Nurse",
  portfolio: "Portfolio",
  professional: "Professional",
  "professional-headshot-photographer": "Headshot Photographer",
  realtor: "Realtor",
  "remote-worker": "Remote Work",
  sales: "Sales",
  startup: "Startup",
  student: "Student",
  teacher: "Teacher",
};

/** Related profession pages for internal linking */
export const PROFESSION_RELATED: Record<HeadshotProfessionSlug, HeadshotProfessionSlug[]> = {
  accountant: ["consultant", "corporate", "business", "linkedin"],
  actor: ["portfolio", "linkedin", "professional", "executive", "model"],
  "ai-headshot-generator": ["linkedin", "professional", "corporate", "executive"],
  "ai-professional-portrait": ["linkedin", "professional", "executive", "corporate"],
  architect: ["corporate", "portfolio", "linkedin", "executive"],
  author: ["portfolio", "linkedin", "professional", "executive"],
  business: ["startup", "executive", "linkedin", "realtor", "sales", "marketing", "finance"],
  "c-suite": ["executive", "corporate", "consultant", "linkedin"],
  consultant: ["lawyer", "corporate", "executive", "linkedin"],
  corporate: ["executive", "business", "consultant", "linkedin", "finance", "engineer"],
  dentist: ["doctor", "nurse", "professional", "linkedin"],
  doctor: ["dentist", "nurse", "executive", "linkedin"],
  engineer: ["startup", "corporate", "linkedin", "professional"],
  executive: ["c-suite", "corporate", "consultant", "linkedin"],
  finance: ["consultant", "corporate", "business", "linkedin"],
  lawyer: ["consultant", "corporate", "executive", "linkedin"],
  linkedin: ["professional", "executive", "corporate", "ai-headshot-generator", "sales", "marketing"],
  marketing: ["business", "startup", "linkedin", "corporate"],
  military: ["executive", "corporate", "linkedin", "professional"],
  model: ["actor", "portfolio", "linkedin", "professional"],
  nurse: ["doctor", "dentist", "teacher", "linkedin"],
  portfolio: ["actor", "professional", "linkedin", "executive", "model", "author"],
  professional: ["linkedin", "business", "executive", "corporate", "finance", "engineer"],
  "professional-headshot-photographer": [
    "ai-headshot-generator",
    "professional",
    "linkedin",
    "executive",
  ],
  realtor: ["business", "professional", "linkedin", "executive"],
  "remote-worker": ["linkedin", "professional", "business", "startup"],
  sales: ["business", "realtor", "linkedin", "corporate"],
  startup: ["business", "executive", "linkedin", "c-suite", "engineer", "marketing"],
  student: ["linkedin", "professional", "portfolio", "business"],
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
  "finance",
  "engineer",
  "marketing",
  "sales",
  "student",
  "model",
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
