import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { UserMenu } from '@/components/auth/UserMenu';

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
            <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
            <UserMenu />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-blue-800">
              Welcome, {session.user.firstName} {session.user.lastName}!
            </p>
            <p className="text-xs text-blue-600 mt-1">
              Role: {session.user.role}
            </p>
          </div>
          <p className="text-gray-600">
            This is the admin dashboard. More features coming soon!
          </p>
        </div>
      </main>
    </div>
  );
}
