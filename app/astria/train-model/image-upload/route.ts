import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import { Database } from '@/types/supabase';
import { logger } from "@/lib/logger";

export const dynamic = 'force-dynamic';

// Allowed MIME types (extension fallback for browsers that omit HEIC/WEBP type)
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/heic', 'image/heif', 'image/webp'];
const ALLOWED_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.webp', '.heic', '.heif'];
const EXT_TO_MIME: Record<string, string> = {
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.heic': 'image/heic',
  '.heif': 'image/heif',
};

function resolveImageContentType(file: File): string | null {
  if (ALLOWED_TYPES.includes(file.type)) return file.type;
  const ext = '.' + (file.name.split('.').pop()?.toLowerCase() ?? '');
  return ALLOWED_EXTENSIONS.includes(ext) ? EXT_TO_MIME[ext] ?? null : null;
}
// Maximum file size (120MB)
const MAX_FILE_SIZE = 120 * 1024 * 1024;

export async function POST(request: Request): Promise<NextResponse> {
  // ✅ 鉴权：必须登录
  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          // Next.js App Router: read cookies from Request
          const cookieHeader = request.headers.get('cookie') || '';
          if (!cookieHeader) return [];
          return cookieHeader.split(';').map(c => {
            const [name, ...rest] = c.trim().split('=');
            return { name, value: rest.join('=') };
          });
        },
        setAll() {},
      },
    }
  );

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Use service_role key ONLY after auth check, for storage upload
  const { createClient } = await import('@supabase/supabase-js');
  const adminSupabase = createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: { autoRefreshToken: false, persistSession: false },
    }
  );

  try {
    const formData = await request.formData();

    const file = formData.get('file') as File | null;
    const fileName = formData.get('fileName') as string | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const contentType = resolveImageContentType(file);
    if (!contentType) {
      return NextResponse.json(
        { error: `File type "${file.type || 'unknown'}" is not allowed. Only PNG, JPG, HEIC, and WEBP are accepted.` },
        { status: 400 }
      );
    }

    // Server-side file size validation
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: `File size ${(file.size / 1024 / 1024).toFixed(2)}MB exceeds the 120MB limit.` },
        { status: 400 }
      );
    }

    // Generate unique path: uploads/{userId}/{timestamp}-{sanitizedName}
    const timestamp = Date.now();
    const sanitized = (fileName || file.name).replace(/[^a-zA-Z0-9._-]/g, '_');
    const filePath = `uploads/${user.id}/${timestamp}-${sanitized}`;

    // Upload to Supabase Storage 'headshots' bucket
    const { data, error } = await adminSupabase.storage
      .from('headshots')
      .upload(filePath, file, {
        contentType,
        upsert: false,
      });

    if (error) {
      logger.error('Storage upload error:', error);
      return NextResponse.json(
        { error: `Upload failed: ${error.message}` },
        { status: 500 }
      );
    }

    // Get public URL
    const { data: urlData } = adminSupabase.storage
      .from('headshots')
      .getPublicUrl(filePath);

    const publicUrl = urlData.publicUrl;

    // ⭐ 验证 URL 是否可访问（bucket 必须是 public）
    try {
      const headRes = await fetch(publicUrl, { method: 'HEAD', signal: AbortSignal.timeout(5000) });
      if (!headRes.ok) {
        logger.error(`Uploaded file not accessible: HEAD ${headRes.status} for ${publicUrl}`);
        // 尝试删除上传的文件，避免垃圾堆积
        await adminSupabase.storage.from('headshots').remove([filePath]);
        return NextResponse.json(
          {
            error: `Storage bucket "headshots" is not public. Astria cannot download your photos. Please make the bucket public in Supabase dashboard → Storage → headshots → Configuration → Public bucket.`,
          },
          { status: 500 }
        );
      }
    } catch (verifyError) {
      logger.warn('URL accessibility check failed (non-blocking):', verifyError);
      // 验证失败不阻塞，继续返回 URL（可能是网络瞬态问题）
    }

    return NextResponse.json({
      url: publicUrl,
      path: data.path,
    });
  } catch (error) {
    logger.error('Upload error:', error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
