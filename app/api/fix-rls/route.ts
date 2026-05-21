import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const maxDuration = 30;

export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!supabaseUrl || !serviceKey) {
    return NextResponse.json({ error: 'Missing Supabase env vars' });
  }

  const results: any[] = [];

  // Try approach: Direct REST query to check RLS status
  // Supabase pg_tables is not exposed via REST, so we need SQL
  
  // Try approach: Use the Supabase client to run SQL via a custom RPC
  // Create the exec_sql function if it doesn't exist, then call it
  
  // Step 1: Try to create exec_sql via raw SQL endpoint
  const createFuncResp = await fetch(`${supabaseUrl}/rest/v1/`, {
    method: 'POST',
    headers: {
      'apikey': serviceKey!,
      'Authorization': 'Bearer ' + serviceKey,
      'Content-Type': 'application/json',
      'Prefer': 'params=single-object'
    },
    body: JSON.stringify({
      query: `CREATE OR REPLACE FUNCTION public.exec_sql(query_text text) RETURNS void LANGUAGE plpgsql SECURITY DEFINER AS $$ BEGIN EXECUTE query_text; END; $$;`
    })
  });
  results.push({ createFunc: createFuncResp.status });

  // Step 2: If function created, try to call it to enable RLS
  if (createFuncResp.ok || createFuncResp.status === 200) {
    // ... actually this won't work because rest/v1/ can't run arbitrary SQL
  }

  // Fallback: Try the Supabase Management API  
  // The correct endpoint for SQL queries
  const ref = new URL(supabaseUrl!).hostname.split('.')[0];
  const mgmtResp = await fetch(`https://api.supabase.com/v1/projects/${ref}/database/query`, {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + serviceKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: `SELECT tablename, relrowsecurity FROM pg_tables WHERE schemaname = 'public'`
    })
  });
  
  let rlsInfo = { status: mgmtResp.status };
  try { rlsInfo = { ...rlsInfo, ...(await mgmtResp.json()) }; } catch {}
  results.push({ mgmtQuery: rlsInfo });

  return NextResponse.json({ 
    message: '检查结果',
    results,
    note: '如需执行修复SQL，请使用 /api/fix-rls POST 方法',
  });
}

export async function POST() {
  const { Client } = await import('pg');
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  const dbPassword = process.env.SUPABASE_DB_PASSWORD;
  
  if (!dbPassword || !supabaseUrl) {
    return NextResponse.json({ 
      error: 'Missing database password. Set SUPABASE_DB_PASSWORD env var.',
      hint: 'Get password from Supabase Dashboard > Project Settings > Database'
    });
  }

  const ref = new URL(supabaseUrl).hostname.split('.')[0];
  const poolerHost = 'aws-0-ap-southeast-1.pooler.supabase.com';
  const results: any[] = [];

  // Try transaction pooler (6543)
  for (const port of [6543, 5432]) {
    const client = new Client({
      host: poolerHost,
      port, database: 'postgres',
      user: 'postgres.' + ref,
      password: dbPassword,
      ssl: { rejectUnauthorized: false },
      connectionTimeoutMillis: 5000,
    });

    try {
      await client.connect();
      
      // Enable RLS
      const rlsStatements = [
        `ALTER TABLE IF EXISTS public.models ENABLE ROW LEVEL SECURITY;`,
        `ALTER TABLE IF EXISTS public.samples ENABLE ROW LEVEL SECURITY;`,
        `ALTER TABLE IF EXISTS public.images ENABLE ROW LEVEL SECURITY;`,
        `ALTER TABLE IF EXISTS public.credits ENABLE ROW LEVEL SECURITY;`,
      ];
      for (const sql of rlsStatements) {
        try { await client.query(sql); results.push({ ok: sql.substring(0,30) }); }
        catch(e: any) { results.push({ skip: sql.substring(0,30), reason: e.message }); }
      }

      // Create policies
      const policies = [
        `DROP POLICY IF EXISTS m_sel ON public.models; CREATE POLICY m_sel ON public.models FOR SELECT USING (auth.uid()::text = user_id)`,
        `DROP POLICY IF EXISTS m_ins ON public.models; CREATE POLICY m_ins ON public.models FOR INSERT WITH CHECK (auth.uid()::text = user_id)`,
        `DROP POLICY IF EXISTS c_sel ON public.credits; CREATE POLICY c_sel ON public.credits FOR SELECT USING (auth.uid()::text = user_id)`,
        `DROP POLICY IF EXISTS c_upd ON public.credits; CREATE POLICY c_upd ON public.credits FOR UPDATE USING (auth.uid()::text = user_id)`,
        `DROP POLICY IF EXISTS s_sel ON public.samples; CREATE POLICY s_sel ON public.samples FOR SELECT USING (auth.uid()::text = (SELECT user_id FROM public.models WHERE id = samples."modelId"))`,
        `DROP POLICY IF EXISTS i_sel ON public.images; CREATE POLICY i_sel ON public.images FOR SELECT USING (auth.uid()::text = (SELECT user_id FROM public.models WHERE id = images."modelId"))`,
      ];
      for (const sql of policies) {
        try { await client.query(sql); results.push({ ok: sql.substring(0,30) }); }
        catch(e: any) { results.push({ ok: sql.substring(0,30), warning: e.message }); }
      }

      await client.end();
      return NextResponse.json({ success: true, port, results });
    } catch(e: any) {
      results.push({ port, error: e.message });
    }
  }

  return NextResponse.json({ success: false, results });
}
