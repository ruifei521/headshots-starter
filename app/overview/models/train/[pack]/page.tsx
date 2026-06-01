import TrainModelZone from "@/components/TrainModelZone";
// import CreditCheckBanner from "@/components/CreditCheckBanner";
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

const packsIsEnabled = false; // ⭐ 不再使用 Pack 选择，直接进入训练

export default async function Index({
  params,
  searchParams,
}: {
  params: { pack: string };
  searchParams: { tier?: string };
}) {
  return (
    <div className="w-full">
      {/* GA4: fire purchase event once on client mount — tier from Creem success_url */}
      <PurchaseTracker tier={searchParams.tier} />
      {/* <CreditCheckBanner packSlug={params.pack} /> */}
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
                Change in backgrounds, lightning, clothing
              </li>
            </ul>
          </div>
        </div>

        {/* Middle: Card */}
        <div className="lg:col-span-6">
          <div id="train-model-container" className="flex flex-1 flex-col gap-2">
            <Link href="/overview" className="text-sm w-fit">
              <Button variant={"outline"} className="h-7 text-xs px-2 py-0">
                <FaArrowLeft className="mr-1" />
                Go Back
              </Button>
            </Link>
            <Card className="p-2">
              <CardHeader className="px-3 pt-2 pb-0">
                <CardTitle>Train Model</CardTitle>
                <CardDescription className="text-xs mt-0">
                  Choose a name, type, and upload some photos to get started.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-3 px-3 pb-3">
                <TrainModelZone packSlug={params.pack} />
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
                Bad lightning, low quality, blurry
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

        {/* Mobile: Good/Bad below Card (only on small screens) */}
        <div className="lg:hidden col-span-1 grid grid-cols-2 gap-4 mb-6">
          <div>
            <h4 className="font-bold text-base mb-2">Good examples</h4>
            <div className="flex gap-2 mb-2">
              <Image src="/howto/good-1.avif" alt="" width={100} height={80} className="max-w-full h-auto rounded max-h-20" />
              <Image src="/howto/good-2.avif" alt="" width={100} height={80} className="max-w-full h-auto rounded max-h-20" />
              <Image src="/howto/good-3.avif" alt="" width={100} height={80} className="max-w-full h-auto rounded max-h-20" />
            </div>
          </div>
          <div>
            <h4 className="font-bold text-base mb-2">Bad examples</h4>
            <div className="flex gap-2 mb-2">
              <Image src="/howto/funny-faces.avif" alt="" width={100} height={80} className="max-w-full h-auto rounded max-h-20" />
              <Image src="/howto/sunglasses.avif" alt="" width={100} height={80} className="max-w-full h-auto rounded max-h-20" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
