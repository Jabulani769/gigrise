'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import {
  User,
  Settings,
  LogOut,
  Moon,
  Sun,
  Globe,
  ChevronDown,
} from 'lucide-react';

interface ProfileDropdownProps {
  avatarUrl: string | null;
  fullName: string | null;
  email: string | null;
}

export default function ProfileDropdown({ avatarUrl, fullName, email }: ProfileDropdownProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    alert('Dark mode coming soon!');
  };

  const Avatar = () => {
    if (avatarUrl) {
      return <img src={avatarUrl} alt="Profile" className="h-10 w-10 rounded-full object-cover" />;
    }
    const initials = fullName?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '??';
    return (
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-500 text-sm font-bold text-white">
        {initials}
      </div>
    );
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 rounded-lg p-1 transition hover:bg-gray-100"
      >
        <Avatar />
        <ChevronDown className={`h-4 w-4 text-gray-600 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 z-50 mt-2 w-64 origin-top-right rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="border-b px-4 py-3">
            <p className="text-sm font-semibold text-gray-900">{fullName || 'User'}</p>
            <p className="truncate text-xs text-gray-600">{email || ''}</p>
          </div>

          <div className="py-1">
            <Link
              href="/profile"
              onClick={() => setIsOpen(false)}
              className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 transition hover:bg-gray-100"
            >
              <User className="h-4 w-4" />
              <span>View Profile</span>
            </Link>

            <Link
              href="/settings"
              onClick={() => setIsOpen(false)}
              className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 transition hover:bg-gray-100"
            >
              <Settings className="h-4 w-4" />
              <span>Settings</span>
            </Link>

            <button
              onClick={toggleDarkMode}
              className="flex w-full items-center justify-between px-4 py-2 text-sm text-gray-700 transition hover:bg-gray-100"
            >
              <div className="flex items-center space-x-3">
                {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                <span>Dark Mode</span>
              </div>
              <div className={`relative inline-flex h-5 w-9 items-center rounded-full transition ${isDarkMode ? 'bg-blue-600' : 'bg-gray-300'}`}>
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${isDarkMode ? 'translate-x-4' : 'translate-x-0.5'}`} />
              </div>
            </button>

            <div className="flex items-center justify-between px-4 py-2 text-sm text-gray-700 transition hover:bg-gray-100">
              <div className="flex items-center space-x-3">
                <Globe className="h-4 w-4" />
                <span>Language</span>
              </div>
              <select
                className="border-none bg-transparent text-xs focus:outline-none"
                onChange={(e) => alert(`Language: ${e.target.value} (Coming soon!)`)}
              >
                <option value="en">English</option>
                <option value="ny">Chichewa</option>
                <option value="fr">Français</option>
              </select>
            </div>
          </div>

          <div className="border-t py-1">
            <button
              onClick={handleSignOut}
              className="flex w-full items-center space-x-3 px-4 py-2 text-sm text-red-600 transition hover:bg-red-50"
            >
              <LogOut className="h-4 w-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
