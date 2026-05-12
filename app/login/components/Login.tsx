'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { Database } from '@/types/supabase';
import { createBrowserClient } from '@supabase/ssr';
import { useState, useMemo, useEffect } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { AiOutlineGoogle } from 'react-icons/ai';
import { WaitingForMagicLink } from './WaitingForMagicLink';

type Inputs = {
  email: string;
};

// Common disposable email domains (small subset for client-side check)
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
  const supabase = useMemo(() => {
    return createBrowserClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
  }, []);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isMagicLinkSent, setIsMagicLinkSent] = useState(false);
  const { toast } = useToast();

  // 处理 URL 中的错误参数（从 auth/callback 重定向回来的），只显示一次
  const errorMsg = searchParams?.error as string | undefined;
  useEffect(() => {
    if (errorMsg) {
      toast({
        title: 'Login failed',
        variant: 'destructive',
        description: errorMsg,
        duration: 8000,
      });
      // 清除 URL 中的 error 参数，避免刷新时重复显示
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

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: data.email,
        options: {
          emailRedirectTo: `${host?.includes('localhost') ? 'http' : 'https'}://${host}/auth/callback`,
        },
      });

      if (error) {
        toast({
          title: 'Error',
          variant: 'destructive',
          description: error.message,
          duration: 5000,
        });
        setIsSubmitting(false);
        return;
      }

      setIsSubmitting(false);
      toast({
        title: 'Email sent',
        description: 'Check your inbox for a magic link to sign in.',
        duration: 5000,
      });
      setIsMagicLinkSent(true);
    } catch (error) {
      setIsSubmitting(false);
      toast({
        title: 'Something went wrong',
        variant: 'destructive',
        description:
          'Please try again, if the problem persists, contact us at hello@tryleap.ai',
        duration: 5000,
      });
    }
  };

  const protocol = host?.includes('localhost') ? 'http' : 'https';
  const redirectUrl = `${protocol}://${host}/auth/callback`;

  const signInWithGoogle = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectUrl,
      },
    });
  };

  if (isMagicLinkSent) {
    return (
      <WaitingForMagicLink toggleState={() => setIsMagicLinkSent(false)} />
    );
  }

  return (
    <>
      <div className='flex items-center justify-center p-8'>
        <div className='flex flex-col gap-4 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 p-4 rounded-xl max-w-sm w-full'>
          <h1 className='text-xl'>Welcome</h1>
          <p className='text-xs opacity-60'>
            Sign in or create an account to get started.
          </p>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className='flex flex-col gap-2'
          >
            <div className='flex flex-col gap-4'>
              <div className='flex flex-col gap-2'>
                <Input
                  type='email'
                  placeholder='Email'
                  {...register('email', {
                    required: true,
                    validate: {
                      emailIsValid: (value: string) =>
                        /^[A-Z0-9._%-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value) ||
                        'Please enter a valid email',
                      emailDoesntHavePlus: (value: string) =>
                        /^[A-Z0-9._%-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value) ||
                        'Email addresses with a + are not allowed',
                      emailIsntDisposable: (value: string) => {
                        const domain = value.split('@')[1];
                        return !DISPOSABLE_DOMAINS.has(domain) ||
                          'Please use a permanent email address';
                      },
                    },
                  })}
                />
                {isSubmitted && errors.email && (
                  <span className={'text-xs text-red-400'}>
                    {errors.email?.message || 'Email is required to sign in'}
                  </span>
                )}
              </div>
            </div>

            <Button
              isLoading={isSubmitting}
              disabled={isSubmitting}
              variant='outline'
              className='w-full'
              type='submit'
            >
              Continue with Email
            </Button>
          </form>

          <OR />

          <Button
            variant='outline'
            className='w-full'
            onClick={signInWithGoogle}
            type='button'
          >
            <AiOutlineGoogle className='mr-2' />
            Continue with Google
          </Button>
        </div>
      </div>
    </>
  );
};

export const OR = () => {
  return (
    <div className='flex items-center my-1'>
      <div className='border-b flex-grow mr-2 opacity-50' />
      <span className='text-sm opacity-50'>OR</span>
      <div className='border-b flex-grow ml-2 opacity-50' />
    </div>
  );
};
