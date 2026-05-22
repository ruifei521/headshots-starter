import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  // Output SQL that needs to be run in Supabase Dashboard
  const sql = `-- ==========================================
-- SnapProHead RLS 修复 SQL
-- 在 Supabase Dashboard -> SQL Editor 中执行
-- ==========================================

-- 1. 启用所有公开表的行级安全
ALTER TABLE IF EXISTS public.models ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.samples ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.images ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.credits ENABLE ROW LEVEL SECURITY;

-- 2. 删除旧策略（如果有）
DROP POLICY IF EXISTS m_sel ON public.models;
DROP POLICY IF EXISTS m_ins ON public.models;
DROP POLICY IF EXISTS m_upd ON public.models;
DROP POLICY IF EXISTS c_sel ON public.credits;
DROP POLICY IF EXISTS c_upd ON public.credits;
DROP POLICY IF EXISTS s_sel ON public.samples;
DROP POLICY IF EXISTS s_ins ON public.samples;
DROP POLICY IF EXISTS i_sel ON public.images;
DROP POLICY IF EXISTS i_ins ON public.images;

-- 3. 创建访问策略

-- models: 用户只能读/改自己的模型
CREATE POLICY m_sel ON public.models FOR SELECT USING (auth.uid()::text = user_id);
CREATE POLICY m_ins ON public.models FOR INSERT WITH CHECK (auth.uid()::text = user_id);
CREATE POLICY m_upd ON public.models FOR UPDATE USING (auth.uid()::text = user_id);

-- credits: 用户只能读/改自己的积分
CREATE POLICY c_sel ON public.credits FOR SELECT USING (auth.uid()::text = user_id);
CREATE POLICY c_upd ON public.credits FOR UPDATE USING (auth.uid()::text = user_id);

-- samples: 用户只能访问自己模型的样本
CREATE POLICY s_sel ON public.samples FOR SELECT USING (auth.uid()::text = (SELECT user_id FROM public.models WHERE id = samples."modelId"));
CREATE POLICY s_ins ON public.samples FOR INSERT WITH CHECK (auth.uid()::text = (SELECT user_id FROM public.models WHERE id = samples."modelId"));

-- images: 用户只能访问自己模型生成的图片
CREATE POLICY i_sel ON public.images FOR SELECT USING (auth.uid()::text = (SELECT user_id FROM public.models WHERE id = images."modelId"));
CREATE POLICY i_ins ON public.images FOR INSERT WITH CHECK (auth.uid()::text = (SELECT user_id FROM public.models WHERE id = images."modelId"));

-- 4. 验证 RLS 已启用
SELECT tablename, relrowsecurity FROM pg_tables WHERE schemaname = 'public';
`;

  return NextResponse.json({ 
    message: '请将下方 SQL 复制到 Supabase Dashboard SQL Editor 中执行',
    sql_editor_url: `https://supabase.com/dashboard/project/vgrqvwhkvnqsawlwywld/sql/new`,
    sql,
    steps: [
      '1. 打开 Supabase Dashboard → SQL Editor',
      '2. 粘贴上方 SQL',
      '3. 点击 "Run" 执行',
      '4. 完成后刷新 Advisors 页面确认'
    ]
  });
}
