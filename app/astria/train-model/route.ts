import { Database } from "@/types/supabase";
import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import axios from "axios";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getTrainingConfig, isTier } from "@/lib/tiers";
import { getTierPrompts } from "@/lib/prompts";

export const dynamic = "force-dynamic";
export const maxDuration = 30; // Extend Vercel timeout for Astria API call

const astriaApiKey = process.env.ASTRIA_API_KEY;
const astriaTestModeIsOn = process.env.ASTRIA_TEST_MODE === "true";

const appWebhookSecret = process.env.APP_WEBHOOK_SECRET;
const stripeIsConfigured = process.env.NEXT_PUBLIC_STRIPE_IS_ENABLED === "true";
const creemIsConfigured = process.env.NEXT_PUBLIC_CREEM_IS_ENABLED === "true";
const paymentIsConfigured = stripeIsConfigured || creemIsConfigured;

if (!appWebhookSecret) {
  console.warn("MISSING APP_WEBHOOK_SECRET - train-model webhook will not function.");
}

export async function POST(request: Request) {
  console.log("=== TRAIN MODEL ROUTE CALLED ===", new Date().toISOString());
  
  let payload;
  try {
    payload = await request.json();
  } catch (e) {
    console.error("Failed to parse request JSON:", e);
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
  let _credits: any = null;

  if (paymentIsConfigured) {
    const { error: creditError, data: credits } = await supabase
      .from("credits")
      .select("credits, tier")
      .eq("user_id", user.id);

    if (creditError) {
      console.error({ creditError });
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
        console.error({ errorCreatingCredits });
        return NextResponse.json(
          {
            message: "Something went wrong!",
          },
          { status: 500 }
        );
      }

      return NextResponse.json(
        {
          message:
            "Not enough credits, please purchase some credits and try again.",
        },
        { status: 500 }
      );
    } else if (credits[0]?.credits < 1) {
      return NextResponse.json(
        {
          message:
            "Not enough credits, please purchase some credits and try again.",
        },
        { status: 500 }
      );
    } else {
      _credits = credits;
      // ⭐ 读取用户 tier（向后兼容：无 tier 字段默认 starter）
      userTier = credits[0]?.tier || 'starter';
      console.log(`User ${user.id} tier: ${userTier}`);
    }
  }

  // ⭐ 根据 tier 决定训练配置
  const trainingConfig = getTrainingConfig(isTier(userTier) ? userTier : 'starter');

  console.log(`Training config: branch=${trainingConfig.branch}, tier=${userTier}`);

  // create a model row in supabase — ⭐ 写入 tier
  const { error: modelError, data } = await supabase
    .from("models")
    .insert({
      user_id: user.id,
      name,
      type,
      tier: userTier,  // ⭐ 记录训练时的 tier
    })
    .select("id")
    .single();

  if (modelError) {
    console.error("modelError: ", modelError);
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
    const deploymentUrl = process.env.DEPLOYMENT_URL || '';
    const baseUrl = deploymentUrl.startsWith('http://') || deploymentUrl.startsWith('https://') 
      ? deploymentUrl 
      : `https://${deploymentUrl}`;

    const trainWebhook = `${baseUrl}/astria/train-webhook`;
    const trainWebhookWithParams = appWebhookSecret
      ? `${trainWebhook}?user_id=${user.id}&model_id=${modelId}&webhook_secret=${appWebhookSecret}`
      : `${trainWebhook}?user_id=${user.id}&model_id=${modelId}`;

    const promptWebhook = `${baseUrl}/astria/prompt-webhook`;
    const promptWebhookWithParams = appWebhookSecret
      ? `${promptWebhook}?user_id=${user.id}&model_id=${modelId}&webhook_secret=${appWebhookSecret}`
      : `${promptWebhook}?user_id=${user.id}&model_id=${modelId}`;

    console.log({ trainWebhookWithParams, promptWebhookWithParams });
    const API_KEY = astriaApiKey;
    const DOMAIN = "https://api.astria.ai";

    // ⭐ 根据 tier 决定 branch
    const branch = astriaTestModeIsOn ? "fast" : trainingConfig.branch;

    // ⭐ 一次性生成该 tier 的所有 prompts（含 callback → prompt-webhook）
    // Astria 训练完成后自动跑所有 prompts，每个 prompt 完成时回调 prompt-webhook
    const effectiveTier = isTier(userTier) ? userTier : 'starter';
    const promptTemplates = getTierPrompts(effectiveTier, type);
    const promptsAttributes = promptTemplates.map(t => ({
      text: t.text,
      callback: promptWebhookWithParams,
      num_images: t.num_images,
    }));

    console.log(`Creating tune with ${promptsAttributes.length} prompts for tier=${effectiveTier} (${promptTemplates.reduce((s, t) => s + t.num_images, 0)} images)`);

    // Create a fine tuned model using Astria tune API
    // ⭐ Flux 使用 LoRA 微调，不需要 base_tune_id（SD1.5 才需要指定 base checkpoint）
    // SD1.5 base_tune_id 690204 = Realistic Vision v5.1（仅 sd15 分支使用）
    const tuneBody: Record<string, any> = {
      tune: {
        title: name,
        name: type,
        branch: branch,
        token: "ohwx",
        image_urls: images,
        callback: trainWebhookWithParams,
        characteristics,
        prompts_attributes: promptsAttributes,
      },
    };

    // SD1.5 分支需要指定 base_tune_id（Realistic Vision v5.1）
    // Flux 分支使用 LoRA 微调，不传 base_tune_id
    if (branch === 'sd15') {
      tuneBody.tune.base_tune_id = 690204;
    }

    // ⭐ POST /tunes + prompts_attributes：一次调用完成训练 + 出图
    const response = await axios.post(
      DOMAIN + "/tunes",
      tuneBody,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${API_KEY}`,
        },
      }
    );

    const { status, data: astriaData } = response;

    if (status !== 201) {
      console.error("Astria API error - status:", status, "response:", astriaData);
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
      console.error("samplesError: ", samplesError);
      return NextResponse.json(
        {
          message: samplesError.message || "Failed to save image samples.",
        },
        { status: 500 }
      );
    }

    if (paymentIsConfigured && _credits && _credits.length > 0) {
      const subtractedCredits = _credits[0].credits - 1;
      const { error: updateCreditError, data: creditData } = await supabase
        .from("credits")
        .update({ credits: subtractedCredits })
        .eq("user_id", user.id)
        .select("*");

      console.log({ creditData });
      console.log({ subtractedCredits });

      if (updateCreditError) {
        console.error({ updateCreditError });
        return NextResponse.json(
          {
            message: updateCreditError.message || "Failed to update credits.",
          },
          { status: 500 }
        );
      }
    }
  } catch (e: any) {
    console.error("Train model error:", e);
    // Rollback: Delete the created model if something goes wrong
    if (modelId) {
      await supabase.from("models").delete().eq("id", modelId);
    }
    const message = e?.response?.data?.message || e?.message || "Something went wrong!";
    return NextResponse.json(
      {
        message,
      },
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
