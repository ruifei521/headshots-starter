import { Database } from "@/types/supabase";
import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import axios from "axios";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { isTier } from "@/lib/tiers";
import { getTierPrompts } from "@/lib/prompts";
import { logger } from "@/lib/logger";
import { isPaymentEnabled } from "@/lib/payment-config";
import { deductTrainingCredit, refundTrainingCredit } from "@/lib/credits-admin";
import { buildTrainWebhookUrl } from "@/lib/astria-webhook";
import {
  ASTRIA_FLUX_BASE_TUNE_ID,
  buildAstriaTunePayload,
  findUnreachableImageUrl,
} from "@/lib/astria-tune";
import {
  buildAstriaTuneTitle,
  createAstriaTune,
  resolveAstriaTuneAfterTimeout,
} from "@/lib/astria-create-tune";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

const astriaApiKey = process.env.ASTRIA_API_KEY;
const astriaTestModeIsOn = process.env.ASTRIA_TEST_MODE === "true";
const paymentIsConfigured = isPaymentEnabled();

if (!process.env.APP_WEBHOOK_SECRET) {
  logger.warn("MISSING APP_WEBHOOK_SECRET - train-model webhook will not function.");
}

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
  const name = payload.name;
  const characteristics = payload.characteristics;

  if (type !== "man" && type !== "woman") {
    return NextResponse.json(
      { message: "Invalid type. Please select Man or Woman." },
      { status: 400 }
    );
  }

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
              // Called from a Server Component.
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
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

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
      { status: 500 }
    );
  }

  if (images?.length < 4) {
    return NextResponse.json(
      { message: "Upload at least 4 sample images" },
      { status: 400 }
    );
  }

  if (images.length > 10) {
    return NextResponse.json(
      { message: "Upload at most 10 sample images" },
      { status: 400 }
    );
  }

  const unreachableUrl = await findUnreachableImageUrl(images);
  if (unreachableUrl) {
    logger.error("Training image URL not reachable:", unreachableUrl);
    return NextResponse.json(
      {
        message:
          "Your photos uploaded, but Astria cannot access them. Make the Supabase 'headshots' storage bucket public.",
        details: unreachableUrl,
      },
      { status: 400 }
    );
  }

  let userTier: string = "starter";

  if (paymentIsConfigured) {
    const { error: creditError, data: credits } = await supabase
      .from("credits")
      .select("credits, tier")
      .eq("user_id", user.id);

    if (creditError) {
      logger.error({ creditError });
      return NextResponse.json({ message: "Something went wrong!" }, { status: 500 });
    }

    if (credits.length === 0) {
      const { error: errorCreatingCredits } = await supabase.from("credits").insert({
        user_id: user.id,
        credits: 0,
        tier: "starter",
      });

      if (errorCreatingCredits) {
        logger.error({ errorCreatingCredits });
        return NextResponse.json({ message: "Something went wrong!" }, { status: 500 });
      }

      return NextResponse.json(
        {
          error: "no_credits",
          message: "No credits available. Please purchase a plan to start training.",
        },
        { status: 402 }
      );
    }

    if (credits[0]?.credits < 1) {
      return NextResponse.json(
        {
          error: "no_credits",
          message: "You've used all your credits. Please purchase more to continue.",
        },
        { status: 402 }
      );
    }

    userTier = credits[0]?.tier || "starter";
    logger.log(`User ${user.id} tier: ${userTier}`);

    const deducted = await deductTrainingCredit(user.id);
    if (!deducted) {
      return NextResponse.json(
        {
          error: "no_credits",
          message: "You've used all your credits. Please purchase more to continue.",
        },
        { status: 402 }
      );
    }
  }

  let creditReserved = paymentIsConfigured;

  const effectiveTierForCount = isTier(userTier) ? userTier : "starter";
  const promptTemplatesForCount = getTierPrompts(effectiveTierForCount, type);
  const totalImages = promptTemplatesForCount.reduce((s, t) => s + t.num_images, 0);

  const { error: modelError, data } = await supabase
    .from("models")
    .insert({
      user_id: user.id,
      name,
      type,
      tier: userTier,
      status: "processing",
      total_images: totalImages,
    })
    .select("id")
    .single();

  if (modelError) {
    logger.error("modelError: ", modelError);
    if (creditReserved) {
      await refundTrainingCredit(user.id, 1);
    }
    return NextResponse.json(
      { message: modelError.message || "Failed to create model record." },
      { status: 500 }
    );
  }

  const modelId = data?.id;

  const persistSamples = async (): Promise<boolean> => {
    const { error: samplesError } = await supabase.from("samples").insert(
      images.map((sample: string) => ({
        modelId: modelId,
        uri: sample,
      }))
    );

    if (samplesError) {
      logger.error("samplesError: ", samplesError);
      return false;
    }
    return true;
  };

  const linkAstriaTune = async (astriaTuneId: number): Promise<boolean> => {
    const { error: linkError } = await supabase
      .from("models")
      .update({ modelId: String(astriaTuneId), status: "processing" })
      .eq("id", modelId);

    if (linkError) {
      logger.error("linkAstriaTune failed:", linkError);
      return false;
    }
    return true;
  };

  const abortTrainingStart = async (message: string, details?: string) => {
    if (modelId) {
      await supabase.from("models").delete().eq("id", modelId);
    }
    if (creditReserved) {
      await refundTrainingCredit(user.id, 1);
    }
    return NextResponse.json({ message, details }, { status: 503 });
  };

  try {
    const trainWebhookWithParams = buildTrainWebhookUrl(user.id, modelId);
    const tuneTitle = buildAstriaTuneTitle(name, modelId);

    // Prompts are submitted after training completes (train-webhook) to avoid
    // Astria 422 from oversized prompts_attributes payloads.
    const tuneBody = buildAstriaTunePayload({
      title: tuneTitle,
      name: type,
      imageUrls: images,
      trainCallbackUrl: trainWebhookWithParams,
      characteristics,
      testMode: astriaTestModeIsOn,
    });

    logger.log(
      `Creating Astria tune: ${images.length} images, tier=${effectiveTierForCount} (${totalImages} prompts queued post-training), testMode=${astriaTestModeIsOn}, base_tune_id=${astriaTestModeIsOn ? "fast" : ASTRIA_FLUX_BASE_TUNE_ID}`
    );

    let astriaTuneId: number | null = null;

    try {
      const created = await createAstriaTune({
        apiKey: astriaApiKey,
        tuneBody,
        timeoutMs: 25_000,
      });

      if (created.status !== 201) {
        logger.error("Astria API error - status:", created.status, "response:", created.data);
        return abortTrainingStart(
          (created.data as { message?: string; error?: string })?.message ||
            (created.data as { message?: string; error?: string })?.error ||
            `Astria API returned status ${created.status}`
        );
      }

      astriaTuneId = created.tuneId;
    } catch (firstError: unknown) {
      const isTimeout =
        axios.isAxiosError(firstError) &&
        (firstError.code === "ECONNABORTED" ||
          firstError.message.includes("timeout"));

      if (!isTimeout) {
        throw firstError;
      }

      logger.warn(
        `Astria create timed out for model ${modelId} — resolving via title idempotency`
      );
      astriaTuneId = await resolveAstriaTuneAfterTimeout({
        apiKey: astriaApiKey,
        title: tuneTitle,
        tuneBody,
      });

      if (!astriaTuneId) {
        return abortTrainingStart(
          "The connection timed out before training could be confirmed. Your credit was returned — please try again on Wi‑Fi or wait a moment and retry.",
          "If you were charged a training credit, it has been refunded automatically."
        );
      }
    }

    if (!astriaTuneId) {
      return abortTrainingStart(
        "Astria did not return a training ID. Your credit was returned — please try again."
      );
    }

    if (!(await linkAstriaTune(astriaTuneId))) {
      return abortTrainingStart("Could not save training progress. Your credit was returned.");
    }

    if (!(await persistSamples())) {
      if (creditReserved) {
        await refundTrainingCredit(user.id, 1);
      }
      return NextResponse.json(
        { message: "Failed to save image samples." },
        { status: 500 }
      );
    }
  } catch (e: any) {
    logger.error("Train model error:", e);

    if (e?.response) {
      logger.error("Astria response status:", e.response.status);
      logger.error("Astria response data:", JSON.stringify(e.response.data, null, 2));
    }

    const astriaBody = e?.response?.data;
    const hasAstriaBody =
      astriaBody &&
      typeof astriaBody === "object" &&
      Object.keys(astriaBody).length > 0;

    let message =
      astriaBody?.message ||
      astriaBody?.error ||
      (typeof e?.message === "string" && !e.message.includes("status code")
        ? e.message
        : "Training could not be started. Please try again.");
    let details =
      astriaBody?.errors != null
        ? Array.isArray(astriaBody.errors)
          ? astriaBody.errors
              .map((err: any) =>
                typeof err === "string" ? err : err.message || JSON.stringify(err)
              )
              .join("; ")
          : JSON.stringify(astriaBody.errors)
        : astriaBody?.details || "";

    if (e?.response?.status === 422 && !hasAstriaBody) {
      message =
        "Astria could not start training. Check that your Supabase 'headshots' bucket is public and your Astria account has credits.";
      details =
        "Supabase → Storage → headshots → Public bucket. Astria → Settings → add credits.";
    }

    if (modelId) {
      await supabase.from("models").delete().eq("id", modelId);
    }
    if (creditReserved) {
      await refundTrainingCredit(user.id, 1);
    }

    return NextResponse.json(
      { message, details },
      { status: e?.response?.status || 500 }
    );
  }

  return NextResponse.json({ message: "success", modelId }, { status: 200 });
}
