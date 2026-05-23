import Link from "next/link";

export const metadata = {
  title: "Refund Policy - SnapProHead",
  description: "14-day unconditional refund guarantee. If you're not happy with your headshots, we'll refund your entire purchase, no questions asked.",
};

export default function RefundPolicy() {
  return (
    <div className="container max-w-3xl py-16 px-4">
      {/* Hero section */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400 mb-4">
          <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
          14-Day Unconditional Guarantee
        </div>
        <h1 className="text-3xl font-bold mb-4">Love Your Headshots, or Get a Full Refund</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          If you don&apos;t get a single headshot you&apos;re happy with, we&apos;ll refund your entire purchase. 
          <strong className="text-foreground"> No questions asked.</strong>
        </p>
      </div>

      {/* Simple policy section */}
      <section className="space-y-8">
        <div className="rounded-xl border bg-card p-6">
          <h2 className="text-xl font-semibold mb-2">Our Promise</h2>
          <p className="text-muted-foreground">
            We believe in our AI headshots. If for any reason you&apos;re not satisfied with your results, 
            simply let us know within 14 days of your purchase and we&apos;ll issue a full refund — 
            no fine print, no hoops to jump through.
          </p>
        </div>

        <div className="rounded-xl border bg-card p-6">
          <h2 className="text-xl font-semibold mb-2">How to Request a Refund</h2>
          <p className="text-muted-foreground mb-3">
            Just email us at the address below. Include your account email and order date — that&apos;s it.
          </p>
          <p className="text-lg font-medium">
            <Link href="mailto:contact@snapprohead.com" className="text-primary hover:underline">
              contact@snapprohead.com
            </Link>
          </p>
        </div>

        <div className="rounded-xl border bg-card p-6">
          <h2 className="text-xl font-semibold mb-2">What Happens Next</h2>
          <ul className="space-y-2 text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="text-green-500 mt-1">✓</span>
              <span>We process your refund within 5-10 business days</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 mt-1">✓</span>
              <span>Refunds go back to your original payment method via Creem, our Merchant of Record</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 mt-1">✓</span>
              <span>Your bank may take additional time to show the refund on your statement</span>
            </li>
          </ul>
        </div>

        <div className="rounded-xl border bg-card p-6">
          <h2 className="text-xl font-semibold mb-2">Not Happy With the Quality?</h2>
          <p className="text-muted-foreground">
            If you&apos;d like to give it another try before requesting a refund, we can offer free regeneration 
            or additional credits at no charge. Just reach out — we&apos;re here to help.
          </p>
        </div>

        <div className="text-center pt-4 text-muted-foreground">
          <p>Questions? Contact us at{' '}
            <Link href="mailto:contact@snapprohead.com" className="text-primary hover:underline">
              contact@snapprohead.com
            </Link>
          </p>
        </div>
      </section>
    </div>
  );
}
