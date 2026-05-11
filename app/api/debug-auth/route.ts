import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const results: Record<string, unknown> = {};

  // 1. Check environment variables
  results.env = {
    hasUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    hasAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    hasServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    serviceKeyLength: process.env.SUPABASE_SERVICE_ROLE_KEY?.length || 0,
    url: process.env.NEXT_PUBLIC_SUPABASE_URL,
  };

  // 2. Try to list users with service role key
  if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
    try {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        { auth: { autoRefreshToken: false, persistSession: false } }
      );

      const { data, error } = await supabase.auth.admin.listUsers();
      if (error) {
        results.adminError = error.message;
      } else {
        results.users = data.users.map(u => ({
          email: u.email,
          created: u.created_at,
          confirmed: u.email_confirmed_at,
          lastSignIn: u.last_sign_in_at,
        }));
      }
    } catch (e) {
      results.adminException = (e as Error).message;
    }
  }

  // 3. Check GoTrue settings via internal API
  try {
    const settingsResp = await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/settings`,
      { headers: { apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY! } }
    );
    results.authSettings = await settingsResp.json();
  } catch (e) {
    results.settingsError = (e as Error).message;
  }

  // 4. Try Management API to get site_url (needs service role)
  try {
    const mgmtResp = await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/admin/config`,
      {
        headers: {
          apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
          Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
        },
      }
    );
    if (mgmtResp.ok) {
      results.gotrueConfig = await mgmtResp.json();
    } else {
      results.gotrueConfigError = `Status ${mgmtResp.status}`;
    }
  } catch (e) {
    results.gotrueConfigException = (e as Error).message;
  }

  return NextResponse.json(results, { status: 200 });
}
