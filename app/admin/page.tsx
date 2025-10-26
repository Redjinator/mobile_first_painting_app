import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { JobSiteList } from '@/components/admin/JobSiteList';
import { AdminNav } from '@/components/admin/AdminNav';
import { RecalculateProgressButton } from '@/components/admin/RecalculateProgressButton';
import Link from 'next/link';

export default async function AdminPage() {
  const session = await auth();

  if (!session) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNav />

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

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <Link
            href="/admin/time-tracking"
            className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow border border-gray-200 hover:border-blue-300"
          >
            <div className="flex items-center gap-4">
              <div className="bg-green-100 rounded-lg p-3">
                <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Time Tracking</h3>
                <p className="text-sm text-gray-600">View active workers and time entries</p>
              </div>
            </div>
          </Link>

          <Link
            href="/admin/team"
            className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow border border-gray-200 hover:border-blue-300"
          >
            <div className="flex items-center gap-4">
              <div className="bg-purple-100 rounded-lg p-3">
                <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Team Management</h3>
                <p className="text-sm text-gray-600">Manage users and assignments</p>
              </div>
            </div>
          </Link>
        </div>

        {/* Action Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Job Sites</h3>
            <p className="text-sm text-gray-600">
              View and manage all active painting projects
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            {session.user.role === 'ADMIN' && <RecalculateProgressButton />}
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
        </div>

        {/* Job Sites Grid */}
        <JobSiteList />
      </main>
    </div>
  );
}
