// src/app/signup/page.tsx
'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import {
  ArrowRight,
  Mail,
  Lock,
  User,
  Briefcase,
  ShoppingCart,
  Store,
  Check,
  Eye,
  EyeOff,
  AlertCircle,
} from 'lucide-react';

type SignupStep = 'account-type' | 'details' | 'verification';
type UserType = 'freelancer' | 'client' | 'seller' | 'both';

export default function SignupPage() {
  const router = useRouter();

  const [currentStep, setCurrentStep] = useState<SignupStep>('account-type');
  const [userType, setUserType] = useState<UserType>('freelancer');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [authError, setAuthError] = useState('');

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    location: '',
    agreedToTerms: false,
    wantsNewsletter: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });

    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validateStep = () => {
    const newErrors: Record<string, string> = {};

    if (currentStep === 'details') {
      if (!formData.fullName.trim()) {
        newErrors.fullName = 'Full name is required';
      } else if (formData.fullName.length < 3) {
        newErrors.fullName = 'Name must be at least 3 characters';
      }

      if (!formData.email.trim()) {
        newErrors.email = 'Email is required';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = 'Please enter a valid email';
      }

      if (!formData.password) {
        newErrors.password = 'Password is required';
      } else if (formData.password.length < 8) {
        newErrors.password = 'Password must be at least 8 characters';
      } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
        newErrors.password =
          'Password must contain uppercase, lowercase, and number';
      }

      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Please confirm your password';
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }

      if (!formData.phone.trim()) {
        newErrors.phone = 'Phone number is required';
      }

      if (!formData.location.trim()) {
        newErrors.location = 'Location is required';
      }

      if (!formData.agreedToTerms) {
        newErrors.agreedToTerms = 'You must agree to the terms';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (currentStep === 'account-type') {
      setCurrentStep('details');
    } else if (currentStep === 'details') {
      if (validateStep()) {
        handleSignup();
      }
    }
  };

  const handleBack = () => {
    if (currentStep === 'details') {
      setCurrentStep('account-type');
    }
  };

  const handleSignup = async () => {
    setIsLoading(true);
    setAuthError('');

    try {
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          emailRedirectTo: `${window.location.origin}/api/auth/callback`,
          data: {
            full_name: formData.fullName,
            phone_number: formData.phone,
            user_type: userType,
            city: formData.location,
          },
        },
      });

      if (error) throw error;

      // Check if email confirmation is required
      if (data.user && !data.session) {
        // Email confirmation is ON - go to verify page
        router.push(
          `/verify-email?email=${encodeURIComponent(formData.email)}`
        );
      } else if (data.session) {
        // Email confirmation is OFF - go directly to onboarding
        router.push('/onboarding');
      }
    } catch (error) {
      console.error('Signup error:', error);
      setAuthError((error as Error).message || 'Failed to create account');
    } finally {
      setIsLoading(false);
    }
  };

  const accountTypes = [
    {
      type: 'freelancer' as UserType,
      icon: Briefcase,
      title: 'Freelancer',
      description: 'Offer your skills and services',
      color: 'blue',
    },
    {
      type: 'client' as UserType,
      icon: User,
      title: 'Client',
      description: 'Hire talented freelancers',
      color: 'green',
    },
    {
      type: 'seller' as UserType,
      icon: Store,
      title: 'Seller',
      description: 'Sell products on marketplace',
      color: 'purple',
    },
    {
      type: 'both' as UserType,
      icon: ShoppingCart,
      title: 'Both',
      description: 'Offer services & sell products',
      color: 'orange',
    },
  ];

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-linear-to-br from-blue-600 to-purple-600"></div>
              <span className="text-xl font-bold text-gray-900">Gigrise</span>
            </Link>
            <Link
              href="/login"
              className="text-sm font-medium text-gray-600 hover:text-gray-900"
            >
              Already have an account?{' '}
              <span className="text-blue-600">Sign in</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4">
            {[
              { step: 'account-type', label: 'Account Type' },
              { step: 'details', label: 'Your Details' },
            ].map((item, index) => (
              <div key={item.step} className="flex items-center">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full border-2 font-semibold ${
                    currentStep === item.step
                      ? 'border-blue-600 bg-blue-600 text-white'
                      : index === 0
                        ? 'border-green-600 bg-green-600 text-white'
                        : 'border-gray-300 bg-white text-gray-400'
                  }`}
                >
                  {index === 0 && currentStep !== 'account-type' ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    index + 1
                  )}
                </div>
                <span
                  className={`ml-2 hidden text-sm font-medium sm:inline ${
                    currentStep === item.step
                      ? 'text-gray-900'
                      : 'text-gray-500'
                  }`}
                >
                  {item.label}
                </span>
                {index < 1 && (
                  <div className="mx-4 h-0.5 w-12 bg-gray-300 sm:w-20"></div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step 1: Account Type */}
        {currentStep === 'account-type' && (
          <div className="mx-auto max-w-3xl">
            <div className="mb-8 text-center">
              <h1 className="mb-2 text-3xl font-bold text-gray-900">
                Choose Your Account Type
              </h1>
              <p className="text-gray-600">
                Select how you want to use Gigrise
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {accountTypes.map(
                ({ type, icon: Icon, title, description, color }) => {
                  const colorMap: Record<
                    string,
                    { border: string; bg: string; icon: string; check: string }
                  > = {
                    blue: {
                      border: 'border-blue-600',
                      bg: 'bg-blue-50',
                      icon: 'bg-blue-600',
                      check: 'border-blue-600 bg-blue-600',
                    },
                    green: {
                      border: 'border-green-600',
                      bg: 'bg-green-50',
                      icon: 'bg-green-600',
                      check: 'border-green-600 bg-green-600',
                    },
                    purple: {
                      border: 'border-purple-600',
                      bg: 'bg-purple-50',
                      icon: 'bg-purple-600',
                      check: 'border-purple-600 bg-purple-600',
                    },
                    orange: {
                      border: 'border-orange-600',
                      bg: 'bg-orange-50',
                      icon: 'bg-orange-600',
                      check: 'border-orange-600 bg-orange-600',
                    },
                  };

                  const colors = colorMap[color];
                  const isSelected = userType === type;

                  return (
                    <button
                      key={type}
                      onClick={() => setUserType(type)}
                      className={`group relative rounded-xl border-2 p-6 text-left transition ${
                        isSelected
                          ? `${colors.border} ${colors.bg}`
                          : 'border-gray-200 bg-white hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div
                          className={`flex h-12 w-12 items-center justify-center rounded-lg transition ${isSelected ? `${colors.icon} text-white` : 'bg-gray-100 text-gray-600'}`}
                        >
                          <Icon className="h-6 w-6" />
                        </div>
                        <div
                          className={`flex h-6 w-6 items-center justify-center rounded-full border-2 transition ${isSelected ? `${colors.check}` : 'border-gray-300 bg-white'}`}
                        >
                          {isSelected && (
                            <Check className="h-4 w-4 text-white" />
                          )}
                        </div>
                      </div>
                      <h3 className="mt-4 text-lg font-semibold text-gray-900">
                        {title}
                      </h3>
                      <p className="mt-1 text-sm text-gray-600">
                        {description}
                      </p>
                    </button>
                  );
                }
              )}
            </div>

            <button
              onClick={handleNext}
              className="mt-8 flex w-full items-center justify-center space-x-2 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
            >
              <span>Continue</span>
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        )}

        {/* Step 2: Details */}
        {currentStep === 'details' && (
          <div className="mx-auto max-w-xl rounded-xl bg-white p-8 shadow-lg">
            <div className="mb-6 text-center">
              <h1 className="mb-2 text-2xl font-bold text-gray-900">
                Create Your Account
              </h1>
              <p className="text-sm text-gray-600">
                Fill in your details to get started
              </p>
            </div>

            {authError && (
              <div className="mb-4 flex items-start space-x-2 rounded-lg bg-red-50 p-4">
                <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />
                <p className="text-sm text-red-700">{authError}</p>
              </div>
            )}

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleNext();
              }}
              className="space-y-4"
            >
              {/* Full Name */}
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className={`block w-full rounded-lg border py-3 pr-3 pl-10 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none ${
                      errors.fullName
                        ? 'border-red-500'
                        : 'border-gray-300 text-gray-700'
                    }`}
                    placeholder="Full name"
                  />
                </div>
                {errors.fullName && (
                  <p className="mt-1 text-xs text-red-600">{errors.fullName}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`block w-full rounded-lg border py-3 pr-3 pl-10 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none ${
                      errors.email
                        ? 'border-red-500'
                        : 'border-gray-300 text-gray-700'
                    }`}
                    placeholder="Email"
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-xs text-red-600">{errors.email}</p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`block w-full rounded-lg border px-3 py-3 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none ${
                    errors.phone
                      ? 'border-red-500'
                      : 'border-gray-300 text-gray-700'
                  }`}
                  placeholder="+265 --- -- -- --"
                />
                {errors.phone && (
                  <p className="mt-1 text-xs text-red-600">{errors.phone}</p>
                )}
              </div>

              {/* Location */}
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className={`block w-full rounded-lg border px-3 py-3 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none ${
                    errors.location
                      ? 'border-red-500'
                      : 'border-gray-300 text-gray-700'
                  }`}
                  placeholder="Blantyre, Malawi"
                />
                {errors.location && (
                  <p className="mt-1 text-xs text-red-600">{errors.location}</p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`block w-full rounded-lg border py-3 pr-10 pl-10 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none ${
                      errors.password
                        ? 'border-red-500'
                        : 'border-gray-300 text-gray-700'
                    }`}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-xs text-red-600">{errors.password}</p>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-gray-400" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`block w-full rounded-lg border py-3 pr-10 pl-10 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none ${
                      errors.confirmPassword
                        ? 'border-red-500'
                        : 'border-gray-300 text-gray-700'
                    }`}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1 text-xs text-red-600">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              {/* Terms */}
              <div>
                <label className="flex items-start">
                  <input
                    type="checkbox"
                    name="agreedToTerms"
                    checked={formData.agreedToTerms}
                    onChange={handleChange}
                    className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-600">
                    I agree to the{' '}
                    <Link
                      href="/terms"
                      className="text-blue-600 hover:underline"
                    >
                      Terms of Service
                    </Link>{' '}
                    and{' '}
                    <Link
                      href="/privacy"
                      className="text-blue-600 hover:underline"
                    >
                      Privacy Policy
                    </Link>
                  </span>
                </label>
                {errors.agreedToTerms && (
                  <p className="mt-1 text-xs text-red-600">
                    {errors.agreedToTerms}
                  </p>
                )}
              </div>

              {/* Newsletter */}
              <div>
                <label className="flex items-start">
                  <input
                    type="checkbox"
                    name="wantsNewsletter"
                    checked={formData.wantsNewsletter}
                    onChange={handleChange}
                    className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-600">
                    Send me news and updates about Gigrise
                  </span>
                </label>
              </div>

              {/* Buttons */}
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={handleBack}
                  className="flex-1 rounded-lg border-2 border-gray-300 px-6 py-3 font-semibold text-gray-700 transition hover:bg-gray-50"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex flex-1 items-center justify-center space-x-2 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                      <span>Creating...</span>
                    </>
                  ) : (
                    <>
                      <span>Create Account</span>
                      <ArrowRight className="h-5 w-5" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
