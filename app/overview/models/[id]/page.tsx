import { Icons } from "@/components/icons";
import ClientSideModel from "@/components/realtime/ClientSideModel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Database } from "@/types/supabase";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import { FaArrowLeft } from "react-icons/fa";
import { MODEL_IMAGES_PAGE_SIZE } from "@/lib/model-images";
import { getModelStatusLabel, isModelGenerating } from "@/lib/model-status-label";
import { loginRedirectPath } from "@/lib/login-redirect.server";
import { reconcileStaleModel } from "@/lib/model-stale-reconcile";
import { syncModelCompletion } from "@/lib/sync-model-completion";
import { createServerClient as createServiceClient } from "@supabase/ssr";

export const dynamic = "force-dynamic";

export default async function Index({ params }: { params: { id: string } }) {
  const supabase = createServerClient<Database>(
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
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect(loginRedirectPath(`/overview/models/${params.id}`));
  }

  const { data: model } = await supabase
    .from("models")
    .select("id, name, type, status, tier, created_at, user_id, modelId, images_generated, total_images")
    .eq("id", Number(params.id))
    .eq("user_id", user.id)
    .single();

  if (!model) {
    redirect("/overview");
  }

  const serviceSupabase = createServiceClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
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
              // read-only in Server Component
            }
          });
        },
      },
    }
  );

  await syncModelCompletion({
    supabase: serviceSupabase,
    model,
  });

  await reconcileStaleModel({
    supabase: serviceSupabase,
    model: { ...model, user_id: user.id },
    userEmail: user.email,
  });

  const { data: refreshedModel } = await supabase
    .from("models")
    .select("id, name, type, status, tier, created_at, user_id, modelId, images_generated, total_images")
    .eq("id", Number(params.id))
    .eq("user_id", user.id)
    .single();

  const activeModel = refreshedModel ?? model;

  const { count: totalImageCount } = await supabase
    .from("images")
    .select("*", { count: "exact", head: true })
    .eq("modelId", activeModel.id);

  const { data: images } = await supabase
    .from("images")
    .select("id, uri, modelId")
    .eq("modelId", activeModel.id)
    .order("id", { ascending: true })
    .range(0, MODEL_IMAGES_PAGE_SIZE - 1);

  const { data: samples } = await supabase
    .from("samples")
    .select("id, uri, modelId")
    .eq("modelId", activeModel.id);

  return (
    <div className="w-full">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
        <Link href="/overview" className="w-fit shrink-0">
          <Button variant="outline" className="min-h-11 text-sm sm:min-h-9 sm:text-sm" size="sm">
            <FaArrowLeft className="mr-2" />
            Go Back
          </Button>
        </Link>
        <div className="flex min-w-0 flex-wrap items-center gap-2 pb-1 sm:pb-4">
          <h1 className="truncate text-lg font-semibold sm:text-xl">{activeModel.name}</h1>
          <Badge
            variant={activeModel.status === "failed" ? "destructive" : (activeModel.status === "finished" || activeModel.status === "completed") ? "default" : "secondary"}
            className="shrink-0 text-xs font-medium"
          >
            {getModelStatusLabel(activeModel)}
            {isModelGenerating(activeModel) && (
              <Icons.spinner className="ml-2 inline-block h-4 w-4 animate-spin" />
            )}
            {activeModel.status === "failed" && (
              <span className="ml-1">&#10007;</span>
            )}
          </Badge>
        </div>
      </div>

      <ClientSideModel
        samples={samples ?? []}
        serverModel={activeModel}
        serverImages={images ?? []}
        totalImageCount={totalImageCount ?? images?.length ?? 0}
      />
    </div>
  );
}
