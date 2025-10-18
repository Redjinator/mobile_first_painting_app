import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function EmployeePage() {
  const session = await auth();

  if (!session) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Employee Dashboard
          </h1>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-green-800">
              Welcome, {session.user.firstName} {session.user.lastName}!
            </p>
            <p className="text-xs text-green-600 mt-1">
              Role: {session.user.role}
            </p>
          </div>
          <p className="text-gray-600">
            This is the employee dashboard. More features coming soon!
          </p>
        </div>
      </div>
    </div>
  );
}
