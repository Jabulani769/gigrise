// src/app/onboarding/page.tsx
'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import {
  ArrowRight,
  Upload,
  Plus,
  X,
  Check,
  Briefcase,
  Award,
  DollarSign,
  AlertCircle,
  Loader2,
} from 'lucide-react';

type OnboardingStep = 'welcome' | 'profile' | 'skills' | 'pricing' | 'complete';

export default function OnboardingPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [currentStep, setCurrentStep] = useState<OnboardingStep>('welcome');
  const [userId, setUserId] = useState<string | null>(null);
  const [userType, setUserType] = useState<string>('freelancer');
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [avatarPreview, setAvatarPreview] = useState<string>('');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  const [profileData, setProfileData] = useState({
    bio: '',
    title: '',
  });
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState('');
  const [pricing, setPricing] = useState({
    hourlyRate: '',
    minProject: '',
  });

  // ✅ Get current user on mount
  useEffect(() => {
    const getUser = async () => {
      setIsLoading(true);
      try {
        const { data: { user }, error } = await supabase.auth.getUser();

        if (error || !user) {
          // Not logged in - redirect to login
          router.push('/login');
          return;
        }

        setUserId(user.id);

        // ✅ Fetch existing profile data
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (profile) {
          setUserType(profile.user_type || 'freelancer');
          setProfileData({
            bio: profile.bio || '',
            title: profile.full_name || '',
          });
          setSkills(profile.skills || []);
          setPricing({
            hourlyRate: profile.hourly_rate?.toString() || '',
            minProject: profile.min_project_budget?.toString() || '',
          });
          if (profile.avatar_url) {
            setAvatarPreview(profile.avatar_url);
          }
        }
      } catch (err) {
        console.error('Error fetching user:', err);
      } finally {
        setIsLoading(false);
      }
    };

    getUser();
  }, [router]);

  const handleNext = () => {
    if (currentStep === 'welcome') setCurrentStep('profile');
    else if (currentStep === 'profile') setCurrentStep('skills');
    else if (currentStep === 'skills') setCurrentStep('pricing');
    else if (currentStep === 'pricing') setCurrentStep('complete');
  };

  const handleSkip = () => router.push('/feed');

  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const removeSkill = (skill: string) => {
    setSkills(skills.filter((s) => s !== skill));
  };

  // ✅ Handle avatar file selection
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be less than 5MB');
      return;
    }

    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
    setError('');
  };

  // ✅ Upload avatar to Supabase Storage
  const uploadAvatar = async (userId: string): Promise<string | null> => {
    if (!avatarFile) return avatarPreview || null;

    try {
      const fileExt = avatarFile.name.split('.').pop();
      const filePath = `${userId}/avatar.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, avatarFile, { upsert: true });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      return data.publicUrl;
    } catch (err) {
      console.error('Avatar upload error:', err);
      return null;
    }
  };

  // ✅ Save profile step to Supabase
  const saveProfileStep = async () => {
    if (!userId) return;
    setIsSaving(true);
    setError('');

    try {
      // Upload avatar if selected
      const avatarUrl = await uploadAvatar(userId);

      const { error } = await supabase
        .from('profiles')
        .update({
          bio: profileData.bio,
          full_name: profileData.title,
          avatar_url: avatarUrl,
          updated_at: new Date().toISOString(),
        })
        .eq('id', userId);

      if (error) throw error;

      handleNext();
    } catch (err: any) {
      setError(err.message || 'Failed to save profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  // ✅ Save skills step to Supabase
  const saveSkillsStep = async () => {
    if (!userId) return;
    setIsSaving(true);
    setError('');

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          skills: skills,
          updated_at: new Date().toISOString(),
        })
        .eq('id', userId);

      if (error) throw error;

      handleNext();
    } catch (err: any) {
      setError(err.message || 'Failed to save skills. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  // ✅ Save pricing step to Supabase
  const savePricingStep = async () => {
    if (!userId) return;
    setIsSaving(true);
    setError('');

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          hourly_rate: pricing.hourlyRate ? parseFloat(pricing.hourlyRate) : null,
          min_project_budget: pricing.minProject ? parseFloat(pricing.minProject) : null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', userId);

      if (error) throw error;

      handleNext();
    } catch (err: any) {
      setError(err.message || 'Failed to save pricing. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  // ✅ Complete onboarding - redirect to feed
  const handleComplete = () => {
    router.push('/feed');
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto h-12 w-12 animate-spin text-blue-600" />
          <p className="mt-4 text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

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
            ].map((item, idx) => {
              const currentStepNum =
                currentStep === 'profile' ? 1 :
                currentStep === 'skills' ? 2 :
                currentStep === 'pricing' ? 3 : 0;

              return (
                <div key={item.id} className="flex flex-1 items-center">
                  <div className="flex flex-col items-center">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition ${
                      item.step === currentStepNum
                        ? 'border-blue-600 bg-blue-600 text-white'
                        : item.step < currentStepNum
                          ? 'border-green-600 bg-green-600 text-white'
                          : 'border-gray-300 bg-white text-gray-400'
                    }`}>
                      {item.step < currentStepNum
                        ? <Check className="h-5 w-5" />
                        : item.step
                      }
                    </div>
                    <span className="mt-2 hidden text-xs text-gray-600 sm:block">
                      {item.label}
                    </span>
                  </div>
                  {idx < 2 && (
                    <div className={`mx-2 h-1 flex-1 rounded ${
                      item.step < currentStepNum ? 'bg-green-600' : 'bg-gray-300'
                    }`}></div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Error Banner */}
      {error && (
        <div className="mx-auto mt-4 max-w-2xl px-4">
          <div className="flex items-start space-x-2 rounded-lg bg-red-50 p-4">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-2xl">

          {/* Welcome Step */}
          {currentStep === 'welcome' && (
            <div className="text-center">
              <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-linear-to-br from-blue-600 to-purple-600 text-5xl text-white">
                🎉
              </div>
              <h1 className="mb-4 text-4xl font-bold text-gray-900">
                Welcome to Gigrise!
              </h1>
              <p className="mb-8 text-xl text-gray-600">
                Let&apos;s set up your profile so clients can find you
              </p>

              <div className="mb-8 grid gap-4 md:grid-cols-3">
                <div className="rounded-lg bg-white p-6 shadow-sm">
                  <Briefcase className="mx-auto mb-3 h-8 w-8 text-blue-600" />
                  <h3 className="mb-2 font-semibold text-gray-900">Create Profile</h3>
                  <p className="text-sm text-gray-600">Build your professional profile</p>
                </div>
                <div className="rounded-lg bg-white p-6 shadow-sm">
                  <Award className="mx-auto mb-3 h-8 w-8 text-purple-600" />
                  <h3 className="mb-2 font-semibold text-gray-900">Showcase Skills</h3>
                  <p className="text-sm text-gray-600">Highlight what you do best</p>
                </div>
                <div className="rounded-lg bg-white p-6 shadow-sm">
                  <DollarSign className="mx-auto mb-3 h-8 w-8 text-green-600" />
                  <h3 className="mb-2 font-semibold text-gray-900">Set Pricing</h3>
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
            <div>
              <h2 className="mb-2 text-3xl font-bold text-gray-900">Complete Your Profile</h2>
              <p className="mb-8 text-gray-600">Tell clients about yourself and your work</p>

              <div className="space-y-6 rounded-lg bg-white p-6 shadow-sm">

                {/* ✅ Avatar Upload */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Profile Picture
                  </label>
                  <div className="flex items-center space-x-4">
                    <div className="h-20 w-20 overflow-hidden rounded-full bg-gray-200">
                      {avatarPreview ? (
                        <img
                          src={avatarPreview}
                          alt="Avatar preview"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-3xl">
                          👤
                        </div>
                      )}
                    </div>
                    <div>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarChange}
                        className="hidden"
                      />
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="inline-flex items-center space-x-2 rounded-lg border-2 border-gray-300 px-4 py-2 font-medium text-gray-700 hover:bg-gray-50"
                      >
                        <Upload className="h-5 w-5" />
                        <span>{avatarPreview ? 'Change Photo' : 'Upload Photo'}</span>
                      </button>
                      <p className="mt-1 text-xs text-gray-500">JPG, PNG up to 5MB</p>
                    </div>
                  </div>
                </div>

                {/* Professional Title */}
                <div>
                  <label htmlFor="title" className="mb-2 block text-sm font-medium text-gray-700">
                    Professional Title
                  </label>
                  <input
                    type="text"
                    id="title"
                    value={profileData.title}
                    onChange={(e) => setProfileData({ ...profileData, title: e.target.value })}
                    className="block w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                    placeholder="e.g. Full Stack Developer, Graphic Designer"
                  />
                </div>

                {/* Bio */}
                <div>
                  <label htmlFor="bio" className="mb-2 block text-sm font-medium text-gray-700">
                    About You
                  </label>
                  <textarea
                    id="bio"
                    rows={4}
                    value={profileData.bio}
                    onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                    className="block w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                    placeholder="Describe your experience, what you do, and what makes you unique..."
                    maxLength={500}
                  ></textarea>
                  <p className="mt-1 text-xs text-gray-500">{profileData.bio.length}/500 characters</p>
                </div>
              </div>

              <div className="mt-6">
                <button
                  onClick={saveProfileStep}
                  disabled={isSaving}
                  className="flex w-full items-center justify-center space-x-2 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <span>Continue</span>
                      <ArrowRight className="h-5 w-5" />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Skills Step */}
          {currentStep === 'skills' && (
            <div>
              <h2 className="mb-2 text-3xl font-bold text-gray-900">Add Your Skills</h2>
              <p className="mb-8 text-gray-600">What services can you provide?</p>

              <div className="space-y-6 rounded-lg bg-white p-6 shadow-sm">
                {/* Add Skill Input */}
                <div>
                  <label htmlFor="skill" className="mb-2 block text-sm font-medium text-gray-700">
                    Add a Skill
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      id="skill"
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && addSkill()}
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
                          <button onClick={() => removeSkill(skill)} className="rounded-full hover:bg-blue-200">
                            <X className="h-4 w-4" />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Popular Skills */}
                <div>
                  <p className="mb-3 text-sm font-medium text-gray-700">Popular Skills</p>
                  <div className="flex flex-wrap gap-2">
                    {['Web Development', 'Graphic Design', 'Content Writing', 'SEO', 'Video Editing', 'Social Media'].map((skill) => (
                      <button
                        key={skill}
                        onClick={() => { if (!skills.includes(skill)) setSkills([...skills, skill]); }}
                        className={`rounded-full border-2 px-4 py-2 text-sm font-medium transition ${
                          skills.includes(skill)
                            ? 'border-blue-600 bg-blue-50 text-blue-600'
                            : 'border-gray-300 text-gray-700 hover:border-blue-600 hover:bg-blue-50 hover:text-blue-600'
                        }`}
                      >
                        {skills.includes(skill) ? `✓ ${skill}` : `+ ${skill}`}
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
                  onClick={saveSkillsStep}
                  disabled={isSaving}
                  className="flex flex-1 items-center justify-center space-x-2 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <span>Continue</span>
                      <ArrowRight className="h-5 w-5" />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Pricing Step */}
          {currentStep === 'pricing' && (
            <div>
              <h2 className="mb-2 text-3xl font-bold text-gray-900">Set Your Rates</h2>
              <p className="mb-8 text-gray-600">You can always adjust these later</p>

              <div className="space-y-6 rounded-lg bg-white p-6 shadow-sm">
                <div>
                  <label htmlFor="hourlyRate" className="mb-2 block text-sm font-medium text-gray-700">
                    Hourly Rate (Optional)
                  </label>
                  <div className="relative">
                    <span className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-500">MK</span>
                    <input
                      type="number"
                      id="hourlyRate"
                      value={pricing.hourlyRate}
                      onChange={(e) => setPricing({ ...pricing, hourlyRate: e.target.value })}
                      className="block w-full rounded-lg border border-gray-300 py-3 pr-4 pl-12 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                      placeholder="5,000"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="minProject" className="mb-2 block text-sm font-medium text-gray-700">
                    Minimum Project Budget
                  </label>
                  <div className="relative">
                    <span className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-500">MK</span>
                    <input
                      type="number"
                      id="minProject"
                      value={pricing.minProject}
                      onChange={(e) => setPricing({ ...pricing, minProject: e.target.value })}
                      className="block w-full rounded-lg border border-gray-300 py-3 pr-4 pl-12 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                      placeholder="20,000"
                    />
                  </div>
                  <p className="mt-1 text-xs text-gray-500">Projects below this amount won&apos;t be shown to you</p>
                </div>

                <div className="rounded-lg bg-blue-50 p-4">
                  <p className="text-sm text-blue-900">
                    💡 <strong>Tip:</strong> Research similar freelancers to set competitive rates. You can adjust these anytime from your profile.
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
                  onClick={savePricingStep}
                  disabled={isSaving}
                  className="flex flex-1 items-center justify-center space-x-2 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <span>Continue</span>
                      <ArrowRight className="h-5 w-5" />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Complete Step */}
          {currentStep === 'complete' && (
            <div className="text-center">
              <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-green-100">
                <Check className="h-12 w-12 text-green-600" />
              </div>
              <h1 className="mb-4 text-4xl font-bold text-gray-900">You&apos;re All Set!</h1>
              <p className="mb-8 text-xl text-gray-600">
                Your profile is ready. Let&apos;s start your journey on Gigrise!
              </p>

              <div className="mb-8 grid gap-4 md:grid-cols-2">
                <div className="rounded-lg bg-white p-6 text-left shadow-sm">
                  <h3 className="mb-2 font-semibold text-gray-900">✨ What&apos;s Next?</h3>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• Post your first gig</li>
                    <li>• Explore the marketplace</li>
                    <li>• Connect with clients</li>
                    <li>• Build your portfolio</li>
                  </ul>
                </div>
                <div className="rounded-lg bg-white p-6 text-left shadow-sm">
                  <h3 className="mb-2 font-semibold text-gray-900">🎁 Welcome Bonus</h3>
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
                className="inline-flex items-center space-x-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-4 font-semibold text-white transition hover:from-blue-700 hover:to-purple-700"
              >
                <span>Go to Feed</span>
                <ArrowRight className="h-5 w-5" />
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}