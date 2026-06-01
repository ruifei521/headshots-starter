import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import { Database } from '@/types/supabase';

export const dynamic = 'force-dynamic';

// Allowed MIME types
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/heic', 'image/heif', 'image/webp'];
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
          const cookie = request.headers.get('cookie') || '';
          return cookie.split(';').map(c => {
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

    // Server-side file type validation
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: `File type "${file.type}" is not allowed. Only PNG, JPG, HEIC, and WEBP are accepted.` },
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
        contentType: file.type,
        upsert: false,
      });

    if (error) {
      console.error('Storage upload error:', error);
      return NextResponse.json(
        { error: `Upload failed: ${error.message}` },
        { status: 500 }
      );
    }

    // Get public URL
    const { data: urlData } = adminSupabase.storage
      .from('headshots')
      .getPublicUrl(filePath);

    return NextResponse.json({
      url: urlData.publicUrl,
      path: data.path,
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
