import type { ProfessionPageData } from "@/components/headshots/ProfessionPage";
import { DELIVERY_FAQ_ANSWER_40_PLUS, PROFESSION_HERO_SUFFIX, STARTER_PRICE_LINE } from "@/lib/refund-policy";

const ALL_PROFESSIONS: Record<string, ProfessionPageData> = {
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

  // === Remaining 16 professions ===
  accountant: {
    slug: "Accountant", heroBadge: "Accounting Professional Headshots", heroTitle: "AI Headshots for Accountants", heroHighlight: "Accountants", heroDescription: "Build client trust with professional headshots for your firm website, LinkedIn, and business profiles. 40+ HD photos from $29 in ~25 minutes.", featureList: ["Client-Trust Building", "Firm-Ready Quality", "Multiple Professional Looks"], whySection: { title: "Why Accountant Headshots Matter", cards: [{ title: "Client Confidence", desc: "A polished portrait on your firm page signals reliability and attention to detail." }, { title: "Directory Presence", desc: "Stand out on LinkedIn and professional accounting directories." }, { title: "Firm Branding", desc: "Consistent headshots across partners and staff build institutional trust." }] }, ctaHeadline: "Look Professional, Build Trust", ctaSubtext: "From $29 for 40+ firm-ready headshots. Upload selfies and download polished portraits in ~25 minutes.", faqs: [{ question: "How much do accountant headshots cost?", answer: `${STARTER_PRICE_LINE} Traditional sessions run $200–$400+. AI delivers 40+ photos in ~25 minutes.` }, { question: "How fast will I get my headshots?", answer: DELIVERY_FAQ_ANSWER_40_PLUS }, { question: "Can my firm get matching headshots?", answer: "Yes. Use the same preset for all accountants and staff for a consistent professional look." }], relatedPages: [{ label: "Corporate Headshots", href: "/headshots/corporate" }, { label: "Consultant Headshots", href: "/headshots/consultant" }, { label: "All Styles", href: "/headshots" }, { label: "Pricing", href: "/pricing" }] },
  actor: {
    slug: "Actor", heroBadge: "Casting & Portfolio Headshots", heroTitle: "AI Headshots for Actors & Performers", heroHighlight: "Actors & Performers", heroDescription: "Multiple looks for casting sites, agents, and portfolios. Get 40+ professional headshots in different styles — without a photographer. From $29 in ~25 minutes.", featureList: ["Multiple Character Looks", "Casting-Ready Quality", "Agent Portfolio Approved"], whySection: { title: "Why Actor Headshots Matter", cards: [{ title: "Casting Calls", desc: "A strong headshot is your first audition. Casting directors scan hundreds — make yours stand out." }, { title: "Versatile Portfolio", desc: "Show range with multiple looks in one AI batch — dramatic, commercial, approachable." }, { title: "Fast Turnaround", desc: "Got a last-minute audition? Refresh your headshot in ~25 minutes." }] }, useCases: ["Casting websites and agent profiles", "IMDb and Spotlight", "Theater programs and playbills", "Social media and personal branding", "Voice actor and commercial profiles"], ctaHeadline: "Get Casting-Ready Headshots", ctaSubtext: "From $29 for 40+ actor-quality headshots. Multiple looks in one batch — no studio booking required.", faqs: [{ question: "Can I get different character looks?", answer: "Yes. One AI batch generates multiple outfits, backgrounds, and expressions — giving you range for commercial, dramatic, and approachable looks." }, { question: "How fast will I get my headshots?", answer: DELIVERY_FAQ_ANSWER_40_PLUS }, { question: "Are these accepted by casting directors?", answer: "For digital submissions, AI headshots that look like you are widely accepted. For union-mandated in-person auditions, check specific requirements." }, { question: "How much do actor headshots cost?", answer: `${STARTER_PRICE_LINE} Traditional actor headshot sessions with a specialty photographer often run $300–$800+.` }], relatedPages: [{ label: "Portfolio Headshots", href: "/headshots/portfolio" }, { label: "Professional Headshots", href: "/headshots/professional" }, { label: "All Styles", href: "/headshots" }, { label: "Pricing", href: "/pricing" }] },
  "ai-headshot-generator": {
    slug: "Professional", heroBadge: "AI Headshot Generator", heroTitle: "AI Headshot Generator — Professional Photos in ~25 Minutes", heroHighlight: "Professional Photos", heroDescription: "Turn your selfies into studio-quality professional headshots. 40+ HD photos from $29 — ideal for LinkedIn, resumes, and team pages. No photographer needed.", featureList: ["Studio-Quality Results", "~25 Minute Delivery", "40+ HD Headshots"], whySection: { title: "Why Choose AI Headshots", cards: [{ title: "Save Time", desc: "No scheduling, no commute, no 2-week wait. Upload selfies and download in ~25 minutes." }, { title: "Save Money", desc: "$29 for 40+ photos vs $300+ for 3–5 from a photographer. More variety, less cost." }, { title: "Look Professional", desc: "Flux-enhanced AI produces natural skin textures and realistic lighting — indistinguishable from studio." }] }, ctaHeadline: "Get Professional Headshots Now", ctaSubtext: "From $29 for 40+ HD headshots. Upload selfies and download in ~25 minutes.", faqs: [{ question: "How does the AI headshot generator work?", answer: "Upload 4-10 selfies from your phone, choose a style pack, and our Flux AI generates 40+ studio-quality headshots in ~25 minutes." }, { question: "How fast will I get my headshots?", answer: DELIVERY_FAQ_ANSWER_40_PLUS }, { question: "Are the headshots realistic?", answer: "Yes. Flux AI produces 1024×1024 headshots with natural skin textures, realistic lighting, and professional backgrounds." }], relatedPages: [{ label: "LinkedIn Headshots", href: "/headshots/linkedin" }, { label: "Professional Headshots", href: "/headshots/professional" }, { label: "All Styles", href: "/headshots" }, { label: "Pricing", href: "/pricing" }] },
  "ai-professional-portrait": {
    slug: "Portrait", heroBadge: "AI Professional Portraits", heroTitle: "AI Professional Portrait — Studio-Quality from Selfies", heroHighlight: "Studio-Quality Portraits", heroDescription: "Polished AI portraits for LinkedIn, websites, and professional directories. Studio lighting and professional backgrounds from your phone photos. From $29 in ~25 minutes.", featureList: ["Studio-Quality Lighting", "Multiple Backgrounds", "Natural & Realistic"], whySection: { title: "Why AI Portraits Work", cards: [{ title: "Studio Quality", desc: "Flux AI produces portraits with professional lighting, clean backgrounds, and natural skin tones." }, { title: "Instant Delivery", desc: "No waiting weeks for edited files. Get 40+ portraits in ~25 minutes." }, { title: "Versatile Use", desc: "Perfect for LinkedIn, email signatures, conference bios, and company directories." }] }, ctaHeadline: "Your Professional Portrait, Instantly", ctaSubtext: "From $29 for 40+ studio-quality portraits. Upload selfies and download in ~25 minutes.", faqs: [{ question: "How much does an AI professional portrait cost?", answer: `${STARTER_PRICE_LINE} Traditional studio portraits run $300–$800+.` }, { question: "How fast will I get my portrait?", answer: DELIVERY_FAQ_ANSWER_40_PLUS }, { question: "Can I use it for my company website?", answer: "Yes. All plans include full commercial rights — use your portraits anywhere." }], relatedPages: [{ label: "Professional Headshots", href: "/headshots/professional" }, { label: "Business Headshots", href: "/headshots/business" }, { label: "All Styles", href: "/headshots" }] },
  architect: {
    slug: "Architect", heroBadge: "Architecture Professional Headshots", heroTitle: "AI Headshots for Architects & Designers", heroHighlight: "Architects & Designers", heroDescription: "Showcase credibility on your firm site, LinkedIn, and design portfolio. Professional AI headshots for architects — 40+ HD photos from $29 in ~25 minutes.", featureList: ["Design-Focused Polish", "Portfolio-Ready Quality", "Firm Website Approved"], whySection: { title: "Why Architect Headshots Matter", cards: [{ title: "Design Credibility", desc: "As a design professional, your visual presentation matters. A polished headshot reflects your aesthetic standards." }, { title: "Firm Presence", desc: "Stand out on your firm's team page and in client proposals." }, { title: "Award & Press Ready", desc: "Have a professional photo ready for industry awards, publications, and speaking engagements." }] }, ctaHeadline: "Design Your Professional Image", ctaSubtext: "From $29 for 40+ professional headshots. Upload selfies and download in ~25 minutes.", faqs: [{ question: "How much do architect headshots cost?", answer: `${STARTER_PRICE_LINE}` }, { question: "How fast will I get them?", answer: DELIVERY_FAQ_ANSWER_40_PLUS }], relatedPages: [{ label: "Corporate Headshots", href: "/headshots/corporate" }, { label: "Portfolio Headshots", href: "/headshots/portfolio" }, { label: "All Styles", href: "/headshots" }] },
  business: {
    slug: "Business", heroBadge: "Entrepreneur & Business Headshots", heroTitle: "AI Headshots for Business Owners & Entrepreneurs", heroHighlight: "Business Owners & Entrepreneurs", heroDescription: "Look credible on your website, pitch deck, and LinkedIn. Professional AI business headshots — 40+ HD photos from $29 in ~25 minutes.", featureList: ["Investor-Ready Polish", "Pitch Deck Approved", "Multiple Professional Styles"], whySection: { title: "Why Business Headshots Matter", cards: [{ title: "Investor Confidence", desc: "A polished photo in your pitch deck signals professionalism before you say a word." }, { title: "Brand Consistency", desc: "Use the same professional image across your website, LinkedIn, and media features." }, { title: "Always Current", desc: "Refresh your photo whenever your brand evolves — no new studio session needed." }] }, ctaHeadline: "Look the Part. Close the Deal.", ctaSubtext: "From $29 for 40+ business-ready headshots. Upload selfies and download in ~25 minutes.", faqs: [{ question: "How much do business headshots cost?", answer: `${STARTER_PRICE_LINE}` }, { question: "How fast is delivery?", answer: DELIVERY_FAQ_ANSWER_40_PLUS }, { question: "Can I use them on my pitch deck?", answer: "Yes. Full commercial rights included — use on pitch decks, websites, LinkedIn, and investor materials." }], relatedPages: [{ label: "Startup Headshots", href: "/headshots/startup" }, { label: "Executive Headshots", href: "/headshots/executive" }, { label: "All Styles", href: "/headshots" }] },
  "c-suite": {
    slug: "C-Suite", heroBadge: "C-Suite & Senior Leadership", heroTitle: "AI Headshots for C-Suite Executives", heroHighlight: "C-Suite Executives", heroDescription: "Command authority with executive headshots for CEOs, CFOs, and senior leaders. Press-ready, boardroom-quality portraits from your phone. From $29 in ~25 minutes.", featureList: ["Boardroom Authority", "Press & Media Ready", "Confident & Approachable"], whySection: { title: "Why C-Suite Headshots Matter", cards: [{ title: "Leadership Signal", desc: "Your photo sets the tone for your entire leadership brand." }, { title: "Media Ready", desc: "Always have a current photo for press releases, interviews, and speaking engagements." }, { title: "Board Presence", desc: "Look the part for board meetings, annual reports, and shareholder communications." }] }, ctaHeadline: "Lead with Authority", ctaSubtext: "From $29 for 40+ executive-quality headshots. Upload selfies and download in ~25 minutes.", faqs: [{ question: "How much do C-suite headshots cost?", answer: `${STARTER_PRICE_LINE}` }, { question: "How fast will I get them?", answer: DELIVERY_FAQ_ANSWER_40_PLUS }], relatedPages: [{ label: "Executive Headshots", href: "/headshots/executive" }, { label: "Corporate Headshots", href: "/headshots/corporate" }, { label: "All Styles", href: "/headshots" }] },
  consultant: {
    slug: "Consultant", heroBadge: "Consulting Professional Headshots", heroTitle: "AI Headshots for Consultants", heroHighlight: "Consultants", heroDescription: "Build authority on your proposals, website, and LinkedIn. Professional AI headshots for management, strategy, and independent consultants. 40+ HD from $29.", featureList: ["Authority-Building Polish", "Proposal & Website Ready", "Multiple Professional Looks"], whySection: { title: "Why Consultant Headshots Matter", cards: [{ title: "Client Trust", desc: "Your photo on a proposal or website is a trust signal before the first meeting." }, { title: "Expert Positioning", desc: "A polished portrait supports your positioning as a premium advisor." }, { title: "Multi-Platform", desc: "Consistent image across LinkedIn, proposals, conference bios, and your consulting website." }] }, ctaHeadline: "Project Confidence, Win Clients", ctaSubtext: "From $29 for 40+ consultant-quality headshots. Upload selfies and download in ~25 minutes.", faqs: [{ question: "How much do consultant headshots cost?", answer: `${STARTER_PRICE_LINE}` }, { question: "How fast will I get them?", answer: DELIVERY_FAQ_ANSWER_40_PLUS }, { question: "Can I use them on client proposals?", answer: "Yes. Full commercial rights included — add your photo to proposals, decks, and your consulting website." }], relatedPages: [{ label: "Corporate Headshots", href: "/headshots/corporate" }, { label: "Business Headshots", href: "/headshots/business" }, { label: "All Styles", href: "/headshots" }] },
  corporate: {
    slug: "Corporate", heroBadge: "Corporate Professional Headshots", heroTitle: "AI Headshots for Corporate Professionals", heroHighlight: "Corporate Professionals", heroDescription: "Consistent, professional portraits for intranets, email signatures, and company directories. From $29 per person — no studio coordination needed.", featureList: ["Team-Wide Consistency", "Intranet & Email Ready", "Scalable Per Person"], whySection: { title: "Why Corporate Headshots Matter", cards: [{ title: "Uniform Branding", desc: "Consistent headshots across your team signal professionalism and organizational maturity." }, { title: "Easy Rollout", desc: "No scheduling 50 calendars. Each employee uploads selfies independently." }, { title: "New Hire Ready", desc: "Onboarding? New headshot in ~25 minutes — not the next quarterly photo day." }] }, ctaHeadline: "Unify Your Team's Image", ctaSubtext: "From $29 per person for 40+ corporate headshots. Team-wide consistency without the logistics headache.", faqs: [{ question: "How much do corporate headshots cost?", answer: `${STARTER_PRICE_LINE} Traditional corporate sessions run $200–$500 per person.` }, { question: "How do I roll out across my team?", answer: "Share a style guide, use the same preset, and have each employee upload selfies. Marketing can review samples before full rollout." }, { question: "How fast is delivery?", answer: DELIVERY_FAQ_ANSWER_40_PLUS }], relatedPages: [{ label: "Executive Headshots", href: "/headshots/executive" }, { label: "Business Headshots", href: "/headshots/business" }, { label: "Professional Headshots", href: "/headshots/professional" }, { label: "All Styles", href: "/headshots" }] },
  dentist: {
    slug: "Dentist", heroBadge: "Dental Professional Headshots", heroTitle: "AI Headshots for Dentists", heroHighlight: "Dentists", heroDescription: "Build patient trust on your practice website, Google Business Profile, and social media. Professional AI dentist headshots — 40+ HD from $29 in ~25 minutes.", featureList: ["Patient-Trust Building", "Practice Website Ready", "Google Profile Approved"], whySection: { title: "Why Dentist Headshots Matter", cards: [{ title: "Patient Comfort", desc: "A warm, professional photo helps anxious patients feel at ease before their first visit." }, { title: "Practice Branding", desc: "Consistent headshots across all dentists reinforce your practice's professionalism." }, { title: "Online Presence", desc: "Stand out on Google Business Profile, Healthgrades, and dental directories." }] }, ctaHeadline: "Smile with Confidence", ctaSubtext: "From $29 for 40+ professional headshots. Upload selfies and download practice-ready photos in ~25 minutes.", faqs: [{ question: "How much do dentist headshots cost?", answer: `${STARTER_PRICE_LINE}` }, { question: "How fast will I get them?", answer: DELIVERY_FAQ_ANSWER_40_PLUS }], relatedPages: [{ label: "Doctor Headshots", href: "/headshots/doctor" }, { label: "Nurse Headshots", href: "/headshots/nurse" }, { label: "All Styles", href: "/headshots" }] },
  nurse: {
    slug: "Nurse", heroBadge: "Nursing Professional Headshots", heroTitle: "AI Headshots for Nurses", heroHighlight: "Nurses", heroDescription: "Present a caring, competent image on hospital sites, LinkedIn, and healthcare directories. Professional AI nurse headshots — 40+ HD from $29 in ~25 minutes.", featureList: ["Caring & Competent Look", "Hospital Site Ready", "Directory Approved"], whySection: { title: "Why Nurse Headshots Matter", cards: [{ title: "Patient Trust", desc: "A warm, professional portrait helps patients feel confident in your care." }, { title: "Career Growth", desc: "A polished LinkedIn photo supports your professional advancement and networking." }, { title: "Practice Branding", desc: "Consistent photos across nursing staff reinforce your facility's professionalism." }] }, ctaHeadline: "Show Your Professional Best", ctaSubtext: "From $29 for 40+ professional headshots. Upload selfies and download in ~25 minutes.", faqs: [{ question: "How much do nurse headshots cost?", answer: `${STARTER_PRICE_LINE}` }, { question: "How fast will I get them?", answer: DELIVERY_FAQ_ANSWER_40_PLUS }], relatedPages: [{ label: "Doctor Headshots", href: "/headshots/doctor" }, { label: "Dentist Headshots", href: "/headshots/dentist" }, { label: "All Styles", href: "/headshots" }] },
  portfolio: {
    slug: "Portfolio", heroBadge: "Creative Portfolio Headshots", heroTitle: "AI Headshots for Creative Portfolios", heroHighlight: "Creative Portfolios", heroDescription: "AI portfolio headshots for models, actors, and creatives. Multiple looks for comp cards, agencies, and personal sites. 40+ HD from $29 in ~25 minutes.", featureList: ["Multiple Creative Looks", "Comp Card Ready", "Agency Portfolio Approved"], whySection: { title: "Why Portfolio Headshots Matter", cards: [{ title: "Show Range", desc: "Multiple outfits and backgrounds in one batch show casting directors your versatility." }, { title: "Stay Current", desc: "Update your portfolio as often as your look changes — no studio rebooking." }, { title: "Cost Effective", desc: "Traditional portfolio sessions with multiple looks run $500–$1,200+. AI delivers for $29." }] }, ctaHeadline: "Build a Standout Portfolio", ctaSubtext: "From $29 for 40+ portfolio-ready headshots. Multiple looks, one upload, ~25 minutes.", faqs: [{ question: "How much do portfolio headshots cost?", answer: `${STARTER_PRICE_LINE}` }, { question: "Can I get multiple looks?", answer: "Yes. Each AI batch generates multiple outfits and backgrounds — giving you variety for comp cards and portfolios." }, { question: "How fast?", answer: DELIVERY_FAQ_ANSWER_40_PLUS }], relatedPages: [{ label: "Actor Headshots", href: "/headshots/actor" }, { label: "Professional Headshots", href: "/headshots/professional" }, { label: "All Styles", href: "/headshots" }] },
  professional: {
    slug: "Professional", heroBadge: "Career Professional Headshots", heroTitle: "AI Professional Headshots for Your Career", heroHighlight: "Your Career", heroDescription: "Resume-ready AI headshots for job seekers and career growth. Polished portraits for LinkedIn, email, and job applications. 40+ HD from $29 in ~25 minutes.", featureList: ["Resume & LinkedIn Ready", "Recruiter-Approved Polish", "Multiple Professional Looks"], whySection: { title: "Why Professional Headshots Matter", cards: [{ title: "Job Search Edge", desc: "Profiles with professional photos get significantly more recruiter attention." }, { title: "Career Growth", desc: "A polished photo supports your personal brand at every career stage." }, { title: "Always Current", desc: "Update your photo whenever you change roles, industries, or just want a refresh." }] }, ctaHeadline: "Advance Your Career", ctaSubtext: "From $29 for 40+ professional headshots. Upload selfies and download career-ready photos in ~25 minutes.", faqs: [{ question: "How much do professional headshots cost?", answer: `${STARTER_PRICE_LINE}` }, { question: "How fast?", answer: DELIVERY_FAQ_ANSWER_40_PLUS }, { question: "Can I use on my resume?", answer: "Yes. Full commercial rights included — use on resumes, LinkedIn, and job applications." }], relatedPages: [{ label: "LinkedIn Headshots", href: "/headshots/linkedin" }, { label: "Corporate Headshots", href: "/headshots/corporate" }, { label: "All Styles", href: "/headshots" }] },
  "professional-headshot-photographer": {
    slug: "Photographer", heroBadge: "Photographer Alternative", heroTitle: "AI Headshots — The Professional Photographer Alternative", heroHighlight: "Photographer Alternative", heroDescription: "Skip the studio booking: AI headshots that match professional photographer quality. 40+ HD portraits from $29 in ~25 minutes.", featureList: ["Studio-Quality Without Studio", "$29 vs $300+", "~25 Min vs 2-3 Weeks"], whySection: { title: "AI vs Traditional Photographer", cards: [{ title: "Dramatic Savings", desc: "AI delivers 40+ photos for $29 vs a photographer's $300+ for 3–5 edited shots." }, { title: "Instant Delivery", desc: "~25 minutes vs 1–3 weeks for photographer editing and delivery." }, { title: "More Variety", desc: "Multiple outfits and backgrounds in one batch — photographers charge extra per look." }] }, ctaHeadline: "Professional Results, Without the Studio", ctaSubtext: "From $29 for 40+ studio-quality headshots. No scheduling, no commute, no $300+ bill.", faqs: [{ question: "Is AI quality as good as a photographer?", answer: "For LinkedIn and company websites, AI headshots are indistinguishable from studio portraits. Photographers still win for billboard campaigns and bespoke art direction." }, { question: "How much does it cost vs a photographer?", answer: `${STARTER_PRICE_LINE} Traditional sessions run $200–$1,500+.` }, { question: "How fast?", answer: DELIVERY_FAQ_ANSWER_40_PLUS }], relatedPages: [{ label: "Professional Headshots", href: "/headshots/professional" }, { label: "Cost Comparison Guide", href: "/blog/ai-headshot-cost-vs-photographer-2026" }, { label: "All Styles", href: "/headshots" }] },
  startup: {
    slug: "Startup", heroBadge: "Founder & Startup Team Headshots", heroTitle: "AI Headshots for Startup Founders & Teams", heroHighlight: "Startup Founders & Teams", heroDescription: "Look investable on your site, pitch deck, and press. Professional AI headshots for founders and startup teams — 40+ HD from $29 per person.", featureList: ["Investor-Ready Polish", "Team-Wide Consistency", "Pitch Deck Approved"], whySection: { title: "Why Startup Headshots Matter", cards: [{ title: "Investor Impression", desc: "A polished team page signals you're serious — before the first slide of your deck." }, { title: "Press Ready", desc: "Have team photos ready for TechCrunch, Product Hunt launches, and media features." }, { title: "Scalable & Fast", desc: "Add new hires instantly. No scheduling a photographer for every new team member." }] }, ctaHeadline: "Look Like the Next Big Thing", ctaSubtext: "From $29 per person for 40+ headshots. Team-wide consistency, zero scheduling.", faqs: [{ question: "How much do startup team headshots cost?", answer: `${STARTER_PRICE_LINE} Traditional team sessions run $2,000–$5,000+. AI delivers for $29 per person.` }, { question: "How fast?", answer: DELIVERY_FAQ_ANSWER_40_PLUS }], relatedPages: [{ label: "Business Headshots", href: "/headshots/business" }, { label: "Corporate Headshots", href: "/headshots/corporate" }, { label: "All Styles", href: "/headshots" }] },
  teacher: {
    slug: "Teacher", heroBadge: "Educator Professional Headshots", heroTitle: "AI Headshots for Teachers & Educators", heroHighlight: "Teachers & Educators", heroDescription: "Build trust on school websites, staff directories, and social media. Professional AI teacher headshots — 40+ HD from $29 in ~25 minutes.", featureList: ["Approachable & Professional", "School Website Ready", "Directory Approved"], whySection: { title: "Why Teacher Headshots Matter", cards: [{ title: "Student & Parent Trust", desc: "A warm, professional photo helps students and parents feel connected before the first class." }, { title: "Staff Directory", desc: "Stand out on your school's team page with a polished, consistent portrait." }, { title: "Career Growth", desc: "A professional LinkedIn photo supports your career advancement in education." }] }, ctaHeadline: "Make a Great First Impression", ctaSubtext: "From $29 for 40+ professional headshots. Upload selfies and download educator-ready photos in ~25 minutes.", faqs: [{ question: "How much do teacher headshots cost?", answer: `${STARTER_PRICE_LINE}` }, { question: "How fast?", answer: DELIVERY_FAQ_ANSWER_40_PLUS }], relatedPages: [{ label: "Professional Headshots", href: "/headshots/professional" }, { label: "LinkedIn Headshots", href: "/headshots/linkedin" }, { label: "All Styles", href: "/headshots" }] },
};

export function getProfessionPageData(slug: string): ProfessionPageData | null {
  return ALL_PROFESSIONS[slug] ?? null;
}
