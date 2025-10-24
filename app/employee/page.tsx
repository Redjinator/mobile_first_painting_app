import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { UserMenu } from '@/components/auth/UserMenu';
import { EmployeeDashboard } from '@/components/employee/EmployeeDashboard';

export default async function EmployeePage() {
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
              <p className="text-xs text-gray-500">Painter Dashboard</p>
            </div>
            <UserMenu />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <EmployeeDashboard userId={session.user.id} />
      </main>
    </div>
  );
}
