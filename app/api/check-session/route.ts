import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
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
    
    return NextResponse.json({
      authenticated: !!user,
      userId: user?.id || null,
      email: user?.email || null,
    });
  } catch (e) {
    return NextResponse.json({ authenticated: false, error: 'Session check failed' });
  }
}
