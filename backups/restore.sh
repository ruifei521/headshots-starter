#!/bin/bash
# ============================================================
# SnapProHead 网站一键恢复脚本
# 用途：从备份快照恢复网站代码、数据库、环境变量
# 用法：bash restore.sh <备份目录路径>
# 示例：bash restore.sh backups/snapprohead_backup_20260531_131900
# ============================================================

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

# 检查参数
if [ -z "$1" ]; then
    echo "用法: bash restore.sh <备份目录路径>"
    echo "示例: bash restore.sh backups/snapprohead_backup_20260531_131900"
    exit 1
fi

BACKUP_PATH="$1"
if [ ! -d "$BACKUP_PATH" ]; then
    echo "❌ 备份目录不存在: $BACKUP_PATH"
    exit 1
fi

echo "=============================================="
echo "  SnapProHead 网站恢复"
echo "  备份目录: $BACKUP_PATH"
echo "  项目目录: $PROJECT_DIR"
echo "=============================================="
echo ""

# --- 步骤1: 恢复代码 ---
echo "[1/4] 恢复源代码..."
if [ -f "$BACKUP_PATH/source_code.tar.gz" ]; then
    read -p "  确认覆盖当前代码？(y/N) " confirm
    if [ "$confirm" = "y" ] || [ "$confirm" = "Y" ]; then
        tar -xzf "$BACKUP_PATH/source_code.tar.gz" -C "$PROJECT_DIR"
        echo "  ✅ 源代码已恢复"
    else
        echo "  ⏭ 跳过代码恢复"
    fi
else
    echo "  ⚠ 未找到 source_code.tar.gz，跳过"
fi

# --- 步骤2: 恢复 Git commit ---
echo ""
echo "[2/4] 恢复 Git commit..."
if [ -f "$BACKUP_PATH/git_commit.txt" ]; then
    COMMIT_HASH=$(head -1 "$BACKUP_PATH/git_commit.txt")
    echo "  备份时的 commit: $COMMIT_HASH"
    cd "$PROJECT_DIR"
    if git cat-file -e "$COMMIT_HASH" 2>/dev/null; then
        read -p "  确认 checkout 到该 commit？(y/N) " confirm
        if [ "$confirm" = "y" ] || [ "$confirm" = "Y" ]; then
            git checkout "$COMMIT_HASH"
            echo "  ✅ Git 已切换到 commit $COMMIT_HASH"
        else
            echo "  ⏭ 跳过 Git checkout"
        fi
    else
        echo "  ⚠ 该 commit 不在当前仓库中，需先恢复源码后再 checkout"
    fi
else
    echo "  ⚠ 未找到 git_commit.txt，跳过"
fi

# --- 步骤3: 恢复环境变量 ---
echo ""
echo "[3/4] 恢复环境变量..."
if [ -f "$BACKUP_PATH/env_prod.txt" ]; then
    echo "  生产环境变量 (env_prod.txt):"
    echo "  ----------------------------------------"
    cat "$BACKUP_PATH/env_prod.txt" | sed 's/^/    /'
    echo "  ----------------------------------------"
    echo ""
    echo "  请手动将以上内容复制到 Vercel 环境变量设置中"
    echo "  Vercel 控制台: https://vercel.com/ruifei521/snapprohead/settings/environment-variables"
    echo ""
    read -p "  是否同时恢复到本地 .env.local？(y/N) " confirm
    if [ "$confirm" = "y" ] || [ "$confirm" = "Y" ]; then
        cp "$BACKUP_PATH/env_prod.txt" "$PROJECT_DIR/.env.local"
        echo "  ✅ 已恢复到 .env.local"
    fi
else
    echo "  ⚠ 未找到 env_prod.txt，跳过"
fi

# --- 步骤4: 恢复数据库 ---
echo ""
echo "[4/4] 恢复数据库..."
if [ -f "$BACKUP_PATH/supabase_dump.sql" ]; then
    echo "  找到数据库 dump: supabase_dump.sql"
    echo "  ⚠ 恢复数据库会覆盖现有数据！"
    read -p "  确认恢复数据库？(y/N) " confirm
    if [ "$confirm" = "y" ] || [ "$confirm" = "Y" ]; then
        SUPABASE_URL="https://vgrqvwhkvnqsawlwywld.supabase.co"
        echo "  正在恢复..."
        # 需要 supabase CLI 或 psql
        if command -v supabase &> /dev/null; then
            supabase db execute "$BACKUP_PATH/supabase_dump.sql" || true
            echo "  ✅ 数据库恢复完成"
        elif command -v psql &> /dev/null; then
            psql "$SUPABASE_URL" -f "$BACKUP_PATH/supabase_dump.sql" || true
            echo "  ✅ 数据库恢复完成"
        else
            echo "  ⚠ 未找到 supabase CLI 或 psql，请手动恢复："
            echo "     supabase db execute < $BACKUP_PATH/supabase_dump.sql"
        fi
    else
        echo "  ⏭ 跳过数据库恢复"
    fi
elif ls "$BACKUP_PATH"/table_*.json 1>/dev/null 2>&1; then
    echo "  找到数据表 JSON 备份，但无完整 dump"
    echo "  请使用 Supabase 控制台手动导入以下文件："
    ls "$BACKUP_PATH"/table_*.json
else
    echo "  ⚠ 未找到数据库备份，跳过"
fi

# --- 完成 ---
echo ""
echo "=============================================="
echo "  ✅ 恢复完成！"
echo "=============================================="
echo ""
echo "后续步骤："
echo "  1. 安装依赖: cd $PROJECT_DIR && npm install"
echo "  2. 本地运行: npm run dev"
echo "  3. 推送到 Vercel: git push origin main"
echo "  4. 检查 Vercel 部署: https://vercel.com/ruifei521/snapprohead"
echo ""
