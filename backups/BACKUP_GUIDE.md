# SnapProHead 网站备份与恢复方案

## 概述

本方案提供**一键备份**和**一键恢复**能力，保护你的网站代码、数据库和所有配置。

---

## 📦 备份内容

| 内容 | 备份方式 | 恢复方式 |
|------|----------|----------|
| **源代码** | `tar.gz` 打包（不含 node_modules） | 解压覆盖 |
| **Git 历史** | 记录当前 commit hash | `git checkout <hash>` |
| **环境变量** | 复制 `.env.prod` 内容 | 手动粘贴到 Vercel |
| **Supabase 数据库** | `supabase dump` + 各表 JSON | `supabase db execute` |
| **Vercel 配置** | `vercel env ls` 列表 | Vercel 控制台手动恢复 |

---

## 🔄 一键备份（推荐方式）

### 方式一：使用备份脚本（Linux/Mac/Git Bash）

```bash
cd /c/Users/Administrator/WorkBuddy/2026-05-29-task-23/headshots-starter
bash backups/backup.sh
```

备份完成后会在 `backups/` 目录生成 `snapprohead_backup_YYYYMMDD_HHMMSS/` 文件夹。

### 方式二：手动备份（Windows 用户）

1. **备份代码**：复制整个 `headshots-starter` 文件夹到安全位置
2. **备份数据库**：登录 [Supabase 控制台](https://app.supabase.com/project/vgrqvwhkvnqsawlwywld/editor) 导出数据
3. **备份环境变量**：复制 `.env.prod` 文件内容保存

---

## 🔙 一键恢复

### 使用恢复脚本（Linux/Mac/Git Bash）

```bash
cd /c/Users/Administrator/WorkBuddy/2026-05-29-task-23/headshots-starter
bash backups/restore.sh backups/snapprohead_backup_YYYYMMDD_HHMMSS
```

脚本会交互式地询问你要恢复哪些内容。

---

## 📋 紧急情况：有人改了代码/推了代码，如何快速回滚？

### 最快方式：Git 回滚（1分钟）

```bash
# 1. 查看历史 commit
cd /c/Users/Administrator/WorkBuddy/2026-05-29-task-23/headshots-starter
git log --oneline -10

# 2. 回滚到指定 commit（会生成一个新的 revert commit）
git revert <bad-commit-hash>
# 或直接 reset（慎用，会丢失历史）
git reset --hard <good-commit-hash>
git push origin main --force

# 3. Vercel 会自动重新部署
```

### Vercel 一键回滚（最快，无需本地）

1. 打开 [Vercel 部署列表](https://vercel.com/ruifei521/snapprohead/deployments)
2. 找到想要回滚到的部署
3. 点击 **"..." → "Promote to Production"**
4. 立即生效！

---

## 🗂️ 备份文件结构

```
backups/
├── backup.sh          # 备份脚本
├── restore.sh         # 恢复脚本
├── BACKUP_GUIDE.md    # 本文件
└── snapprohead_backup_20260531_131900/   # 某次备份
    ├── README.md             # 备份说明
    ├── source_code.tar.gz   # 源代码
    ├── git_commit.txt       # commit 信息
    ├── git_uncommitted.diff # 未提交改动
    ├── env_prod.txt         # 生产环境变量
    ├── env_local.txt       # 本地环境变量
    ├── supabase_dump.sql   # 数据库 dump（如有）
    ├── table_profiles.json # 各表数据
    ├── table_images.json
    └── vercel_env_list.txt # Vercel 环境变量列表
```

---

## ⚠️ 重要提醒

1. **备份文件包含密钥**：`env_prod.txt` 包含 API Key、数据库密码等敏感信息，请妥善保管，不要上传到公开仓库
2. **定期备份**：建议每次大改动前手动运行一次备份
3. **多重备份**：将备份文件夹同步到云盘（百度网盘/OneDrive）或另一台电脑
4. **测试恢复**：每隔几个月测试一次恢复流程，确保备份可用

---

## 🆘 紧急联系

如果遇到问题：
- Vercel 支持：https://vercel.com/help
- Supabase 支持：https://supabase.com/support
- 项目 GitHub：https://github.com/ruifei521/headshots-starter
