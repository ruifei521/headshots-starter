import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { STARTER_PRICE_LINE } from "@/lib/refund-policy";

export default function BlogPostCta() {
  return (
    <div className="mt-14 rounded-2xl border bg-gradient-to-br from-primary/5 via-muted/40 to-background p-8 md:p-10 text-center shadow-sm">
      <h2 className="text-2xl font-bold tracking-tight">
        Ready for studio-quality headshots?
      </h2>
      <p className="mt-2 text-muted-foreground max-w-lg mx-auto">
        Upload a few selfies and get professional AI headshots in about 25 minutes.
        {STARTER_PRICE_LINE}. Delivered in about 25 minutes.
      </p>
      <div className="mt-6 flex flex-col sm:flex-row justify-center gap-3">
        <Link href="/pricing">
          <Button size="lg" className="group w-full sm:w-auto">
            View pricing
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
        <Link href="/headshots/linkedin">
          <Button size="lg" variant="outline" className="w-full sm:w-auto">
            LinkedIn headshots
          </Button>
        </Link>
      </div>
    </div>
  );
}
