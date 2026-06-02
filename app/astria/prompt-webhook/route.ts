import { Database } from "@/types/supabase";
import { createClient } from "@supabase/supabase-js";
import * as crypto from "crypto";
import { NextResponse } from "next/server";
import { Resend } from "resend";
import { logger } from "@/lib/logger";

export const dynamic = "force-dynamic";

const resendApiKey = process.env.RESEND_API_KEY;
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const astriaApiKey = process.env.ASTRIA_API_KEY;

const appWebhookSecret = process.env.APP_WEBHOOK_SECRET;

if (!resendApiKey) {
  logger.warn(
    "We detected that the RESEND_API_KEY is missing from your environment variables. The app should still work but email notifications will not be sent. Please add your RESEND_API_KEY to your environment variables if you want to enable email notifications."
  );
}

if (!supabaseUrl) {
  logger.warn("MISSING NEXT_PUBLIC_SUPABASE_URL - prompt-webhook will not function.");
}

if (!supabaseServiceRoleKey) {
  logger.warn("MISSING SUPABASE_SERVICE_ROLE_KEY - prompt-webhook will not function.");
}

/**
 * ⭐ 从 Astria CDN 下载图片并上传到 Supabase Storage
 * Astria CDN (mp.astria.ai) 对匿名请求返回 403，需 API key 认证下载。
 * 转存到 Supabase Storage 后返回公开 URL，避免 CDN 封锁问题。
 */
async function downloadAndUploadToStorage(
  astriaUrl: string,
  modelId: number,
  imageIndex: number
): Promise<string> {
  const BUCKET = 'headshots';
  
  // Step 1: Download from Astria CDN with API key
  const downloadRes = await fetch(astriaUrl, {
    headers: { Authorization: `Bearer ${astriaApiKey}` },
  });
  
  if (!downloadRes.ok) {
    throw new Error(`Download failed: ${downloadRes.status} ${downloadRes.statusText}`);
  }
  
  const buffer = Buffer.from(await downloadRes.arrayBuffer());
  
  // Step 2: Upload to Supabase Storage
  const fileName = `model-${modelId}/${imageIndex}-${Date.now()}.jpg`;
  const uploadUrl = `${supabaseUrl}/storage/v1/object/${BUCKET}/${fileName}`;
  
  const uploadRes = await fetch(uploadUrl, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${supabaseServiceRoleKey}`,
      'Content-Type': 'image/jpeg',
      'x-upsert': 'true',
    },
    body: buffer,
  });
  
  if (!uploadRes.ok) {
    const errBody = await uploadRes.text();
    throw new Error(`Upload failed: ${uploadRes.status} ${errBody}`);
  }
  
  // Return public URL
  return `${supabaseUrl}/storage/v1/object/public/${BUCKET}/${fileName}`;
}

export async function POST(request: Request) {
  // ⭐ 强制鉴权：webhook 必须配置 APP_WEBHOOK_SECRET，防止外部攻击者伪造回调
  if (!appWebhookSecret) {
    return NextResponse.json(
      { message: "Server misconfigured: APP_WEBHOOK_SECRET is not set." },
      { status: 500 }
    );
  }
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

  logger.log(`Prompt webhook: prompt_id=${prompt.id}, tune_id=${prompt.tune_id}, images=${prompt.images?.length || 0}`);

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
      logger.error({ modelError });
      return NextResponse.json(
        {
          message: "Something went wrong!",
        },
        { status: 500 }
      );
    }

    // ⭐ 幂等保护：逐张处理 — 下载 → 转存 Supabase → 写入 DB
    let savedCount = 0;
    await Promise.all(
      allHeadshots.map(async (image, idx) => {
        try {
          let storageUrl: string;
          
          // Step 1: 尝试下载并上传到 Supabase Storage
          try {
            storageUrl = await downloadAndUploadToStorage(image, Number(model.id), idx);
            logger.log(`Prompt webhook: image ${idx} uploaded to Supabase Storage`);
          } catch (uploadErr: any) {
            logger.error(`Prompt webhook: failed to upload image ${idx} to storage, falling back to Astria URL: ${uploadErr?.message}`);
            storageUrl = image; // fallback: 直接存 Astria URL（可能不可访问）
          }
          
          // Step 2: 检查幂等（用 Supabase URL 检查，因为 Astria URL 可能重复）
          const { data: existing } = await supabase
            .from("images")
            .select("id")
            .eq("modelId", Number(model.id))
            .eq("uri", storageUrl)
            .maybeSingle();

          if (existing) {
            logger.log(`Prompt webhook: skipping duplicate image for model ${model.id}`);
            return; // 已存在，跳过
          }

          const { error: imageError } = await supabase.from("images").insert({
            modelId: Number(model.id),
            uri: storageUrl,
          });

          if (imageError) {
            logger.error(`Prompt webhook: failed to insert image for model ${model.id}:`, imageError);
          } else {
            savedCount++;
          }
        } catch (err) {
          logger.error(`Prompt webhook: error processing image for model ${model.id}:`, err);
        }
      })
    );

    // ⭐ 更新 models.images_generated（累加本次保存的图片数）
    // 容错：如果列不存在（migration 未执行），跳过进度更新但不影响图片保存
    if (savedCount > 0) {
      let newCount = savedCount; // fallback: 仅算本次
      let progressUpdated = false;
      try {
        const { data: currentModel, error: selectError } = await supabase
          .from("models")
          .select("images_generated")
          .eq("id", Number(model.id))
          .single();

        if (!selectError && currentModel) {
          newCount = (currentModel?.images_generated || 0) + savedCount;
          const { error: updateError } = await supabase
            .from("models")
            .update({ images_generated: newCount })
            .eq("id", Number(model.id));

          if (updateError) {
            logger.error(`Prompt webhook: failed to update images_generated for model ${model.id}:`, updateError);
          } else {
            progressUpdated = true;
            logger.log(`Prompt webhook: model ${model.id} progress ${newCount}/${model.total_images || '?'}`);
          }
        }
      } catch (progressErr: any) {
        // 列不存在等情况 — 不影响核心流程
        logger.warn(`Prompt webhook: images_generated column not available, skipping progress tracking: ${progressErr?.message}`);
      }

      if (progressUpdated) {
        logger.log(`Prompt webhook: model ${model.id} progress ${newCount}/${model.total_images || '?'}`);

        // ⭐ 完成检测：达标时标记 model.status = "completed" + 发送邮件
        // 幂等保护：model.status 已是 "completed" 时跳过，避免重复发邮件
        if (
          model.total_images &&
          newCount >= model.total_images &&
          model.status !== "completed"
        ) {
          const { error: completeError } = await supabase
            .from("models")
            .update({ status: "completed" })
            .eq("id", Number(model.id));

          if (completeError) {
            logger.error(
              `Prompt webhook: failed to mark model ${model.id} as completed:`,
              completeError
            );
          } else {
            logger.log(
              `Prompt webhook: model ${model.id} COMPLETED — ${newCount}/${model.total_images} images ready!`
            );

            // 发送完成邮件通知
            if (resendApiKey) {
              try {
                const resend = new Resend(resendApiKey);
                await resend.emails.send({
                  from: "contact@snapprohead.com",
                  to: user?.email ?? "",
                  subject: "Your AI headshots are ready!",
                  html: `<h2>Great news! Your ${newCount} AI headshots have been generated successfully.</h2><p>Visit your <a href="https://snapprohead.com/overview">dashboard</a> to view and download your headshots.</p>`,
                });
              } catch (emailErr) {
                logger.error(
                  `Prompt webhook: failed to send completion email for model ${model.id}:`,
                  emailErr
                );
              }
            }
          }
        }
      }
    }

    return NextResponse.json(
      {
        message: "success",
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
