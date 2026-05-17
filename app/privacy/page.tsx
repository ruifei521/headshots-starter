import Link from "next/link";

export const metadata = {
  title: "Privacy Policy - SnapProHead",
  description: "SnapProHead Privacy Policy - How we collect, use, and protect your personal data and photos.",
};

export default function PrivacyPolicy() {
  return (
    <div className="container max-w-4xl py-16 px-4">
      <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>
      <p className="text-sm text-muted-foreground mb-8">Last updated: May 17, 2026</p>

      <section className="space-y-6 text-muted-foreground">
        <div>
          <h2 className="text-xl font-semibold text-foreground mb-3">1. Information We Collect</h2>
          <p className="mb-3">SnapProHead (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;) collects the following types of information:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong className="text-foreground">Account Information:</strong> Email address, name, and authentication data when you sign up or log in via Google OAuth.</li>
            <li><strong className="text-foreground">Photos You Upload:</strong> The photos you submit for AI headshot generation. These photos are processed by our AI provider to generate your headshots.</li>
            <li><strong className="text-foreground">Payment Information:</strong> Billing details processed securely through our payment provider (Dodo Payments). We do not store your full credit card number.</li>
            <li><strong className="text-foreground">Usage Data:</strong> Information about how you interact with our service, including pages visited, features used, and device information.</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-foreground mb-3">2. How We Use Your Photos</h2>
          <p className="mb-3">Your uploaded photos are used solely for the purpose of generating AI headshots. Specifically:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Photos are sent to our AI processing provider (Astria AI) to train a custom model and generate headshots based on your likeness.</li>
            <li>Model training is necessary to produce accurate, personalized headshots — your photos are not used for any other purpose.</li>
            <li><strong className="text-foreground">Original uploaded photos are automatically deleted within 7 days</strong> after your headshots are generated.</li>
            <li><strong className="text-foreground">Generated headshots are stored for 30 days</strong>, after which they are automatically deleted.</li>
            <li>We do not use your photos to train third-party AI models. Astria AI&apos;s data handling is governed by their privacy policy: <Link href="https://astria.ai/privacy" className="text-primary hover:underline" target="_blank">https://astria.ai/privacy</Link></li>
            <li>You may request early deletion of your photos and generated images at any time by contacting us at <Link href="mailto:contact@snapprohead.com" className="text-primary hover:underline">contact@snapprohead.com</Link>.</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-foreground mb-3">3. Data Storage and Security</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Your account data is stored securely in our database hosted by Supabase.</li>
            <li>Uploaded and generated images are stored using Vercel Blob storage.</li>
            <li>We implement industry-standard security measures to protect your data.</li>
            <li>While we strive to protect your personal information, no method of transmission over the Internet is 100% secure.</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-foreground mb-3">4. Third-Party Services</h2>
          <p className="mb-3">We use the following third-party services that may have access to your data:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong className="text-foreground">Supabase:</strong> Database and authentication services</li>
            <li><strong className="text-foreground">Dodo Payments:</strong> Payment processing (acting as Merchant of Record)</li>
            <li><strong className="text-foreground">Vercel:</strong> Application hosting and file storage</li>
            <li><strong className="text-foreground">AI Processing Provider:</strong> For headshot generation (photos are sent to our AI provider for model training and image generation as part of the service)</li>
          </ul>
          <p className="mt-3">Each third-party provider has their own privacy policy governing the use of your information.</p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-foreground mb-3">5. Data Retention and Deletion</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong className="text-foreground">Original uploaded photos:</strong> Automatically deleted within 7 days after headshot generation is complete.</li>
            <li><strong className="text-foreground">Generated headshots:</strong> Stored for 30 days after generation, then automatically deleted.</li>
            <li><strong className="text-foreground">Account data:</strong> Retained while your account is active.</li>
            <li>You may request early deletion of your photos and generated images at any time by contacting us at <Link href="mailto:contact@snapprohead.com" className="text-primary hover:underline">contact@snapprohead.com</Link>.</li>
            <li>Upon account deletion request, we will remove your personal data, uploaded photos, and generated images within 7 days.</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-foreground mb-3">6. Your Rights</h2>
          <p>Depending on your jurisdiction, you may have the right to:</p>
          <ul className="list-disc pl-6 space-y-2 mt-2">
            <li>Access the personal data we hold about you</li>
            <li>Request correction of inaccurate data</li>
            <li>Request deletion of your data</li>
            <li>Object to processing of your data</li>
            <li>Data portability</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-foreground mb-3">7. Cookies</h2>
          <p>We use essential cookies for authentication and session management. We may also use analytics cookies to improve our service. You can manage cookie preferences through your browser settings.</p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-foreground mb-3">8. Children&apos;s Privacy</h2>
          <p>SnapProHead is not intended for use by individuals under the age of 18. We do not knowingly collect personal information from children.</p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-foreground mb-3">9. Changes to This Policy</h2>
          <p>We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new policy on this page and updating the &quot;Last updated&quot; date.</p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-foreground mb-3">10. Contact Us</h2>
          <p>If you have any questions about this Privacy Policy, please contact us at:</p>
          <p className="mt-2">
            <Link href="mailto:contact@snapprohead.com" className="text-primary hover:underline">
              contact@snapprohead.com
            </Link>
          </p>
        </div>
      </section>
    </div>
  );
}
