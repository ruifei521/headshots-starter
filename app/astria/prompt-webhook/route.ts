import { Database } from "@/types/supabase";
import { createClient } from "@supabase/supabase-js";
import * as crypto from "crypto";
import { NextResponse } from "next/server";

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
  console.warn("MISSING NEXT_PUBLIC_SUPABASE_URL - prompt-webhook will not function.");
}

if (!supabaseServiceRoleKey) {
  console.warn("MISSING SUPABASE_SERVICE_ROLE_KEY - prompt-webhook will not function.");
}

if (!appWebhookSecret) {
  console.warn("MISSING APP_WEBHOOK_SECRET - prompt-webhook will not function.");
}

export async function POST(request: Request) {
  type PromptData = {
    id: number;
    text: string;
    negative_prompt: string;
    steps: null;
    tune_id: number;
    trained_at: string;
    started_training_at: string;
    created_at: string;
    updated_at: string;
    images: string[];
  };
  
  const incomingData = (await request.json()) as { prompt: PromptData };

  const { prompt } = incomingData;

  console.log({ prompt });

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

  // HMAC 验证
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
    // ⭐ 多 Pack 兼容：所有 prompt 回调统一处理
    // 无论是主 Pack（corporate-headshots）还是额外 Pack（partners/natural/speaker/realtor），
    // 都通过相同的 prompt-webhook 回调，model_id 保持不变
    const allHeadshots = prompt.images;
    
    const { data: model, error: modelError } = await supabase
      .from("models")
      .select("*")
      .eq("id", Number(model_id))
      .single();

    if (modelError) {
      console.error({ modelError });
      return NextResponse.json(
        {
          message: "Something went wrong!",
        },
        { status: 500 }
      );
    }

    await Promise.all(
      allHeadshots.map(async (image) => {
        const { error: imageError } = await supabase.from("images").insert({
          modelId: Number(model.id),
          uri: image,
        });
        if (imageError) {
          console.error({ imageError });
        }
      })
    );
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
