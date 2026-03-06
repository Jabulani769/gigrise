'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { Mail, CheckCircle, RefreshCw } from 'lucide-react';

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [isResending, setIsResending] = useState(false);
  const [resendMessage, setResendMessage] = useState('');
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);

  // ✅ Get email from URL parameter
  useEffect(() => {
    const emailParam = searchParams.get('email');
    if (emailParam) {
      setEmail(emailParam);
    }
  }, [searchParams]);

  // Countdown timer for resend button
  useEffect(() => {
    if (countdown > 0 && !canResend) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0) {
      setCanResend(true);
    }
  }, [countdown, canResend]);

  // ✅ Resend verification email
  const handleResend = async () => {
    if (!email) return;

    setIsResending(true);

    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
        options: {
          emailRedirectTo: `${window.location.origin}/api/auth/callback`,
        },
      });

      if (error) throw error;

      setResendMessage(
        '✅ Verification email sent successfully! Check your inbox.'
      );
      setCanResend(false);
      setCountdown(60);

      setTimeout(() => setResendMessage(''), 5000);
    } catch (err) {
      console.error('Resend error:', err);
      setResendMessage('❌ Failed to resend. Please try again.');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-purple-50">
      <header className="border-b bg-white/80 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-linear-to-br from-blue-600 to-purple-600"></div>
              <span className="text-xl font-bold text-gray-900">Gigrise</span>
            </Link>
          </div>
        </div>
      </header>

      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-md text-center">
          <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-blue-100">
            <Mail className="h-12 w-12 text-blue-600" />
          </div>

          <h1 className="mb-4 text-3xl font-bold text-gray-900">
            Verify Your Email
          </h1>
          <p className="mb-8 text-gray-600">
            We&apos;ve sent a verification email to:
          </p>
          <p className="mb-8 text-lg font-semibold text-gray-900">
            {email || 'your email'}
          </p>

          <div className="mb-8 rounded-lg bg-white p-6 text-left shadow-sm">
            <h3 className="mb-4 font-semibold text-gray-900">Next Steps:</h3>
            <ol className="space-y-3 text-sm text-gray-600">
              <li className="flex items-start">
                <span className="mr-3 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-semibold text-blue-600">
                  1
                </span>
                <span>Check your email inbox (and spam folder)</span>
              </li>
              <li className="flex items-start">
                <span className="mr-3 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-semibold text-blue-600">
                  2
                </span>
                <span>Click the verification link in the email</span>
              </li>
              <li className="flex items-start">
                <span className="mr-3 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-semibold text-blue-600">
                  3
                </span>
                <span>
                  You&apos;ll be automatically redirected to complete your
                  profile
                </span>
              </li>
            </ol>
          </div>

          {resendMessage && (
            <div
              className={`mb-6 rounded-lg p-4 ${
                resendMessage.includes('✅') ? 'bg-green-50' : 'bg-red-50'
              }`}
            >
              <div
                className={`flex items-center space-x-2 ${
                  resendMessage.includes('✅')
                    ? 'text-green-800'
                    : 'text-red-800'
                }`}
              >
                {resendMessage.includes('✅') && (
                  <CheckCircle className="h-5 w-5" />
                )}
                <p className="text-sm">{resendMessage}</p>
              </div>
            </div>
          )}

          <div className="mb-6">
            <p className="mb-3 text-sm text-gray-600">
              Didn&apos;t receive the email?
            </p>
            <button
              onClick={handleResend}
              disabled={!canResend || isResending}
              className="inline-flex items-center space-x-2 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isResending ? (
                <>
                  <RefreshCw className="h-5 w-5 animate-spin" />
                  <span>Sending...</span>
                </>
              ) : (
                <>
                  <RefreshCw className="h-5 w-5" />
                  <span>
                    {canResend ? 'Resend Email' : `Resend in ${countdown}s`}
                  </span>
                </>
              )}
            </button>
          </div>

          <div className="rounded-lg bg-yellow-50 p-4 text-left">
            <p className="text-sm text-yellow-800">
              <strong>Need help?</strong> Contact us at{' '}
              <a
                href="mailto:support@gigrise.com"
                className="font-semibold underline"
              >
                support@gigrise.com
              </a>{' '}
              if you&apos;re having trouble verifying your email.
            </p>
          </div>

          <p className="mt-8 text-sm text-gray-600">
            Wrong email address?{' '}
            <Link
              href="/signup"
              className="font-semibold text-blue-600 hover:text-blue-700"
            >
              Sign up again
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
