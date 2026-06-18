import Link from "next/link";
import {
  REFUND_CONTACT_EMAIL,
  REFUND_GUARANTEE_LABEL,
  REFUND_HERO_LINE,
  REFUND_META_DESCRIPTION,
  REFUND_WINDOW_DAYS,
  REFUND_WINDOW_LINE,
} from "@/lib/refund-policy";

export const metadata = {
  title: "Refund Policy - SnapProHead",
  description: REFUND_META_DESCRIPTION,
  alternates: {
    canonical: "https://snapprohead.com/refund",
  },
};

export default function RefundPolicy() {
  return (
    <div className="container max-w-3xl py-16 px-4">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400 mb-4">
          <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
          {REFUND_GUARANTEE_LABEL}
        </div>
        <h1 className="text-3xl font-bold mb-4">Love Your Headshots, or Get a Full Refund</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          {REFUND_HERO_LINE}
        </p>
      </div>

      <section className="space-y-8">
        <div className="rounded-xl border bg-card p-6">
          <h2 className="text-xl font-semibold mb-2">Our Promise</h2>
          <p className="text-muted-foreground">
            We believe in our AI headshots. {REFUND_WINDOW_LINE} Refunds are
            available when you are not satisfied with the headshots delivered in
            your pack — no complicated forms required.
          </p>
        </div>

        <div className="rounded-xl border bg-card p-6">
          <h2 className="text-xl font-semibold mb-2">How to Request a Refund</h2>
          <p className="text-muted-foreground mb-3">
            Email us within {REFUND_WINDOW_DAYS} days of purchase. Include your
            account email and order date.
          </p>
          <p className="text-lg font-medium">
            <Link href={`mailto:${REFUND_CONTACT_EMAIL}`} className="text-primary hover:underline">
              {REFUND_CONTACT_EMAIL}
            </Link>
          </p>
        </div>

        <div className="rounded-xl border bg-card p-6">
          <h2 className="text-xl font-semibold mb-2">What Happens Next</h2>
          <ul className="space-y-2 text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="text-green-500 mt-1">✓</span>
              <span>We review your request and respond within 2 business days</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 mt-1">✓</span>
              <span>Approved refunds are processed within 5–10 business days</span>
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
          <h2 className="text-xl font-semibold mb-2">Quality Concerns</h2>
          <p className="text-muted-foreground">
            If results look off because of upload quality or a technical issue,
            email us before the {REFUND_WINDOW_DAYS}-day window closes. We will
            help troubleshoot or process a refund if we cannot deliver usable
            headshots. Additional re-runs are not sold separately — each purchase
            includes one training run for the selected pack.
          </p>
        </div>

        <div className="text-center pt-4 text-muted-foreground">
          <p>
            See also our{" "}
            <Link href="/terms" className="text-primary hover:underline">
              Terms of Service
            </Link>
            . Questions?{" "}
            <Link href={`mailto:${REFUND_CONTACT_EMAIL}`} className="text-primary hover:underline">
              {REFUND_CONTACT_EMAIL}
            </Link>
          </p>
        </div>
      </section>
    </div>
  );
}
