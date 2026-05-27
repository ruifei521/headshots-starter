import { Metadata } from "next";
import { Camera } from "lucide-react";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "We provide AI-generated professional headshots for professionals worldwide.",
  alternates: {
    canonical: "https://snapprohead.com/about",
  },
};

export default function AboutPage() {
  return (
    <main className="min-h-screen">
      <section className="py-16 md:py-24">
        <div className="max-w-2xl mx-auto px-4">
          <div className="flex items-center gap-2 mb-6">
            <Camera className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl md:text-4xl font-bold">
              About SnapProHead
            </h1>
          </div>

          <p className="text-lg text-muted-foreground mb-6">
            SnapProHead makes professional headshots accessible to everyone. 
            No studios, no expensive photographers, no scheduling headaches — 
            just upload your selfies and get studio-quality portraits in ~30 minutes.
          </p>

          <h2 className="text-xl font-semibold mt-10 mb-3">Our Mission</h2>
          <p className="text-muted-foreground mb-6">
            We believe that every professional deserves a great headshot. 
            Whether you&apos;re building your LinkedIn profile, updating your company website, 
            or preparing for a speaking engagement — your first impression matters, 
            and it shouldn&apos;t cost a fortune.
          </p>

          <h2 className="text-xl font-semibold mt-10 mb-3">Who We Are</h2>
          <p className="text-muted-foreground mb-6">
            Our team combines expertise in AI technology 
            and e-commerce to deliver a seamless, affordable headshot experience 
            to customers worldwide.
          </p>

          <h2 className="text-xl font-semibold mt-10 mb-3">Our Guarantee</h2>
          <ul className="list-disc pl-5 space-y-2 text-muted-foreground mb-6">
            <li><strong>$29 per pack</strong> — No subscription, no hidden fees.</li>
            <li><strong>14-day money-back guarantee</strong> — Not happy? Full refund.</li>
            <li><strong>~30 minute turnaround</strong> — Fast, no waiting.</li>
            <li><strong>100+ AI-generated photos</strong> — Pick your favorites.</li>
          </ul>

          <h2 className="text-xl font-semibold mt-10 mb-3">Contact Us</h2>
          <p className="text-muted-foreground">
            Email: <a href="mailto:contact@snapprohead.com" className="text-blue-600 hover:underline">contact@snapprohead.com</a>
            <br />
          </p>
        </div>
      </section>
    </main>
  );
}
