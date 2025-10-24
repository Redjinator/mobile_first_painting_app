import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { ClockPage } from '@/components/employee/ClockPage';

export default async function EmployeeClockPage() {
  const session = await auth();
  if (!session?.user) {
    redirect('/login');
  }

  if (session.user.role !== 'EMPLOYEE') {
    redirect('/');
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <ClockPage userId={session.user.id} />
    </div>
  );
}
