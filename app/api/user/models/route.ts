import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
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

    // Optional status filter query param
    const { searchParams } = new URL(req.url);
    const statusFilter = searchParams.get('status');

    // Build query
    let query = supabase
      .from('models')
      .select('id, name, type, status, modelId, tier, images_generated, total_images, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (statusFilter) {
      query = query.eq('status', statusFilter);
    }

    const { data, error } = await query;

    if (error) {
      console.error('[models] Query error:', error);
      return NextResponse.json({ error: 'server_error' }, { status: 500 });
    }

    return NextResponse.json({ models: data || [] });
  } catch (e) {
    console.error('[models] Unexpected error:', e);
    return NextResponse.json({ error: 'server_error' }, { status: 500 });
  }
}
