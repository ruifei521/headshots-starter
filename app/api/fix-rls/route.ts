import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const maxDuration = 30;

export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!supabaseUrl || !serviceKey) {
    return NextResponse.json({ error: 'Missing Supabase credentials' }, { status: 500 });
  }

  const sql = `
    -- Enable RLS on all public tables
    ALTER TABLE IF EXISTS public.models ENABLE ROW LEVEL SECURITY;
    ALTER TABLE IF EXISTS public.samples ENABLE ROW LEVEL SECURITY;
    ALTER TABLE IF EXISTS public.images ENABLE ROW LEVEL SECURITY;
    ALTER TABLE IF EXISTS public.credits ENABLE ROW LEVEL SECURITY;

    -- Drop existing policies
    DROP POLICY IF EXISTS m_sel ON public.models;
    DROP POLICY IF EXISTS m_ins ON public.models;
    DROP POLICY IF EXISTS m_upd ON public.models;
    DROP POLICY IF EXISTS m_srv ON public.models;
    DROP POLICY IF EXISTS c_sel ON public.credits;
    DROP POLICY IF EXISTS c_upd ON public.credits;
    DROP POLICY IF EXISTS c_srv ON public.credits;
    DROP POLICY IF EXISTS s_sel ON public.samples;
    DROP POLICY IF EXISTS s_ins ON public.samples;
    DROP POLICY IF EXISTS i_sel ON public.images;
    DROP POLICY IF EXISTS i_ins ON public.images;

    -- Create policies for models
    CREATE POLICY m_sel ON public.models FOR SELECT USING (auth.uid()::text = user_id);
    CREATE POLICY m_ins ON public.models FOR INSERT WITH CHECK (auth.uid()::text = user_id);
    CREATE POLICY m_upd ON public.models FOR UPDATE USING (auth.uid()::text = user_id);
    CREATE POLICY m_srv ON public.models FOR ALL TO authenticated USING (auth.jwt()->>'role' = 'service_role') WITH CHECK (auth.jwt()->>'role' = 'service_role');

    -- Credentials
    CREATE POLICY c_sel ON public.credits FOR SELECT USING (auth.uid()::text = user_id);
    CREATE POLICY c_upd ON public.credits FOR UPDATE USING (auth.uid()::text = user_id);
    CREATE POLICY c_srv ON public.credits FOR ALL TO authenticated USING (auth.jwt()->>'role' = 'service_role') WITH CHECK (auth.jwt()->>'role' = 'service_role');

    -- Samples (join to models.user_id)
    CREATE POLICY s_sel ON public.samples FOR SELECT USING (auth.uid()::text = (SELECT user_id FROM public.models WHERE id = samples."modelId"));
    CREATE POLICY s_ins ON public.samples FOR INSERT WITH CHECK (auth.uid()::text = (SELECT user_id FROM public.models WHERE id = samples."modelId"));

    -- Images (join to models.user_id)
    CREATE POLICY i_sel ON public.images FOR SELECT USING (auth.uid()::text = (SELECT user_id FROM public.models WHERE id = images."modelId"));
    CREATE POLICY i_ins ON public.images FOR INSERT WITH CHECK (auth.uid()::text = (SELECT user_id FROM public.models WHERE id = images."modelId"));
  `;

  // Split SQL by semicolons and execute each statement
  const statements = sql.split(';').filter(s => s.trim().length > 0);
  const results: any[] = [];
  
  for (const stmt of statements) {
    try {
      const supabase = createClient(supabaseUrl, serviceKey);
      // Note: We need to use raw SQL via a pre-existing function
      // Since we can't run raw SQL via the client, 
      // this endpoint will serve as a reference
      results.push({ sql: stmt.substring(0, 40), error: 'Need direct SQL access' });
    } catch (e: any) {
      results.push({ sql: stmt.substring(0, 40), error: e.message });
    }
  }

  return NextResponse.json({ 
    note: 'Cannot run raw SQL via Supabase REST API. Manual SQL execution required.',
    sql_to_run: sql
  });
}
