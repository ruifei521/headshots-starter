// ============================================
// lib/app-config.ts — 应用级配置常量
// 社会化证明、保障卡片、上传常量统一管理
// ============================================

export const APP_CONFIG = {
  // 上传配置
  upload: {
    minImages: 3,
    maxImages: 10,
    maxTotalSize: 4.5 * 1024 * 1024, // 4.5MB
    acceptedFormats: ['image/png', 'image/jpeg'] as const,
    acceptedExtensions: ['.png', '.jpg', '.jpeg'] as const,
  },

  // 社会化证明（静态配置，后续可接 API）
  socialProof: {
    trustpilotRating: 4.8,
    trustpilotReviews: 1234,
    customersServed: 196987,
    headshotsGenerated: 2000000,
    testimonials: [
      {
        name: 'Sarah J.',
        role: 'Marketing Manager',
        text: 'My LinkedIn profile has never looked better. Got the job!',
        rating: 5,
      },
      {
        name: 'Michael T.',
        role: 'Software Engineer',
        text: 'Way better than spending $200 on a photographer. Took 25 minutes.',
        rating: 5,
      },
      {
        name: 'Emily R.',
        role: 'Real Estate Agent',
        text: 'My clients always comment on my professional photos. Game changer.',
        rating: 5,
      },
    ],
  },

  // 保障卡片
  guarantees: [
    {
      title: '14-Day Money Back',
      description: 'Not satisfied? Full refund within 14 days, no questions asked.',
      icon: 'ShieldCheck',
    },
    {
      title: 'Privacy Protected',
      description: 'Your photos are auto-deleted after 7 days. Headshots deleted after 30 days.',
      icon: 'Lock',
    },
    {
      title: 'Commercial License',
      description: 'Use your headshots anywhere — LinkedIn, resumes, websites, and more.',
      icon: 'Briefcase',
    },
  ],

  // 锚定定价文案
  pricing: {
    anchorCopy: 'Save 8x vs. $232 traditional photoshoot',
    currency: 'USD',
    guaranteeText: '14-day money-back guarantee',
  },
} as const;
