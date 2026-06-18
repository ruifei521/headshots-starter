import axios from "axios";

import { getTierPrompts } from "@/lib/prompts";

import { isTier } from "@/lib/tiers";

import { logger } from "@/lib/logger";

import { PORTRAIT_GENERATION_OPTIONS } from "@/lib/prompt-quality";



const ASTRIA_DOMAIN = "https://api.astria.ai";

const PROMPT_BATCH_SIZE = 5;



export async function submitTierPromptsForTune(params: {

  astriaTuneId: number;

  modelId: number;

  userId: string;

  tier: string;

  type: string;

  promptCallbackUrl: string;

}): Promise<{ submitted: number; failed: number }> {

  const apiKey = process.env.ASTRIA_API_KEY;

  if (!apiKey) {

    throw new Error("Missing ASTRIA_API_KEY");

  }



  const tier = isTier(params.tier) ? params.tier : "starter";

  const type = params.type === "woman" ? "woman" : "man";

  const prompts = getTierPrompts(tier, type);



  let submitted = 0;

  let failed = 0;



  for (let i = 0; i < prompts.length; i += PROMPT_BATCH_SIZE) {

    const batch = prompts.slice(i, i + PROMPT_BATCH_SIZE);

    const results = await Promise.allSettled(

      batch.map((p, batchIndex) => {

        const promptIndex = i + batchIndex;

        const seed = (params.astriaTuneId * 10_000 + promptIndex + 1) % 2_147_483_647;



        return axios.post(

          `${ASTRIA_DOMAIN}/tunes/${params.astriaTuneId}/prompts`,

          {

            prompt: {

              text: p.text,

              callback: params.promptCallbackUrl,

              num_images: p.num_images,

              seed,

              ...PORTRAIT_GENERATION_OPTIONS,

            },

          },

          {

            headers: {

              "Content-Type": "application/json",

              Authorization: `Bearer ${apiKey}`,

            },

            timeout: 20000,

          }

        );

      })

    );



    for (const result of results) {

      if (result.status === "fulfilled") {

        submitted++;

      } else {

        failed++;

        logger.error(

          `Prompt submit failed for Astria tune ${params.astriaTuneId}:`,

          result.reason?.response?.data || result.reason?.message || result.reason

        );

      }

    }

  }



  logger.log(

    `Submitted ${submitted}/${prompts.length} prompts for Astria tune ${params.astriaTuneId} (model ${params.modelId})`

  );



  return { submitted, failed };

}


