-- ============================================
-- 训练进度追踪 & 幂等保护 迁移脚本
-- 执行方式：Supabase Dashboard → SQL Editor → 粘贴执行
-- ============================================

-- 1. models 表：加进度字段
ALTER TABLE models 
ADD COLUMN IF NOT EXISTS images_generated INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS total_images INTEGER DEFAULT 0;

-- 2. images 表：清理已有重复（保留最早的记录）
DELETE FROM images 
WHERE id NOT IN (
  SELECT MIN(id) FROM images GROUP BY "modelId", uri
);

-- 3. images 表：加唯一约束（防重复写入）
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE lower(conname) = 'images_modelid_uri_key' 
    AND conrelid = 'images'::regclass
  ) THEN
    ALTER TABLE images ADD CONSTRAINT images_modelId_uri_key UNIQUE ("modelId", uri);
  END IF;
END $$;

-- 验证
SELECT 'Migration complete: models has images_generated/total_images, images has unique constraint' AS result;
