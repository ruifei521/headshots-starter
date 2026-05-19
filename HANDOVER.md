# 📦 项目交接文档 - SnapProHead.com

**项目名称**: SnapProHead.com  
**源代码仓库**: headshots-starter (GitHub: https://github.com/ruifei521/headshots-starter)  
**生产环境**: https://snapprohead.com  
**交接时间**: 2026-05-20  
**交接原因**: 用户要求交给另一个 Agent 继续处理  

---

## 🎯 项目概述

**功能**: AI 头像生成应用（用户上传 selfie 照片 → AI 训练模型 → 生成专业头像）

**技术栈**:
- 前端: Next.js 14 (App Router), React, TypeScript, Tailwind CSS
- 后端: Next.js API Routes
- 数据库: Supabase (Auth + Storage + PostgreSQL)
- AI 服务: Astria AI (模型训练), OpenAI DALL-E (图像生成)
- 部署: Vercel

**核心流程**:
1. 用户注册/登录 (Magic Link 或 Google OAuth)
2. 上传 5-10 张训练图片
3. 调用 Astria AI API 启动模型训练
4. 训练完成后（webhook 通知），用户可以选择预设模板生成头像
5. 调用 OpenAI DALL-E 生成最终头像
6. 用户下载/分享生成的头像

---

## ✅ 已完成的修复

### 1. Magic Link 登录 500 错误 ✅
**问题**: 点击 Magic Link 后出现 "Database error saving new user"  
**原因**: Supabase 数据库触发器冲突  
**修复**: 在 Supabase Dashboard → SQL Editor 执行：
```sql
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
```
**状态**: ✅ 已修复（用户确认 "登录成功了"）

---

### 2. 图片上传 MIME 类型修复 ✅
**问题**: 某些 JPEG 图片上传失败  
**原因**: 代码包含非标准的 `"image/jpg"` (正确应该是 `"image/jpeg"`)  
**修复**: 修改 `app/astria/train-model/image-upload/route.ts`，移除 `"image/jpg"`  
**状态**: ✅ 已修复并提交到 GitHub

---

### 3. Vercel 环境变量配置 ✅
**问题**: 图片上传和训练功能失败，因为 Vercel 缺少环境变量  
**修复**: 使用 Vercel CLI 添加环境变量（需要重新配置，见下文）  
**状态**: ✅ 流程已验证，但需要重新配置（见密钥部分）

---

### 4. Google OAuth iOS 问题 ⏳
**问题**: iPhone 上使用 Google 登录时提示 "让输入有效目标"  
**尝试的修复** (均未完全解决):
- 移除 `skipBrowserRedirect: true`
- 移除 `prompt: 'select_account'`
- 修改 `emailRedirectTo` 路径

**根本原因**: Google Cloud Console 缺少授权的重定向 URI  
**待修复**: 需要在 Google Cloud Console 添加：
- `https://snapprohead.com/auth/callback`
- `https://vgrqvwhkvnqsawlwywld.supabase.co/auth/v1/callback`

**状态**: ⏳ 等待配置（需要用户用手机浏览器操作）

---

## 🔑 密钥和配置（重要！）

### ⚠️ 安全提示
**所有密钥都需要下一个 Agent 重新获取或验证，不要使用文档中的示例值！**

---

### 1. Vercel 部署 Token
**获取方法**:
1. 登录 https://vercel.com/account/tokens
2. 创建新 Token: `name: "snapprohead-production"`, `scope: Full Access`
3. 复制生成的 Token (格式: `vcp_xxxxxxxxxx`)

**使用方法**:
```bash
vercel --prod --token "vcp_xxxxxxxxxx"
vercel env add VARIABLE_NAME production --token "vcp_xxxxxxxxxx"
```

---

### 2. Astria AI API Key
**获取方法**:
1. 登录 https://www.astria.ai/settings
2. 查看 "API Key" 部分
3. 格式: `sd_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

**重要提示**: 
- ⚠️ 需要使用**正确的 Astria AI API Key**，不是 OpenAI 的 `sk-` 格式
- ⚠️ 账户需要至少 $2 USD 余额才能启动训练

**验证方法**:
```bash
curl -X POST "https://api.astria.ai/tunes" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer sd_YOUR_KEY_HERE" \
  -d '{"tune": {"name": "test"}}'
```
**预期结果**: 不应该返回 "HTTP Token: Access denied."

---

### 3. Supabase 配置
**项目 URL**: `https://vgrqvwhkvnqsawlwywld.supabase.co`

**获取 Anon Key**:
1. 登录 https://supabase.com/dashboard/project/vgrqvwhkvnqsawlwywld/settings/api
2. 复制 "anon public" key

**获取 Service Role Key** (保密！):
1. 同上页面
2. 复制 "service_role" key (注意：不要泄露！)

**数据库密码**: 在同样的 API 设置页面可以找到或重置

---

### 4. OpenAI API Key
**获取方法**:
1. 登录 https://platform.openai.com/api-keys
2. 创建新 Key
3. 格式: `sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

**用途**: 生成头像 (DALL-E)

---

### 5. Google OAuth Credentials
**获取方法**:
1. 登录 https://console.cloud.google.com/
2. 选择项目 → APIs & Services → Credentials
3. 创建 OAuth 2.0 Client ID (如果还没有)
4. 记录 Client ID 和 Client Secret

**需要配置的授权的重定向 URI**:
```
https://snapprohead.com/auth/callback
https://vgrqvwhkvnqsawlwywld.supabase.co/auth/v1/callback
```

**Supabase 配置**:
1. 登录 Supabase Dashboard → Authentication → Providers → Google
2. 填入 Client ID 和 Client Secret
3. 启用 Google 提供商

---

## 📋 待完成的任务（优先级排序）

### 🔴 P0 - 紧急阻塞（需要立即处理）

#### 任务 1: 充值 Astria AI 账户 ⏳
**问题**: Astria AI 账户余额不足 $1.5，无法启动训练  
**操作步骤**:
1. 用手机浏览器访问 https://www.astria.ai/settings
2. 登录账户
3. 点击 "Add to balance" 或 "Top up"
4. 充值至少 $2 USD (建议 $5-10)
5. 支持信用卡付款

**完成后**:
- 更新 Vercel 环境变量 `ASTRIA_API_KEY`
- 重新部署到生产环境
- 测试完整训练流程

---

#### 任务 2: 配置 Vercel 环境变量 ⏳
**需要配置的环境变量**:
```bash
# Astria AI
ASTRIA_API_KEY=sd_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
ASTRIA_TEST_MODE=false

# Supabase
SUPABASE_SERVICE_ROLE_KEY=eyJxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# OpenAI
OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Webhook Secret (用于验证 Astria AI 的回调)
APP_WEBHOOK_SECRET=your_webhook_secret_here
```

**配置方法**:
```bash
vercel env add ASTRIA_API_KEY production --token "vcp_xxxxxxxxxx"
vercel env add SUPABASE_SERVICE_ROLE_KEY production --token "..."
vercel env add OPENAI_API_KEY production --token "..."
vercel env add APP_WEBHOOK_SECRET production --token "..."
vercel env add ASTRIA_TEST_MODE production --token "..."
```

**部署**:
```bash
vercel --prod --token "vcp_xxxxxxxxxx"
```

---

#### 任务 3: 修复 Google OAuth iOS 问题 ⏳
**问题**: iPhone 上 Google 登录失败  
**操作步骤**:
1. 用手机浏览器访问 https://console.cloud.google.com/
2. 选择项目
3. APIs & Services → Credentials
4. 编辑 OAuth 2.0 Client
5. 添加授权的重定向 URI:
   - `https://snapprohead.com/auth/callback`
   - `https://vgrqvwhkvnqsawlwywld.supabase.co/auth/v1/callback`
6. 保存

**Supabase 配置**:
1. 访问 https://supabase.com/dashboard/project/vgrqvwhkvnqsawlwywld/auth/providers
2. 启用 Google 提供商
3. 填入 Google OAuth Client ID 和 Client Secret

**测试**: 用 iPhone 访问 https://snapprohead.com 测试 Google 登录

---

### 🟡 P1 - 重要（完成后尽快处理）

#### 任务 4: 测试完整流程
**测试步骤**:
1. 访问 https://snapprohead.com
2. 注册/登录 (Magic Link 或 Google)
3. 上传 5-10 张 selfie 照片
4. 启动模型训练
5. 等待训练完成（接收邮件/Webhook 通知）
6. 选择模板生成头像
7. 下载生成的头像

**验证点**:
- ✅ 图片上传成功
- ✅ 训练启动成功（Astria AI 扣费 $1.5）
- ✅ Webhook 回调正常工作
- ✅ 头像生成成功（OpenAI DALL-E 扣费）
- ✅ 用户可以下载头像

---

#### 任务 5: 配置 Astria AI Webhook
**用途**: 训练完成时接收通知，自动更新数据库状态

**配置方法**:
1. 登录 https://www.astria.ai/settings
2. 找到 "Webhooks" 部分
3. 添加 Webhook URL: `https://snapprohead.com/api/astria/webhook`
4. 选择事件: `tune.completed`, `tune.failed`

**验证**:
- 训练完成后，检查数据库 `models` 表状态是否更新
- 检查用户是否收到通知（邮件或站内通知）

---

### 🟢 P2 - 可选优化

#### 任务 6: 优化用户体验
- 添加训练进度条
- 优化错误提示信息（更友好）
- 移动端 UI 优化
- 添加训练历史记录页面

---

#### 任务 7: 监控和日志
- 集成 Sentry 错误监控
- 添加关键操作日志（登录、上传、训练、生成）
- 设置告警（训练失败、API 错误等）

---

## 🛠️ 常用命令

### Git 操作
```bash
# 查看最新提交
git log -5 --oneline

# 查看修改内容
git diff HEAD~1

# 推送到远程
git push origin main
```

### Vercel 操作
```bash
# 生产环境部署
vercel --prod --token "vcp_xxxxxxxxxx"

# 查看环境变量
vercel env list --token "vcp_xxxxxxxxxx"

# 删除环境变量
vercel env rm VARIABLE_NAME production --token "vcp_xxxxxxxxxx"

# 查看部署日志
vercel logs --token "vcp_xxxxxxxxxx"
```

### 测试 API
```bash
# 测试 Astria AI API Key
curl -X POST "https://api.astria.ai/tunes" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer sd_YOUR_KEY_HERE" \
  -d '{"tune": {"name": "test"}}'

# 测试图片上传接口
curl -X POST "https://snapprohead.com/astria/train-model/image-upload" \
  -F "file=@/path/to/image.jpg" \
  -F "fileName=test.jpg"

# 测试训练接口
curl -X POST "https://snapprohead.com/astria/train-model" \
  -H "Content-Type: application/json" \
  -d '{"modelName": "test", "images": [...]}'
```

---

## 📁 关键文件位置

### 认证相关
- `app/login/components/Login.tsx` - 登录组件 (Google OAuth + Magic Link)
- `components/HashAuthHandler.tsx` - 处理 Magic Link token
- `app/layout.tsx` - 全局布局 (包含 HashAuthHandler)

### Astria AI 训练相关
- `app/astria/train-model/route.ts` - 启动模型训练 API
- `app/astria/train-model/image-upload/route.ts` - 图片上传 API
- `components/TrainModelZone.tsx` - 前端训练组件

### Webhook 相关
- `app/api/astria/webhook/route.ts` - Astria AI Webhook 回调处理

### 环境配置
- `.env.local` - 本地开发环境变量
- `.env.vercel` - Vercel 环境变量模板
- `vercel.json` - Vercel 配置文件
- `next.config.mjs` - Next.js 配置

---

## 🔍 故障排查指南

### 问题 1: Magic Link 登录 500 错误
**症状**: "Database error saving new user"  
**原因**: Supabase 数据库触发器冲突  
**修复**: 在 Supabase Dashboard → SQL Editor 执行：
```sql
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
```

---

### 问题 2: Google OAuth iOS 失败
**症状**: "让输入有效目标"  
**原因**: Google Cloud Console 缺少授权的重定向 URI  
**修复**:
1. Google Cloud Console → OAuth 2.0 Client → 授权的重定向 URI
2. 添加:
   - `https://snapprohead.com/auth/callback`
   - `https://vgrqvwhkvnqsawlwywld.supabase.co/auth/v1/callback`
3. Supabase Dashboard → Auth → Providers → Google → 启用并填入 Client ID/Secret

---

### 问题 3: 图片上传失败 "Something went wrong"
**症状**: 上传图片后提示错误  
**检查清单**:
1. ✅ Vercel 环境变量 `ASTRIA_API_KEY` 已配置
2. ✅ Astria AI API Key 格式正确（不是 OpenAI 的 `sk-` 格式）
3. ✅ Astria AI 账户余额充足（至少 $2）
4. ✅ 图片格式为 JPEG 或 PNG

**调试**:
```bash
# 查看 Vercel 部署日志
vercel logs --token "vcp_xxxxxxxxxx"

# 测试图片上传接口
curl -X POST "https://snapprohead.com/astria/train-model/image-upload" \
  -F "file=@test.jpg" \
  -F "fileName=test.jpg"
```

---

### 问题 4: 训练启动失败
**症状**: 调用 `/astria/train-model` 返回 500 错误  
**检查清单**:
1. ✅ `ASTRIA_API_KEY` 环境变量已配置
2. ✅ Astria AI 账户余额充足
3. ✅ 图片已成功上传到 Supabase Storage
4. ✅ 图片 URL 可公开访问

**查看详细错误**:
```bash
# 查看 Vercel 函数日志
vercel logs --token "vcp_xxxxxxxxxx"
```

---

### 问题 5: Webhook 回调未触发
**症状**: 训练完成后，数据库状态未更新  
**检查清单**:
1. ✅ Astria AI Webhook URL 已配置 (`https://snapprohead.com/api/astria/webhook`)
2. ✅ Webhook Secret 已配置 (`APP_WEBHOOK_SECRET`)
3. ✅ `/api/astria/webhook/route.ts` 代码正确

**测试 Webhook**:
```bash
# 手动发送测试 Webhook 请求
curl -X POST "https://snapprohead.com/api/astria/webhook" \
  -H "Content-Type: application/json" \
  -H "X-Astria-Signature: test_signature" \
  -d '{"event": "tune.completed", "data": {...}}'
```

---

## 👤 用户信息

**用户名**: ruifei521 (GitHub) / huahuah (可能是其他平台)  
**项目**: SnapProHead.com (https://snapprohead.com)  
**技术背景**: 非技术用户，主要使用手机操作  
**沟通风格**: 喜欢直接的操作步骤，不需要过多解释，常说 "你直接帮我搞定"  
**限制**: 没有电脑，只能用手机浏览器

**建议的沟通方式**:
- ✅ 给出清晰的步骤（1、2、3...）
- ✅ 提供直观的链接和截图（如果可能）
- ❌ 避免过多的技术术语
- ❌ 避免需要电脑才能完成的操作

---

## 🎯 下一步行动（给下一个 Agent）

### 第一优先级（必须完成）
1. ⏳ **获取/验证所有密钥和 Token**
   - Vercel Token
   - Astria AI API Key
   - Supabase Service Role Key
   - OpenAI API Key
   - Google OAuth Credentials

2. ⏳ **充值 Astria AI 账户**
   - 访问 https://www.astria.ai/settings
   - 充值至少 $2 USD
   - 验证 API Key 有效

3. ⏳ **配置 Vercel 环境变量**
   - 添加所有必需的环境变量
   - 重新部署到生产环境
   - 验证部署成功

4. ⏳ **修复 Google OAuth**
   - 配置 Google Cloud Console 重定向 URI
   - 配置 Supabase Auth Google 提供商
   - 测试 iOS 设备登录

---

### 第二优先级（完成后尽快处理）
5. ⏳ **测试完整流程**
   - 注册 → 登录 → 上传图片 → 启动训练 → 生成头像 → 下载
   - 验证每个步骤都正常工作

6. ⏳ **配置 Webhook**
   - 设置 Astria AI Webhook
   - 验证训练完成后能正确更新状态

---

### 第三优先级（可选优化）
7. 🟢 **优化用户体验**
8. 🟢 **添加监控和日志**

---

## 🔗 相关链接

### 项目链接
- **生产环境**: https://snapprohead.com
- **GitHub 仓库**: https://github.com/ruifei521/headshots-starter
- **源代码路径**: `/workspace/headshots-starter`

### Dashboard 链接
- **Supabase Dashboard**: https://supabase.com/dashboard/project/vgrqvwhkvnqsawlwywld
- **Vercel Dashboard**: https://vercel.com/dashboard
- **Astria AI Dashboard**: https://www.astria.ai/settings
- **Google Cloud Console**: https://console.cloud.google.com/
- **OpenAI Platform**: https://platform.openai.com/api-keys

---

## 📝 重要提示

1. **用户无法使用电脑**：只能通过手机操作，需要给出适合手机浏览器的指引
2. **密钥安全**：所有密钥都已经过验证，但需要下一个 Agent 重新获取或验证
3. **优先解决阻塞问题**：Astria AI 余额不足和 Google OAuth 是主要阻塞
4. **保持沟通简洁**：用户喜欢直接的操作步骤
5. **代码已推送**：所有修复都已提交到 GitHub，Vercel 会自动部署（如果配置了 GitHub 集成）

---

## ✅ 交接检查清单

下一个 Agent 接手时，请确认：

- [ ] 已读取本文档
- [ ] 已获取所有必要的密钥和 Token
- [ ] 已验证 Astria AI API Key 有效
- [ ] 已验证 Astria AI 账户余额充足
- [ ] 已配置 Vercel 环境变量
- [ ] 已部署到生产环境
- [ ] 已测试 Magic Link 登录
- [ ] 已修复 Google OAuth（或在处理中）
- [ ] 已测试图片上传和训练功能
- [ ] 已配置 Webhook
- [ ] 已测试完整流程

---

**祝下一个 Agent 工作顺利！🚀**

如果有任何问题，可以参考本文档的"故障排查指南"部分，或查看代码注释。

---

**文档版本**: v1.0  
**最后更新**: 2026-05-20  
**作者**: CodeBuddy (Qi - Delivery Director)
