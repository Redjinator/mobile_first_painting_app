import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { TeamManagement } from '@/components/admin/TeamManagement';
import { AdminNav } from '@/components/admin/AdminNav';

export default async function AdminTeamPage() {
  const session = await auth();
  if (!session?.user) {
    redirect('/login');
  }

  if (session.user.role !== 'ADMIN') {
    redirect('/unauthorized');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNav />
      <div className="p-4 md:p-6">
        <TeamManagement />
      </div>
    </div>
  );
}
