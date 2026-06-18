import { Check } from "lucide-react";
import { TRUST_CLOSING_BADGE, TRUST_HERO_BADGE } from "@/lib/refund-policy";

export default function BlogTrustBar() {
  return (
    <div className="mx-auto max-w-5xl mb-10 md:mb-14">
      <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 rounded-full border bg-muted/40 px-6 py-3 text-sm text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <Check className="h-4 w-4 text-primary shrink-0" />
          {TRUST_CLOSING_BADGE}
        </span>
        <span className="hidden sm:inline text-muted-foreground/40">·</span>
        <span className="flex items-center gap-1.5">
          <Check className="h-4 w-4 text-primary shrink-0" />
          From $29 · ~25 min delivery
        </span>
        <span className="hidden sm:inline text-muted-foreground/40">·</span>
        <span className="flex items-center gap-1.5">
          <Check className="h-4 w-4 text-primary shrink-0" />
          {TRUST_HERO_BADGE.split(" · ")[0]}
        </span>
      </div>
    </div>
  );
}
