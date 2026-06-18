import { Database } from "@/types/supabase";
import { createClient } from "@supabase/supabase-js";
import * as crypto from "crypto";
import { NextResponse } from "next/server";
import { logger } from "@/lib/logger";
import {
  attachAstriaTuneToModel,
  shouldSkipTrainWebhook,
  submitPromptsAfterTraining,
} from "@/lib/complete-tune-prompts";
import {
  isAstriaTuneFailure,
  markTrainingFailedAndNotify,
} from "@/lib/training-failure";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const appWebhookSecret = process.env.APP_WEBHOOK_SECRET;

if (!supabaseUrl) {
  logger.warn("MISSING NEXT_PUBLIC_SUPABASE_URL - train-webhook will not function.");
}

if (!supabaseServiceRoleKey) {
  logger.warn("MISSING SUPABASE_SERVICE_ROLE_KEY - train-webhook will not function.");
}

type TunePayload = {
  id: number;
  title: string;
  name: string;
  steps: null;
  trained_at: string | null;
  started_training_at: string | null;
  created_at: string;
  updated_at: string;
  expires_at: null;
  error?: string;
  status?: string;
};

export async function POST(request: Request) {
  // ⭐ 强制鉴权：webhook 必须配置 APP_WEBHOOK_SECRET，防止外部攻击者伪造回调
  if (!appWebhookSecret) {
    return NextResponse.json(
      { message: "Server misconfigured: APP_WEBHOOK_SECRET is not set." },
      { status: 500 }
    );
  }

  const incomingData = (await request.json()) as {
    tune?: TunePayload;
    error?: string;
  };

  const { tune } = incomingData;

  const urlObj = new URL(request.url);
  const user_id = urlObj.searchParams.get("user_id");
  const model_id = urlObj.searchParams.get("model_id");
  const webhook_token = urlObj.searchParams.get("webhook_token");

  if (!model_id) {
   return NextResponse.json(
     {
       message: "Malformed URL, no model_id detected!",
     },
     { status: 500 }
   );
  }
 

  // ⭐ HMAC 签名验证（强制，appWebhookSecret 已在 POST 入口保证存在）
  if (!webhook_token) {
    return NextResponse.json(
      { message: "Malformed URL, no webhook_token detected!" },
      { status: 500 }
    );
  }

  if (!user_id) {
    return NextResponse.json(
      { message: "Malformed URL, no user_id detected!" },
      { status: 500 }
    );
  }

  // Verify HMAC token — always verify regardless of user_id state
  const expectedToken = crypto
    .createHmac("sha256", appWebhookSecret)
    .update(`${user_id}:${model_id}`)
    .digest("hex");

  if (webhook_token !== expectedToken) {
    return NextResponse.json(
      { message: "Unauthorized!" },
      { status: 401 }
    );
  }

  const supabase = createClient<Database>(
    supabaseUrl as string,
    supabaseServiceRoleKey as string,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
        detectSessionInUrl: false,
      },
    }
  );

  const {
    data: { user },
    error,
  } = await supabase.auth.admin.getUserById(user_id);

  if (error) {
    return NextResponse.json(
      {
        message: error.message,
      },
      { status: 401 }
    );
  }

  if (!user) {
    return NextResponse.json(
      {
        message: "Unauthorized",
      },
      { status: 401 }
    );
  }

  try {
    const { data: modelData, error: modelFetchError } = await supabase
      .from("models")
      .select("id, tier, type, status, name")
      .eq("id", Number(model_id))
      .single();

    if (modelFetchError) {
      logger.error("Error fetching model:", modelFetchError);
    }

    if (!modelData) {
      logger.error(`Train webhook: Model ${model_id} not found`);
      return NextResponse.json(
        { message: "Model not found." },
        { status: 404 }
      );
    }

    const modelTier: string = modelData?.tier || 'starter';
    const modelType: string = modelData?.type || 'man';
    logger.log(`Train webhook: model_id=${model_id}, tier=${modelTier}, type=${modelType}`);

    if (
      await shouldSkipTrainWebhook({
        supabase,
        modelId: Number(model_id),
        status: modelData?.status ?? null,
      })
    ) {
      logger.log(
        `Train webhook: Model ${model_id} already ${modelData?.status}, skipping (idempotent)`
      );
      return NextResponse.json(
        { message: "success", idempotent: true },
        { status: 200 }
      );
    }

    const astriaFailed =
      !!incomingData.error ||
      (tune != null && isAstriaTuneFailure(tune as Record<string, unknown>));

    if (astriaFailed || !tune?.id) {
      logger.error(
        `Train webhook: Astria training failed for model ${model_id}`,
        incomingData.error ?? tune?.error ?? "missing tune id"
      );
      await markTrainingFailedAndNotify({
        supabase,
        userId: user_id,
        userEmail: user.email,
        modelId: Number(model_id),
        modelName: modelData.name,
        reason: "astria_training",
      });
      return NextResponse.json({ message: "success", failed: true }, { status: 200 });
    }

    if (!(await attachAstriaTuneToModel(supabase, Number(model_id), tune.id))) {
      return NextResponse.json(
        { message: "Something went wrong!" },
        { status: 500 }
      );
    }

    const promptResult = await submitPromptsAfterTraining({
      supabase,
      modelId: Number(model_id),
      userId: user_id,
      userEmail: user.email,
      modelName: modelData.name,
      astriaTuneId: tune.id,
      tier: modelTier,
      type: modelType,
    });

    if (promptResult.outcome === "error") {
      return NextResponse.json(
        { message: "Something went wrong!" },
        { status: 500 }
      );
    }

    // Credit deducted atomically at train-model start — no deduction here.

    return NextResponse.json(
      {
        message: "success",
        promptsSubmitted: promptResult.outcome === "submitted",
      },
      { status: 200, statusText: "Success" }
    );
  } catch (e) {
    logger.error(e);
    return NextResponse.json(
      {
        message: "Something went wrong!",
      },
      { status: 500 }
    );
  }
}
