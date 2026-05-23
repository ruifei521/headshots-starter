# SnapProHead 项目简报

> 生成时间: 2026-05-22 20:39 GMT+8
> 用途: 新会话加载上下文用。新窗口直接发"继续 SnapProHead 项目，读 BRIEFING.md"

---

## 一、项目基本信息

| 项目 | 值 |
|------|-----|
| 产品 | SnapProHead — AI 职业头像 SaaS |
| 域名 | https://snapprohead.com |
| GitHub | https://github.com/ruifei521/headshots-starter |
| 部署 | Vercel (自动部署，但最近构建卡住了) |
| 数据库 | Supabase |
| 支付 | CREEM (Merchant of Record) |
| AI | Astria (模型训练+头像生成) |
| 技术 | Next.js 14 + Supabase SSR + Astria API |

## 二、核心 Credentials

### Supabase
- Project URL: `https://vgrqvwhkvnqsawlwywld.supabase.co`
- Project ref: `vgrqvwhkvnqsawlwywld`
- Anon key: (in .env.prod)
- Service role key: (in .env.prod)

### Astria
- API Key: (in .env.prod)
- Test Mode: `false`（生产模式）
- 余额: **$0**（需要充值才能训练）
- 基础模型: Realistic Vision V5.1 (tune_id: 690204)

### CREEM（支付）
- API Key: (in .env.prod)
- Webhook Secret: (in .env.prod)
- 产品:
  - Starter: `prod_31zqeJaVi4nCiCLGPz0F2K` → $29 → 1 credit
  - Pro: `prod_198ewWuQouDaQfEOT6kTvj` → $49 → 3 credits
  - Executive: `prod_1pZIlgHsKVk5YOK1QupnPP` → $89 → 5 credits

### Google Cloud OAuth
- Project: `snapprohead`
- Client ID: (in .env.prod)
- Client Secret: (in .env.prod)
- 授权回调: `https://vgrqvwhkvnqsawlwywld.supabase.co/auth/v1/callback`

### Resend（邮件通知）
- 当前 API Key: **空**（需配置，免费版够用）

## 三、当前定价

| 套餐 | 价格 | Credits | 承诺照片 | 承诺风格 | CREEM Product ID |
|:----|:----:|:-------:|:--------:|:--------:|:----------------:|
| Starter | $29 | 1 | 40 张 | 5 种 | `prod_31zqeJaVi4nCiCLGPz0F2K` |
| Pro | $49 | 3 | 100 张 | 10 种 | `prod_198ewWuQouDaQfEOT6kTvj` |
| Executive | $89 | 5 | 200 张 | 20 种 | `prod_1pZIlgHsKVk5YOK1QupnPP` |

## 四、已上线 5 个 Astria 职业 Pack

| 序号 | Pack Slug | 女/男 图片数 | 女/男 费用 |
|:---:|:----------|:-----------:|:----------:|
| 1 | `corporate-headshots` | 女56 / 男52 | $4.47 / $4.30 |
| 2 | `partners-headshots` | 女44 / 男40 | $3.97 / $3.81 |
| 3 | `natural-headshots` | 女44 / 男— | $3.97 / — |
| 4 | `speaker` | 女29 / 男19 | $3.35 / $2.94 |
| 5 | `realtor` | 女19 / 男20 | $2.94 / $2.98 |

## 五、已完成改动

- Google OAuth 配置检查通过 ✅
- Packs 模式开启（`packsIsEnabled = true` 硬编码） ✅
- 首页精简为 3 模块（Hero + Pricing + FAQ） ✅
- 定价页优化（per photo 价格、Most Popular 84% 标签、加购入口） ✅
- 行业落地页：`/headshots/linkedin` `/headshots/lawyer` `/headshots/realtor` ✅
- Home 键修复（登录后返回首页） ✅
- FAQ 更新（pack 和加购说明） ✅
- 信任标志去重 ✅

## 六、待办问题

1. **Vercel 构建卡住** — 新代码已 push 但没部署到线上。需检查 Vercel Dashboard → Deployments 看构建失败原因
2. **Astria 余额 $0** — 必须充值才能跑训练。去 astria.ai 充值 $10-20
3. **定价可能偏高** — Executive $89 vs PicStudio Pro+ $59.99，建议调整
4. **Resend API Key 为空** — 训练完成无邮件通知（不配置也能用）

## 七、关键文件路径

```
app/page.tsx                      ← 首页（已精简）
components/homepage/HeroSection.tsx  ← Hero
components/homepage/modern-pricing.tsx ← 定价组件（优化版）
components/homepage/faq-section.tsx ← FAQ
components/PacksGalleryZone.tsx    ← Packs 展示
app/astria/packs/route.ts          ← Packs API（已过滤6个包）
app/astria/train-model/route.ts    ← 训练 API
app/api/webhook/creem/route.ts     ← CREEM 支付回调
app/headshots/linkedin/page.tsx    ← 行业页
lib/pricing.ts                     ← 定价常量
next.config.js                     ← 已修改为 packs 模式
.env.prod                          ← 生产环境变量
```

## 八、用户偏好（老大）

- 微信/中文沟通
- 务实、快速推进，不要啰嗦
- 对客户体验要求高
- 名字: 贾斌
- 支付宝: 15618589715

---

*新会话时，读完此文件后还清先检查网站当前部署状态，再推进待办。*
