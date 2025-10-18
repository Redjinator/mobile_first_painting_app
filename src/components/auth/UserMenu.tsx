'use client';

import { useState } from 'react';
import { signOut } from 'next-auth/react';
import { useCurrentUser } from '@/hooks/useCurrentUser';

/**
 * Mobile-friendly user menu component
 * Shows user name, role, and logout button
 * Displays as a dropdown on larger screens, modal on mobile
 */
export function UserMenu() {
  const { user, isLoading } = useCurrentUser();
  const [isOpen, setIsOpen] = useState(false);

  if (isLoading || !user) {
    return null;
  }

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/login' });
  };

  return (
    <div className="relative">
      {/* User Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-3 rounded-lg bg-white px-4 py-2 shadow-sm border border-gray-200 hover:bg-gray-50 transition-colors min-h-[44px]"
      >
        {/* Avatar */}
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-600 text-white text-sm font-semibold">
          {user.firstName.charAt(0)}
          {user.lastName.charAt(0)}
        </div>

        {/* User Info - Hidden on mobile */}
        <div className="hidden sm:block text-left">
          <p className="text-sm font-medium text-gray-900">
            {user.firstName} {user.lastName}
          </p>
          <p className="text-xs text-gray-500">{user.role}</p>
        </div>

        {/* Chevron */}
        <svg
          className={`h-5 w-5 text-gray-400 transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          {/* Backdrop for mobile */}
          <div
            className="fixed inset-0 z-10 bg-black bg-opacity-25 sm:hidden"
            onClick={() => setIsOpen(false)}
          />

          {/* Menu Panel */}
          <div className="fixed bottom-0 left-0 right-0 z-20 sm:absolute sm:right-0 sm:left-auto sm:top-full sm:mt-2 sm:w-64">
            <div className="bg-white rounded-t-2xl sm:rounded-lg shadow-lg border border-gray-200 overflow-hidden">
              {/* User Info - Visible on mobile */}
              <div className="sm:hidden border-b border-gray-200 p-4 bg-gray-50">
                <p className="text-sm font-medium text-gray-900">
                  {user.firstName} {user.lastName}
                </p>
                <p className="text-xs text-gray-500 mt-1">{user.email}</p>
                <span className="inline-block mt-2 px-2 py-1 text-xs font-medium bg-primary-100 text-primary-800 rounded">
                  {user.role}
                </span>
              </div>

              {/* Menu Items */}
              <div className="p-2">
                <button
                  onClick={() => {
                    setIsOpen(false);
                    // Navigate to profile (placeholder)
                    alert('Profile page coming soon');
                  }}
                  className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors flex items-center space-x-3 min-h-[44px]"
                >
                  <svg
                    className="h-5 w-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  <span className="text-sm font-medium text-gray-700">
                    Profile
                  </span>
                </button>

                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-3 rounded-lg hover:bg-red-50 transition-colors flex items-center space-x-3 min-h-[44px]"
                >
                  <svg
                    className="h-5 w-5 text-red-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                  <span className="text-sm font-medium text-red-600">
                    Sign Out
                  </span>
                </button>
              </div>

              {/* Cancel button for mobile */}
              <div className="sm:hidden border-t border-gray-200 p-2">
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-full px-4 py-3 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors text-sm font-medium text-gray-700 min-h-[44px]"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
