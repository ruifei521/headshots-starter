# SnapProHead 项目交接文档

**生成时间**: 2026-05-17
**项目**: SnapProHead (AI 头像生成 SaaS)
**开发者**: Fei Rui (个人开发者)

---

## 项目概述

SnapProHead 是一个 AI 专业头像生成 SaaS 应用，用户上传照片后通过 Astria AI 训练模型并生成专业头像。

- **生产域名**: https://snapprohead.com
- **仓库**: https://github.com/ruifei521/headshots-starter
- **Vercel 项目**: headshots-starter

---

## 技术栈

| 组件 | 技术 |
|------|------|
| 框架 | Next.js 14.2.35 (App Router) |
| 样式 | Tailwind CSS |
| 数据库/存储 | Supabase (PostgreSQL + Storage) |
| 认证 | Supabase Auth + Google OAuth |
| AI 训练 | Astria AI API |
| 邮件 | Resend (可选) |
| 支付 | Dodo Payments (待接入) |
| 部署 | Vercel |

---

## 关键凭证（不存放在仓库，由用户单独提供）

### GitHub
```
账号: ruifeiqiye@126.com
仓库: https://github.com/ruifei521/headshots-starter
Token: [用户单独提供]
```

### Supabase
```
项目 URL: [用户单独提供，格式 https://xxxxx.supabase.co]
匿名密钥 (ANON): [用户单独提供，格式 sb_publishable_xxx]
服务密钥 (SERVICE_ROLE): [用户单独提供，格式 sb_secret_xxx]
```

### Vercel
```
Token: [用户单独提供]
项目: headshots-starter
生产 URL: https://headshots-starter-tawny.vercel.app
```

### Astria AI
```
API Key: 需要配置 ASTRIA_API_KEY 环境变量
```

---

## 环境变量清单

### Vercel 中已配置（接手后需确认）：
```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
NEXT_PUBLIC_STRIPE_IS_ENABLED=false
NEXT_PUBLIC_TUNE_TYPE=packs
PACK_QUERY_TYPE=both
DEPLOYMENT_URL=https://snapprohead.com
```

### 待配置：
```
ASTRIA_API_KEY=         # Astria AI API 密钥（必需，当前缺失）
RESEND_API_KEY=         # 邮件服务（可选）
APP_WEBHOOK_SECRET=     # Webhook 密钥
DODO_PAYMENTS_API_KEY=  # Dodo Payments（待接入）
```

### 本地开发
创建 `/workspace/headshots-starter/.env.local`，内容由用户提供的凭证填写。
参考模板：`.env.local.example`

---

## 最近完成的工作

### 1. 照片上传功能优化
- 重构 `components/TrainModelZone.tsx`，使用 `FileObject` 结构统一管理文件和预览 URL
- 修复内存泄漏：组件卸载时自动释放 Object URL
- 添加最低图片数量验证（至少 4 张才可提交）
- 添加服务器端文件类型和大小验证（`app/astria/train-model/image-upload/route.ts`）
- 修复删除文件后特性数据不同步问题

### 2. Dodo Payments 合规整改
- `components/Footer.tsx`：添加运营者信息、联系邮箱、AI 免责声明
- `app/privacy/page.tsx`：明确数据保留期限（原始照片 7 天，生成头像 30 天）
- `app/refund/page.tsx`：改为有条件退款（仅 AI 生成失败/技术错误可退款）
- `types/zod.ts`：添加 `dataConsent` 表单验证

### 3. UI 优化
- `components/homepage/modern-pricing.tsx`：定价按钮改为蓝色，统一文字为 "Get Started"
- `components/ImageInspector.tsx`：只显示关键警告（多人、模糊、戴墨镜、戴帽子、搞怪表情）
- 修复第二张图片不显示问题（React key 重复）

### 4. Supabase RLS 问题修复
- `app/astria/train-model/image-upload/route.ts` 改用 `SUPABASE_SERVICE_ROLE_KEY` 绕过 RLS
- `app/astria/train-model/route.ts` 分离认证检查（anon key）和数据库写入（service_role）

### 5. Vercel 构建修复
- 将所有 route.ts 中环境变量缺失时的 `throw new Error()` 改为 `console.warn()`
- 防止构建时因缺失环境变量而失败

---

## 当前状态

| 功能 | 状态 | 说明 |
|------|------|------|
| 网站部署 | 已部署 | Vercel 生产环境正常 |
| 用户认证 | 可用 | Google OAuth 正常工作 |
| 照片上传 | 功能正常 | 支持 4-10 张，并行上传 |
| AI 模型训练 | 需配置 | 需要有效的 ASTRIA_API_KEY |
| 支付集成 | 待接入 | 目标：Dodo Payments |
| 邮件通知 | 可选 | 需配置 RESEND_API_KEY |
| 自定义域名 | 待配置 | snapprohead.com 指向 Vercel |

---

## 待完成任务

### 高优先级

**1. 接入 Dodo Payments**
- 注册地址：https://dodopayments.com
- 安装 SDK：`npm install dodo-payments`
- 实现支付流程（结账、Webhook 处理）
- 更新定价页面支付按钮
- Dodo Payments 支持中国个人开发者，结算到支付宝

**2. 配置 Astria AI**
- 注册 Astria AI 账户获取 API Key
- 将 `ASTRIA_API_KEY` 配置到 Vercel 环境变量
- 确认 `ASTRIA_TEST_MODE` 设为 `false`（当前为 true，仅测试模式）
- 测试完整的模型训练和头像生成流程

### 中优先级

**3. 配置自定义域名**
- 将 snapprohead.com 的 DNS 指向 Vercel

**4. 提交 Dodo Payments KYC 审核**
- 准备护照（确认有效期）
- 网站已完成合规整改，可提交审核

### 低优先级

**5. 优化**
- 添加 `metadataBase` 到 `app/layout.tsx`（修复 Vercel 构建警告）
- 配置 `RESEND_API_KEY` 启用邮件通知

---

## 关键文件位置

```
/workspace/headshots-starter/
├── app/
│   ├── astria/
│   │   ├── train-model/
│   │   │   ├── route.ts              # 模型训练 API
│   │   │   └── image-upload/
│   │   │       └── route.ts          # 图片上传 API（含服务端验证）
│   │   ├── prompt-webhook/route.ts   # Astria 提示词 Webhook
│   │   └── train-webhook/route.ts    # Astria 训练完成 Webhook
│   ├── overview/                     # 用户仪表板
│   │   ├── page.tsx                 # 模型列表
│   │   └── models/[id]/page.tsx     # 模型详情/生成的头像
│   ├── login/page.tsx                # 登录页面
│   ├── privacy/page.tsx              # 隐私政策（已合规更新）
│   ├── refund/page.tsx               # 退款政策（已合规更新）
│   └── terms/page.tsx                # 服务条款
├── components/
│   ├── TrainModelZone.tsx            # 照片上传核心组件（已优化）
│   ├── ImageInspector.tsx           # 图片质量检查组件
│   ├── Footer.tsx                   # 页脚（含运营者信息）
│   └── homepage/
│       └── modern-pricing.tsx       # 定价板块（蓝色按钮）
├── lib/
│   ├── imageInspection.ts           # 图片检查逻辑
│   └── config.ts                    # 配置验证
├── types/
│   └── zod.ts                      # 表单验证 Schema（含 dataConsent）
└── .env.local.example              # 环境变量示例
```

---

## 部署流程

⚠️ **重要**：Fork 仓库推送到 GitHub 后，Vercel **不会**自动部署，需要手动触发。

### 方法一：Vercel Dashboard
1. 进入 Vercel 项目页面
2. 点击 "Deployments" 标签
3. 找到最新提交，点击 "Redeploy"

### 方法二：Vercel CLI
```bash
cd /workspace/headshots-starter
vercel --token [VERCEL_TOKEN] --prod --yes
```

---

## 常见问题排查

### Vercel 部署失败
- 检查 Vercel 环境变量是否全部配置
- 本地先运行 `npm run build` 确认构建通过
- 查看构建日志：`vercel logs [production-url] --token [token]`

### 图片上传失败："new row violates row-level security policy"
- 确认 `app/astria/train-model/image-upload/route.ts` 使用 `SUPABASE_SERVICE_ROLE_KEY`
- 确认 Supabase 中 `storage.objects` 的 RLS 策略允许 service_role 写入

### 训练模型后无反应
- 检查 `ASTRIA_API_KEY` 是否有效
- 检查 `ASTRIA_TEST_MODE` 是否设为 `false`
- 查看 Vercel 函数日志

---

## Dodo Payments 接入要点

Dodo Payments 是 Merchant of Record (MoR) 模式，适合中国个人开发者：

1. **注册**：https://dodopayments.com
2. **KYC 要求**：身份证或护照（需确认护照有效期）、中国个人开发者可注册、结算货币支持支付宝提现
3. **SDK 安装**：`npm install dodo-payments`
4. **Webhook 处理**：需要配置 `APP_WEBHOOK_SECRET`
5. **合规要求**（已完成）：
   - 网站与 KYC 信息一致
   - 明确的退款政策
   - 隐私政策含数据保留期限
   - 用户数据同意勾选
   - AI 工具免责声明

---

## 快速上手命令

```bash
# 1. 克隆仓库
cd /workspace
git clone https://github.com/ruifei521/headshots-starter.git
cd headshots-starter

# 2. 安装依赖
npm install

# 3. 配置环境变量（向用户索取凭证后填写）
cp .env.local.example .env.local
# 编辑 .env.local 填入用户提供的凭证

# 4. 本地开发
npm run dev

# 5. 构建检查
npm run build

# 6. 部署到 Vercel（需先向用户索取 Vercel Token）
vercel --token [VERCEL_TOKEN] --prod --yes
```

---

## 联系人

- **开发者**: Fei Rui
- **邮箱**: ruifeiqiye@126.com
- **网站**: https://snapprohead.com
- **GitHub**: https://github.com/ruifei521
