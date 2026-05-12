'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { Database } from '@/types/supabase';
import { createBrowserClient } from '@supabase/ssr';
import { useState, useMemo } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { AiOutlineGoogle } from 'react-icons/ai';
import { useRouter } from 'next/navigation';

type LoginInputs = {
  email: string;
  password: string;
};

type SignupInputs = {
  email: string;
  password: string;
  confirmPassword: string;
};

// Common disposable email domains (small subset for client-side check)
const DISPOSABLE_DOMAINS = new Set([
  'tempmail.com', 'throwaway.com', 'guerrillamail.com', 'mailinator.com',
  '10minutemail.com', 'fakeinbox.com', 'trashmail.com', 'temp-mail.org',
]);

type Mode = 'login' | 'signup';

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

  const [mode, setMode] = useState<Mode>('login');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const loginForm = useForm<LoginInputs>();
  const signupForm = useForm<SignupInputs>();

  const {
    register: registerLogin,
    handleSubmit: handleSubmitLogin,
    formState: { errors: loginErrors, isSubmitted: loginIsSubmitted },
  } = loginForm;

  const {
    register: registerSignup,
    handleSubmit: handleSubmitSignup,
    formState: { errors: signupErrors, isSubmitted: signupIsSubmitted },
  } = signupForm;

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

  const handleLogin: SubmitHandler<LoginInputs> = async (data) => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (error) {
        toast({
          title: 'Login failed',
          variant: 'destructive',
          description: 'Invalid login credentials',
          duration: 5000,
        });
        setIsSubmitting(false);
        return;
      }

      router.push('/overview');
    } catch (error) {
      toast({
        title: 'Something went wrong',
        variant: 'destructive',
        description:
          'Please try again, if the problem persists, contact us at hello@tryleap.ai',
        duration: 5000,
      });
      setIsSubmitting(false);
    }
  };

  const handleSignup: SubmitHandler<SignupInputs> = async (data) => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
      });

      if (error) {
        if (error.message.includes('already registered') || error.message.includes('already exists')) {
          toast({
            title: 'Registration failed',
            variant: 'destructive',
            description: 'User already registered',
            duration: 5000,
          });
        } else {
          toast({
            title: 'Registration failed',
            variant: 'destructive',
            description: error.message,
            duration: 5000,
          });
        }
        setIsSubmitting(false);
        return;
      }

      toast({
        title: 'Success',
        description: 'Registration successful, please sign in',
        duration: 5000,
      });
      setMode('login');
      signupForm.reset();
      setIsSubmitting(false);
    } catch (error) {
      toast({
        title: 'Something went wrong',
        variant: 'destructive',
        description:
          'Please try again, if the problem persists, contact us at hello@tryleap.ai',
        duration: 5000,
      });
      setIsSubmitting(false);
    }
  };

  const toggleMode = () => {
    setMode(mode === 'login' ? 'signup' : 'login');
    loginForm.reset();
    signupForm.reset();
  };

  const validateEmail = (value: string) => {
    if (!value) return 'Email is required';
    if (!/^[A-Z0-9._%-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)) {
      return 'Please enter a valid email';
    }
    if (value.includes('+')) {
      return 'Email addresses with a + are not allowed';
    }
    const domain = value.split('@')[1];
    if (DISPOSABLE_DOMAINS.has(domain)) {
      return 'Please use a permanent email address';
    }
    return true;
  };

  const validatePassword = (value: string) => {
    if (!value) return 'Password is required';
    if (value.length < 6) {
      return 'Password must be at least 6 characters';
    }
    return true;
  };

  const validateConfirmPassword = (value: string) => {
    if (mode === 'signup') {
      const password = signupForm.getValues('password');
      if (value !== password) {
        return 'Passwords do not match';
      }
    }
    return true;
  };

  return (
    <>
      <div className='flex items-center justify-center p-8'>
        <div className='flex flex-col gap-4 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 p-4 rounded-xl max-w-sm w-full'>
          <h1 className='text-xl'>Welcome</h1>
          <p className='text-xs opacity-60'>
            Sign in or create an account to get started.
          </p>

          {mode === 'login' ? (
            <form
              onSubmit={handleSubmitLogin(handleLogin)}
              className='flex flex-col gap-2'
            >
              <div className='flex flex-col gap-4'>
                <div className='flex flex-col gap-2'>
                  <Input
                    type='email'
                    placeholder='Email'
                    {...registerLogin('email', {
                      validate: validateEmail,
                    })}
                  />
                  {loginIsSubmitted && loginErrors.email && (
                    <span className={'text-xs text-red-400'}>
                      {loginErrors.email.message}
                    </span>
                  )}
                </div>
                <div className='flex flex-col gap-2'>
                  <Input
                    type='password'
                    placeholder='Password'
                    {...registerLogin('password', {
                      validate: validatePassword,
                    })}
                  />
                  {loginIsSubmitted && loginErrors.password && (
                    <span className={'text-xs text-red-400'}>
                      {loginErrors.password.message}
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
                Sign In
              </Button>
            </form>
          ) : (
            <form
              onSubmit={handleSubmitSignup(handleSignup)}
              className='flex flex-col gap-2'
            >
              <div className='flex flex-col gap-4'>
                <div className='flex flex-col gap-2'>
                  <Input
                    type='email'
                    placeholder='Email'
                    {...registerSignup('email', {
                      validate: validateEmail,
                    })}
                  />
                  {signupIsSubmitted && signupErrors.email && (
                    <span className={'text-xs text-red-400'}>
                      {signupErrors.email.message}
                    </span>
                  )}
                </div>
                <div className='flex flex-col gap-2'>
                  <Input
                    type='password'
                    placeholder='Password'
                    {...registerSignup('password', {
                      validate: validatePassword,
                    })}
                  />
                  {signupIsSubmitted && signupErrors.password && (
                    <span className={'text-xs text-red-400'}>
                      {signupErrors.password.message}
                    </span>
                  )}
                </div>
                <div className='flex flex-col gap-2'>
                  <Input
                    type='password'
                    placeholder='Confirm Password'
                    {...registerSignup('confirmPassword', {
                      validate: validateConfirmPassword,
                    })}
                  />
                  {signupIsSubmitted && signupErrors.confirmPassword && (
                    <span className={'text-xs text-red-400'}>
                      {signupErrors.confirmPassword.message}
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
                Sign Up
              </Button>
            </form>
          )}

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

          <p className='text-xs text-center opacity-60'>
            {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}{' '}
            <button
              type='button'
              onClick={toggleMode}
              className='underline hover:opacity-80'
            >
              {mode === 'login' ? 'Sign up' : 'Sign in'}
            </button>
          </p>
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
