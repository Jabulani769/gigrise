// src/app/onboarding/page.tsx
'use client';

import Link from 'next/link';
import { useState } from 'react';
import {
  ArrowRight,
  Upload,
  Plus,
  X,
  Check,
  Briefcase,
  Award,
  DollarSign,
} from 'lucide-react';

type OnboardingStep = 'welcome' | 'profile' | 'skills' | 'pricing' | 'complete';

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('welcome');
  const [profileData, setProfileData] = useState({
    bio: '',
    title: '',
    avatar: '',
    portfolio: [] as string[],
  });
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState('');
  const [pricing, setPricing] = useState({
    hourlyRate: '',
    minProject: '',
  });

  // Mock user type from signup
  const userType = 'freelancer'; // This would come from auth context

  const handleNext = () => {
    if (currentStep === 'welcome') setCurrentStep('profile');
    else if (currentStep === 'profile') setCurrentStep('skills');
    else if (currentStep === 'skills') setCurrentStep('pricing');
    else if (currentStep === 'pricing') setCurrentStep('complete');
  };

  const handleSkip = () => {
    // Skip to profile
    window.location.href = '/profile';
  };

  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const removeSkill = (skill: string) => {
    setSkills(skills.filter((s) => s !== skill));
  };

  const handleComplete = () => {
    // Save profile and redirect to profile
    console.log('Profile data:', { profileData, skills, pricing });
    window.location.href = '/profile';
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
            <button
              onClick={handleSkip}
              className="text-sm font-medium text-gray-600 hover:text-gray-900"
            >
              Skip for now
            </button>
          </div>
        </div>
      </header>

      {/* Progress Bar */}
      {currentStep !== 'welcome' && currentStep !== 'complete' && (
        <div className="mx-auto max-w-3xl px-4 pt-8">
          <div className="flex items-center justify-between">
            {[
              { id: 'profile', label: 'Profile', step: 1 },
              { id: 'skills', label: 'Skills', step: 2 },
              { id: 'pricing', label: 'Pricing', step: 3 },
            ].map((item, idx) => (
              <div key={item.id} className="flex flex-1 items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition ${
                      currentStep === item.id
                        ? 'border-blue-600 bg-blue-600 text-white'
                        : item.step <
                            (currentStep === 'skills'
                              ? 2
                              : currentStep === 'pricing'
                                ? 3
                                : 1)
                          ? 'border-green-600 bg-green-600 text-white'
                          : 'border-gray-300 bg-white text-gray-400'
                    }`}
                  >
                    {item.step <
                    (currentStep === 'skills'
                      ? 2
                      : currentStep === 'pricing'
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
                      (currentStep === 'skills'
                        ? 2
                        : currentStep === 'pricing'
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
      )}

      {/* Main Content */}
      <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-2xl">
          {/* Welcome Step */}
          {currentStep === 'welcome' && (
            <div className="animate-in fade-in text-center duration-300">
              <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-linear-to-br from-blue-600 to-purple-600 text-5xl text-white">
                🎉
              </div>
              <h1 className="mb-4 text-4xl font-bold text-gray-900">
                Welcome to Gigrise!
              </h1>
              <p className="mb-8 text-xl text-gray-600">
                Let's set up your profile so clients can find you
              </p>

              <div className="mb-8 grid gap-4 md:grid-cols-3">
                <div className="rounded-lg bg-white p-6 shadow-sm">
                  <Briefcase className="mx-auto mb-3 h-8 w-8 text-blue-600" />
                  <h3 className="mb-2 font-semibold text-gray-900">
                    Create Profile
                  </h3>
                  <p className="text-sm text-gray-600">
                    Build your professional profile
                  </p>
                </div>
                <div className="rounded-lg bg-white p-6 shadow-sm">
                  <Award className="mx-auto mb-3 h-8 w-8 text-purple-600" />
                  <h3 className="mb-2 font-semibold text-gray-900">
                    Showcase Skills
                  </h3>
                  <p className="text-sm text-gray-600">
                    Highlight what you do best
                  </p>
                </div>
                <div className="rounded-lg bg-white p-6 shadow-sm">
                  <DollarSign className="mx-auto mb-3 h-8 w-8 text-green-600" />
                  <h3 className="mb-2 font-semibold text-gray-900">
                    Set Pricing
                  </h3>
                  <p className="text-sm text-gray-600">Define your rates</p>
                </div>
              </div>

              <button
                onClick={handleNext}
                className="inline-flex items-center space-x-2 rounded-lg bg-linear-to-r from-blue-600 to-purple-600 px-8 py-4 font-semibold text-white transition hover:from-blue-700 hover:to-purple-700"
              >
                <span>Get Started</span>
                <ArrowRight className="h-5 w-5" />
              </button>

              <p className="mt-6 text-sm text-gray-500">
                Takes only 2-3 minutes • You can always edit later
              </p>
            </div>
          )}

          {/* Profile Step */}
          {currentStep === 'profile' && (
            <div className="animate-in fade-in duration-300">
              <h2 className="mb-2 text-3xl font-bold text-gray-900">
                Complete Your Profile
              </h2>
              <p className="mb-8 text-gray-600">
                Tell clients about yourself and your work
              </p>

              <div className="space-y-6 rounded-lg bg-white p-6 shadow-sm">
                {/* Avatar Upload */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Profile Picture
                  </label>
                  <div className="flex items-center space-x-4">
                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gray-200 text-3xl">
                      {profileData.avatar || '👤'}
                    </div>
                    <button className="inline-flex items-center space-x-2 rounded-lg border-2 border-gray-300 px-4 py-2 font-medium text-gray-700 hover:bg-gray-50">
                      <Upload className="h-5 w-5" />
                      <span>Upload Photo</span>
                    </button>
                  </div>
                </div>

                {/* Professional Title */}
                <div>
                  <label
                    htmlFor="title"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Professional Title
                  </label>
                  <input
                    type="text"
                    id="title"
                    value={profileData.title}
                    onChange={(e) =>
                      setProfileData({ ...profileData, title: e.target.value })
                    }
                    className="block w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                    placeholder="e.g. Full Stack Developer, Graphic Designer"
                  />
                </div>

                {/* Bio */}
                <div>
                  <label
                    htmlFor="bio"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    About You
                  </label>
                  <textarea
                    id="bio"
                    rows={4}
                    value={profileData.bio}
                    onChange={(e) =>
                      setProfileData({ ...profileData, bio: e.target.value })
                    }
                    className="block w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                    placeholder="Describe your experience, what you do, and what makes you unique..."
                  ></textarea>
                  <p className="mt-1 text-xs text-gray-500">
                    {profileData.bio.length}/500 characters
                  </p>
                </div>

                {/* Portfolio */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Portfolio (Optional)
                  </label>
                  <button className="inline-flex items-center space-x-2 rounded-lg border-2 border-dashed border-gray-300 px-4 py-3 font-medium text-gray-700 hover:border-gray-400 hover:bg-gray-50">
                    <Plus className="h-5 w-5" />
                    <span>Add Portfolio Item</span>
                  </button>
                </div>
              </div>

              <div className="mt-6 flex space-x-3">
                <button
                  onClick={handleNext}
                  className="flex flex-1 items-center justify-center space-x-2 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
                >
                  <span>Continue</span>
                  <ArrowRight className="h-5 w-5" />
                </button>
              </div>
            </div>
          )}

          {/* Skills Step */}
          {currentStep === 'skills' && (
            <div className="animate-in fade-in duration-300">
              <h2 className="mb-2 text-3xl font-bold text-gray-900">
                Add Your Skills
              </h2>
              <p className="mb-8 text-gray-600">
                What services can you provide?
              </p>

              <div className="space-y-6 rounded-lg bg-white p-6 shadow-sm">
                {/* Add Skill Input */}
                <div>
                  <label
                    htmlFor="skill"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Add a Skill
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      id="skill"
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                      className="block flex-1 rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                      placeholder="e.g. React.js, Logo Design, Content Writing"
                    />
                    <button
                      onClick={addSkill}
                      className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
                    >
                      Add
                    </button>
                  </div>
                </div>

                {/* Skills List */}
                {skills.length > 0 && (
                  <div>
                    <p className="mb-3 text-sm font-medium text-gray-700">
                      Your Skills ({skills.length})
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {skills.map((skill) => (
                        <span
                          key={skill}
                          className="inline-flex items-center space-x-2 rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-blue-800"
                        >
                          <span>{skill}</span>
                          <button
                            onClick={() => removeSkill(skill)}
                            className="rounded-full hover:bg-blue-200"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Popular Skills */}
                <div>
                  <p className="mb-3 text-sm font-medium text-gray-700">
                    Popular Skills
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {[
                      'Web Development',
                      'Graphic Design',
                      'Content Writing',
                      'SEO',
                      'Video Editing',
                      'Social Media',
                    ].map((skill) => (
                      <button
                        key={skill}
                        onClick={() => {
                          if (!skills.includes(skill)) {
                            setSkills([...skills, skill]);
                          }
                        }}
                        className="rounded-full border-2 border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:border-blue-600 hover:bg-blue-50 hover:text-blue-600"
                      >
                        + {skill}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-6 flex space-x-3">
                <button
                  onClick={() => setCurrentStep('profile')}
                  className="flex-1 rounded-lg border-2 border-gray-300 px-6 py-3 font-semibold text-gray-700 hover:bg-gray-50"
                >
                  Back
                </button>
                <button
                  onClick={handleNext}
                  className="flex flex-1 items-center justify-center space-x-2 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
                >
                  <span>Continue</span>
                  <ArrowRight className="h-5 w-5" />
                </button>
              </div>
            </div>
          )}

          {/* Pricing Step */}
          {currentStep === 'pricing' && (
            <div className="animate-in fade-in duration-300">
              <h2 className="mb-2 text-3xl font-bold text-gray-900">
                Set Your Rates
              </h2>
              <p className="mb-8 text-gray-600">
                You can always adjust these later
              </p>

              <div className="space-y-6 rounded-lg bg-white p-6 shadow-sm">
                <div>
                  <label
                    htmlFor="hourlyRate"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Hourly Rate (Optional)
                  </label>
                  <div className="relative">
                    <span className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-500">
                      MK
                    </span>
                    <input
                      type="number"
                      id="hourlyRate"
                      value={pricing.hourlyRate}
                      onChange={(e) =>
                        setPricing({ ...pricing, hourlyRate: e.target.value })
                      }
                      className="block w-full rounded-lg border border-gray-300 py-3 pr-4 pl-12 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                      placeholder="5,000"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="minProject"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Minimum Project Budget
                  </label>
                  <div className="relative">
                    <span className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-500">
                      MK
                    </span>
                    <input
                      type="number"
                      id="minProject"
                      value={pricing.minProject}
                      onChange={(e) =>
                        setPricing({ ...pricing, minProject: e.target.value })
                      }
                      className="block w-full rounded-lg border border-gray-300 py-3 pr-4 pl-12 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                      placeholder="20,000"
                    />
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    Projects below this amount won't be shown to you
                  </p>
                </div>

                <div className="rounded-lg bg-blue-50 p-4">
                  <p className="text-sm text-blue-900">
                    💡 <strong>Tip:</strong> Research similar freelancers to set
                    competitive rates. You can adjust these anytime from your
                    profile.
                  </p>
                </div>
              </div>

              <div className="mt-6 flex space-x-3">
                <button
                  onClick={() => setCurrentStep('skills')}
                  className="flex-1 rounded-lg border-2 border-gray-300 px-6 py-3 font-semibold text-gray-700 hover:bg-gray-50"
                >
                  Back
                </button>
                <button
                  onClick={handleNext}
                  className="flex flex-1 items-center justify-center space-x-2 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
                >
                  <span>Continue</span>
                  <ArrowRight className="h-5 w-5" />
                </button>
              </div>
            </div>
          )}

          {/* Complete Step */}
          {currentStep === 'complete' && (
            <div className="animate-in fade-in text-center duration-300">
              <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-green-100">
                <Check className="h-12 w-12 text-green-600" />
              </div>
              <h1 className="mb-4 text-4xl font-bold text-gray-900">
                You're All Set!
              </h1>
              <p className="mb-8 text-xl text-gray-600">
                Your profile is ready. Let's start your journey on Gigrise!
              </p>

              <div className="mb-8 grid gap-4 md:grid-cols-2">
                <div className="rounded-lg bg-white p-6 text-left shadow-sm">
                  <h3 className="mb-2 font-semibold text-gray-900">
                    ✨ What's Next?
                  </h3>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• Post your first gig</li>
                    <li>• Explore the marketplace</li>
                    <li>• Connect with clients</li>
                    <li>• Build your portfolio</li>
                  </ul>
                </div>

                <div className="rounded-lg bg-white p-6 text-left shadow-sm">
                  <h3 className="mb-2 font-semibold text-gray-900">
                    🎁 Welcome Bonus
                  </h3>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• 30-day premium trial</li>
                    <li>• Featured listing</li>
                    <li>• Priority support</li>
                    <li>• 0% fees on first order</li>
                  </ul>
                </div>
              </div>

              <button
                onClick={handleComplete}
                className="inline-flex items-center space-x-2 rounded-lg bg-linear-to-r from-blue-600 to-purple-600 px-8 py-4 font-semibold text-white transition hover:from-blue-700 hover:to-purple-700"
              >
                <span>Go to profile</span>
                <ArrowRight className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
