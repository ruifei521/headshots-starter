import nextDynamic from "next/dynamic";
import PurchaseTracker from "@/components/PurchaseTracker";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa";
import { redirect } from 'next/navigation';
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { logger } from "@/lib/logger";
import { isPaymentEnabled } from "@/lib/payment-config";
import { TrainModelSection } from "@/components/train/TrainModelSection";

const PaymentSuccessBanner = nextDynamic(
  () => import("@/components/PaymentSuccessBanner"),
  { ssr: false }
);

export const dynamic = "force-dynamic";

export default async function Index({
  params,
  searchParams,
}: {
  params: { pack: string };
  searchParams: { tier?: string; payment?: string };
}) {
  const paymentIsConfigured = isPaymentEnabled();
  const paymentSuccess = searchParams.payment === "success";
  const showPaymentSuccess = paymentSuccess;

  // ⭐ 服务端检查用户 credits —— 使用 Service Role Key 绕过 RLS
  let hasCredits = true; // 默认允许（支付未配置时放行）
  if (paymentIsConfigured) {
    try {
      // 用 Service Role Key 查 credits（Anon Key 可能被 RLS 拦截）
      const supabaseService = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        {
          cookies: {
            getAll() { return cookies().getAll(); },
            setAll(cookiesToSet) {
              cookiesToSet.forEach(({ name, value, options }) => {
                try { cookies().set(name, value, options); } catch {}
              });
            },
          },
        }
      );
      const { data: { user } } = await supabaseService.auth.getUser();
      if (user) {
        const { data: credits, error: creditsError } = await supabaseService
          .from("credits")
          .select("credits")
          .eq("user_id", user.id)
          .order("id", { ascending: false })
          .limit(1)
          .maybeSingle();
        hasCredits = !!(credits && credits.credits >= 1);
      }
    } catch (e: unknown) {
      logger.warn("Credit check failed on train page, denying access:", e);
      hasCredits = false;
    }
  }

  const awaitingCredits = paymentIsConfigured && !hasCredits && paymentSuccess;

  // 无 credits 且非刚付完款 → 去定价页（付完款时等 webhook 到账）
  if (!hasCredits && !paymentSuccess) {
    redirect("/pricing?reason=no_credits");
  }

  return (
    <div className="w-full">
      {showPaymentSuccess && <PaymentSuccessBanner tier={searchParams.tier} />}
      {/* GA4: fire purchase event once on client mount */}
      <PurchaseTracker tier={searchParams.tier} requireCredits={paymentSuccess} />
      {/* Three-column layout */}
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left: Good examples */}
        <div className="hidden lg:block lg:col-span-3">
          <div className="image-upload-guide">
            <h4 className="font-bold text-lg mb-3">Good examples</h4>
            <div className="flex gap-3 mb-4">
              <div className="relative">
                <Image src="/howto/good-1.avif" alt="Good example" width={200} height={144} className="max-w-full h-auto rounded max-h-36" />
                <svg className="absolute top-1 left-1 w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="relative">
                <Image src="/howto/good-2.avif" alt="Good example" width={200} height={144} className="max-w-full h-auto rounded max-h-36" />
                <svg className="absolute top-1 left-1 w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="relative">
                <Image src="/howto/good-3.avif" alt="Good example" width={200} height={144} className="max-w-full h-auto rounded max-h-36" />
                <svg className="absolute top-1 left-1 w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <ul className="list-none p-0 space-y-1 text-sm">
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 flex-shrink-0 text-green-500" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Use shoulders-up images
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 flex-shrink-0 text-green-500" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Waist-up images are also good
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 flex-shrink-0 text-green-500" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Looking at the camera
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 flex-shrink-0 text-green-500" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Variation, from different days
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 flex-shrink-0 text-green-500" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Change in backgrounds, lighting, clothing
              </li>
            </ul>
          </div>
        </div>

        {/* Middle: Card */}
        <div className="order-2 lg:order-none lg:col-span-6">
          <div id="train-model-container" className="flex flex-1 flex-col gap-2">
            <Link href="/overview" className="text-sm w-fit">
              <Button variant="outline" className="min-h-11 text-sm px-3">
                <FaArrowLeft className="mr-1" />
                Go Back
              </Button>
            </Link>

            <Card className="p-2 notranslate" translate="no">
                <CardHeader className="px-3 pt-2 pb-0">
                  <CardTitle>Create your headshots</CardTitle>
                  <CardDescription className="text-xs mt-0">
                    Add a name, choose gender, and upload 4–10 photos to get started.
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-3 px-3 pb-3">
                  <TrainModelSection
                    packSlug={params.pack}
                    initialHasCredits={hasCredits}
                    awaitingCredits={awaitingCredits}
                  />
                </CardContent>
              </Card>
          </div>
        </div>

        {/* Right: Bad examples */}
        <div className="hidden lg:block lg:col-span-3">
          <div className="image-upload-guide">
            <h4 className="font-bold text-lg mb-3">Bad examples</h4>
            <div className="flex gap-3 mb-4">
              <div className="relative">
                <Image src="/howto/cropped.avif" alt="Bad example" width={200} height={144} className="max-w-full h-auto rounded max-h-36" />
                <svg className="absolute top-1 left-1 w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="relative">
                <Image src="/howto/funny-faces.avif" alt="Bad example" width={200} height={144} className="max-w-full h-auto rounded max-h-36" />
                <svg className="absolute top-1 left-1 w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="relative">
                <Image src="/howto/sunglasses.avif" alt="Bad example" width={200} height={144} className="max-w-full h-auto rounded max-h-36" />
                <svg className="absolute top-1 left-1 w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <ul className="list-none p-0 space-y-1 text-sm">
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 flex-shrink-0 text-red-500" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                AI generated images
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 flex-shrink-0 text-red-500" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Extra people
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 flex-shrink-0 text-red-500" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Same day or with same clothing
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 flex-shrink-0 text-red-500" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Funny-faces
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 flex-shrink-0 text-red-500" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Filters, Black and White or Sepia
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 flex-shrink-0 text-red-500" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Bad lighting, low quality, blurry
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 flex-shrink-0 text-red-500" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Hat, glasses
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 flex-shrink-0 text-red-500" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Bad angles
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 flex-shrink-0 text-red-500" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Cropped face
              </li>
            </ul>
          </div>
        </div>

        {/* Mobile: upload guide above form on small screens */}
        <div className="order-1 lg:order-last lg:hidden col-span-1 space-y-3 mb-2">
          <details className="rounded-lg border p-3 text-sm bg-muted/30" open>
            <summary className="cursor-pointer font-medium">Photo tips before you upload</summary>
            <div className="mt-3 grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-semibold text-green-700 dark:text-green-400 mb-2">Good examples</p>
                <div className="grid grid-cols-3 gap-1.5">
                  {["good-1", "good-2", "good-3"].map((name) => (
                    <div key={name} className="relative aspect-[4/5] rounded overflow-hidden bg-muted">
                      <Image src={`/howto/${name}.avif`} alt="Good example" fill sizes="20vw" className="object-cover" />
                    </div>
                  ))}
                </div>
                <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
                  <li>Shoulders-up or waist-up</li>
                  <li>Look at the camera</li>
                  <li>Different days &amp; backgrounds</li>
                </ul>
              </div>
              <div>
                <p className="text-xs font-semibold text-red-700 dark:text-red-400 mb-2">Avoid</p>
                <div className="grid grid-cols-3 gap-1.5">
                  {["cropped", "funny-faces", "sunglasses"].map((name) => (
                    <div key={name} className="relative aspect-[4/5] rounded overflow-hidden bg-muted">
                      <Image src={`/howto/${name}.avif`} alt="Bad example" fill sizes="20vw" className="object-cover" />
                    </div>
                  ))}
                </div>
                <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
                  <li>No hats, sunglasses, filters</li>
                  <li>No group shots or cropped faces</li>
                  <li>No blurry or low-light photos</li>
                </ul>
              </div>
            </div>
            <Link href="/howto" className="mt-3 inline-block text-primary text-xs underline underline-offset-2">
              Full upload guide →
            </Link>
          </details>
        </div>
      </div>
    </div>
  );
}
