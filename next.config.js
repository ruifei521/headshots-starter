/** @type {import("next").NextConfig} */
module.exports = {
  env: {
    PACK_QUERY_TYPE: 'both',
    NEXT_PUBLIC_TUNE_TYPE: 'packs',
  },

  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
          {
            key: 'Content-Security-Policy',
            value:
              "default-src 'self'; " +
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://vercel.live; " +
              "style-src 'self' 'unsafe-inline'; " +
              "img-src 'self' data: https: blob:; " +
              "font-src 'self'; " +
              "connect-src 'self' https://*.supabase.co https://vitals.vercel-insights.com; " +
              "frame-src 'none';",
          },
        ],
      },
      {
        source: "/_next/image",
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      {
        source: "/images/:path*",
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
    ];
  },

  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      { protocol: 'https', hostname: '**.vercel-storage.com' },
      { protocol: 'https', hostname: '**.supabase.co' },
    ],
  },

  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
};
