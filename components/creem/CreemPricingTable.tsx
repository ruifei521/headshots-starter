'use client'
import { User } from '@supabase/supabase-js';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

type Props = {
  user: User | null;
}

export default function CreemPricingTable({ user }: Props) {
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    if (!user) {
      window.location.href = '/login?redirect=/packs';
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/creem/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, email: user.email, name: user.user_metadata?.full_name }),
      });
      if (!res.ok) throw new Error('Checkout failed');
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch (e) {
      alert('Payment error. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 p-8">
      <h2 className="text-2xl font-bold">Generate Headshots — $29</h2>
      <p className="text-muted-foreground text-center max-w-md">
        Pay once, generate unlimited headshots from any style.
      </p>
      <Button onClick={handleCheckout} disabled={loading} size="lg" className="text-lg px-8">
        {loading ? 'Redirecting...' : 'Pay $29'}
      </Button>
    </div>
  );
}
