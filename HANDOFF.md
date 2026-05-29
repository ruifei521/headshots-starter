# SnapProHead 项目交接文档

> 生成时间：2026-05-29 09:50
> 当前远程 HEAD：`2b26137` (origin/main)
> 项目路径：`C:\Users\Administrator\WorkBuddy\2026-05-26-task-22\headshots-starter`

---

## 一、项目概览

| 项 | 值 |
|---|---|
| 产品名 | SnapProHead — AI 专业头像生成 SaaS |
| 线上地址 | https://snapprohead.com |
| 技术栈 | Next.js 14 App Router + Supabase + Astria AI + CREEM 支付 |
| GitHub | https://github.com/ruifei521/headshots-starter.git |
| 部署方式 | 推送到 GitHub main 分支自动触发 Vercel 部署 |

### 核心业务流程
1. 用户选择套餐（Basic $29 / Professional $39 / Executive $59）
2. 跳转 CREEM 支付
3. 支付成功 → CREEM webhook → 创建训练任务（Supabase models 表）
4. 调用 Astria API 训练 AI 模型 + 生成头像
5. 用户在 /overview 页面查看生成结果

---

## 二、关键文件索引

### 定价 & 支付
| 文件 | 作用 |
|---|---|
| `lib/tiers.ts` | 三档定价唯一数据源（Tier 类型、价格、Creem Product ID、训练参数） |
| `components/homepage/modern-pricing.tsx` | 首页定价卡片 — 点击直接跳 Creem 付费（无中间步骤） |
| `app/api/creem/checkout/route.ts` | Creem 结账 API — 接收 tier+pack 参数，创建 checkout session |
| `app/api/webhook/creem/route.ts` | Creem webhook — 支付成功后写 orders/credits，触发训练 |
| `components/homepage/tier-comparison-table.tsx` | 三档对比表 |

### Pack 模板页
| 文件 | 作用 |
|---|---|
| `app/packs/[slug]/page.tsx` | Pack 详情页 — 男/女封面选择 + 单价 $29 直接购买 |
| `app/templates/page.tsx` | 所有模板列表页 |

### AI 训练
| 文件 | 作用 |
|---|---|
| `lib/prompts.ts` | 每档 prompt 生成逻辑（Basic 10个、Professional 15个、Executive 25个） |
| `app/astria/train-model/route.ts` | 训练入口 — 创建 Astria tune + prompts |
| `app/astria/train-model/image-upload/route.ts` | 用户上传自拍 — 有 session 鉴权 + 用户路径隔离 |
| `components/TrainModelZone.tsx` | 训练页面上传组件 |
| `components/realtime/ClientSideModel.tsx` | 实时显示训练状态 |

### 首页各 Section
| 文件 | 作用 |
|---|---|
| `components/homepage/HeroSection.tsx` | Hero — "Skip the $250+ Photographer" + CTA |
| `components/homepage/ProcessSection.tsx` | 4步流程（Choose Style → Upload → AI Generates → Download） |
| `components/homepage/TestimonialsSection.tsx` | 媒体引用 + 对比表 |
| `components/homepage/faq-section.tsx` | FAQ（含竞品对比、推荐码） |
| `components/homepage/ClosingCtaSection.tsx` | 底部 CTA + 信任标识 |
| `components/homepage/3d-before-after-gallery.tsx` | 前后对比画廊（useRef 修复了闭包问题） |

### 认证
| 文件 | 作用 |
|---|---|
| `app/login/page.tsx` | 登录页（Supabase Auth） |
| 所有客户端组件 | 使用 `createBrowserClient`（非 `createClient`）读取 cookie session |

---

## 三、三档定价体系

```
Basic ($29, was $39)    → 40 HD headshots, 10 styles, sd15, ~45min
Professional ($39, was $54) → 60 HD headshots, 15 styles, sd15, ~40min  ← Most Popular
Executive ($59, was $79)    → 100 HD headshots, 25 styles, flux, ~25min ← Best Value
```

### Creem Product ID 映射
```
starter:      prod_fWHFyTDAhVb1xqwS71esu
professional: prod_453s1kOCIVZECDNqx9z1o3
executive:    prod_4Bcd1ZArXQXbWl7GWkxzUe
```

### 向后兼容旧 ID（在 lib/tiers.ts PRODUCT_ID_TO_TIER 中）
```
prod_31zqeJaVi4nCiCLGPz0F2K → starter
prod_6F4zKTNhL3V7vWPUhnjZDZ → starter
prod_198ewWuQouDaQfEOT6kTvj → professional
prod_1pZIlgHsKVk5YOK1QupnPP → executive
```

---

## 四、已完成的所有工作（按时间线）

### 第一轮：安全修复 + Bug 修复
1. 删除开放代理路由（google-forward、google-proxy）
2. 修复 proxy-google-token（移除客户端 client_secret，加鉴权）
3. 修复 image-upload（加 session 鉴权 + 用户路径隔离）
4. 修复 ClientSideModel/ClientSideModelsList（createBrowserClient + useMemo + useRef）
5. 修复 3d-before-after-gallery setInterval 闭包（useRef）
6. 修复 sitemap 死链接

### 第二轮：对标 aragon.ai 网站优化（8 项）
1. 定价页全英化
2. Pack 页加三档卡片（后又被用户要求还原，见下）
3. CTA 404 修复
4. 数字统一（12 styles）
5. Slug 统一（amichai-ai → styled-for-success）
6. 锚点修复
7. 价格文案（Starting at $29）
8. About 页 + JSON-LD 更新

### 第三轮：用户需求调整
1. **首页定价卡片直接付费** — 移除 PackSelectorModal，点击按钮直接跳 Creem
2. **Pack 详情页还原** — 从 3-tier 卡片还原为男/女封面 + 单价 $29 购买（参考 Astria 布局）

---

## 五、当前线上状态

### 已部署（远程 origin/main = `2b26137`）
- ✅ Pack 详情页：男/女封面选择 + $29 单价购买
- ✅ 首页定价：点击直接跳 Creem 付费
- ✅ 三档定价体系（Basic/Professional/Executive）
- ✅ 所有安全修复
- ✅ aragon.ai 对标优化

### 已知问题 / 未完成项
- **无重大未解决问题**
- 低优先级：19 个小问题未处理（主要是不影响功能的代码质量/SEO 细节）

---

## 六、踩过的坑 & 注意事项

1. **`createClient` vs `createBrowserClient`**：客户端组件必须用 `createBrowserClient`（读取 cookie），不能用 `createClient`（服务端）
2. **Astria 网站被 Cloudflare ASN 屏蔽**：无法从服务器直接访问 astria.ai
3. **Supabase 直连 DB 不通**：DNS/IPv6 限制，需用 Management API
4. **Jest 不兼容 vitest 语法**：项目用 vitest，运行测试用 `npx vitest run`，不要用 `npx jest`
5. **Pack 页面设计**：用户明确要求 Pack 详情页不要三档卡片，要用男/女封面 + 单价
6. **首页定价按钮**：用户要求直接跳付费，不要中间步骤（不要弹窗/不要跳模板页）
7. **image-shots slug 的图片前缀是 talya-maor**：在 allPacks 中有映射
8. **commit 用 `git commit -m`**：不要用 `/commit` 命令（不存在）
9. **环境变量**：.env.prod 中有 Astria API Key、CREEM API Key、Supabase keys
10. **tier 升级不降级**：`maxTier()` 函数确保用户 tier 只升不降

---

## 七、给下一位 Agent 的操作指南

### 如何验证当前状态
```bash
cd "C:\Users\Administrator\WorkBuddy\2026-05-26-task-22\headshots-starter"
npx tsc --noEmit --pretty   # TypeScript 编译检查
npx vitest run               # 运行 71 个测试
git status                   # 检查未提交改动
git log --oneline -5         # 查看最近提交
```

### 如何部署
```bash
git push origin main         # 推送触发 Vercel 自动部署
```

### 如何修改代码
1. 先 `Read` 文件看当前内容
2. 用 `Edit` 或 `Write` 修改
3. `npx tsc --noEmit` 检查编译
4. `npx vitest run` 运行测试
5. `git add` + `git commit -m` + `git push origin main` 部署

### 项目长期记忆文件
- **每日日志**：`.workbuddy/memory/YYYY-MM-DD.md`
- **长期记忆**：`.workbuddy/memory/MEMORY.md`
