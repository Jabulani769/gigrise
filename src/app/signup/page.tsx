// src/app/signup/page.tsx
'use client';

import Link from 'next/link';
import { useState } from 'react';
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
} from 'lucide-react';

type SignupStep = 'account-type' | 'details' | 'verification';
type UserType = 'freelancer' | 'client' | 'seller' | 'both';

export default function SignupPage() {
  const [currentStep, setCurrentStep] = useState<SignupStep>('account-type');
  const [userType, setUserType] = useState<UserType>('freelancer');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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

  const handleSubmit = async () => {
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      console.log('Signup data:', { ...formData, userType });
      // Redirect to email verification page
      window.location.href = '/verify-email';
      setIsLoading(false);
    }, 2000);
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

      {/* Progress Bar */}
      <div className="mx-auto max-w-2xl px-4 pt-8">
        <div className="flex items-center justify-center">
          {[
            { id: 'account-type', label: 'Account Type', step: 1 },
            { id: 'details', label: 'Your Details', step: 2 },
            { id: 'verification', label: 'Verify', step: 3 },
          ].map((item, idx) => (
            <div key={item.id} className="flex flex-1 items-center">
              <div className="flex flex-col items-center">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition ${
                    currentStep === item.id
                      ? 'border-blue-600 bg-blue-600 text-white'
                      : item.step <
                          (currentStep === 'details'
                            ? 2
                            : currentStep === 'verification'
                              ? 3
                              : 1)
                        ? 'border-green-600 bg-green-600 text-white'
                        : 'border-gray-300 bg-white text-gray-400'
                  }`}
                >
                  {item.step <
                  (currentStep === 'details'
                    ? 2
                    : currentStep === 'verification'
                      ? 3
                      : 1) ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    item.step
                  )}
                </div>
                <span className="mt-2 hidden text-xs text-gray-600 sm:block">
                  {item.label}
                </span>
              </div>
              {idx < 2 && (
                <div
                  className={`mx-2 h-1 flex-1 rounded ${
                    item.step <
                    (currentStep === 'details'
                      ? 2
                      : currentStep === 'verification'
                        ? 3
                        : 1)
                      ? 'bg-green-600'
                      : 'bg-gray-300'
                  }`}
                ></div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex min-h-[calc(100vh-12rem)] items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-2xl">
          {/* Step 1: Account Type */}
          {currentStep === 'account-type' && (
            <div className="animate-in fade-in duration-300">
              <div className="mb-8 text-center">
                <h1 className="mb-2 text-3xl font-bold text-gray-900">
                  Choose Your Account Type
                </h1>
                <p className="text-gray-600">
                  Select how you want to use Gigrise
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {/* Freelancer Option */}
                <button
                  onClick={() => setUserType('freelancer')}
                  className={`group rounded-xl border-2 p-6 text-left transition ${
                    userType === 'freelancer'
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <div className="mb-4 flex items-center justify-between">
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-lg transition ${
                        userType === 'freelancer'
                          ? 'bg-blue-600'
                          : 'bg-gray-100 group-hover:bg-gray-200'
                      }`}
                    >
                      <Briefcase
                        className={`h-6 w-6 ${userType === 'freelancer' ? 'text-white' : 'text-gray-600'}`}
                      />
                    </div>
                    <div
                      className={`h-6 w-6 rounded-full border-2 transition ${
                        userType === 'freelancer'
                          ? 'border-blue-600 bg-blue-600'
                          : 'border-gray-300'
                      }`}
                    >
                      {userType === 'freelancer' && (
                        <Check className="h-5 w-5 text-white" />
                      )}
                    </div>
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-gray-900">
                    Freelancer
                  </h3>
                  <p className="text-sm text-gray-600">
                    Offer your services, build portfolio, get hired by clients
                  </p>
                </button>

                {/* Client Option */}
                <button
                  onClick={() => setUserType('client')}
                  className={`group rounded-xl border-2 p-6 text-left transition ${
                    userType === 'client'
                      ? 'border-purple-600 bg-purple-50'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <div className="mb-4 flex items-center justify-between">
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-lg transition ${
                        userType === 'client'
                          ? 'bg-purple-600'
                          : 'bg-gray-100 group-hover:bg-gray-200'
                      }`}
                    >
                      <ShoppingCart
                        className={`h-6 w-6 ${userType === 'client' ? 'text-white' : 'text-gray-600'}`}
                      />
                    </div>
                    <div
                      className={`h-6 w-6 rounded-full border-2 transition ${
                        userType === 'client'
                          ? 'border-purple-600 bg-purple-600'
                          : 'border-gray-300'
                      }`}
                    >
                      {userType === 'client' && (
                        <Check className="h-5 w-5 text-white" />
                      )}
                    </div>
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-gray-900">
                    Client
                  </h3>
                  <p className="text-sm text-gray-600">
                    Hire freelancers for projects and services
                  </p>
                </button>

                {/* Marketplace Seller Option */}
                <button
                  onClick={() => setUserType('seller')}
                  className={`group rounded-xl border-2 p-6 text-left transition ${
                    userType === 'seller'
                      ? 'border-green-600 bg-green-50'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <div className="mb-4 flex items-center justify-between">
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-lg transition ${
                        userType === 'seller'
                          ? 'bg-green-600'
                          : 'bg-gray-100 group-hover:bg-gray-200'
                      }`}
                    >
                      <Store
                        className={`h-6 w-6 ${userType === 'seller' ? 'text-white' : 'text-gray-600'}`}
                      />
                    </div>
                    <div
                      className={`h-6 w-6 rounded-full border-2 transition ${
                        userType === 'seller'
                          ? 'border-green-600 bg-green-600'
                          : 'border-gray-300'
                      }`}
                    >
                      {userType === 'seller' && (
                        <Check className="h-5 w-5 text-white" />
                      )}
                    </div>
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-gray-900">
                    Marketplace Seller
                  </h3>
                  <p className="text-sm text-gray-600">
                    Sell physical products in our marketplace
                  </p>
                </button>

                {/* All-in-One Option */}
                <button
                  onClick={() => setUserType('both')}
                  className={`group rounded-xl border-2 p-6 text-left transition ${
                    userType === 'both'
                      ? 'border-indigo-600 bg-indigo-50'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <div className="mb-4 flex items-center justify-between">
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-lg transition ${
                        userType === 'both'
                          ? 'bg-indigo-600'
                          : 'bg-gray-100 group-hover:bg-gray-200'
                      }`}
                    >
                      <div className="grid grid-cols-2 gap-0.5">
                        <Briefcase
                          className={`h-4 w-4 ${userType === 'both' ? 'text-white' : 'text-gray-600'}`}
                        />
                        <Store
                          className={`h-4 w-4 ${userType === 'both' ? 'text-white' : 'text-gray-600'}`}
                        />
                      </div>
                    </div>
                    <div
                      className={`h-6 w-6 rounded-full border-2 transition ${
                        userType === 'both'
                          ? 'border-indigo-600 bg-indigo-600'
                          : 'border-gray-300'
                      }`}
                    >
                      {userType === 'both' && (
                        <Check className="h-5 w-5 text-white" />
                      )}
                    </div>
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-gray-900">
                    All-in-One
                  </h3>
                  <p className="text-sm text-gray-600">
                    Full access: Freelance, hire, and sell products
                  </p>
                </button>
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

          {/* Step 2: Details - Same as before */}
          {currentStep === 'details' && (
            <div className="animate-in fade-in duration-300">
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
                      className={`block w-full rounded-lg border ${
                        errors.fullName
                          ? 'border-red-500'
                          : 'border-gray-300 text-gray-700'
                      } py-3 pr-3 pl-10 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none`}
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
                      className={`block w-full rounded-lg border ${
                        errors.email
                          ? 'border-red-500'
                          : 'border-gray-300 text-gray-700'
                      } py-3 pr-3 pl-10 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none`}
                      placeholder="john@example.com"
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email}</p>
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
                    className={`block w-full rounded-lg border ${
                      errors.phone
                        ? 'border-red-500'
                        : 'border-gray-300 text-gray-700'
                    } px-3 py-3 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none`}
                    placeholder="+265 888 123 456"
                  />
                  {errors.phone && (
                    <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
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
                    className={`block w-full rounded-lg border ${
                      errors.location
                        ? 'border-red-500'
                        : 'border-gray-300 text-gray-700'
                    } px-3 py-3 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none`}
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
                      className={`block w-full rounded-lg border ${
                        errors.password
                          ? 'border-red-500'
                          : 'border-gray-300 text-gray-700'
                      } py-3 pr-10 pl-10 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none`}
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
                    Must be 8+ characters with uppercase, lowercase, and number
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
                      className={`block w-full rounded-lg border ${
                        errors.confirmPassword
                          ? 'border-red-500'
                          : 'border-gray-300 text-gray-700'
                      } py-3 pr-10 pl-10 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none`}
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

                {/* Terms & Newsletter */}
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
            <div className="animate-in fade-in duration-300">
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

              <div className="space-y-4 rounded-lg bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between border-b pb-3">
                  <span className="text-sm text-gray-600">Account Type</span>
                  <span className="font-medium text-gray-900">
                    {userType === 'both'
                      ? 'All-in-One'
                      : userType === 'seller'
                        ? 'Marketplace Seller'
                        : userType.charAt(0).toUpperCase() + userType.slice(1)}
                  </span>
                </div>
                <div className="flex items-center justify-between border-b pb-3">
                  <span className="text-sm text-gray-600">Full Name</span>
                  <span className="font-medium text-gray-900">
                    {formData.fullName}
                  </span>
                </div>
                <div className="flex items-center justify-between border-b pb-3">
                  <span className="text-sm text-gray-600">Email</span>
                  <span className="font-medium text-gray-900">
                    {formData.email}
                  </span>
                </div>
                <div className="flex items-center justify-between border-b pb-3">
                  <span className="text-sm text-gray-600">Phone</span>
                  <span className="font-medium text-gray-900">
                    {formData.phone}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Location</span>
                  <span className="font-medium text-gray-900">
                    {formData.location}
                  </span>
                </div>
              </div>

              <div className="mt-6 rounded-lg bg-blue-50 p-4">
                <p className="text-sm text-blue-900">
                  📧 We'll send a verification email to{' '}
                  <strong>{formData.email}</strong> to confirm your account.
                </p>
              </div>

              <div className="mt-8 flex space-x-3">
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
                    <span>Creating Account...</span>
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
  );
}
