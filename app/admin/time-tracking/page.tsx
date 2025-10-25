import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { TimeTrackingDashboard } from '@/components/admin/TimeTrackingDashboard';

export default async function AdminTimeTrackingPage() {
  const session = await auth();
  if (!session?.user) {
    redirect('/login');
  }

  if (session.user.role !== 'ADMIN') {
    redirect('/unauthorized');
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <TimeTrackingDashboard />
    </div>
  );
}
