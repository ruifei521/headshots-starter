"use client"; // v5 - male/female cover selection + single $29 price → direct checkout

import Link from "next/link";
import { ArrowLeft, Loader2, Shield, Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { TIERS } from "@/lib/tiers";

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

/** Cover card with gender label, cover image, price and direct checkout button */
function GenderCoverCard({ title, img, count, packSlug, gender }: {
  title: string; img: string; count: number; packSlug: string; gender: 'woman' | 'man';
}) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const starterTier = TIERS.starter;

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
        gender,
        tier: 'starter',
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
    <div className="group relative flex flex-col rounded-2xl border bg-white overflow-hidden shadow-sm transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 max-w-xs w-full">
      {/* Cover image */}
      <div className="relative overflow-hidden">
        <img
          src={`/packs/${img}`}
          alt={`${title} headshot preview`}
          className="w-full aspect-[3/4] object-cover transition-transform duration-300 group-hover:scale-105"
          onError={(e) => { (e.target as HTMLImageElement).src = `/packs/${packSlug}_1.webp`; }}
        />
        {/* Gender label overlay */}
        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/60 to-transparent px-4 pb-3 pt-8">
          <span className="text-white text-lg font-semibold">{title}</span>
          <span className="text-white/80 text-sm ml-2">{count} styles</span>
        </div>
      </div>

      {/* Price + CTA */}
      <div className="p-4 flex flex-col gap-3">
        <div className="flex items-baseline justify-center gap-2">
          <span className="text-muted-foreground line-through text-sm">${starterTier.originalPrice}</span>
          <span className="text-2xl font-extrabold">{starterTier.priceLabel}</span>
          <span className="text-sm text-muted-foreground">/pack</span>
        </div>
        <button
          onClick={handlePurchase}
          disabled={loading}
          className="w-full py-3 px-4 bg-primary text-primary-foreground rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading ? (
            <><Loader2 className="h-4 w-4 animate-spin" /> Processing...</>
          ) : (
            `Get Started — ${starterTier.priceLabel}`
          )}
        </button>
      </div>
    </div>
  );
}

export default function PackDetail({ params }: { params: { slug: string } }) {
  const pack = allPacks[params.slug];
  const router = useRouter();
  if (!pack) {
    router.replace('/templates'); return null;
  }

  const starterTier = TIERS.starter;

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
        {/* Title + Description */}
        <div className="text-center mt-8">
          <h1 className="text-3xl font-bold">{pack.title}</h1>
          <p className="text-muted-foreground mt-1">{pack.desc}</p>
        </div>

        <div className="max-w-2xl mx-auto px-4 mt-3">
          <p className="text-center text-muted-foreground">{pack.longDesc}</p>
        </div>

        {/* Steps indicator */}
        <div className="flex justify-center mt-6 mb-8">
          <ul className="flex gap-8 text-sm">
            <li className="text-primary font-semibold">
              <span className="bg-primary text-white rounded-full w-6 h-6 inline-flex items-center justify-center mr-1 text-xs">1</span>
              Select type
            </li>
            <li className="text-gray-400">
              <span className="bg-gray-200 text-gray-500 rounded-full w-6 h-6 inline-flex items-center justify-center mr-1 text-xs">2</span>
              Upload images
            </li>
            <li className="text-gray-400">
              <span className="bg-gray-200 text-gray-500 rounded-full w-6 h-6 inline-flex items-center justify-center mr-1 text-xs">3</span>
              AI processing
            </li>
          </ul>
        </div>

        {/* Gender selection cover cards */}
        <div className="max-w-3xl mx-auto px-4 pb-4">
          <div className="flex flex-wrap justify-center gap-8">
            <GenderCoverCard
              title="Woman"
              img={pack.womanImg}
              count={pack.womanCount}
              packSlug={params.slug}
              gender="woman"
            />
            <GenderCoverCard
              title="Man"
              img={pack.manImg}
              count={pack.manCount}
              packSlug={params.slug}
              gender="man"
            />
          </div>

          {/* Trust line */}
          <div className="flex items-center justify-center gap-6 mt-6 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Shield className="h-4 w-4 text-primary" />
              14-day money-back guarantee
            </span>
            <span className="flex items-center gap-1">
              <Check className="h-4 w-4 text-primary" />
              Commercial license
            </span>
          </div>

          {/* What you get */}
          <div className="max-w-md mx-auto mt-6 p-4 rounded-xl bg-gray-50 border">
            <h3 className="font-semibold text-center mb-3">What you get for {starterTier.priceLabel}</h3>
            <ul className="space-y-2">
              {starterTier.features.slice(0, 4).map((feature, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <Check className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
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
            <li>Select the type of images you would like (Woman or Man)</li>
            <li>Upload your training images following the guidelines</li>
            <li>Our AI processes your images and creates your headshots (~30 minutes). You will receive your professional headshots as shown in the preview images.</li>
          </ol>
        </div>
      </main>
    </div>
  );
}
