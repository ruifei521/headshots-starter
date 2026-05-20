'use client'
import { User } from '@supabase/supabase-js';
import React from 'react';
import { CreemCheckout } from '@creem_io/nextjs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';

type Props = {
  user: User;
}

const PRODUCTS = [
  {
    id: 'prod_31zqeJaVi4nCiCLGPz0F2K',
    name: 'Starter',
    price: '$29',
    credits: '1 Credit',
    headshots: '40 Headshots',
    description: 'Perfect for individuals looking to enhance their LinkedIn or CV.',
    features: [
      '5 Styles Included',
      '40 AI-Generated Headshots',
      'Commercial License',
      'High-Resolution Download',
    ],
  },
  {
    id: 'prod_198ewWuQouDaQfEOT6kTvj',
    name: 'Pro',
    price: '$49',
    credits: '3 Credits',
    headshots: '100 Headshots',
    description: 'Ideal for professionals who want variety and different styles.',
    popular: true,
    features: [
      '10 Styles Included',
      '100 AI-Generated Headshots',
      'Commercial License',
      'High-Resolution Download',
      'Priority Processing',
    ],
  },
  {
    id: 'prod_1pZIlgHsKVk5YOK1QupnPP',
    name: 'Executive',
    price: '$89',
    credits: '5 Credits',
    headshots: '200 Headshots',
    description: 'The complete package for maximum variety.',
    features: [
      '20 Styles Included',
      '200 AI-Generated Headshots',
      'All Backgrounds',
      'Commercial License',
      'High-Resolution Download',
      'Priority Processing',
    ],
  },
];

const CreemPricingTable = ({ user }: Props) => {
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
              <CreemCheckout
                productId={product.id}
                successUrl="/get-credits?success=true"
                metadata={{
                  source: 'web',
                }}
                referenceId={user.id}
                customer={{
                  email: user.email || '',
                  name: user.user_metadata?.full_name || user.email || '',
                }}
              >
                <Button className="w-full" variant={product.popular ? 'default' : 'outline'}>
                  Get {product.credits}
                </Button>
              </CreemCheckout>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default CreemPricingTable;
