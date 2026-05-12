# SnapProHead 项目交接简报

> 生成时间：2026-05-12 17:30 (GMT+8)
> 生成者：无不言（上一任 Agent）
> 接手人：下一任 Agent

---

## 一、项目背景

**SnapProHead** 是一款 AI 职业头像 SaaS 产品。用户上传照片 → AI 训练模型 → 生成职业头像。采用 credits 积分制，用户购买 credits 后消费。

| 项目信息 | 值 |
|---------|-----|
| 产品域名 | https://snapprohead.com |
| GitHub 仓库 | https://github.com/RuifeiQi/snapprohead (远程: github.com/ruifei521/headshots-starter) |
| 部署平台 | Vercel (snapprohead.vercel.app) |
| 数据库 | Supabase (Project: snapprohead-db) |
| 邮件服务 | RESEND（已配置 API Key，但自定义域名未验证） |

### 技术栈
| 技术 | 版本 |
|-----|------|
| Next.js | ^14.2.35 (App Router) |
| React | ^18.2.0 |
| @supabase/ssr | ^0.10.3 |
| @supabase/supabase-js | ^2.40.0 |
| Stripe | 用于一次性 credit 购买 |
| Astria API | AI 模型训练和图像生成 |
| TailwindCSS | 样式 |
| Vercel CLI | 手动部署用 |

### 项目结构（关键文件）
```
app/
├── auth/callback/route.ts        ← 认证回调（PKCE + 多种 fallback）
├── auth/sign-out/route.ts
├── login/
│   ├── page.tsx                  ← 登录页
│   └── components/
│       ├── Login.tsx             ← Magic Link 登录组件（当前版本）
│       └── WaitingForMagicLink.tsx
├── overview/
│   ├── layout.tsx                ← 需要认证，未登录 redirect('/login')
│   ├── page.tsx
│   ├── packs/page.tsx
│   └── models/[id]/page.tsx
├── get-credits/page.tsx          ← Stripe 购买 credits
├── stripe/subscription-webhook/route.ts  ← Stripe webhook
├── astria/                       ← AI 训练相关 API
├── api/debug-auth/route.ts       ← 调试用端点
├── page.tsx                      ← 首页（landing page）
└── layout.tsx                    ← 根布局

components/
├── NavLinks.tsx                  ← 导航链接（曾有问题，已修复）
├── Navbar.tsx / NavbarClient.tsx
├── stripe/StripeTable.tsx        ← Stripe Pricing Table 嵌入
├── homepage/                     ← 首页各 section 组件
└── realtime/                     ← 实时数据组件

middleware.ts                      ← Supabase session 刷新 + Cache-Control
```

---

## 二、当前遇到的问题

### 🔴 P0：Magic Link 登录偶尔失败（PKCE 间歇性问题）

**现象**：用户输入邮箱 → 收到 Magic Link → 点击链接 → 有时登录成功，有时报错 `code challenge does not match previously saved code verifier`

**根因**：Supabase `signInWithOtp` 使用 PKCE 流程。客户端生成 code verifier 并存入浏览器 cookie，用户从邮件点击链接回来时，服务端 `exchangeCodeForSession` 需要读取该 cookie 中的 verifier 来完成交换。如果 cookie 丢失，交换失败。

**cookie 丢失的常见原因**：
1. 用户在隐私/无痕模式使用
2. 浏览器清除了 cookie（在发送 Magic Link 和点击链接之间）
3. 链接在不同浏览器打开
4. 链接超过 5 分钟有效期
5. Cookie SameSite 策略阻止（已用 `lax` 默认值）
6. Vercel CDN 缓存干扰（已加 `Cache-Control: private, no-store` 修复）

**当前状态**：已添加友好错误提示，用户看到"请重新发送"而非技术报错。但根本问题未解决——PKCE 间歇性失败仍然会发生。

**可能的解决方案**：
- **方案 A**：在 Supabase Dashboard 中关闭 PKCE，改用 Implicit Flow（需验证 Supabase 是否支持 Magic Link 的 Implicit Flow）
- **方案 B**：配置 Google OAuth 作为主要登录方式，Magic Link 作为备选（推荐）
- **方案 C**：将 PKCE verifier 存储到更可靠的位置（如 IndexedDB 或服务端 session）

### 🟡 P1：RESEND 邮件发送未完全就绪

**现象**：RESEND API Key 已配置，但需要验证自定义发件域名才能正式使用。目前 Supabase 使用内置邮件服务发送 Magic Link，有速率限制。

**当前状态**：
- Supabase 内置邮件服务可用（有速率限制，开发环境够用）
- RESEND 需要配置 DNS 记录验证域名后才能用于生产环境
- 之前曾临时使用 `mailer_autoconfirm` 绕过邮件验证

### 🟡 P2：Stripe 支付配置风险

**现象**：当前使用 Stripe Pricing Table 嵌入方式，存在以下问题：
- Stripe 的 subscription 模式对 SaaS 一次性购买 credits 可能过重
- Webhook 处理需要 `STRIPE_SECRET_KEY` 和 `STRIPE_WEBHOOK_SECRET`

**推荐替代**：LemonSqueezy —— 更轻量，更适合一次性数字产品购买，不需要企业资质，webhook 更简单

### 🟢 P3：Google OAuth 未配置

**现象**：Login.tsx 中有 "Continue with Google" 按钮，但 Google OAuth 尚未在 Supabase 中配置。

**需要**：
1. Google Cloud Console 创建 OAuth 2.0 客户端（需要用户提供）
2. 在 Supabase Dashboard → Authentication → Providers → Google 中配置 Client ID 和 Client Secret
3. Google Cloud Console 回调 URL 设置为 `https://vgrqvwhkvnqsawlwywld.supabase.co/auth/v1/callback`

---

## 三、已采取的行动（时间线）

### 2026-05-12 全天工作记录

1. **发现登录死循环 Bug**：用户登录后被重定向回登录页
2. **第一轮修复**：Cookie 配置 + Redirect 修复
   - `auth/callback/route.ts`：显式设置 cookie 属性
   - `middleware.ts`：secure 根据 localhost 自动判断
   - `overview/layout.tsx`：`redirect('/login')` 替代内联 `<Login />`
3. **第二轮修复**：替换为邮箱+密码登录（绕过 PKCE 问题）
   - `Login.tsx`：signInWithPassword + signUp
4. **用户反馈**：邮箱+密码登录容易流失客户，要求恢复 Magic Link
5. **第三轮修复（当前版本）**：恢复 Magic Link + 改进错误处理
   - 恢复 `signInWithOtp`
   - PKCE 失败时显示友好提示
   - 添加 `Cache-Control: private, no-store`
6. **DNS 验证**：`snapprohead.com` → CNAME `cname.vercel-dns.com` ✅
7. **导航修复**：NavLinks.tsx 添加 `window.location.href` fallback
8. **Stripe 调研**：推荐 LemonSqueezy 替代

### 关键 Git Commits
| Commit | 描述 |
|--------|------|
| `6bcb3e4` | fix(auth): revert to Magic Link login with improved PKCE error handling ← **当前版本** |
| `ce7e2a3` | fix(auth): replace Magic Link with email+password login (已回滚) |
| `359b7bb` | trigger: 强制 Vercel 重新构建 |

---

## 四、API 权限与凭证

### 环境变量（.env.local 中已有）
| 变量名 | 状态 | 用途 |
|--------|------|------|
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ 已设置 | `https://vgrqvwhkvnqsawlwywld.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ 已设置 | 客户端 Supabase 访问 |
| `SUPABASE_SERVICE_ROLE_KEY` | ✅ 已设置 | 服务端 Supabase 访问（绕过 RLS） |
| `RESEND_API_KEY` | ✅ 已设置 | 邮件发送（但域名未验证） |
| `ASTRIA_API_KEY` | ✅ 已设置 | AI 模型训练 |
| `APP_WEBHOOK_SECRET` | ✅ 已设置 | Webhook 签名验证 |
| `STRIPE_SECRET_KEY` | ⚠️ 需确认 Vercel 环境变量 | Stripe 支付 |
| `STRIPE_WEBHOOK_SECRET` | ⚠️ 需确认 Vercel 环境变量 | Stripe Webhook |
| `STRIPE_PRICE_ID_ONE_CREDIT` | ⚠️ 需确认 Vercel 环境变量 | Stripe 价格 ID |
| `STRIPE_PRICE_ID_THREE_CREDITS` | ⚠️ 需确认 Vercel 环境变量 | Stripe 价格 ID |
| `STRIPE_PRICE_ID_FIVE_CREDITS` | ⚠️ 需确认 Vercel 环境变量 | Stripe 价格 ID |

### Vercel 部署
- 项目名：`ruifeiqiye191314-9891s-projects/snapprohead`
- 部署方式：`npx vercel deploy --prod --yes`（GitHub 自动部署偶尔失败，手动 CLI 更可靠）
- 环境变量：需在 Vercel Dashboard 中同步（特别是 Stripe 相关的）

### Supabase 配置
- Project URL: `https://vgrqvwhkvnqsawlwywld.supabase.co`
- 数据库名：snapprohead-db
- Auth 配置：Site URL 应设为 `https://snapprohead.com`
- Redirect URLs 应包含：`https://snapprohead.com/auth/callback`
- 当前邮件模板：使用 Supabase 默认 Magic Link 模板
- `mailer_autoconfirm`：曾临时开启，用于绕过邮件验证（不应长期使用）

---

## 五、下一步应该做什么（优先级排序）

### 🔴 优先级 1：配置 Google OAuth 登录
**为什么**：这是解决 Magic Link PKCE 间歇性失败的最佳方案。Google OAuth 不依赖 PKCE cookie，用户体验也更流畅。

**具体步骤**：
1. 让用户（老大）去 [Google Cloud Console](https://console.cloud.google.com/) 创建 OAuth 2.0 客户端
   - 应用类型：Web 应用
   - 授权重定向 URL：`https://vgrqvwhkvnqsawlwywld.supabase.co/auth/v1/callback`
   - 获取 Client ID 和 Client Secret
2. 在 Supabase Dashboard → Authentication → Providers → Google 中填入 Client ID 和 Client Secret
3. 确认 `app/login/components/Login.tsx` 中的 `signInWithGoogle` 函数正常工作
4. 测试 Google OAuth 登录流程
5. 部署到 Vercel

### 🟡 优先级 2：配置 RESEND 自定义域名
**为什么**：Supabase 内置邮件服务有速率限制，不适合生产环境。

**具体步骤**：
1. 在 RESEND Dashboard 中添加自定义域名（如 `mail.snapprohead.com`）
2. 在 DNS 中添加 RESEND 要求的 MX/TXT 记录
3. 等待域名验证完成
4. 在 Supabase Dashboard → Authentication → SMTP Settings 中配置 RESEND SMTP
   - Host: `smtp.resend.com`
   - Port: `465`
   - User: `resend`
   - Pass: RESEND API Key
   - 发件人邮箱: `noreply@snapprohead.com`（或验证过的域名邮箱）

### 🟡 优先级 3：评估 Stripe → LemonSqueezy 迁移
**为什么**：LemonSqueezy 更适合一次性数字产品购买，配置更简单，不需要企业资质。

**具体步骤**：
1. 注册 LemonSqueezy 账号
2. 创建产品和价格（1 credit / 3 credits / 5 credits）
3. 替换 `components/stripe/StripeTable.tsx` 为 LemonSqueezy 嵌入
4. 创建新的 webhook handler 替代 `app/stripe/subscription-webhook/route.ts`
5. 测试购买流程
6. 部署

### 🟢 优先级 4：Vercel 环境变量审计
**为什么**：.env.local 中的变量和 Vercel 环境变量可能不同步，导致线上问题。

**具体步骤**：
1. 在 Vercel Dashboard 中检查所有环境变量
2. 确保 Stripe 相关变量已设置
3. 确保 RESEND_API_KEY 已设置
4. 测试所有功能端到端

### 🟢 优先级 5：Magic Link 可靠性增强（如果不用 Google OAuth）
**如果用户不愿配置 Google OAuth**，可以考虑：
1. 研究 Supabase 是否支持 Magic Link 的 Implicit Flow（避免 PKCE）
2. 实现服务端 PKCE verifier 存储（而非依赖浏览器 cookie）
3. 添加 Magic Link 重发机制（当前已有基本重试）

---

## 六、已知注意事项

1. **GitHub 推送需要 VPN**：用户在中国大陆，访问 GitHub 需要开启 VPN
2. **Vercel 自动部署不可靠**：有时 GitHub push 后 Vercel 不触发部署，需手动 `npx vercel deploy --prod --yes`
3. **项目代码位置**：`C:\Users\Administrator\projects\snapprohead`（不在当前工作目录）
4. **Login.tsx.bak**：`app/login/components/Login.tsx.bak` 是之前 email+password 版本的备份，可删除
5. **用户偏好**：老大偏好务实，先快速推进再完善；对客户体验要求高（不能有降低转化率的设计）
6. **Supabase `mailer_autoconfirm`**：曾临时开启绕过邮件验证，不应在生产环境使用

---

## 七、关键代码片段参考

### 当前 Magic Link 登录流程
```
用户输入邮箱 → signInWithOtp() → Supabase 发邮件 → 用户点击链接
→ /auth/callback?code=xxx → exchangeCodeForSession(code) → 设置 session cookie → redirect /overview
```

### auth/callback/route.ts 的多方法处理顺序
1. PKCE (code 参数) → `exchangeCodeForSession`
2. token + email → `verifyOtp({ email, token, type: 'magiclink' })`
3. token_hash → `verifyOtp({ token_hash, type: 'magiclink' })`
4. 纯 token → `verifyOtp({ token_hash: token, type: 'magiclink' })`
5. 无参数 → 重定向到 /login?error=...

### middleware.ts 的作用
- 在每个请求上调用 `supabase.auth.getSession()` 刷新 token
- 同时设置 `request.cookies` 和 `response.cookies` 确保 PKCE verifier 传递
- 添加 `Cache-Control: private, no-store` 防止 CDN 缓存

---

*简报结束。如有疑问，请查阅 git log 或直接联系老大确认。*
