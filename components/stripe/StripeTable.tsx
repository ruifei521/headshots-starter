'use client'
import { User } from '@supabase/supabase-js';
import React, { useEffect } from 'react';

interface StripePricingTableProps extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> {
  'pricing-table-id': string;
  'publishable-key': string;
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'stripe-pricing-table': StripePricingTableProps;
    }
  }
}

type Props = {
  user: User;
}

const StripePricingTable = ({ user }: Props) => {
  const stripePublishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

  useEffect(() => {
    if (!stripePublishableKey) return;
    const script = document.createElement('script');
    script.src = "https://js.stripe.com/v3/pricing-table.js";
    script.async = true;

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    }
  }, [stripePublishableKey]);

  if (!stripePublishableKey) {
    return (
      <div className='flex flex-1 flex-col w-full items-center justify-center py-12'>
        <p className='text-muted-foreground'>Payment is currently processed by Creem. Please visit the <a href="/get-credits" className="text-primary hover:underline">Get Credits</a> page.</p>
      </div>
    );
  }

  return (
    <div className='flex flex-1 flex-col w-full'>
      <stripe-pricing-table
          pricing-table-id="prctbl_1P0TL0C3ic5Sd20TGpWOU2Fi"
          publishable-key={stripePublishableKey}
          client-reference-id={user.id}
          customer-email={user.email}
      >
      </stripe-pricing-table>
    </div>
  );
}

export default StripePricingTable;
