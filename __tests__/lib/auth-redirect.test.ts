import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  safeAuthRedirectPath,
  resolvePostLoginDestination,
  authErrorMessage,
  authErrorTitle,
} from '@/lib/auth-redirect';
import { loginRedirectPath } from '@/lib/login-redirect.server';

describe('auth-redirect', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it('safeAuthRedirectPath blocks external URLs', () => {
    expect(safeAuthRedirectPath('https://evil.com')).toBe('/overview');
    expect(safeAuthRedirectPath('//evil.com')).toBe('/overview');
    expect(safeAuthRedirectPath('/overview')).toBe('/overview');
    expect(safeAuthRedirectPath('/overview?checkout=starter&pack=foo')).toBe(
      '/overview?checkout=starter&pack=foo'
    );
  });

  it('resolvePostLoginDestination keeps Creem checkout URLs', () => {
    expect(
      resolvePostLoginDestination('/api/creem/go?tier=professional&pack=corporate-headshots')
    ).toBe('/api/creem/go?tier=professional&pack=corporate-headshots');
  });

  it('resolvePostLoginDestination blocks open redirects', () => {
    expect(resolvePostLoginDestination('https://evil.com')).toBe('/overview');
    expect(resolvePostLoginDestination('//evil.com/phish')).toBe('/overview');
  });

  it('resolvePostLoginDestination defaults to overview', () => {
    expect(resolvePostLoginDestination(null)).toBe('/overview');
    expect(resolvePostLoginDestination(undefined)).toBe('/overview');
  });

  it('authErrorMessage maps known codes to friendly copy', () => {
    expect(authErrorMessage('missing_token')).toContain('invalid');
    expect(authErrorMessage('verification_failed')).toContain('expired');
    expect(authErrorMessage('unknown_code')).toContain('Sign-in failed');
  });

  it('authErrorMessage passes through OAuth redirect messages', () => {
    expect(authErrorMessage('Google sign-in was cancelled.')).toBe(
      'Google sign-in was cancelled.'
    );
    expect(authErrorMessage('Login link expired. Request a new code.')).toBe(
      'Login link expired. Request a new code.'
    );
  });

  it('authErrorMessage rejects unsafe pass-through payloads', () => {
    expect(authErrorMessage('<script>alert(1)</script>')).toContain('Sign-in failed');
    expect(authErrorMessage('javascript:alert(1)')).toContain('Sign-in failed');
  });

  it('authErrorTitle reflects specific OAuth errors', () => {
    expect(authErrorTitle('Google sign-in was cancelled.')).toBe('Sign-in cancelled');
    expect(authErrorTitle('verification_failed')).toBe('Link expired');
    expect(authErrorTitle('unknown_code')).toBe('Sign-in failed');
  });

  it('loginRedirectPath encodes explicit return path', () => {
    expect(loginRedirectPath('/overview/models/42')).toBe(
      '/login?redirect=%2Foverview%2Fmodels%2F42'
    );
  });
});
