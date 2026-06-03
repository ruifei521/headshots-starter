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

    // Query credits table for this user
    const { data, error } = await supabase
      .from('credits')
      .select('credits, tier')
      .eq('user_id', user.id)
      .maybeSingle();

    if (error) {
      console.error('[credits] Query error:', error);
      return NextResponse.json({ error: 'server_error' }, { status: 500 });
    }

    // No row found — return defaults
    if (!data) {
      return NextResponse.json({ credits: 0, tier: 'starter' });
    }

    return NextResponse.json({ credits: data.credits, tier: data.tier });
  } catch (e) {
    console.error('[credits] Unexpected error:', e);
    return NextResponse.json({ error: 'server_error' }, { status: 500 });
  }
}
