import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const modelId = searchParams.get('modelId');

    // Validate required param
    if (!modelId) {
      return NextResponse.json({ error: 'missing_modelId' }, { status: 400 });
    }

    const modelIdNum = parseInt(modelId, 10);
    if (isNaN(modelIdNum)) {
      return NextResponse.json({ error: 'invalid_modelId' }, { status: 400 });
    }

    // Authenticate via server client
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() { return req.cookies.getAll(); },
          setAll() {},
        },
      }
    );

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
    }

    // Query the model, must belong to current user
    const { data, error } = await supabase
      .from('models')
      .select('status, images_generated, total_images, name, user_id')
      .eq('id', modelIdNum)
      .maybeSingle();

    if (error) {
      console.error('[astria/status] Query error:', error);
      return NextResponse.json({ error: 'server_error' }, { status: 500 });
    }

    if (!data) {
      return NextResponse.json({ error: 'not_found' }, { status: 404 });
    }

    // Authorization check: model must belong to the authenticated user
    if (data.user_id !== user.id) {
      return NextResponse.json({ error: 'forbidden' }, { status: 403 });
    }

    return NextResponse.json({
      status: data.status,
      images_generated: data.images_generated,
      total_images: data.total_images,
      name: data.name,
    });
  } catch (e) {
    console.error('[astria/status] Unexpected error:', e);
    return NextResponse.json({ error: 'server_error' }, { status: 500 });
  }
}
