'use client';

import { Star } from 'lucide-react';
import { APP_CONFIG } from '@/lib/app-config';
import { Card, CardContent } from '@/components/ui/card';

/** Social proof bar: Trustpilot rating + customer stats */
export function SocialProofBar() {
  const { trustpilotRating, trustpilotReviews, customersServed, headshotsGenerated } = APP_CONFIG.socialProof;

  // Format numbers for display
  const formatNumber = (n: number): string => {
    if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M+`;
    if (n >= 1_000) return `${Math.round(n / 1_000).toLocaleString()},000+`;
    return `${n.toLocaleString()}+`;
  };

  return (
    <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8 py-6">
      {/* Trustpilot Rating */}
      <div className="flex items-center gap-2">
        <span className="text-2xl font-bold text-green-600">★</span>
        <div className="flex flex-col">
          <span className="font-semibold text-sm">Trustpilot {trustpilotRating}</span>
          <span className="text-xs text-muted-foreground">{trustpilotReviews.toLocaleString()} reviews</span>
        </div>
      </div>

      <span className="hidden md:block text-muted-foreground/40">|</span>

      {/* Customers Served */}
      <div className="flex items-center gap-2">
        <span className="text-2xl font-bold text-primary">{formatNumber(customersServed)}</span>
        <span className="text-sm text-muted-foreground">customers</span>
      </div>

      <span className="hidden md:block text-muted-foreground/40">|</span>

      {/* Headshots Generated */}
      <div className="flex items-center gap-2">
        <span className="text-2xl font-bold text-primary">{formatNumber(headshotsGenerated)}</span>
        <span className="text-sm text-muted-foreground">headshots generated</span>
      </div>
    </div>
  );
}

/** Testimonials section: grid of customer reviews */
export function Testimonials() {
  const { testimonials } = APP_CONFIG.socialProof;

  return (
    <div className="mt-16 max-w-5xl mx-auto w-full">
      <h3 className="text-center text-2xl font-bold mb-2">
        What Our Customers Say
      </h3>
      <p className="text-center text-muted-foreground text-sm mb-8">
        Join thousands of professionals who upgraded their headshots with AI.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {testimonials.map((t, i) => (
          <Card key={i} className="flex flex-col">
            <CardContent className="flex flex-col gap-3 pt-6">
              {/* Rating stars */}
              <div className="flex gap-0.5">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star key={j} className="h-4 w-4 fill-amber-500 text-amber-500" />
                ))}
              </div>

              {/* Quote */}
              <blockquote className="text-sm text-muted-foreground flex-1">
                &ldquo;{t.text}&rdquo;
              </blockquote>

              {/* Author */}
              <div className="flex items-center gap-3 pt-2 border-t">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center text-sm font-bold text-primary">
                  {t.name.charAt(0)}
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold">{t.name}</span>
                  <span className="text-xs text-muted-foreground">{t.role}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
