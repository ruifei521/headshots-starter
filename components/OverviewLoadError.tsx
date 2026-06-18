"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

/** Shown when overview data fails to load instead of a silent empty dashboard. */
export default function OverviewLoadError() {
  return (
    <div className="flex flex-col items-center gap-4 py-16 px-4 text-center max-w-md mx-auto">
      <p className="font-medium">Could not load your models</p>
      <p className="text-sm text-muted-foreground">
        This is usually temporary. Refresh the page or try again in a moment.
      </p>
      <div className="flex gap-2">
        <Button size="sm" onClick={() => window.location.reload()}>
          Refresh
        </Button>
        <Button size="sm" variant="outline" asChild>
          <Link href="/">Go home</Link>
        </Button>
      </div>
      <p className="text-xs text-muted-foreground">
        Still stuck?{" "}
        <a href="mailto:contact@snapprohead.com" className="text-primary underline">
          contact@snapprohead.com
        </a>
      </p>
    </div>
  );
}
