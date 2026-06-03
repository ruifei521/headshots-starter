import { Database } from "@/types/supabase";
import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import axios from "axios";
import * as crypto from "crypto";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getTrainingConfig, isTier } from "@/lib/tiers";
import { getTierPrompts } from "@/lib/prompts";
import { logger } from "@/lib/logger";

export const dynamic = "force-dynamic";
// maxDuration no longer needed: training is non-blocking (fire-and-forget)

const astriaApiKey = process.env.ASTRIA_API_KEY;
const astriaTestModeIsOn = process.env.ASTRIA_TEST_MODE === "true";

const appWebhookSecret = process.env.APP_WEBHOOK_SECRET;
const stripeIsConfigured = process.env.NEXT_PUBLIC_STRIPE_IS_ENABLED === "true";
const creemIsConfigured = process.env.NEXT_PUBLIC_CREEM_IS_ENABLED === "true";
const paymentIsConfigured = stripeIsConfigured || creemIsConfigured;

if (!appWebhookSecret) {
  logger.warn("MISSING APP_WEBHOOK_SECRET - train-model webhook will not function.");
}

/** 生成 HMAC-SHA256 webhook token，避免明文 secret 出现在 URL 中 */
const generateWebhookToken = (uid: string, mid: number): string | null => {
  if (!appWebhookSecret) return null;
  return crypto
    .createHmac("sha256", appWebhookSecret)
    .update(`${uid}:${mid}`)
    .digest("hex");
};

export async function POST(request: Request) {
  let payload;
  try {
    payload = await request.json();
  } catch (e) {
    logger.error("Failed to parse request JSON:", e);
    return NextResponse.json({ message: "Invalid request body" }, { status: 400 });
  }
  
  const images = payload.urls;
  const type = payload.type;
  const pack = payload.pack;
  const name = payload.name;
  const characteristics = payload.characteristics;

  // First verify user is authenticated using anon key + cookies
  const supabaseAuth = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookies().getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            try {
              cookies().set(name, value, options);
            } catch {
              // The `set` method was called from a Server Component.
            }
          });
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabaseAuth.auth.getUser();

  if (!user) {
    return NextResponse.json(
      {
        message: "Unauthorized",
      },
      { status: 401 }
    );
  }

  // Use service_role_key for database writes to bypass RLS
  const supabase = createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );

  if (!astriaApiKey) {
    return NextResponse.json(
      {
        message:
          "Missing API Key: Add your Astria API Key to generate headshots",
      },
      {
        status: 500,
      }
    );
  }

  if (images?.length < 3) {
    return NextResponse.json(
      {
        message: "Upload at least 3 sample images",
      },
      { status: 500 }
    );
  }

  // ⭐ 读取用户 tier（用于决定训练参数）
  let userTier: string = 'starter';

  if (paymentIsConfigured) {
    const { error: creditError, data: credits } = await supabase
      .from("credits")
      .select("credits, tier")
      .eq("user_id", user.id);

    if (creditError) {
      logger.error({ creditError });
      return NextResponse.json(
        {
          message: "Something went wrong!",
        },
        { status: 500 }
      );
    }

    if (credits.length === 0) {
      // create credits for user.
      const { error: errorCreatingCredits } = await supabase
        .from("credits")
        .insert({
          user_id: user.id,
          credits: 0,
          tier: 'starter',
        });

      if (errorCreatingCredits) {
        logger.error({ errorCreatingCredits });
        return NextResponse.json(
          {
            message: "Something went wrong!",
          },
          { status: 500 }
        );
      }

      return NextResponse.json(
        {
          error: "no_credits",
          message:
            "No credits available. Please purchase a plan to start training.",
        },
        { status: 402 }
      );
    } else if (credits[0]?.credits < 1) {
      return NextResponse.json(
        {
          error: "no_credits",
          message:
            "You've used all your credits. Please purchase more to continue.",
        },
        { status: 402 }
      );
    } else {
      // ⭐ 读取用户 tier（向后兼容：无 tier 字段默认 starter）
      userTier = credits[0]?.tier || 'starter';
      logger.log(`User ${user.id} tier: ${userTier}`);
    }
  }

  // ⭐ 根据 tier 决定训练配置
  const trainingConfig = getTrainingConfig(isTier(userTier) ? userTier : 'starter');

  logger.log(`Training config: branch=${trainingConfig.branch}, tier=${userTier}`);

  // ⭐ 计算 total_images（从 prompts 数量得出）
  const effectiveTierForCount = isTier(userTier) ? userTier : 'starter';
  const promptTemplatesForCount = getTierPrompts(effectiveTierForCount, type);
  const totalImages = promptTemplatesForCount.reduce((s, t) => s + t.num_images, 0);

  // create a model row in supabase — ⭐ 非阻塞模式：初始状态为 'training'
  // 后续由 train-webhook 回调更新为 'finished'，或由前端实时订阅感知状态变化
  const { error: modelError, data } = await supabase
    .from("models")
    .insert({
      user_id: user.id,
      name,
      type,
      tier: userTier,
      status: 'training',
      total_images: totalImages,   // ⭐ 写入预计总图片数（prompt-webhook 用于判断完成）
    })
    .select("id")
    .single();

  if (modelError) {
    logger.error("modelError: ", modelError);
    return NextResponse.json(
      {
        message: modelError.message || "Failed to create model record.",
      },
      { status: 500 }
    );
  }
  
  // Get the modelId from the created model
  const modelId = data?.id;

  try {
    // ⭐ 1. 先保存 samples（不依赖 Astria 响应，提前完成以减少阻塞）
    const { error: samplesError } = await supabase.from("samples").insert(
      images.map((sample: string) => ({
        modelId: modelId,
        uri: sample,
      }))
    );

    if (samplesError) {
      logger.error("samplesError: ", samplesError);
      return NextResponse.json(
        { message: samplesError.message || "Failed to save image samples." },
        { status: 500 }
      );
    }

    // ⭐ 2. 构建 webhook URLs
    const deploymentUrl = process.env.DEPLOYMENT_URL || process.env.VERCEL_URL || '';
    const baseUrl = deploymentUrl.startsWith('http://') || deploymentUrl.startsWith('https://') 
      ? deploymentUrl 
      : `https://${deploymentUrl}`;

    const webhookToken = generateWebhookToken(user.id, modelId);
    const trainWebhook = `${baseUrl}/astria/train-webhook`;
    const trainWebhookWithParams = webhookToken
      ? `${trainWebhook}?user_id=${user.id}&model_id=${modelId}&webhook_token=${webhookToken}`
      : `${trainWebhook}?user_id=${user.id}&model_id=${modelId}`;

    const promptWebhook = `${baseUrl}/astria/prompt-webhook`;
    const promptWebhookWithParams = webhookToken
      ? `${promptWebhook}?user_id=${user.id}&model_id=${modelId}&webhook_token=${webhookToken}`
      : `${promptWebhook}?user_id=${user.id}&model_id=${modelId}`;

    // ⭐ 3. 构建 Astria 请求体
    const branch = astriaTestModeIsOn ? "fast" : trainingConfig.branch;
    const promptTemplates = promptTemplatesForCount;
    const promptsAttributes = promptTemplates.map(t => ({
      text: t.text,
      callback: promptWebhookWithParams,
      num_images: t.num_images,
    }));

    logger.log(`Firing tune with ${promptsAttributes.length} prompts (non-blocking), tier=${effectiveTierForCount} (${totalImages} images)`);

    const tuneBody: Record<string, any> = {
      tune: {
        title: name,
        name: type,
        branch: branch,
        model_type: "lora",
        token: "ohwx",
        image_urls: images,
        callback: trainWebhookWithParams,
        prompts_attributes: promptsAttributes,
      },
    };

    if (characteristics && typeof characteristics === 'object' && Object.keys(characteristics).length > 0) {
      tuneBody.tune.characteristics = characteristics;
    }

    // ⭐ 4. 非阻塞模式：fire-and-forget Astria API 调用
    // - 不 await Astria 响应 → Vercel Hobby 10s 限制不再阻塞训练
    // - 成功路径：train-webhook 回调负责更新模型状态 + 扣减 credits
    // - 失败路径：.catch() 将模型标记为 failed
    const API_KEY = astriaApiKey;
    const DOMAIN = "https://api.astria.ai";

    axios.post(DOMAIN + "/tunes", tuneBody, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
      },
      timeout: 30000, // 30s 给后台请求本身（不影响 HTTP 响应）
    })
      .then(async (response) => {
        if (response.status === 201) {
          const astriaId = (response.data as any)?.id;
          logger.log(`Astria tune accepted: model_id=${modelId}, astria_id=${astriaId}`);
          if (astriaId) {
            await supabase
              .from("models")
              .update({ modelId: `${astriaId}` })
              .eq("id", modelId);
          }
        } else {
          logger.error(`Astria rejected model ${modelId}: status ${response.status}`);
          await supabase.from("models").update({ status: "failed" }).eq("id", modelId);
        }
      })
      .catch(async (e: any) => {
        const statusCode = e?.response?.status;
        // 4xx = 请求格式错误（不可恢复）→ 标记 failed
        // 5xx / timeout = 服务端暂时不可用 → 保留 training 状态，train-webhook 可能仍会回调
        if (statusCode && statusCode >= 400 && statusCode < 500) {
          logger.error(`Astria 4xx for model ${modelId}:`, e?.response?.data);
          await supabase.from("models").update({ status: "failed" }).eq("id", modelId);
        } else {
          logger.warn(`Astria request pending for model ${modelId}: ${e?.message || 'unknown'}`);
          // 保持 training 状态，train-webhook 回调时会更新
        }
      });

    // ⭐ 5. 立即返回 — 不等待 Astria 响应
    return NextResponse.json(
      {
        message: "success",
        model_id: modelId,
        status: "training",
      },
      { status: 200 }
    );
  } catch (e: any) {
    // 仅捕获 samples insert 等同步操作的错误
    logger.error("Train model pre-flight error:", e);
    if (modelId) {
      await supabase.from("models").delete().eq("id", modelId);
    }
    return NextResponse.json(
      { message: e?.message || "Something went wrong!" },
      { status: 500 }
    );
  }
}
