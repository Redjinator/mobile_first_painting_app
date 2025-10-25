'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function AdminNav() {
  const pathname = usePathname();

  const navItems = [
    { href: '/admin', label: 'Dashboard', icon: '🏠' },
    { href: '/admin/team', label: 'Team', icon: '👥' },
    { href: '/admin/time-tracking', label: 'Time Tracking', icon: '⏱️' },
  ];

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 mb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Home */}
          <Link
            href="/admin"
            className="text-xl font-bold text-blue-600 hover:text-blue-700 transition"
          >
            PaintingBuddy
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                    isActive
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <span className="mr-1">{item.icon}</span>
                  {item.label}
                </Link>
              );
            })}
          </div>

          {/* User Menu / Logout */}
          <form action="/api/auth/signout" method="POST">
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition"
            >
              Logout
            </button>
          </form>
        </div>
      </div>
    </nav>
  );
}
