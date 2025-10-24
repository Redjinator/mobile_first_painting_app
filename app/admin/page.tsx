import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { UserMenu } from '@/components/auth/UserMenu';
import { JobSiteList } from '@/components/admin/JobSiteList';
import Link from 'next/link';

export default async function AdminPage() {
  const session = await auth();

  if (!session) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div>
              <h1 className="text-xl font-bold text-gray-900">PaintingBuddy</h1>
              <p className="text-xs text-gray-500">Admin Dashboard</p>
            </div>
            <UserMenu />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg shadow-lg p-6 mb-6 text-white">
          <h2 className="text-2xl font-bold mb-2">
            Welcome back, {session.user.firstName}!
          </h2>
          <p className="text-blue-100">
            Manage your painting projects and team
          </p>
        </div>

        {/* Action Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Job Sites</h3>
            <p className="text-sm text-gray-600">
              View and manage all active painting projects
            </p>
          </div>
          <Link
            href="/admin/job-sites/new"
            className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            <svg
              className="-ml-1 mr-2 h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            New Job Site
          </Link>
        </div>

        {/* Job Sites Grid */}
        <JobSiteList />
      </main>
    </div>
  );
}
