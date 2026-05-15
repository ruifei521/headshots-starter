import Link from "next/link";

export const metadata = {
  title: "Refund Policy - SnapProHead",
  description: "SnapProHead Refund Policy - Our commitment to your satisfaction with our AI headshot service.",
};

export default function RefundPolicy() {
  return (
    <div className="container max-w-4xl py-16 px-4">
      <h1 className="text-3xl font-bold mb-8">Refund Policy</h1>
      <p className="text-sm text-muted-foreground mb-8">Last updated: May 15, 2026</p>

      <section className="space-y-6 text-muted-foreground">
        <div>
          <h2 className="text-xl font-semibold text-foreground mb-3">1. 14-Day Money-Back Guarantee</h2>
          <p>We offer a 14-day money-back guarantee on all credit purchases. If you are not satisfied with the Service within 14 days of your purchase, you may request a full refund.</p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-foreground mb-3">2. Eligibility for Refund</h2>
          <p className="mb-3">To be eligible for a refund:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>The request must be made within 14 days of the original purchase date.</li>
            <li>You must not have used more than 50% of the purchased credits.</li>
            <li>Your account must be in good standing with no violations of our Terms of Service.</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-foreground mb-3">3. How to Request a Refund</h2>
          <p className="mb-3">To request a refund, please contact us at:</p>
          <p>
            <Link href="mailto:contact@snapprohead.com" className="text-primary hover:underline">
              contact@snapprohead.com
            </Link>
          </p>
          <p className="mt-3">Please include the following in your refund request:</p>
          <ul className="list-disc pl-6 space-y-2 mt-2">
            <li>Your account email address</li>
            <li>The date of purchase</li>
            <li>The amount paid</li>
            <li>The reason for the refund request</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-foreground mb-3">4. Refund Processing</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Approved refunds will be processed within 5-10 business days.</li>
            <li>Refunds will be issued to the original payment method.</li>
            <li>Depending on your bank or credit card company, it may take additional time for the refund to appear on your statement.</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-foreground mb-3">5. Partial Refunds</h2>
          <p>In some cases, partial refunds may be offered if:</p>
          <ul className="list-disc pl-6 space-y-2 mt-2">
            <li>More than 50% of credits have been used but technical issues prevented satisfactory results.</li>
            <li>Service interruptions significantly impacted your ability to use the Service.</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-foreground mb-3">6. Non-Refundable Items</h2>
          <p>The following are not eligible for refunds:</p>
          <ul className="list-disc pl-6 space-y-2 mt-2">
            <li>Credit purchases older than 14 days</li>
            <li>Credits that have been fully consumed</li>
            <li>Accounts terminated for Terms of Service violations</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-foreground mb-3">7. Quality Satisfaction</h2>
          <p>If you are unsatisfied with the quality of your generated headshots (but have used credits), please contact us. We may offer:</p>
          <ul className="list-disc pl-6 space-y-2 mt-2">
            <li>Free regeneration of headshots with different settings</li>
            <li>Additional credits at no charge</li>
            <li>Guidance on improving photo upload quality for better results</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-foreground mb-3">8. Contact Us</h2>
          <p>If you have any questions about this Refund Policy, please contact us at:</p>
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
