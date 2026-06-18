'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { Database } from '@/types/supabase';
import { createBrowserClient } from '@supabase/ssr';
import { useState, useMemo, useEffect } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { AiOutlineGoogle } from 'react-icons/ai';
import { EmailCodeVerification } from './EmailCodeVerification';
import { hardNavigate } from '@/lib/hard-navigate';
import {
  resolvePostLoginDestination,
  authErrorMessage,
  authErrorTitle,
} from '@/lib/auth-redirect';
import {
  postLoginPathFromSearchParams,
  isCheckoutIntent,
} from '@/lib/checkout-url';
import { getTierInfo } from '@/lib/tiers';
import { isInAppBrowser, inAppBrowserHint } from '@/lib/in-app-browser';

type Inputs = {
  email: string;
};

const DISPOSABLE_DOMAINS = new Set([
  'tempmail.com', 'throwaway.com', 'guerrillamail.com', 'mailinator.com',
  '10minutemail.com', 'fakeinbox.com', 'trashmail.com', 'temp-mail.org',
]);

export const Login = ({
  host,
  searchParams,
}: {
  host: string | null;
  searchParams?: { [key: string]: string | string[] | undefined };
}) => {
  const supabase = useMemo(
    () =>
      createBrowserClient<Database>(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      ),
    []
  );

  const [step, setStep] = useState<'email' | 'code'>('email');
  const [pendingEmail, setPendingEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const inAppBrowser = useMemo(() => isInAppBrowser(), []);
  const { toast } = useToast();

  const errorMsg = searchParams?.error as string | undefined;
  useEffect(() => {
    if (errorMsg) {
      toast({
        title: authErrorTitle(errorMsg),
        variant: 'destructive',
        description: authErrorMessage(errorMsg),
        duration: 8000,
      });
      const url = new URL(window.location.href);
      url.searchParams.delete('error');
      window.history.replaceState({}, '', url.toString());
    }
  }, [errorMsg, toast]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitted },
  } = useForm<Inputs>();

  const redirectAfterLogin = (searchParams?.redirect as string) || '';
  const checkoutResumePath = postLoginPathFromSearchParams(searchParams);
  const checkoutTier =
    typeof searchParams?.tier === 'string' ? searchParams.tier : null;
  const checkoutTierName = checkoutTier
    ? getTierInfo(checkoutTier).name
    : null;

  useEffect(() => {
    if (isCheckoutIntent(searchParams)) {
      if (checkoutResumePath) {
        sessionStorage.setItem('postLoginRedirect', checkoutResumePath);
      }
      return;
    }
    sessionStorage.removeItem('postLoginRedirect');
    if (redirectAfterLogin) {
      sessionStorage.setItem(
        'postLoginRedirect',
        resolvePostLoginDestination(redirectAfterLogin)
      );
    }
  }, [checkoutResumePath, redirectAfterLogin, searchParams]);

    const sendLoginCode = async (email: string): Promise<boolean> => {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          // No emailRedirectTo → Supabase sends a 6-digit OTP code (no magic link)
        },
      });

    if (error) {
      toast({
        title: 'Could not send code',
        description: error.message,
        variant: 'destructive',
        duration: 5000,
      });
      return false;
    }
    return true;
  };

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    setIsSubmitting(true);
    setPendingEmail(data.email);
    const ok = await sendLoginCode(data.email);
    setIsSubmitting(false);
    if (ok) {
      setStep('code');
    }
  };

  const signInWithGoogle = () => {
    if (inAppBrowser) {
      toast({
        title: 'Open in Safari or Chrome',
        description: inAppBrowserHint(),
        duration: 10000,
      });
      return;
    }

    const params = new URLSearchParams();
    let afterLogin =
      sessionStorage.getItem('postLoginRedirect') || '/overview';
    afterLogin = resolvePostLoginDestination(afterLogin);

    if (afterLogin === '/overview') {
      if (checkoutResumePath) {
        afterLogin = checkoutResumePath;
      } else if (redirectAfterLogin) {
        afterLogin = resolvePostLoginDestination(redirectAfterLogin);
      }
    }

    if (afterLogin !== '/overview') {
      params.set('redirect', afterLogin);
    }
    const qs = params.toString();
    hardNavigate(`/api/auth/google${qs ? `?${qs}` : ''}`);
  };

  return (
    <div className="flex items-center justify-center p-8">
      <div className="flex flex-col gap-4 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 p-4 rounded-xl max-w-sm w-full">
        {step === 'code' ? (
          <EmailCodeVerification
            email={pendingEmail}
            onBack={() => setStep('email')}
            resending={isResending}
            onResend={async () => {
              setIsResending(true);
              try {
                return await sendLoginCode(pendingEmail);
              } finally {
                setIsResending(false);
              }
            }}
          />
        ) : (
          <>
              {isCheckoutIntent(searchParams) && (
                <div
                  className="rounded-lg border border-primary/25 bg-primary/5 px-3 py-2.5 text-sm"
                  role="status"
                >
                  <p className="font-medium text-foreground">
                    Sign in to complete your purchase
                  </p>
                  <p className="mt-1 text-muted-foreground text-xs leading-relaxed">
                    {checkoutTierName
                      ? `Your ${checkoutTierName} plan is saved. After sign-in you’ll continue to secure checkout.`
                      : 'After sign-in you’ll continue to secure checkout.'}
                  </p>
                </div>
              )}

              <div>
                <h1 className="text-xl font-semibold">Sign in</h1>
                <p className="text-sm text-muted-foreground mt-1">
                  We'll email you a 6-digit code. Enter it here — no need to leave this page.
                </p>
              </div>

            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
              <div className="flex flex-col gap-2">
                <Input
                  type="email"
                  placeholder="Email"
                  autoComplete="email"
                  {...register('email', {
                    required: true,
                    validate: {
                      emailIsValid: (value: string) =>
                        /^[A-Z0-9._%-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value) ||
                        'Please enter a valid email',
                      emailIsntDisposable: (value: string) => {
                        const domain = value.split('@')[1];
                        return (
                          !DISPOSABLE_DOMAINS.has(domain) ||
                          'Please use a permanent email address'
                        );
                      },
                    },
                  })}
                />
                {isSubmitted && errors.email && (
                  <span className="text-xs text-red-400">
                    {errors.email?.message || 'Email is required to sign in'}
                  </span>
                )}
              </div>

              <Button
                isLoading={isSubmitting}
                disabled={isSubmitting}
                variant="outline"
                className="w-full"
                type="submit"
              >
                Send sign-in code
              </Button>
            </form>

            <OR />

            {inAppBrowser && (
              <div
                className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs leading-relaxed text-amber-950 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-100"
                role="status"
              >
                {inAppBrowserHint()}
              </div>
            )}

            <Button
              variant="outline"
              className="w-full"
              onClick={signInWithGoogle}
              type="button"
            >
              <AiOutlineGoogle className="mr-2" />
              Continue with Google
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export const OR = () => {
  return (
    <div className="flex items-center my-1">
      <div className="border-b flex-grow mr-2 opacity-50" />
      <span className="text-sm opacity-50">OR</span>
      <div className="border-b flex-grow ml-2 opacity-50" />
    </div>
  );
};
