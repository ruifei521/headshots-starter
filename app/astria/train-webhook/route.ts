import { Database } from "@/types/supabase";
import { createClient } from "@supabase/supabase-js";
import * as crypto from "crypto";
import { NextResponse } from "next/server";
import { Resend } from "resend";

export const dynamic = "force-dynamic";

const resendApiKey = process.env.RESEND_API_KEY;
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const appWebhookSecret = process.env.APP_WEBHOOK_SECRET;

if (!resendApiKey) {
  console.warn(
    "We detected that the RESEND_API_KEY is missing from your environment variables. The app should still work but email notifications will not be sent. Please add your RESEND_API_KEY to your environment variables if you want to enable email notifications."
  );
}

if (!supabaseUrl) {
  console.warn("MISSING NEXT_PUBLIC_SUPABASE_URL - train-webhook will not function.");
}

if (!supabaseServiceRoleKey) {
  console.warn("MISSING SUPABASE_SERVICE_ROLE_KEY - train-webhook will not function.");
}

if (!appWebhookSecret) {
  console.warn("MISSING APP_WEBHOOK_SECRET - train-webhook will not function.");
}

export async function POST(request: Request) {
  type TuneData = {
    id: number;
    title: string;
    name: string;
    steps: null;
    trained_at: null;
    started_training_at: null;
    created_at: string;
    updated_at: string;
    expires_at: null;
  };

  const incomingData = (await request.json()) as { tune: TuneData };

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
 

  // HMAC 验证（仅当 appWebhookSecret 配置时）
  if (appWebhookSecret) {
    if (!webhook_token) {
      return NextResponse.json(
        { message: "Malformed URL, no webhook_token detected!" },
        { status: 500 }
      );
    }

    if (user_id) {
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
    }
  }

  if (!user_id) {
    return NextResponse.json(
      {
        message: "Malformed URL, no user_id detected!",
      },
      { status: 500 }
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
    // ⭐ 1. 读取 model 信息（仅用于日志）
    const { data: modelData, error: modelFetchError } = await supabase
      .from("models")
      .select("id, tier, type")
      .eq("id", Number(model_id))
      .single();

    if (modelFetchError) {
      console.error("Error fetching model:", modelFetchError);
    }

    const modelTier: string = modelData?.tier || 'starter';
    const modelType: string = modelData?.type || 'person';
    console.log(`Train webhook: model_id=${model_id}, tier=${modelTier}, type=${modelType}`);

    if (resendApiKey) {
      const resend = new Resend(resendApiKey);
      await resend.emails.send({
        from: "contact@snapprohead.com",
        to: user?.email ?? "",
        subject: "Your model was successfully trained!",
        html: `<h2>We're writing to notify you that your model training was successful! Your headshots are being generated now.</h2>`,
      });
    }

    // ⭐ 2. 更新 model 状态为 finished
    // prompts 已在 train-model 创建时通过 prompts_attributes 一并提交，
    // Astria 训练完成后会自动跑所有 prompts，每个 prompt 完成时回调 prompt-webhook
    // 兼容 pending（超时场景）和 processing（正常场景）
    const { data: modelUpdated, error: modelUpdatedError } = await supabase
      .from("models")
      .update({
        modelId: `${tune.id}`,
        status: "finished",
      })
      .eq("id", Number(model_id))
      .select();

    if (modelUpdatedError) {
      console.error({ modelUpdatedError });
      return NextResponse.json(
        {
          message: "Something went wrong!",
        },
        { status: 500 }
      );
    }

    if (!modelUpdated) {
      console.error("No model updated!");
      console.error({ modelUpdated });
    }

    // ⭐ 3. 扣减 credits（确保只有训练成功才扣）
    // 之前 credit 扣减在 train-model 中，超时场景会导致扣了但请求可能未到达 Astria
    // 现在统一由 train-webhook 回调确认训练成功后扣减
    const paymentIsConfigured = !!(process.env.NEXT_PUBLIC_STRIPE_IS_ENABLED === "true" || process.env.NEXT_PUBLIC_CREEM_IS_ENABLED === "true");
    if (paymentIsConfigured) {
      try {
        const { data: currentCredits, error: creditFetchError } = await supabase
          .from("credits")
          .select("credits")
          .eq("user_id", user_id)
          .single();

        if (!creditFetchError && currentCredits && currentCredits.credits > 0) {
          const { error: updateCreditError } = await supabase
            .from("credits")
            .update({ credits: currentCredits.credits - 1 })
            .eq("user_id", user_id);

          if (updateCreditError) {
            console.error("train-webhook: Failed to deduct credits:", updateCreditError);
          } else {
            console.log(`train-webhook: Credit deducted for user ${user_id}, remaining: ${currentCredits.credits - 1}`);
          }
        } else {
          console.warn(`train-webhook: No credits to deduct for user ${user_id} (credits=${currentCredits?.credits})`);
        }
      } catch (creditErr) {
        // 不阻塞主流程：model 状态已更新，credits 扣减失败仅记录日志
        console.error("train-webhook: Credit deduction error:", creditErr);
      }
    }

    return NextResponse.json(
      {
        message: "success",
      },
      { status: 200, statusText: "Success" }
    );
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      {
        message: "Something went wrong!",
      },
      { status: 500 }
    );
  }
}
