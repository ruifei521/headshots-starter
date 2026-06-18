// ============================================
// lib/json-ld.ts — 集中式 JSON-LD Schema 生成器
// 所有页面通过此文件获取结构化数据，保持 DRY
// ============================================

import { TIERS, type Tier } from "@/lib/tiers";
import {
  COMPARE_PRIVACY_SNIPPET,
  PHOTOS_FAQ_ANSWER,
} from "@/lib/data-retention-policy";
import {
  REFUND_FAQ_ANSWER,
  COMPARE_STARTER_LINE,
  TIER_COUNTS_LINE,
  META_SITE_DESCRIPTION,
  DELIVERY_FAQ_STANDARD,
} from "@/lib/refund-policy";
import { ESTIMATED_DELIVERY_MINUTES } from "@/lib/tiers";
import { compareVsStudioPhotographerSnippet } from "@/lib/marketing-copy";

// ============================================
// 类型定义
// ============================================
export interface FAQItem {
  question: string;
  answer: string;
}

export interface BreadcrumbItem {
  name: string;
  url: string;
}

export interface ReviewItem {
  name: string;
  role?: string;
  rating: number;
  date: string;
  text: string;
}

// ============================================
// 站点常量
// ============================================
const SITE = {
  name: "SnapProHead",
  url: "https://snapprohead.com",
  description: META_SITE_DESCRIPTION,
  logo: "https://snapprohead.com/hero.png",
  email: "contact@snapprohead.com",
  foundingDate: "2024",
  sameAs: [
    "https://twitter.com/snapprohead",
    "https://linkedin.com/company/snapprohead",
  ],
} as const;

// ============================================
// FAQ 数据（与 faq-section.tsx 保持同步）
// ============================================
export const FAQ_DATA: FAQItem[] = [
  {
    question: "How does AI headshot generation work?",
    answer:
      `Upload 4-10 selfies from any device (phone, computer, or tablet), choose a professional style, then our Flux AI trains on your face and generates studio-quality headshots in about ${ESTIMATED_DELIVERY_MINUTES} minutes. You get 40+ photos with different backgrounds and outfits.`,
  },
  {
    question: "What kind of photos should I upload?",
    answer:
      "At least 4 high-quality selfies with good lighting. Front-facing, one person per frame, no sunglasses or hats. Different angles and expressions give better variety. Avoid heavily filtered or group photos. Phone selfies work great — iPhone 11+ or recent Android recommended.",
  },
  {
    question: "What styles are available?",
    answer:
      "We offer professional outfit and background presets across Basic, Professional, and Executive packs — from corporate blazers to polished studio looks.",
  },
  {
    question: "How many headshots do I get per pack?",
    answer:
      "Basic packs include 40+ headshots, Professional packs include 60+, and Executive packs include 100+. Each outfit within a pack generates three variations with different backgrounds and poses.",
  },
  {
    question: "How long does it take to get my AI headshots?",
    answer: DELIVERY_FAQ_STANDARD,
  },
  {
    question: "Can I use AI headshots professionally?",
    answer:
      "Absolutely. Use them on LinkedIn, company websites, resumes, email signatures, social media, and marketing materials. All plans include full commercial rights — no attribution or additional licensing required.",
  },
  {
    question: "What if I don't like my AI headshots?",
    answer: REFUND_FAQ_ANSWER,
  },
  {
    question: "How does SnapProHead compare to other AI headshot services?",
    answer: `${COMPARE_STARTER_LINE} That's ${compareVsStudioPhotographerSnippet()} and 95% faster (~${ESTIMATED_DELIVERY_MINUTES} minutes vs 2-3 weeks). We use advanced Flux AI for 1024×1024 resolution, curated outfit presets, ${COMPARE_PRIVACY_SNIPPET}, and a fair refund policy that many alternatives don't provide.`,
  },
  {
    question: "How much does it cost?",
    answer: `${TIER_COUNTS_LINE} You can purchase additional packs anytime without re-uploading photos — your trained model is reused.`,
  },
  {
    question: "Are the headshots realistic? Will people know they're AI-generated?",
    answer:
      "Yes — our AI uses Flux technology to produce 1024×1024 high-resolution headshots with natural skin textures, realistic lighting, and professional backgrounds. Results are designed to look like studio portraits, not obvious AI art.",
  },
  {
    question: "How many good photos can I expect?",
    answer:
      "Based on customer feedback, the average user gets 28-35 usable headshots and 10-15 photos they absolutely love per Basic pack. With 40-100+ headshots depending on your plan, you'll have plenty to choose from.",
  },
  {
    question: "Who owns the copyright? Can I use them commercially?",
    answer:
      "You have full copyright and commercial rights to your headshots. Use them on LinkedIn, company websites, resumes, marketing materials, print — anywhere you need. No additional licensing or attribution required. The photos are yours.",
  },
  {
    question: "Is there a free trial?",
    answer:
      "We don't offer a free trial because AI model training has real computing costs. See our refund policy at snapprohead.com/refund if you'd like to understand your options before purchasing.",
  },
  {
    question: "What do you do with my uploaded photos?",
    answer: PHOTOS_FAQ_ANSWER,
  },
];

// ============================================
// Schema 生成器
// ============================================

/** Organization — 品牌主体 */
export function generateOrganizationSchema() {
  return {
    "@type": "Organization",
    name: SITE.name,
    url: SITE.url,
    logo: SITE.logo,
    description: SITE.description,
    email: SITE.email,
    foundingDate: SITE.foundingDate,
    sameAs: SITE.sameAs,
  };
}

/** WebSite — 站点级 Schema，含 SearchAction */
export function generateWebSiteSchema() {
  return {
    "@type": "WebSite",
    name: SITE.name,
    url: SITE.url,
    description: SITE.description,
  };
}

/** Product — 含 3 个独立 Offer（按 tier） + AggregateOffer + AggregateRating */
export function generateProductSchema() {
  const tierOrder: Tier[] = ["starter", "professional", "executive"];

  const individualOffers = tierOrder.map((tier) => {
    const info = TIERS[tier];
    return {
      "@type": "Offer",
      name: `${info.name} Plan — ${info.marketingImageCount}+ AI Headshots`,
      price: info.price.toString(),
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      description: `${info.marketingImageCount}+ HD AI headshots, ${info.features.slice(0, 3).join(", ")}`,
      eligibleQuantity: {
        "@type": "QuantitativeValue",
        value: info.marketingImageCount,
        unitText: "headshots",
      },
    };
  });

  return {
    "@type": "Product",
    name: "SnapProHead — AI Professional Headshot Generator",
    description: SITE.description,
    url: SITE.url,
    image: SITE.logo,
    category: "Professional Photography",
    brand: {
      "@type": "Brand",
      name: SITE.name,
    },
    offers: [
      ...individualOffers,
      {
        "@type": "AggregateOffer",
        priceCurrency: "USD",
        lowPrice: "29",
        highPrice: "59",
        offerCount: "3",
        availability: "https://schema.org/InStock",
      },
    ],
  };
}

/** FAQPage — 从 FAQItem[] 生成 */
export function generateFAQSchema(faqs: FAQItem[]) {
  return {
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

/** Review — 多条独立评价 */
export function generateReviewSchema(reviews: ReviewItem[]) {
  return reviews.map((review) => ({
    "@type": "Review",
    author: {
      "@type": "Person",
      name: review.name,
      ...(review.role ? { jobTitle: review.role } : {}),
    },
    reviewRating: {
      "@type": "Rating",
      ratingValue: review.rating.toString(),
      bestRating: "5",
    },
    datePublished: review.date,
    reviewBody: review.text,
    itemReviewed: {
      "@type": "Product",
      name: "SnapProHead AI Headshots",
    },
  }));
}

/** BreadcrumbList */
export function generateBreadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

// ============================================
// 页面级组合：直接返回 <script> 可用的对象
// ============================================

/** 全站通用：Organization + WebSite */
export function getSiteWideJsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [generateOrganizationSchema(), generateWebSiteSchema()],
  };
}

/** 首页：Product + FAQ（21 条全量） */
export function getHomepageJsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [generateProductSchema(), generateFAQSchema(FAQ_DATA)],
  };
}

/** 定价页：Product + FAQ + Breadcrumb */
export function getPricingPageJsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      generateProductSchema(),
      generateFAQSchema(FAQ_DATA),
      generateBreadcrumbSchema([
        { name: "Home", url: SITE.url },
        { name: "Pricing", url: `${SITE.url}/pricing` },
      ]),
    ],
  };
}

/** Blog article: Article + Breadcrumb (+ optional FAQPage) */
export function getBlogArticleJsonLd(input: {
  title: string;
  description: string;
  slug: string;
  datePublished: string;
  dateModified?: string;
  imageUrl?: string;
  wordCount?: number;
  faqs?: FAQItem[];
}) {
  const url = `${SITE.url}/blog/${input.slug}`;
  const modified = input.dateModified ?? input.datePublished;

  const graph: Record<string, unknown>[] = [
    {
      "@type": "Article",
      headline: input.title,
      description: input.description,
      datePublished: input.datePublished,
      dateModified: modified,
      author: {
        "@type": "Organization",
        name: SITE.name,
        url: SITE.url,
      },
      publisher: {
        "@type": "Organization",
        name: SITE.name,
        url: SITE.url,
        logo: {
          "@type": "ImageObject",
          url: SITE.logo,
        },
      },
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": url,
      },
      image: [input.imageUrl ?? SITE.logo],
      ...(input.wordCount != null && input.wordCount > 0
        ? { wordCount: input.wordCount }
        : {}),
    },
    generateBreadcrumbSchema([
      { name: "Home", url: SITE.url },
      { name: "Blog", url: `${SITE.url}/blog` },
      { name: input.title, url },
    ]),
  ];

  if (input.faqs && input.faqs.length > 0) {
    graph.push(generateFAQSchema(input.faqs));
  }

  return {
    "@context": "https://schema.org",
    "@graph": graph,
  };
}

/** Blog index: CollectionPage + Breadcrumb */
export function getBlogIndexJsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        name: "SnapProHead Blog",
        description:
          "Guides and comparisons on AI professional headshots, LinkedIn photos, and studio-quality portraits.",
        url: `${SITE.url}/blog`,
        isPartOf: { "@type": "WebSite", name: SITE.name, url: SITE.url },
      },
      generateBreadcrumbSchema([
        { name: "Home", url: SITE.url },
        { name: "Blog", url: `${SITE.url}/blog` },
      ]),
    ],
  };
}

/** Examples page: breadcrumb only (testimonials are illustrative, not Review schema). */
export function getExamplesJsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        name: "Sample Reviews & Examples",
        description:
          "Preview AI-generated professional headshots and typical user feedback from SnapProHead.",
        url: `${SITE.url}/examples`,
        isPartOf: { "@type": "WebSite", name: SITE.name, url: SITE.url },
      },
      generateBreadcrumbSchema([
        { name: "Home", url: SITE.url },
        { name: "Reviews & Examples", url: `${SITE.url}/examples` },
      ]),
    ],
  };
}
