'use client'
import { User } from '@supabase/supabase-js';
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, Loader2 } from 'lucide-react';
import { PRICING, PRODUCT_IDS } from '@/lib/pricing';

type Props = {
  user: User | null;
}

const PRODUCTS = [
  {
    id: PRODUCT_IDS.starter,
    name: 'Starter',
    price: `$${PRICING.starter.price}`,
    credits: `${PRICING.starter.credits} Credit`,
    headshots: `${PRICING.starter.headshots} Headshots`,
    description: 'Perfect for individuals looking to enhance their LinkedIn or CV.',
    features: [
      `${PRICING.starter.styles} Styles Included`,
      `${PRICING.starter.headshots} AI-Generated Headshots`,
      'Commercial License',
      'High-Resolution Download',
    ],
  },
  {
    id: PRODUCT_IDS.pro,
    name: 'Pro',
    price: `$${PRICING.pro.price}`,
    credits: `${PRICING.pro.credits} Credits`,
    headshots: `${PRICING.pro.headshots} Headshots`,
    description: 'Ideal for professionals who want variety and different styles.',
    popular: true,
    features: [
      `${PRICING.pro.styles} Styles Included`,
      `${PRICING.pro.headshots} AI-Generated Headshots`,
      'Commercial License',
      'High-Resolution Download',
      'Priority Processing',
    ],
  },
  {
    id: PRODUCT_IDS.executive,
    name: 'Executive',
    price: `$${PRICING.executive.price}`,
    credits: `${PRICING.executive.credits} Credits`,
    headshots: `${PRICING.executive.headshots} Headshots`,
    description: 'The complete package for maximum variety.',
    features: [
      `${PRICING.executive.styles} Styles Included`,
      `${PRICING.executive.headshots} AI-Generated Headshots`,
      'All Backgrounds',
      'Commercial License',
      'High-Resolution Download',
      'Priority Processing',
    ],
  },
];

const CreemPricingTable = ({ user }: Props) => {
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const handleCheckout = async (productId: string) => {
    if (!user) {
      window.location.href = '/login';
      return;
    }
    if (!agreedToTerms) {
      alert('Please agree to the Terms of Service and Refund Policy before purchasing.');
      return;
    }
    setLoadingId(productId);
    try {
      // Create a checkout session via our API
      const resp = await fetch('/api/creem/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId,
          userId: user.id,
          email: user.email,
          name: user.user_metadata?.full_name || user.email,
        }),
      });
      
      const data = await resp.json();
      
      if (data.url) {
        // Redirect to CREEM checkout page
        window.location.href = data.url;
      } else {
        console.error('No checkout URL returned:', data);
        alert('Failed to create checkout session. Please try again.');
      }
    } catch (err) {
      console.error('Checkout error:', err);
      alert('Failed to start checkout. Please try again.');
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto py-12 px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Get Credits</h1>
        <p className="text-muted-foreground text-lg">
          Choose the pack that suits your needs. One credit = one model training.
        </p>
      </div>
      
      <div className="grid md:grid-cols-3 gap-8">
        {PRODUCTS.map((product) => (
          <Card 
            key={product.id} 
            className={`relative flex flex-col ${product.popular ? 'border-primary shadow-lg scale-105' : ''}`}
          >
            {product.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full">
                  Most Popular
                </span>
              </div>
            )}
            
            <CardHeader>
              <CardTitle className="text-xl">{product.name}</CardTitle>
              <CardDescription>{product.description}</CardDescription>
            </CardHeader>
            
            <CardContent className="flex-1">
              <div className="mb-6">
                <span className="text-4xl font-bold">{product.price}</span>
                <div className="mt-2 space-y-1">
                  <p className="text-sm font-medium text-primary">{product.credits} · {product.headshots}</p>
                </div>
              </div>
              
              <ul className="space-y-3">
                {product.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <span className="text-sm text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            
            <CardFooter>
              <Button 
                className="w-full" 
                variant={product.popular ? 'default' : 'outline'}
                onClick={() => handleCheckout(product.id)}
                disabled={loadingId !== null}
              >
                {loadingId === product.id ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Redirecting...
                  </>
                ) : (
                  `Get ${product.credits}`
                )}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Compliance: Terms agreement + CREEM disclosure */}
      <div className="mt-10 max-w-md mx-auto space-y-4">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={agreedToTerms}
            onChange={(e) => setAgreedToTerms(e.target.checked)}
            className="mt-1 h-5 w-5 accent-primary"
          />
          <span className="text-sm text-muted-foreground">
            I agree to the{" "}
            <a href="/terms" target="_blank" className="text-primary hover:underline">Terms of Service</a>
            {" "}and{" "}
            <a href="/refund" target="_blank" className="text-primary hover:underline">Refund Policy</a>.
            I understand that payments are processed by Creem (Merchant of Record).
          </span>
        </label>
        
        <div className="text-center space-y-1">
          <p className="text-xs text-muted-foreground">
            🔒 Payments securely processed by <strong>Creem</strong> (Merchant of Record)
          </p>
          <p className="text-xs text-muted-foreground">
            Prices exclude applicable taxes. Tax will be calculated at checkout.
          </p>
        </div>
      </div>
    </div>
  );
}

export default CreemPricingTable;
