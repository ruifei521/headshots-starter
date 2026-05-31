#!/bin/bash
# ============================================================
# SnapProHead 网站完整备份脚本
# 用途：一键备份网站代码、数据库、环境变量
# 恢复：使用 restore.sh 脚本
# ============================================================

set -e

BACKUP_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(cd "$BACKUP_DIR/.." && pwd)"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_NAME="snapprohead_backup_${TIMESTAMP}"
BACKUP_PATH="${BACKUP_DIR}/${BACKUP_NAME}"
SUPABASE_URL="https://vgrqvwhkvnqsawlwywld.supabase.co"
SUPABASE_SERVICE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZncnF2d2hrdm5xc2F3bHd5d2xkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NzgzNzc1NSwiZXhwIjoyMDkzNDEzNzU1fQ._jtlkKJz25BhWzLlD5Smgx1h22WbHTgIl8JaGcf-i0s"

echo "=============================================="
echo "  SnapProHead 网站完整备份"
echo "  备份时间: $(date)"
echo "=============================================="
echo ""

# 创建备份目录
mkdir -p "$BACKUP_PATH"
echo "[1/5] 创建备份目录: $BACKUP_PATH"

# --- 步骤2: 备份 Git 代码（当前 commit） ---
echo ""
echo "[2/5] 备份 Git 代码..."
cd "$PROJECT_DIR"
git log -1 --format="%H%n%an%n%ae%n%ai%n%s" > "$BACKUP_PATH/git_commit.txt"
git diff HEAD > "$BACKUP_PATH/git_uncommitted.diff" 2>/dev/null || true
# 打包源代码（不含 node_modules、.next、backups）
tar --exclude='node_modules' --exclude='.next' --exclude='backups' --exclude='.git' \
    -czf "$BACKUP_PATH/source_code.tar.gz" -C "$PROJECT_DIR" .
echo "  Git commit: $(head -1 "$BACKUP_PATH/git_commit.txt")"
echo "  源码包: source_code.tar.gz"

# --- 步骤3: 备份环境变量 ---
echo ""
echo "[3/5] 备份环境变量..."
# 从 .env.prod 复制（包含生产环境变量）
if [ -f "$PROJECT_DIR/.env.prod" ]; then
    cp "$PROJECT_DIR/.env.prod" "$BACKUP_PATH/env_prod.txt"
    echo "  .env.prod -> env_prod.txt"
fi
if [ -f "$PROJECT_DIR/.env.local" ]; then
    cp "$PROJECT_DIR/.env.local" "$BACKUP_PATH/env_local.txt"
    echo "  .env.local -> env_local.txt"
fi
# 同时保存 Vercel 环境变量（通过 Vercel CLI，如果已安装）
if command -v vercel &> /dev/null; then
    vercel env ls --yes > "$BACKUP_PATH/vercel_env_list.txt" 2>/dev/null || true
    echo "  Vercel env list saved"
fi

# --- 步骤4: 备份 Supabase 数据库 ---
echo ""
echo "[4/5] 备份 Supabase 数据库..."

# 使用 Supabase CLI 备份（如果已安装）
if command -v supabase &> /dev/null; then
    supabase db dump --db-url "$SUPABASE_URL" > "$BACKUP_PATH/supabase_dump.sql" 2>/dev/null || true
    echo "  Supabase dump saved to supabase_dump.sql"
else
    echo "  ⚠ Supabase CLI 未安装，跳过数据库 dump"
    echo "  请手动运行: supabase db dump > supabase_dump.sql"
fi

# 备份重要数据表（通过 API）
echo "  备份数据表 via API..."
TABLES=("profiles" "images" "orders" "packs" "tunes" "reviews" "credits")
for table in "${TABLES[@]}"; do
    curl -s -X GET "$SUPABASE_URL/rest/v1/$table?select=*" \
        -H "apikey: $SUPABASE_SERVICE_KEY" \
        -H "Authorization: Bearer $SUPABASE_SERVICE_KEY" \
        -H "Prefer: return=representation" \
        -o "$BACKUP_PATH/table_${table}.json" 2>/dev/null || true
    # 检查文件是否非空
    if [ -s "$BACKUP_PATH/table_${table}.json" ]; then
        count=$(wc -l < "$BACKUP_PATH/table_${table}.json" 2>/dev/null || echo "0")
        echo "    $table -> table_${table}.json"
    else
        rm -f "$BACKUP_PATH/table_${table}.json"
        echo "    $table -> (empty, skipped)"
    fi
done

# --- 步骤5: 生成备份清单 ---
echo ""
echo "[5/5] 生成备份清单..."
cat > "$BACKUP_PATH/README.md" << 'EOF'
# SnapProHead 网站备份快照

## 备份信息
- **备份时间**: TIMESTAMP_PLACEHOLDER
- **Git Commit**: COMMIT_PLACEHOLDER
- **项目路径**: /c/Users/Administrator/WorkBuddy/2026-05-29-task-23/headshots-starter

## 文件说明
| 文件 | 说明 |
|------|------|
| `source_code.tar.gz` | 完整源代码（不含 node_modules/.next） |
| `git_commit.txt` | 备份时的 Git commit 信息 |
| `git_uncommitted.diff` | 未提交的改动（如有） |
| `env_prod.txt` | 生产环境变量（.env.prod） |
| `env_local.txt` | 本地环境变量（.env.local） |
| `supabase_dump.sql` | Supabase 数据库完整 dump（如有） |
| `table_*.json` | 各数据表的 JSON 导出 |
| `vercel_env_list.txt` | Vercel 环境变量列表 |

## 恢复方式
1. **代码恢复**: `tar -xzf source_code.tar.gz -C /path/to/restore`
2. **Git 恢复**: `git checkout COMMIT_HASH`
3. **数据库恢复**: `supabase db execute < supabase_dump.sql`
4. **环境变量**: 将 `env_prod.txt` 内容复制到 Vercel 环境变量

## 一键恢复
运行项目根目录的 `backups/restore.sh` 脚本：
```bash
cd /path/to/headshots-starter
bash backups/restore.sh backups/snapprohead_backup_YYYYMMDD_HHMMSS
```
EOF

# 替换占位符
sed -i "s/TIMESTAMP_PLACEHOLDER/$(date)/g" "$BACKUP_PATH/README.md"
sed -i "s/COMMIT_PLACEHOLDER/$(head -1 "$BACKUP_PATH/git_commit.txt")/g" "$BACKUP_PATH/README.md"

# --- 完成 ---
echo ""
echo "=============================================="
echo "  ✅ 备份完成！"
echo "  备份位置: $BACKUP_PATH"
echo "  备份大小: $(du -sh "$BACKUP_PATH" | cut -f1)"
echo "=============================================="
echo ""
echo "下一步："
echo "  1. 将备份目录同步到安全位置（如云盘/另一台电脑）"
echo "  2. 恢复时运行: bash $BACKUP_DIR/restore.sh $BACKUP_PATH"
echo ""
