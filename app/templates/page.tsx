import Link from 'next/link';

const professionalPacks = [
  { slug: 'corporate-headshots', title: 'Corporate Headshots', desc: 'Formal Business', img: 'corporate-headshots_1.jpg' },
  { slug: 'partners-headshots', title: "Partner's Headshots", desc: 'Legal Professional', img: 'partners-headshots_1.jpg' },
  { slug: 'speaker', title: 'Speaker', desc: 'Public Speaking', img: 'speaker_1.jpg' },
  { slug: 'realtor', title: 'Realtor', desc: 'Real Estate', img: 'realtor_1.jpg' },
  { slug: 'styled-for-success', title: 'Styled for Success', desc: 'Modern Professional', img: 'styled-for-success_1.jpg' },
  { slug: 'lawyer-il', title: 'Lawyer Headshots', desc: 'Legal Professional', img: 'lawyer-il_1.jpg' },
];

const morePacks = [
  { slug: 'talya-maor', title: 'Image shots - Talya Maor', desc: 'Branding Photography', img: 'talya-maor_1.jpg' },
  { slug: 'natural-headshots', title: 'Natural Looks', desc: 'Natural & Approachable', img: 'natural-headshots_1.jpg' },
  { slug: 'business-profile-studio', title: 'Business Profile - Studio', desc: 'Studio Photography', img: 'business-profile-studio_1.jpg' },
  { slug: 'effortless-professionalism', title: 'Effortless Professionalism', desc: 'Casual Professional', img: 'effortless-professionalism_1.jpg' },
  { slug: 'office-outfits', title: 'Office Outfits', desc: 'Office Fashion', img: 'office-outfits_1.jpg' },
  { slug: 'stylish-studio-portraits', title: 'Stylish Studio Portraits', desc: 'Studio Portrait Photography', img: 'stylish-studio-portraits_1.jpg' },
];

function PackCard({ pack }: { pack: typeof professionalPacks[0] }) {
  return (
    <Link
      href={`/packs/${pack.slug}.html`}
      className="block bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200 no-underline text-inherit"
    >
      <img
        src={`/packs/${pack.img}`}
        alt={pack.title}
        className="w-full aspect-[3/4] object-cover block"
        loading="lazy"
      />
      <div className="p-4">
        <h3 className="m-0 mb-1 text-lg font-semibold">{pack.title}</h3>
        <p className="m-0 text-gray-400 text-sm">{pack.desc}</p>
        <span className="inline-block mt-2.5 bg-blue-600 text-white px-4 py-1.5 rounded-full text-sm font-semibold">
          $29
        </span>
      </div>
    </Link>
  );
}

export const dynamic = 'force-dynamic';

export default function TemplatesPage() {
  return (
    <div className="max-w-[1100px] mx-auto px-4 py-6">
      <h1 className="text-center text-2xl font-bold text-gray-900 mb-2">🎯 Choose Your Style</h1>
      <p className="text-center text-gray-500 mb-6">Browse all available styles below</p>

      {/* Professional Styles */}
      <div className="mb-10">
        <h2 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
          <span className="w-1 h-5 bg-blue-600 rounded-full inline-block"></span>
          Professional Styles
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {professionalPacks.map((pack) => (
            <PackCard key={pack.slug} pack={pack} />
          ))}
        </div>
      </div>

      {/* More Styles */}
      <div>
        <h2 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
          <span className="w-1 h-5 bg-gray-300 rounded-full inline-block"></span>
          More Styles
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {morePacks.map((pack) => (
            <PackCard key={pack.slug} pack={pack} />
          ))}
        </div>
      </div>
    </div>
  );
}
