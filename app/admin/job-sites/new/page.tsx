import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { CreateJobSiteForm } from '@/components/admin/CreateJobSiteForm';
import { AdminNav } from '@/components/admin/AdminNav';
import { Breadcrumbs } from '@/components/admin/Breadcrumbs';

export default async function NewJobSitePage() {
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Breadcrumbs
          items={[
            { label: 'Dashboard', href: '/admin' },
            { label: 'New Job Site' },
          ]}
        />
        <CreateJobSiteForm />
      </div>
    </div>
  );
}
