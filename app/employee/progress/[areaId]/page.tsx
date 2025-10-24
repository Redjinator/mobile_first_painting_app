import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { ProgressUpdatePage } from '@/components/employee/ProgressUpdatePage';

export default async function EmployeeProgressPage({
  params,
}: {
  params: Promise<{ areaId: string }>;
}) {
  const session = await auth();
  if (!session?.user) {
    redirect('/login');
  }

  if (session.user.role !== 'EMPLOYEE') {
    redirect('/');
  }

  const { areaId } = await params;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <ProgressUpdatePage areaId={areaId} userId={session.user.id} />
    </div>
  );
}
