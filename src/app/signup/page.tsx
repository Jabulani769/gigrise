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

      if (formData.password !== formData.confirmPassword) {
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
        setCurrentStep('verification');
      }
    }
  };

  const handleBack = () => {
    if (currentStep === 'details') {
      setCurrentStep('account-type');
    } else if (currentStep === 'verification') {
      setCurrentStep('details');
    }
  };

  // ✅ REAL SUPABASE SIGNUP
  const handleSubmit = async () => {
    setIsLoading(true);
    setAuthError('');

    try {
      // 1. Sign up with Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,
          },
          emailRedirectTo: `${window.location.origin}/api/auth/callback`,
        },
      });

      if (error) throw error;

      if (data.user) {
        // 2. Update the profile with extra info
        const { error: profileError } = await supabase
          .from('profiles')
          .update({
            user_type: userType,
            phone_number: formData.phone,
            city: formData.location,
            full_name: formData.fullName,
          })
          .eq('id', data.user.id);

        if (profileError) {
          console.error('Profile update error:', profileError);
          // Not critical - profile trigger already created basic profile
        }

        // 3. Redirect to verify email page
        router.push('/verify-email');
      }
    } catch (error: any) {
      console.error('Signup error:', error);

      // Show user-friendly error messages
      if (error.message.includes('already registered')) {
        setAuthError(
          'This email is already registered. Try logging in instead.'
        );
      } else if (error.message.includes('Password')) {
        setAuthError('Password is too weak. Use at least 8 characters.');
      } else if (error.message.includes('valid email')) {
        setAuthError('Please enter a valid email address.');
      } else {
        setAuthError(
          error.message || 'Something went wrong. Please try again.'
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

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
            <div className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link
                href="/login"
                className="font-semibold text-blue-600 hover:text-blue-700"
              >
                Log In
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-2xl px-4">
        <div className="flex min-h-[calc(100vh-12rem)] items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
          <div className="w-full max-w-2xl">
            {/* Step 1: Account Type */}
            {currentStep === 'account-type' && (
              <div>
                <div className="mb-8 text-center">
                  <h1 className="mb-2 text-3xl font-bold text-gray-900">
                    Choose Your Account Type
                  </h1>
                  <p className="text-gray-600">
                    Select how you want to use Gigrise
                  </p>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  {[
                    {
                      type: 'freelancer' as UserType,
                      label: 'Freelancer',
                      desc: 'Offer your services, build portfolio, get hired by clients',
                      icon: <Briefcase className="h-6 w-6" />,
                      color: 'blue',
                    },
                    {
                      type: 'client' as UserType,
                      label: 'Client',
                      desc: 'Hire freelancers for projects and services',
                      icon: <ShoppingCart className="h-6 w-6" />,
                      color: 'purple',
                    },
                    {
                      type: 'seller' as UserType,
                      label: 'Marketplace Seller',
                      desc: 'Sell physical products in our marketplace',
                      icon: <Store className="h-6 w-6" />,
                      color: 'green',
                    },
                    {
                      type: 'both' as UserType,
                      label: 'All-in-One',
                      desc: 'Full access: Freelance, hire, and sell products',
                      icon: <Briefcase className="h-6 w-6" />,
                      color: 'indigo',
                    },
                  ].map(({ type, label, desc, icon, color }) => (
                    <button
                      key={type}
                      onClick={() => setUserType(type)}
                      className={`group rounded-xl border-2 p-6 text-left transition ${
                        userType === type
                          ? `border-${color}-600 bg-${color}-50`
                          : 'border-gray-200 bg-white hover:border-gray-300'
                      }`}
                    >
                      <div className="mb-4 flex items-center justify-between">
                        <div
                          className={`flex h-12 w-12 items-center justify-center rounded-lg transition ${
                            userType === type
                              ? `bg-${color}-600 text-white`
                              : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {icon}
                        </div>
                        <div
                          className={`flex h-6 w-6 items-center justify-center rounded-full border-2 transition ${
                            userType === type
                              ? `border-${color}-600 bg-${color}-600`
                              : 'border-gray-300'
                          }`}
                        >
                          {userType === type && (
                            <Check className="h-4 w-4 text-white" />
                          )}
                        </div>
                      </div>
                      <h3 className="mb-2 text-lg font-semibold text-gray-900">
                        {label}
                      </h3>
                      <p className="text-sm text-gray-600">{desc}</p>
                    </button>
                  ))}
                </div>

                <button
                  onClick={handleNext}
                  className="mt-8 flex w-full items-center justify-center space-x-2 rounded-lg bg-linear-to-r from-blue-600 to-purple-600 px-6 py-3 font-semibold text-white transition hover:from-blue-700 hover:to-purple-700"
                >
                  <span>Continue</span>
                  <ArrowRight className="h-5 w-5" />
                </button>
              </div>
            )}

            {/* Step 2: Details */}
            {currentStep === 'details' && (
              <div>
                <div className="mb-8 text-center">
                  <h1 className="mb-2 text-3xl font-bold text-gray-900">
                    Create Your Account
                  </h1>
                  <p className="text-gray-600">
                    Fill in your details to get started
                  </p>
                </div>

                <form className="space-y-4">
                  {/* Full Name */}
                  <div>
                    <label
                      htmlFor="fullName"
                      className="mb-1 block text-sm font-medium text-gray-700"
                    >
                      Full Name
                    </label>
                    <div className="relative">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <User className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        id="fullName"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        className={`block w-full rounded-lg border ${errors.fullName ? 'border-red-500' : 'border-gray-300 text-gray-700'} py-3 pr-3 pl-10 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none`}
                        placeholder="John Doe"
                      />
                    </div>
                    {errors.fullName && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.fullName}
                      </p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label
                      htmlFor="email"
                      className="mb-1 block text-sm font-medium text-gray-700"
                    >
                      Email Address
                    </label>
                    <div className="relative">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <Mail className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`block w-full rounded-lg border ${errors.email ? 'border-red-500' : 'border-gray-300 text-gray-700'} py-3 pr-3 pl-10 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none`}
                        placeholder="john@example.com"
                      />
                    </div>
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.email}
                      </p>
                    )}
                  </div>

                  {/* Phone */}
                  <div>
                    <label
                      htmlFor="phone"
                      className="mb-1 block text-sm font-medium text-gray-700"
                    >
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className={`block w-full rounded-lg border ${errors.phone ? 'border-red-500' : 'border-gray-300 text-gray-700'} px-3 py-3 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none`}
                      placeholder="+265 888 123 456"
                    />
                    {errors.phone && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.phone}
                      </p>
                    )}
                  </div>

                  {/* Location */}
                  <div>
                    <label
                      htmlFor="location"
                      className="mb-1 block text-sm font-medium text-gray-700"
                    >
                      Location
                    </label>
                    <select
                      id="location"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      className={`block w-full rounded-lg border ${errors.location ? 'border-red-500' : 'border-gray-300 text-gray-700'} px-3 py-3 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none`}
                    >
                      <option value="">Select your city</option>
                      <option value="Blantyre">Blantyre</option>
                      <option value="Lilongwe">Lilongwe</option>
                      <option value="Mzuzu">Mzuzu</option>
                      <option value="Zomba">Zomba</option>
                      <option value="Other">Other</option>
                    </select>
                    {errors.location && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.location}
                      </p>
                    )}
                  </div>

                  {/* Password */}
                  <div>
                    <label
                      htmlFor="password"
                      className="mb-1 block text-sm font-medium text-gray-700"
                    >
                      Password
                    </label>
                    <div className="relative">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <Lock className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className={`block w-full rounded-lg border ${errors.password ? 'border-red-500' : 'border-gray-300 text-gray-700'} py-3 pr-10 pl-10 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none`}
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 flex items-center pr-3"
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5 text-gray-400" />
                        ) : (
                          <Eye className="h-5 w-5 text-gray-400" />
                        )}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.password}
                      </p>
                    )}
                    <p className="mt-1 text-xs text-gray-500">
                      Must be 8+ characters with uppercase, lowercase, and
                      number
                    </p>
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label
                      htmlFor="confirmPassword"
                      className="mb-1 block text-sm font-medium text-gray-700"
                    >
                      Confirm Password
                    </label>
                    <div className="relative">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <Lock className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        id="confirmPassword"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className={`block w-full rounded-lg border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300 text-gray-700'} py-3 pr-10 pl-10 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none`}
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute inset-y-0 right-0 flex items-center pr-3"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-5 w-5 text-gray-400" />
                        ) : (
                          <Eye className="h-5 w-5 text-gray-400" />
                        )}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.confirmPassword}
                      </p>
                    )}
                  </div>

                  {/* Terms */}
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <input
                        type="checkbox"
                        id="agreedToTerms"
                        name="agreedToTerms"
                        checked={formData.agreedToTerms}
                        onChange={handleChange}
                        className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <label
                        htmlFor="agreedToTerms"
                        className="ml-2 text-sm text-gray-600"
                      >
                        I agree to the{' '}
                        <Link
                          href="/terms"
                          className="text-blue-600 hover:text-blue-700"
                        >
                          Terms of Service
                        </Link>{' '}
                        and{' '}
                        <Link
                          href="/privacy"
                          className="text-blue-600 hover:text-blue-700"
                        >
                          Privacy Policy
                        </Link>
                      </label>
                    </div>
                    {errors.agreedToTerms && (
                      <p className="text-sm text-red-600">
                        {errors.agreedToTerms}
                      </p>
                    )}

                    <div className="flex items-start">
                      <input
                        type="checkbox"
                        id="wantsNewsletter"
                        name="wantsNewsletter"
                        checked={formData.wantsNewsletter}
                        onChange={handleChange}
                        className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <label
                        htmlFor="wantsNewsletter"
                        className="ml-2 text-sm text-gray-600"
                      >
                        Send me tips, trends, and updates about Gigrise
                      </label>
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="flex space-x-3 pt-2">
                    <button
                      type="button"
                      onClick={handleBack}
                      className="flex-1 rounded-lg border-2 border-gray-300 px-6 py-3 font-semibold text-gray-700 transition hover:bg-gray-50"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={handleNext}
                      className="flex flex-1 items-center justify-center space-x-2 rounded-lg bg-linear-to-r from-blue-600 to-purple-600 px-6 py-3 font-semibold text-white transition hover:from-blue-700 hover:to-purple-700"
                    >
                      <span>Continue</span>
                      <ArrowRight className="h-5 w-5" />
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Step 3: Verification */}
            {currentStep === 'verification' && (
              <div>
                <div className="mb-8 text-center">
                  <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
                    <Check className="h-10 w-10 text-green-600" />
                  </div>
                  <h1 className="mb-2 text-3xl font-bold text-gray-900">
                    Almost There!
                  </h1>
                  <p className="text-gray-600">
                    Review your information and create your account
                  </p>
                </div>

                {/* Review Summary */}
                <div className="space-y-4 rounded-lg bg-white p-6 shadow-sm">
                  {[
                    {
                      label: 'Account Type',
                      value:
                        userType === 'both'
                          ? 'All-in-One'
                          : userType === 'seller'
                            ? 'Marketplace Seller'
                            : userType.charAt(0).toUpperCase() +
                              userType.slice(1),
                    },
                    { label: 'Full Name', value: formData.fullName },
                    { label: 'Email', value: formData.email },
                    { label: 'Phone', value: formData.phone },
                    { label: 'Location', value: formData.location },
                  ].map(({ label, value }, index, arr) => (
                    <div
                      key={label}
                      className={`flex items-center justify-between ${index < arr.length - 1 ? 'border-b pb-3' : ''}`}
                    >
                      <span className="text-sm text-gray-600">{label}</span>
                      <span className="font-medium text-gray-900">{value}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-6 rounded-lg bg-blue-50 p-4">
                  <p className="text-sm text-blue-900">
                    📧 We&apos;ll send a verification email to{' '}
                    <strong>{formData.email}</strong> to confirm your account.
                  </p>
                </div>

                {/* ✅ Show auth errors here */}
                {authError && (
                  <div className="mt-4 flex items-start space-x-2 rounded-lg bg-red-50 p-4">
                    <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />
                    <p className="text-sm text-red-700">{authError}</p>
                  </div>
                )}

                <div className="mt-6 flex space-x-3">
                  <button
                    type="button"
                    onClick={handleBack}
                    className="flex-1 rounded-lg border-2 border-gray-300 px-6 py-3 font-semibold text-gray-700 transition hover:bg-gray-50"
                    disabled={isLoading}
                  >
                    Back
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={isLoading}
                    className={`flex flex-1 items-center justify-center space-x-2 rounded-lg px-6 py-3 font-semibold text-white transition ${
                      isLoading
                        ? 'cursor-not-allowed bg-gray-400'
                        : 'bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
                    }`}
                  >
                    {isLoading ? (
                      <div className="flex items-center space-x-2">
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                        <span>Creating Account...</span>
                      </div>
                    ) : (
                      <>
                        <span>Create Account</span>
                        <ArrowRight className="h-5 w-5" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
