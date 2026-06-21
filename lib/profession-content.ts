import type { ProfessionPageData } from "@/components/headshots/ProfessionPage";
import { DELIVERY_FAQ_ANSWER_40_PLUS, PROFESSION_HERO_SUFFIX, STARTER_PRICE_LINE } from "@/lib/refund-policy";

const TOP_5: Record<string, ProfessionPageData> = {
  linkedin: {
    slug: "LinkedIn",
    heroBadge: "Stand Out on LinkedIn",
    heroTitle: "AI Headshots for LinkedIn Profile",
    heroHighlight: "LinkedIn",
    heroDescription:
      "Recruiters judge your profile in seconds. Get a recruiter-ready LinkedIn photo that communicates credibility, approachability, and professionalism — all from your phone in ~25 minutes.",
    featureList: [
      "Recruiter-Approved Look",
      "400×400+ Optimized",
      "Multiple Professional Styles",
    ],
    specsSection: {
      title: "LinkedIn Photo Specs & Best Practices",
      items: [
        { label: "Minimum Size", value: "400 × 400 px (upload 800 × 800+ for sharpness)" },
        { label: "Aspect Ratio", value: "1:1 square — crop before uploading" },
        { label: "Face Coverage", value: "60–70% of frame; eyes in upper third" },
        { label: "Background", value: "Neutral studio background — white, grey, or soft gradient" },
        { label: "File Format", value: "JPG or PNG, up to 8 MB" },
        { label: "Expression", value: "Natural, subtle smile; no sunglasses or heavy filters" },
      ],
    },
    whySection: {
      title: "Why Your LinkedIn Photo Matters",
      cards: [
        { title: "Better Visibility", desc: "Profiles with professional photos get significantly more views and connection requests." },
        { title: "More Responses", desc: "Recruiters are more likely to open InMail from candidates with polished headshots." },
        { title: "First Impression", desc: "Your photo is the first thing people see — before your headline, experience, or skills." },
      ],
    },
    useCases: [
      "LinkedIn profile photo (primary)",
      "LinkedIn background photo matching style",
      "Company website team page",
      "Email signature and Slack/Teams avatar",
      "Conference speaker bio and event apps",
      "Professional networking platforms",
    ],
    ctaHeadline: "Upgrade Your LinkedIn Photo Today",
    ctaSubtext:
      "From $29 for 40+ recruiter-ready headshots. Upload selfies, choose your style, and download in ~25 minutes. Full commercial rights included.",
    faqs: [
      {
        question: "What size should a LinkedIn profile picture be?",
        answer: "LinkedIn recommends 400×400 pixels minimum with a 1:1 square aspect ratio. Upload at 800×800 or higher for sharp display on high-DPI screens. Our AI generates high-resolution headshots perfectly sized for LinkedIn.",
      },
      {
        question: "How long does it take to get LinkedIn headshots?",
        answer: DELIVERY_FAQ_ANSWER_40_PLUS,
      },
      {
        question: "How much do LinkedIn headshots cost?",
        answer: PROFESSION_HERO_SUFFIX,
      },
      {
        question: "Can recruiters tell if my photo is AI-generated?",
        answer: "For a standard professional headshot with a neutral background, most viewers — including recruiters — cannot distinguish AI-generated photos from studio portraits. The key is that the photo looks like the real you on a good day, which our AI delivers when trained on quality selfies.",
      },
      {
        question: "Should I smile in my LinkedIn photo?",
        answer: "A natural, subtle smile performs best for most roles. It communicates approachability and confidence. Very serious expressions can work for some executive or legal roles, but avoid looking stiff or unfriendly. Test a calm smile against a neutral expression and see which feels more authentic.",
      },
      {
        question: "Can I use the same photo across all platforms?",
        answer: "Yes — consistent branding across LinkedIn, company bios, conference pages, and email signatures reinforces recognition. Use the same master file and crop differently per platform: tighter crop for LinkedIn, wider for company bios.",
      },
      {
        question: "Are AI headshots accepted by LinkedIn?",
        answer: "LinkedIn expects an accurate representation of yourself. AI headshots trained on your real selfies meet that standard — they are widely used across all industries on the platform. The platform's focus is on authentic representation, not the production method.",
      },
    ],
    relatedPages: [
      { label: "Lawyer Headshots", href: "/headshots/lawyer" },
      { label: "Executive Headshots", href: "/headshots/executive" },
      { label: "Corporate Headshots", href: "/headshots/corporate" },
      { label: "Professional Headshots", href: "/headshots/professional" },
      { label: "All Styles", href: "/headshots" },
      { label: "Pricing", href: "/pricing" },
    ],
  },

  lawyer: {
    slug: "Lawyer",
    heroBadge: "Professional Headshots for Legal Professionals",
    heroTitle: "AI Headshots for Lawyers & Attorneys",
    heroHighlight: "Lawyers & Attorneys",
    heroDescription:
      "Make a powerful first impression. Get partner-quality headshots that convey trust, authority, and professionalism — tailored for law firms, solo practitioners, and legal directories.",
    featureList: [
      "Partner-Quality Portraits",
      "Firm-Consistent Styling",
      "40+ HD Variations",
    ],
    whySection: {
      title: "Why Attorney Headshots Matter",
      cards: [
        { title: "Client Trust", desc: "Potential clients scan partner grids in seconds — a sharp headshot supports your credibility." },
        { title: "Court-Ready Polish", desc: "Directories, bar listings, and speaker bios demand a consistent, authoritative look." },
        { title: "Firm Branding", desc: "Matching backgrounds across partners signals institutional strength and attention to detail." },
      ],
    },
    useCases: [
      "Law firm \"Our Team\" page",
      "LinkedIn and Avvo profiles",
      "Martindale-Hubbell and state bar directories",
      "Conference and CLE speaker pages",
      "Best Lawyers / Super Lawyers submissions",
      "Chambers and Partners entries",
    ],
    ctaHeadline: "Elevate Your Firm's Image",
    ctaSubtext:
      "From $29 per attorney for 40+ partner-quality headshots. No scheduling, no studio visit — just upload selfies and download in ~25 minutes. Firm-wide consistency at a fraction of studio cost.",
    faqs: [
      {
        question: "Can law firms use AI headshots on the homepage?",
        answer: "Many mid-size and boutique firms do for bio pages and directories. Am Law 100 firms may prefer branded studio work for the homepage hero. Check with your marketing partner and run samples through firm leadership before a full rollout.",
      },
      {
        question: "How much do lawyer headshots cost?",
        answer: `${STARTER_PRICE_LINE} Traditional attorney portrait sessions typically run $150–$400+ per lawyer, plus scheduling overhead. For a 30-attorney firm, AI saves thousands per refresh cycle.`,
      },
      {
        question: "Should all partners use the same background?",
        answer: "Yes — visual consistency signals institutional strength. A unified team grid page converts better than a mosaic of mismatched photos. Use the same AI tool and preset for all attorneys.",
      },
      {
        question: "Are AI headshots acceptable under bar ethics rules?",
        answer: "As of this writing, no U.S. state bar rule specifically bans AI headshots in attorney advertising. However, the general duties of candor and truthful representation apply — your photo should look like you in person. Confirm with your jurisdiction if unsure.",
      },
      {
        question: "How fast will I receive my headshots?",
        answer: DELIVERY_FAQ_ANSWER_40_PLUS,
      },
      {
        question: "Can my entire firm get headshots at once?",
        answer: "Yes. Each attorney can upload their selfies independently using the same vendor and style preset for consistent results. Stagger uploads by 3–5 attorneys so marketing can review and course-correct before firm-wide rollout.",
      },
    ],
    relatedPages: [
      { label: "Corporate Headshots", href: "/headshots/corporate" },
      { label: "Executive Headshots", href: "/headshots/executive" },
      { label: "Consultant Headshots", href: "/headshots/consultant" },
      { label: "LinkedIn Headshots", href: "/headshots/linkedin" },
      { label: "All Styles", href: "/headshots" },
      { label: "Pricing", href: "/pricing" },
    ],
  },

  realtor: {
    slug: "Realtor",
    heroBadge: "Real Estate Agent Headshots",
    heroTitle: "AI Headshots for Realtors & Real Estate Agents",
    heroHighlight: "Realtors & Real Estate Agents",
    heroDescription:
      "Your face is on every listing, sign, and social post. Get polished, approachable headshots for Zillow, Realtor.com, yard signs, and Instagram — without the $300 photo shoot.",
    featureList: [
      "Zillow & MLS Ready",
      "Approachable & Trustworthy",
      "Multiple Looks Per Batch",
    ],
    whySection: {
      title: "Why Realtor Headshots Drive Listings",
      cards: [
        { title: "Buyer Trust", desc: "A warm, professional portrait signals you're accessible, organized, and worth the call." },
        { title: "Brand Consistency", desc: "Same look across Zillow, signs, social, and postcards builds farm-area recognition." },
        { title: "Fast Refresh", desc: "Switch brokerages? New hairstyle? Update your headshot in ~25 minutes, not 3 weeks." },
      ],
    },
    useCases: [
      "Zillow and Realtor.com agent profiles",
      "Brokerage website and team page",
      "Yard signs and business cards (print resolution)",
      "Instagram, Facebook, and YouTube thumbnails",
      "Email newsletters and Just Sold postcards",
      "MLS and local board directories",
    ],
    ctaHeadline: "Look Your Best on Every Listing",
    ctaSubtext:
      "From $29 for 40+ agent-ready headshots. No scheduling, no studio — upload selfies and download in ~25 minutes. Refresh your photo every season, not every career.",
    faqs: [
      {
        question: "Will AI headshots work on yard signs?",
        answer: "Yes if you export high-resolution files; always run a print proof first. We recommend 300 DPI at final print size to avoid pixelation on close inspection.",
      },
      {
        question: "How often should realtors update headshots?",
        answer: "At least every 18–24 months, or after a brokerage rebrand, major hairstyle change, or weight change. Fresh photography keeps your brand aligned with how you look today.",
      },
      {
        question: "How much do realtor headshots cost?",
        answer: `${STARTER_PRICE_LINE} Traditional realtor photo shoots typically run $150–$400 and take 1–3 weeks to schedule, shoot, and deliver. AI delivers 40+ images in ~25 minutes.`,
      },
      {
        question: "Can teams get matching backgrounds?",
        answer: "Yes — use the same vendor preset and attire brief for every agent. Consistency across team members is a strong differentiator for boutique brokerages.",
      },
      {
        question: "Will buyers notice it's an AI headshot?",
        answer: "For professional-looking profile photos with neutral backgrounds, most buyers cannot tell. The signals that matter — polished, warm, professional — come through clearly.",
      },
      {
        question: "What if my brokerage has specific photo requirements?",
        answer: "Check your brokerage compliance guide first. Some franchises require photographer-vetted files for official portraits. AI is usually fine for personal branding and social media, not franchise-mandated official portraits.",
      },
    ],
    relatedPages: [
      { label: "Business Headshots", href: "/headshots/business" },
      { label: "LinkedIn Headshots", href: "/headshots/linkedin" },
      { label: "Portfolio Headshots", href: "/headshots/portfolio" },
      { label: "All Styles", href: "/headshots" },
      { label: "Pricing", href: "/pricing" },
    ],
  },

  doctor: {
    slug: "Doctor",
    heroBadge: "Medical Professional Headshots",
    heroTitle: "AI Headshots for Doctors & Physicians",
    heroHighlight: "Doctors & Physicians",
    heroDescription:
      "Patients choose doctors they trust at a glance. Get clinic-ready headshots for Healthgrades, Zocdoc, Doximity, and your practice website — without blocking half a day for a studio shoot.",
    featureList: [
      "Patient-Trust Building",
      "HIPAA-Conscious Privacy",
      "Directory-Ready Quality",
    ],
    whySection: {
      title: "Why Physician Headshots Matter",
      cards: [
        { title: "Patient Choice", desc: "Patients often compare physicians online before booking — photo and bio quality are common tiebreakers." },
        { title: "Directory Presence", desc: "A dated selfie on Healthgrades can undermine confidence. A consistent, well-lit portrait signals competence." },
        { title: "Clinic Branding", desc: "A unified look across all physicians reinforces practice professionalism and patient trust." },
      ],
    },
    useCases: [
      "Clinic website team page",
      "Google Business Profile",
      "Healthgrades, Zocdoc, and Doximity",
      "Hospital and insurance directories",
      "Telehealth platform profiles",
      "Conference and CME speaker bios",
    ],
    ctaHeadline: "Build Patient Trust at First Glance",
    ctaSubtext:
      "From $29 for 40+ physician-quality headshots. Upload selfies in your white coat or business attire, and download clinic-ready photos in ~25 minutes. Privacy-first, delete on request.",
    faqs: [
      {
        question: "What should I wear for my doctor headshot?",
        answer: "A white coat or professional business attire works best — match what patients see in clinic. Solid colors, minimal jewelry, no lanyards or ID badges in frame. The AI preserves your outfit while giving you a polished, studio-quality background.",
      },
      {
        question: "Can I use my doctor headshot on medical directories?",
        answer: "Yes. Our headshots are suitable for Healthgrades, Zocdoc, Doximity, Google Business Profile, hospital websites, and any medical professional directory.",
      },
      {
        question: "Are AI headshots HIPAA-compliant?",
        answer: "The headshot itself is not PHI. The vendor relationship is the consideration — most AI headshot tools are not Business Associates under HIPAA. Do not upload images that contain patient PHI or identifiable backgrounds. SnapProHead uses a delete-on-request privacy policy.",
      },
      {
        question: "How fast will I receive my headshots?",
        answer: DELIVERY_FAQ_ANSWER_40_PLUS,
      },
      {
        question: "Can my entire medical practice get headshots?",
        answer: "Absolutely. Each physician, nurse, or staff member can order their own pack for a consistent professional clinic-wide look. Use the same preset for brand consistency.",
      },
      {
        question: "Should telehealth photos be different from clinic photos?",
        answer: "Telehealth profiles are typically tighter crops with slightly more relaxed expressions. Generate both from the same AI batch and crop differently for each use case.",
      },
    ],
    relatedPages: [
      { label: "Dentist Headshots", href: "/headshots/dentist" },
      { label: "Nurse Headshots", href: "/headshots/nurse" },
      { label: "Professional Headshots", href: "/headshots/professional" },
      { label: "All Styles", href: "/headshots" },
      { label: "Pricing", href: "/pricing" },
    ],
  },

  executive: {
    slug: "Executive",
    heroBadge: "Leadership & C-Suite Headshots",
    heroTitle: "AI Headshots for Executives & Business Leaders",
    heroHighlight: "Executives & Business Leaders",
    heroDescription:
      "Command authority with boardroom-quality headshots. Perfect for annual reports, speaking engagements, investor updates, and LinkedIn — delivered in ~25 minutes from your phone.",
    featureList: [
      "Boardroom-Quality Polish",
      "Authoritative Yet Approachable",
      "Press & Investor Ready",
    ],
    whySection: {
      title: "Why Executive Headshots Matter",
      cards: [
        { title: "Leadership Presence", desc: "Your photo represents the company — a polished, confident headshot supports the narrative you've built." },
        { title: "Multi-Channel Reach", desc: "From annual reports to keynote speaker bios, your portrait appears everywhere your name does." },
        { title: "Fast Updates", desc: "New role, new company, or board appointment — refresh your headshot without coordinating a studio day." },
      ],
    },
    useCases: [
      "Annual reports and shareholder communications",
      "Keynote and conference speaker bios",
      "Company leadership page and press kits",
      "LinkedIn and executive networking platforms",
      "Board of directors and advisory profiles",
      "Industry awards and recognition submissions",
    ],
    ctaHeadline: "Lead with Confidence",
    ctaSubtext:
      "From $29 for 40+ executive-quality headshots. Upload selfies in business attire and download boardroom-ready photos in ~25 minutes. Full commercial rights included.",
    faqs: [
      {
        question: "How much do executive headshots cost?",
        answer: `${STARTER_PRICE_LINE} Traditional executive portrait sessions with a corporate photographer often run $500–$1,500+ including hair, makeup, and art direction. AI delivers comparable quality for everyday channels at a fraction of the cost.`,
      },
      {
        question: "Do I need a professional photographer for C-suite roles?",
        answer: "Many executives still use photographers for annual reports and major press campaigns. AI headshots are a strong option for LinkedIn, internal directories, and rapid updates between formal shoots. A hybrid approach is increasingly common.",
      },
      {
        question: "How fast will I get my headshots?",
        answer: DELIVERY_FAQ_ANSWER_40_PLUS,
      },
      {
        question: "What outfit and background work best?",
        answer: "Dark suit or blazer, white or light blue shirt, conservative tie where appropriate. Neutral backgrounds — navy, grey, or soft gradient — keep the focus on you. Match your industry's expectations: finance leans conservative, tech can be slightly more relaxed.",
      },
      {
        question: "Can I use the same photo for press and LinkedIn?",
        answer: "Yes — use the same master image for brand consistency. Crop tighter for LinkedIn (more face), wider for press kits and company pages. One AI batch gives you both crops without additional cost.",
      },
      {
        question: "Is AI quality acceptable for investor materials?",
        answer: "For digital investor decks, LinkedIn, and internal communications, modern AI headshots are more than sufficient. For print annual reports and major press releases, confirm with your communications team — some organizations still require photographer-vetted portraits for regulatory filings.",
      },
    ],
    relatedPages: [
      { label: "C-Suite Headshots", href: "/headshots/c-suite" },
      { label: "Corporate Headshots", href: "/headshots/corporate" },
      { label: "Business Headshots", href: "/headshots/business" },
      { label: "LinkedIn Headshots", href: "/headshots/linkedin" },
      { label: "All Styles", href: "/headshots" },
      { label: "Pricing", href: "/pricing" },
    ],
  },
};

export function getProfessionPageData(slug: string): ProfessionPageData | null {
  return TOP_5[slug] ?? null;
}
