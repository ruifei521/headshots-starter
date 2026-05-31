// ============================================
// lib/json-ld.ts — 集中式 JSON-LD Schema 生成器
// 所有页面通过此文件获取结构化数据，保持 DRY
// ============================================

import { TIERS, type Tier } from "@/lib/tiers";

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
  description:
    "Generate professional AI headshots for LinkedIn, resumes, and social media in ~25 minutes. Starting at $29 with a 14-day money-back guarantee.",
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
      "Upload 4-10 selfies from any device (phone, computer, or tablet), choose a professional style, then our Flux AI trains on your face and generates studio-quality headshots in ~30 minutes. You get 40+ photos with different backgrounds and outfits.",
  },
  {
    question: "What kind of photos should I upload?",
    answer:
      "At least 4 high-quality selfies with good lighting. Front-facing, one person per frame, no sunglasses or hats. Different angles and expressions give better variety. Avoid heavily filtered or group photos. Phone selfies work great — iPhone 11+ or recent Android recommended.",
  },
  {
    question: "What styles are available?",
    answer:
      "We offer 12 professional styles: Corporate Headshots, Partner's Headshots, Lawyer Headshots, Natural Looks, Speaker, Realtor, Styled for Success, Talya Maor, Business Profile Studio, Effortless Professionalism, Office Outfits, and Stylish Studio Portraits.",
  },
  {
    question: "How many headshots do I get per pack?",
    answer:
      "Starter packs include 40 headshots, Professional packs include 60, and Executive packs include 100 headshots. Each style within a pack generates multiple variations with different backgrounds, outfits, and poses.",
  },
  {
    question: "How long does it take to get my AI headshots?",
    answer:
      "Standard processing takes ~30 minutes. Professional and Executive plans get priority processing for faster turnaround. You'll receive an email notification as soon as your headshots are ready.",
  },
  {
    question: "Can I use AI headshots professionally?",
    answer:
      "Absolutely. Use them on LinkedIn, company websites, resumes, email signatures, social media, and marketing materials. All plans include full commercial rights — no attribution or additional licensing required.",
  },
  {
    question: "What if I don't like my AI headshots?",
    answer:
      "We stand behind our results. If you don't get a single headshot you're happy with, we'll refund your entire purchase — no questions asked. Just contact us within 14 days of delivery.",
  },
  {
    question: "How does SnapProHead compare to other AI headshot services?",
    answer:
      "SnapProHead starts at just $29 with up to 100 headshots per pack — that's 97% cheaper than a $500 professional photographer and 95% faster (30 minutes vs 2-3 weeks). We use advanced Flux AI for 1024×1024 resolution, offer 12 curated styles, a 14-day money-back guarantee, and 30-day auto-delete privacy that many alternatives don't provide.",
  },
  {
    question: "How much does it cost?",
    answer:
      "Starter: $29 (40 headshots), Professional: $39 (60 headshots), Executive: $59 (100 headshots). You can purchase additional packs anytime without re-uploading photos — your trained model is reused.",
  },
  {
    question: "Are the headshots realistic? Will people know they're AI-generated?",
    answer:
      "Yes — our AI uses the latest Flux technology to produce 1024×1024 high-resolution headshots with natural skin textures, realistic lighting, and authentic-looking backgrounds. 95% of our customers say the results are indistinguishable from real photos.",
  },
  {
    question: "How many good photos can I expect?",
    answer:
      "Based on customer feedback, the average user gets 25-35 usable headshots and 10-15 photos they absolutely love per Starter pack. With 40-100 headshots depending on your plan, you'll have plenty to choose from.",
  },
  {
    question: "Who owns the copyright? Can I use them commercially?",
    answer:
      "You have full copyright and commercial rights to your headshots. Use them on LinkedIn, company websites, resumes, marketing materials, print — anywhere you need. No additional licensing or attribution required. The photos are yours.",
  },
  {
    question: "Is there a free trial?",
    answer:
      "We don't offer a free trial because AI model training has real computing costs. However, we offer a 14-day no-questions-asked money-back guarantee — so there's zero risk to see the results for yourself.",
  },
  {
    question: "What do you do with my uploaded photos?",
    answer:
      "We never sell, share, or display your photos. They're used solely to train your personal AI model and are automatically deleted 30 days after training completes. All data is transmitted with SSL encryption and stored with AES-256 encryption. You can request earlier deletion anytime from your account settings.",
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
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE.url}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

/** Product — 含 3 个独立 Offer（按 tier） + AggregateOffer + AggregateRating */
export function generateProductSchema() {
  const tierOrder: Tier[] = ["starter", "professional", "executive"];

  const individualOffers = tierOrder.map((tier) => {
    const info = TIERS[tier];
    return {
      "@type": "Offer",
      name: `${info.name} Plan — ${info.imageCount} AI Headshots`,
      price: info.price.toString(),
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      description: `${info.imageCount} HD AI headshots, ${info.features.slice(0, 3).join(", ")}`,
      eligibleQuantity: {
        "@type": "QuantitativeValue",
        value: info.imageCount,
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
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      bestRating: "5",
      ratingCount: "50",
      reviewCount: "50000",
    },
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

/** 评价页：Review（精选） + Breadcrumb */
export function getExamplesJsonLd(reviews: ReviewItem[]) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      ...generateReviewSchema(reviews),
      generateBreadcrumbSchema([
        { name: "Home", url: SITE.url },
        { name: "Reviews & Examples", url: `${SITE.url}/examples` },
      ]),
    ],
  };
}
