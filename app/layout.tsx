import { Metadata } from 'next';
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";
import { Suspense } from "react";
import dynamic from "next/dynamic";
import { Analytics } from "@vercel/analytics/react";
import { ThemeProvider } from "@/components/homepage/theme-provider"
import { validateConfig } from "@/lib/config";
import { HashAuthHandler } from "@/components/HashAuthHandler";

// Dynamic import with ssr: false to prevent motion/react from being bundled on every page
const AnnouncementBar = dynamic(
  () => import("@/components/homepage/announcement-bar").then(mod => mod.default),
  { ssr: false }
);

// Validate configuration at app initialization
validateConfig();

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0f172a' },
  ],
};

export const metadata: Metadata = {
  title: {
    default: `SnapProHead - AI Professional Headshots in ~30 Minutes | Just $29`,
    template: "%s | SnapProHead",
  },
  description: `Generate professional AI headshots for LinkedIn, resumes, and social media in ~30 minutes. 14-day money-back guarantee. Just $29 — a fraction of traditional photography.`,
    alternates: {
      canonical: "https://snapprohead.com",
    },
  openGraph: {
    title: "SnapProHead - AI Professional Headshots in ~30 Minutes",
    description: `Turn selfies into professional headshots in ~30 minutes. Just $29 with a 14-day money-back guarantee. Used by professionals on LinkedIn and social media.`,
    url: "https://snapprohead.com",
    siteName: "SnapProHead",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "https://snapprohead.com/hero.png",
        width: 1200,
        height: 630,
        alt: "SnapProHead - AI Generated Professional Headshots",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SnapProHead - AI Professional Headshots in ~30 Minutes",
    description: `Turn selfies into professional headshots in ~30 minutes. Just $29 with a 14-day money-back guarantee.`,
    images: ["https://snapprohead.com/hero.png"],
  },
  manifest: "/site.webmanifest",
  icons: {
    icon: "data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%232563eb%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%0A%20%20%3Cpath%20d%3D%22M14.5%204h-5L7%207H4a2%202%200%200%200-2%202v9a2%202%200%200%200%202%202h16a2%202%200%200%200%202-2V9a2%202%200%200%200-2-2h-3l-2.5-3z%22/%3E%0A%20%20%3Ccircle%20cx%3D%2212%22%20cy%3D%2213%22%20r%3D%223%22/%3E%0A%3C/svg%3E",
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col bg-background">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <HashAuthHandler />
          <AnnouncementBar />
          {/* Remove the section wrapper as it's interfering with sticky positioning */}
          <Suspense
            fallback={
              <div className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container h-16" />
              </div>
            }
          >
            <Navbar />
          </Suspense>
          <main className="flex-1">
            {children}
          </main>
          <Footer />
          <Toaster />
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  );
}
