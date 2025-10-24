import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { EmployeeJobSiteDetail } from '@/components/employee/EmployeeJobSiteDetail';

export default async function EmployeeJobSitePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session?.user) {
    redirect('/login');
  }

  if (session.user.role !== 'EMPLOYEE') {
    redirect('/');
  }

  const { id } = await params;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <EmployeeJobSiteDetail jobSiteId={id} userId={session.user.id} />
    </div>
  );
}
