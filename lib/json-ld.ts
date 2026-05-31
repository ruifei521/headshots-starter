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
      "Upload 4-10 selfies, choose a professional style (Corporate, Natural, Formal, etc.), then our AI trains on your face and generates studio-quality headshots in ~30 minutes. You get 40+ photos with different backgrounds and outfits.",
  },
  {
    question: "What styles are available?",
    answer:
      "We offer 12 professional styles: Corporate Headshots, Partner's Headshots, Lawyer Headshots, Natural Looks, Speaker, Realtor, Styled for Success, Talya Maor, Business Profile Studio, Effortless Professionalism, Office Outfits, and Stylish Studio Portraits.",
  },
  {
    question: "Can I buy additional packs later?",
    answer:
      "Yes! You can purchase additional packs anytime. Packs start at $29. You don't need to upload new photos — we use your existing trained model to generate new styles.",
  },
  {
    question: "What kind of photos should I upload?",
    answer:
      "At least 4 high-quality selfies with good lighting. Front-facing, one person per frame, no sunglasses or hats. Different angles and expressions give better variety. Avoid heavily filtered or group photos.",
  },
  {
    question: "How many headshots per style?",
    answer:
      "Each style generates 20-81 professional headshots, depending on the style you choose. Larger styles like Lawyer Headshots produce 81 images (women) or 69 images (men) with diverse backgrounds and outfits.",
  },
  {
    question: "Can I use these headshots professionally?",
    answer:
      "Absolutely. All plans include full commercial rights. Use them on LinkedIn, company websites, resumes, social media, email signatures — anywhere you need a professional look.",
  },
  {
    question: "How quickly will I receive my headshots?",
    answer:
      "Standard processing is ~30 minutes. Pro and Executive plans get priority processing. You'll receive an email when your headshots are ready.",
  },
  {
    question: "What if I'm not satisfied with the results?",
    answer:
      "We stand behind our AI headshots. If you don't get a single headshot you're happy with, we'll refund your entire purchase — no questions asked. Just contact us within 14 days.",
  },
  {
    question: "How does SnapProHead compare to other AI headshot services?",
    answer:
      "SnapProHead offers 12 curated professional styles with up to 100 headshots per pack, starting at just $29. All plans use advanced Flux AI for enhanced 1024×1024 resolution — higher than most competitors. Plus, we offer a 14-day money-back guarantee and 30-day auto-delete privacy that many alternatives don't.",
  },
  {
    question: "I love my headshots! How can I spread the word?",
    answer:
      "Share your experience on social media and tag us, or tell your colleagues and friends. If you have a large audience, reach out about our affiliate program at contact@snapprohead.com.",
  },
  {
    question: "What do you do with my uploaded photos? Are they safe?",
    answer:
      "We never sell or share your photos. All uploaded photos are automatically deleted 30 days after AI training completes. We are GDPR compliant and take your privacy seriously.",
  },
  {
    question: "How long do you keep my photos?",
    answer:
      "Uploaded photos are used to train your AI model and are automatically deleted 30 days after training completes. You can request earlier deletion anytime from your account settings.",
  },
  {
    question: "Can other people see my headshots?",
    answer:
      "No. Your headshots are visible only to you. We never display, share, or showcase your headshots publicly. Your privacy is our priority.",
  },
  {
    question: "Is my data encrypted and secure?",
    answer:
      "Yes. All data is transmitted with SSL encryption and stored with AES-256 encryption. We use industry-standard security practices to protect your information.",
  },
  {
    question: "How does SnapProHead compare to a $500 photographer?",
    answer:
      "A professional photographer costs $500+ and takes 2-3 weeks. SnapProHead starts at just $29 and delivers 40+ headshots in ~30 minutes. That's 97% cheaper and 95% faster — with a money-back guarantee.",
  },
  {
    question: "Is there a free trial?",
    answer:
      "We don't offer a free trial because AI model training has real computing costs. But we offer a 14-day no-questions-asked money-back guarantee — so there's zero risk to try.",
  },
  {
    question: "How many selfies do I need to upload?",
    answer:
      "We recommend 4-10 clear selfies with good lighting. Front-facing only, no sunglasses or hats. Phone selfies work great — no professional equipment needed.",
  },
  {
    question: "Are the headshots realistic? Will people know they're AI-generated?",
    answer:
      "Our AI uses the latest Flux technology, generating 1024×1024 high-resolution headshots. 95% of our customers say the results look very natural and indistinguishable from real photos.",
  },
  {
    question: "How many good photos can I expect?",
    answer:
      "Based on customer feedback, the average customer gets 25-35 usable headshots and 10-15 photos they're very happy with, per pack. With 40+ headshots per pack, you'll have plenty to choose from.",
  },
  {
    question: "Who owns the copyright? Can I use them commercially?",
    answer:
      "You have full copyright and commercial rights to your headshots. Use them on LinkedIn, company websites, resumes, marketing materials, print — anywhere you need. No additional licensing or attribution required.",
  },
  {
    question: "What devices can I use? Can I upload from my phone?",
    answer:
      "Any device works — phone, computer, or tablet. Upload directly from your camera roll. We recommend iPhone 11+ or recent Android phones for best photo quality. No professional camera needed.",
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
