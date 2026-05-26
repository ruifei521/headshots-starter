// 构建时环境变量可能不存在，提供安全的 fallback 默认值
export const config = {
  packQueryType: (process.env.PACK_QUERY_TYPE || 'both') as 'users' | 'gallery' | 'both',
  tuneType: (process.env.NEXT_PUBLIC_TUNE_TYPE || 'packs') as 'packs' | 'tune',
  stripeEnabled: process.env.NEXT_PUBLIC_STRIPE_IS_ENABLED === 'true',
  deploymentUrl: process.env.DEPLOYMENT_URL || '',
} as const;

function isVercelPreviewUrl(url: string): boolean {
  return url.includes('.vercel.app') &&
    (url.includes('-git-') ||
     url.match(/-[a-f0-9]{8,}\.vercel\.app/i) !== null);
}

export function validateConfig() {
  const validPackQueryTypes = ['users', 'gallery', 'both'];
  const validTuneTypes = ['packs', 'tune'];

  if (!validPackQueryTypes.includes(config.packQueryType)) {
    console.warn(`Invalid PACK_QUERY_TYPE: ${config.packQueryType}, falling back to 'both'`);
  }

  if (!validTuneTypes.includes(config.tuneType)) {
    console.warn(`Invalid NEXT_PUBLIC_TUNE_TYPE: ${config.tuneType}, falling back to 'packs'`);
  }

  // Deployment URL 验证（仅当 URL 存在时检查）
  if (config.deploymentUrl && isVercelPreviewUrl(config.deploymentUrl)) {
    console.warn(
      'Invalid DEPLOYMENT_URL: Preview URLs cannot be used for webhooks.\n' +
      'Please use either:\n' +
      '1. Your production domain (e.g., your-app.com)\n' +
      '2. For local development, use ngrok (e.g., your-tunnel.ngrok.io)'
    );
  }
}


