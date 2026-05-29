"use client"; // v4 - three tier cards, gender selection removed

import Link from "next/link";
import { ArrowLeft, Loader2, Check, Clock, Star, Zap, Shield } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { TIERS, getTierInfo, type Tier, type TierInfo } from "@/lib/tiers";

// Use browser client so it reads cookies and manages session automatically
function getSupabase() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

export const runtime = 'nodejs';

// Pack details - matched by slug
const allPacks: Record<string, { title: string; desc: string; img: string; longDesc: string; womanImg: string; manImg: string; womanCount: number; manCount: number }> = {
  'corporate-headshots': {
    title: 'Corporate Headshots', desc: 'Formal Business',
    img: 'corporate-headshots_1.webp',
    womanImg: 'corporate-headshots_woman_cover.jpg', manImg: 'corporate-headshots_man_cover.jpg',
    womanCount: 24, manCount: 24,
    longDesc: 'Professional corporate headshots designed for executives, managers, and business professionals. Clean white background, formal attire, perfect for LinkedIn and company websites.'
  },
  'partners-headshots': {
    title: "Partner's Headshots", desc: 'Legal Professional',
    img: 'partners-headshots_1.webp',
    womanImg: 'partners-headshots_woman_cover.jpg', manImg: 'partners-headshots_man_cover.jpg',
    womanCount: 24, manCount: 24,
    longDesc: 'Executive-level headshots tailored for law partners, senior counsel, and legal professionals. Commanding presence with a refined, trustworthy look.'
  },
  'speaker': {
    title: 'Speaker', desc: 'Public Speaking',
    img: 'speaker_1.webp',
    womanImg: 'speaker_woman_cover.jpg', manImg: 'speaker_man_cover.jpg',
    womanCount: 24, manCount: 24,
    longDesc: 'Dynamic speaker portraits for keynote presenters, TEDx speakers, and thought leaders. Engaging expressions that command attention on stage and online.'
  },
  'realtor': {
    title: 'Realtor', desc: 'Real Estate',
    img: 'realtor_1.webp',
    womanImg: 'realtor_woman_cover.jpg', manImg: 'realtor_man_cover.jpg',
    womanCount: 24, manCount: 24,
    longDesc: 'Approachable and trustworthy headshots for real estate agents. Warm, friendly style that helps you connect with potential buyers and sellers.'
  },
  'styled-for-success': {
    title: 'Styled for Success', desc: 'Modern Professional',
    img: 'styled-for-success_1.webp',
    womanImg: 'styled-for-success_woman_cover.jpg', manImg: 'styled-for-success_man_cover.jpg',
    womanCount: 24, manCount: 24,
    longDesc: 'Modern, polished headshots for the contemporary professional. Versatile style suitable for LinkedIn, company bios, and professional networking.'
  },
  'lawyer-il': {
    title: 'Lawyer Headshots', desc: 'Legal Professional',
    img: 'lawyer-il_1.webp',
    womanImg: 'lawyer-il_woman_cover.jpg', manImg: 'lawyer-il_man_cover.jpg',
    womanCount: 24, manCount: 24,
    longDesc: 'Professional attorney headshots that convey competence and credibility. Suitable for law firm websites, court profiles, and legal directories.'
  },
  'image-shots': {
    title: 'Image shots - Talya Maor', desc: 'Branding Photography',
    img: 'talya-maor_1.webp',
    womanImg: 'talya-maor_woman_cover.jpg', manImg: 'talya-maor_man_cover.jpg',
    womanCount: 24, manCount: 24,
    longDesc: 'Branding photography inspired by Talya Maor style. Creative and artistic portraits perfect for personal branding and social media.'
  },
  'natural-headshots': {
    title: 'Natural Looks', desc: 'Natural & Approachable',
    img: 'natural-headshots_1.webp',
    womanImg: 'natural-headshots_woman_cover.jpg', manImg: 'natural-headshots_man_cover.jpg',
    womanCount: 24, manCount: 24,
    longDesc: 'Relaxed, natural headshots that capture your authentic self. Perfect for creative professionals, consultants, and anyone wanting a genuine look.'
  },
  'business-profile-studio': {
    title: 'Business Profile - Studio', desc: 'Studio Photography',
    img: 'business-profile-studio_1.webp',
    womanImg: 'business-profile-studio_woman_cover.jpg', manImg: 'business-profile-studio_man_cover.jpg',
    womanCount: 24, manCount: 24,
    longDesc: 'Studio-quality business profiles with professional lighting and composition. Ideal for corporate directories, press releases, and media kits.'
  },
  'effortless-professionalism': {
    title: 'Effortless Professionalism', desc: 'Casual Professional',
    img: 'effortless-professionalism_1.webp',
    womanImg: 'effortless-professionalism_woman_cover.jpg', manImg: 'effortless-professionalism_man_cover.jpg',
    womanCount: 24, manCount: 24,
    longDesc: 'Effortlessly professional headshots with a relaxed, modern feel. Great for startups, creative agencies, and modern workplaces.'
  },
  'office-outfits': {
    title: 'Office Outfits', desc: 'Office Fashion',
    img: 'office-outfits_1.webp',
    womanImg: 'office-outfits_woman_cover.jpg', manImg: 'office-outfits_man_cover.jpg',
    womanCount: 24, manCount: 24,
    longDesc: 'Fashion-forward office portraits with varied wardrobe options. Stylish yet professional, perfect for fashion, beauty, and lifestyle professionals.'
  },
  'stylish-studio-portraits': {
    title: 'Stylish Studio Portraits', desc: 'Studio Portrait Photography',
    img: 'stylish-studio-portraits_1.webp',
    womanImg: 'stylish-studio-portraits_woman_cover.jpg', manImg: 'stylish-studio-portraits_man_cover.jpg',
    womanCount: 24, manCount: 24,
    longDesc: 'Artistic studio portraits with a fashion editorial feel. High-end styling for creatives, models, and anyone wanting standout imagery.'
  },
};

/** Tier card with embedded gender selection */
function TierPricingCard({ tierInfo, packSlug, highlight }: { tierInfo: TierInfo; packSlug: string; highlight?: boolean }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const isPopular = tierInfo.badge === 'Most Popular';
  const isBest = tierInfo.badge === 'Best Value';

  const handlePurchase = async () => {
    setLoading(true);
    try {
      const supabase = getSupabase();
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push(`/login?redirect=/packs/${packSlug}`);
        return;
      }

      const body: Record<string, string> = {
        pack: packSlug,
        gender: 'woman',
        tier: tierInfo.tier,
      };

      const res = await fetch('/api/creem/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert('Failed to create checkout: ' + (data.error || 'Unknown error'));
      }
    } catch (err) {
      alert('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`relative flex flex-col rounded-xl border bg-card p-6 shadow-sm transition-all duration-200 hover:shadow-md ${
        highlight ? 'ring-2 ring-primary scale-[1.02]' : ''
      }`}
    >
      {/* Badge */}
      {tierInfo.badge && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${
            isPopular
              ? 'bg-primary text-primary-foreground'
              : 'bg-gradient-to-r from-amber-500 to-orange-500 text-white'
          }`}>
            {isBest && <Zap className="h-3 w-3" />}
            {isPopular && <Star className="h-3 w-3" />}
            {tierInfo.badge}
          </span>
        </div>
      )}

      {/* Price */}
      <div className="flex items-baseline justify-center gap-2 mt-2">
        <span className="text-base text-muted-foreground line-through">${tierInfo.originalPrice}</span>
        <span className="text-4xl font-extrabold">{tierInfo.priceLabel}</span>
        <span className="text-sm text-muted-foreground">/pack</span>
      </div>

      {/* Image count */}
      <p className="mt-1 text-center text-sm text-muted-foreground">
        {tierInfo.imageCount} HD headshots
      </p>

      {/* Delivery time */}
      <div className="mt-2 flex items-center justify-center gap-1 text-xs text-muted-foreground">
        <Clock className="h-3 w-3" />
        <span>{tierInfo.estimatedTime} · {tierInfo.resolution}</span>
      </div>

      {/* Features */}
      <ul className="my-4 space-y-1.5 flex-1">
        {tierInfo.features.slice(0, 4).map((feature, i) => (
          <li key={i} className="flex items-start gap-2 text-sm">
            <Check className="h-4 w-4 text-primary mt-0.5 shrink-0" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      {/* CTA Button */}
      <button
        onClick={handlePurchase}
        disabled={loading}
        className={`w-full py-3 px-4 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 transition-opacity disabled:opacity-50 ${
          highlight
            ? 'bg-primary text-primary-foreground hover:opacity-90'
            : 'bg-secondary text-secondary-foreground hover:opacity-80'
        }`}
      >
        {loading ? (
          <><Loader2 className="h-4 w-4 animate-spin" /> Processing...</>
        ) : (
          `Get ${tierInfo.name} — ${tierInfo.priceLabel}`
        )}
      </button>
    </div>
  );
}

export default function PackDetail({ params }: { params: { slug: string } }) {
  const pack = allPacks[params.slug];
  const router = useRouter();
  if (!pack) {
    router.replace('/templates'); return null;
  }

  const tierList: TierInfo[] = [TIERS.starter, TIERS.professional, TIERS.executive];

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center">
          <Link href="/templates" className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1">
            <ArrowLeft className="h-4 w-4" />
            Back to Styles
          </Link>
        </div>
      </header>

      <main className="flex-1">
        {/* Title + Steps indicator */}
        <div className="text-center mt-6">
          <h1 className="text-3xl font-bold">{pack.title}</h1>
          <p className="text-muted-foreground mt-1">{pack.desc}</p>
        </div>

        {/* Description */}
        <div className="max-w-2xl mx-auto px-4 mt-4">
          <p className="text-center text-muted-foreground">{pack.longDesc}</p>
        </div>

        {/* Steps */}
        <div className="flex justify-center mt-6 mb-8">
          <ul className="flex gap-8 text-sm">
            <li className="text-primary font-semibold"><span className="bg-primary text-white rounded-full w-6 h-6 inline-flex items-center justify-center mr-1 text-xs">1</span> Choose plan</li>
            <li className="text-gray-400"><span className="bg-gray-200 text-gray-500 rounded-full w-6 h-6 inline-flex items-center justify-center mr-1 text-xs">2</span> Upload images</li>
            <li className="text-gray-400"><span className="bg-gray-200 text-gray-500 rounded-full w-6 h-6 inline-flex items-center justify-center mr-1 text-xs">3</span> AI processing</li>
          </ul>
        </div>

        {/* Three Tier Cards */}
        <div className="max-w-5xl mx-auto px-4 pb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {tierList.map((tierInfo) => (
              <TierPricingCard
                key={tierInfo.tier}
                tierInfo={tierInfo}
                packSlug={params.slug}
                highlight={tierInfo.tier === 'professional'}
              />
            ))}
          </div>

          {/* Trust line */}
          <div className="flex items-center justify-center gap-4 mt-6 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Shield className="h-4 w-4 text-primary" />
              14-day money-back guarantee
            </span>
            <span className="flex items-center gap-1">
              <Check className="h-4 w-4 text-primary" />
              Commercial license
            </span>
          </div>
        </div>

        {/* Preview Images Grid */}
        <div className="py-12 bg-gray-50 mt-8">
          <div className="max-w-5xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-center mb-8">Preview Images</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {(() => {
                const prefix = {'image-shots': 'talya-maor'}[params.slug] || params.slug;
                const imgs = [];
                for (let i = 1; i <= 12; i++) {
                  imgs.push(`/packs/${prefix}_${i}.jpg`);
                }
                return imgs.map((src, i) => (
                  <div key={i} className="rounded-xl overflow-hidden shadow-sm">
                    <img
                      src={src}
                      alt={`Preview ${i + 1}`}
                      className="w-full aspect-[3/4] object-cover"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                ));
              })()}
            </div>
          </div>
        </div>

        {/* How it works */}
        <div className="max-w-3xl mx-auto px-4 py-12 border-t mt-8">
          <h2 className="text-2xl font-bold mb-6">How does it work?</h2>
          <ol className="space-y-4 text-gray-600 list-decimal list-inside">
            <li>Choose your plan above</li>
            <li>Upload your training images following the guidelines</li>
            <li>Our AI processes your images and creates your headshots (~30 minutes). You will receive your professional headshots as shown in the preview images.</li>
          </ol>
        </div>
      </main>
    </div>
  );
}
