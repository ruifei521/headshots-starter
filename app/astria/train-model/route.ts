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
export const maxDuration = 30; // Extend Vercel timeout for Astria API call

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

  if (images?.length < 4) {
    return NextResponse.json(
      {
        message: "Upload at least 4 sample images",
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
  // 这里先算一次用于 model.insert，正式值后面 promptsAttributes 生成后对齐
  // 使用 getTierPrompts 预计算（后面正式生成时复用）
  const effectiveTierForCount = isTier(userTier) ? userTier : 'starter';
  const promptTemplatesForCount = getTierPrompts(effectiveTierForCount, type);
  const totalImages = promptTemplatesForCount.reduce((s, t) => s + t.num_images, 0);

  // create a model row in supabase — ⭐ 写入 tier + 进度字段
  const { error: modelError, data } = await supabase
    .from("models")
    .insert({
      user_id: user.id,
      name,
      type,
      tier: userTier,           // ⭐ 记录训练时的 tier
      status: 'processing',     // 显式设置初始状态
      images_generated: 0,      // 初始 0
      total_images: totalImages, // 预计总图片数
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
    // ⭐ 使用 VERCEL_URL 作为 fallback（Vercel 自动注入）
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

    const API_KEY = astriaApiKey;
    const DOMAIN = "https://api.astria.ai";

    // ⭐ 根据 tier 决定 branch
    const branch = astriaTestModeIsOn ? "fast" : trainingConfig.branch;

    // ⭐ 复用已计算的 prompts（与 model.insert 时一致）
    const promptTemplates = promptTemplatesForCount;
    const promptsAttributes = promptTemplates.map(t => ({
      text: t.text,
      callback: promptWebhookWithParams,
      num_images: t.num_images,
    }));

    logger.log(`Creating tune with ${promptsAttributes.length} prompts for tier=${effectiveTierForCount} (${totalImages} images)`);

    // Create a fine tuned model using Astria tune API
    // Flux 使用 LoRA 微调
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

    // ⭐ 只有 non-empty characteristics 才发给 Astria（避免空对象导致 422）
    if (characteristics && typeof characteristics === 'object' && Object.keys(characteristics).length > 0) {
      tuneBody.tune.characteristics = characteristics;
    }

    // ⭐ POST /tunes + prompts_attributes：一次调用完成训练 + 出图
    // Vercel Hobby plan 函数超时 10s，设置 axios 9s 防止被 Vercel 杀掉
    const response = await axios.post(
      DOMAIN + "/tunes",
      tuneBody,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${API_KEY}`,
        },
        timeout: 9000, // 9s，留 1s 给 Vercel 返回响应
      }
    );

    const { status, data: astriaData } = response;

    if (status !== 201) {
      logger.error("Astria API error - status:", status, "response:", astriaData);
      // Rollback: Delete the created model if something goes wrong
      if (modelId) {
        await supabase.from("models").delete().eq("id", modelId);
      }

      const errorMessage = (astriaData as any)?.message || (astriaData as any)?.error || `Astria API returned status ${status}`;
      return NextResponse.json(
        {
          message: errorMessage,
        },
        { status }
      );
    }

    const { error: samplesError } = await supabase.from("samples").insert(
      images.map((sample: string) => ({
        modelId: modelId,
        uri: sample,
      }))
    );

    if (samplesError) {
      logger.error("samplesError: ", samplesError);
      return NextResponse.json(
        {
          message: samplesError.message || "Failed to save image samples.",
        },
        { status: 500 }
      );
    }

    // ⭐ credits 扣减移到 train-webhook（确保只有训练成功才扣）
    // 之前在此处扣减，但超时场景下 Astria 可能实际排队了但响应未到
  } catch (e: any) {
    logger.error("Train model error:", e);
    // ⭐ Axios 超时（ECONNABORTED）：请求已发出但 Astria 响应慢，Vercel Hobby 10s 限制
    // 保留 model 行，标记为 pending — train-webhook 回调时会更新为 finished + 扣 credits
    if (e?.code === 'ECONNABORTED' || e?.message?.includes('timeout')) {
      logger.warn("Astria request timed out (likely queued successfully) — setting status=pending");
      if (modelId) {
        await supabase
          .from("models")
          .update({ status: "pending" })
          .eq("id", modelId);
      }
      return NextResponse.json(
        { message: "success", queued: true },
        { status: 202 }
      );
    }
    // 🔍 Astria 422/400 等错误 — 打印完整响应体用于排查
    if (e?.response) {
      logger.error("Astria response status:", e.response.status);
      logger.error("Astria response data:", JSON.stringify(e.response.data, null, 2));
    }
    // Rollback: Delete the created model if something goes wrong
    if (modelId) {
      await supabase.from("models").delete().eq("id", modelId);
    }
    const message = e?.response?.data?.message || e?.response?.data?.error || e?.message || "Something went wrong!";
    // 提取 Astria errors 数组（通常是具体的校验错误）
    const details = e?.response?.data?.errors
      ? (Array.isArray(e.response.data.errors)
          ? e.response.data.errors.map((err: any) => typeof err === 'string' ? err : (err.message || JSON.stringify(err))).join("; ")
          : JSON.stringify(e.response.data.errors))
      : (e?.response?.data?.details || '');
    return NextResponse.json(
      { message, details },
      { status: e?.response?.status || 500 }
    );
  }

  return NextResponse.json(
    {
      message: "success",
    },
    { status: 200 }
  );
}
