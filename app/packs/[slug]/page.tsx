"use client";

import Link from "next/link";
// import PurchaseButton from "@/components/PurchaseButton";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

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
  'amichai-ai': {
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

function GenderCard({ title, img, count, price, packSlug, gender }: {
  title: string; img: string; count: number; price: string; packSlug: string; gender: string;
}) {
  return (
    <div className="card shadow-sm max-w-xs overflow-hidden bg-white rounded-2xl">
      <figure>
        <img
          src={`/packs/${img}`}
          alt={title}
          className="w-full max-h-80 object-cover"
          onError={(e) => { (e.target as HTMLImageElement).src = `/packs/${packSlug}_1.webp`; }}
        />
      </figure>
      <div className="p-4">
        <h5 className="text-lg font-semibold">{title}</h5>
        <div className="flex justify-between items-center mt-3">
          <span className="text-sm text-gray-500">{count} images</span>
          <span className="text-lg font-bold">{price}</span>
        </div>
        <div className="mt-3">
          {/* <PurchaseButton packSlug={packSlug} /> */}
        </div>
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

        <div className="max-w-3xl mx-auto px-4 py-8">
          {/* Steps */}
          <div className="flex justify-center mb-8">
            <ul className="flex gap-8 text-sm">
              <li className="text-primary font-semibold"><span className="bg-primary text-white rounded-full w-6 h-6 inline-flex items-center justify-center mr-1 text-xs">1</span> Select type</li>
              <li className="text-gray-400"><span className="bg-gray-200 text-gray-500 rounded-full w-6 h-6 inline-flex items-center justify-center mr-1 text-xs">2</span> Upload images</li>
              <li className="text-gray-400"><span className="bg-gray-200 text-gray-500 rounded-full w-6 h-6 inline-flex items-center justify-center mr-1 text-xs">3</span> AI processing</li>
            </ul>
          </div>

          {/* Gender selection cards */}
          <div className="flex flex-wrap justify-center gap-6">
            <GenderCard
              title="Woman"
              img={pack.womanImg}
              count={pack.womanCount}
              price="$29"
              packSlug={params.slug}
              gender="woman"
            />
            <GenderCard
              title="Man"
              img={pack.manImg}
              count={pack.manCount}
              price="$29"
              packSlug={params.slug}
              gender="man"
            />
          </div>
        </div>

        {/* Preview Images Grid */}
        <div className="py-12 bg-gray-50 mt-8">
          <div className="max-w-5xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-center mb-8">Preview Images</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {(() => {
                const prefix = {'amichai-ai': 'styled-for-success', 'image-shots': 'talya-maor'}[params.slug] || params.slug;
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

        {/* FAQ */}
        <div className="max-w-3xl mx-auto px-4 py-12 border-t mt-8">
          <h2 className="text-2xl font-bold mb-6">How does it work?</h2>
          <ol className="space-y-4 text-gray-600 list-decimal list-inside">
            <li>Select the type of images you would like to buy from above</li>
            <li>Upload your training images following the guideline</li>
            <li>Our system processes your images and creates an AI model (~30 minutes). Using the new AI model, a set of predefined headshots will be created for you as shown in the preview images.</li>
          </ol>
        </div>
      </main>
    </div>
  );
}
