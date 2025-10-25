import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { JobSiteDetail } from '@/components/admin/JobSiteDetail';
import { AdminNav } from '@/components/admin/AdminNav';
import { Breadcrumbs } from '@/components/admin/Breadcrumbs';

interface JobSitePageProps {
  params: Promise<{ id: string }>;
}

export default async function JobSitePage({ params }: JobSitePageProps) {
  const session = await auth();
  const { id } = await params;

  if (!session) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNav />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Breadcrumbs
          items={[
            { label: 'Dashboard', href: '/admin' },
            { label: 'Job Site Details' },
          ]}
        />
        <JobSiteDetail siteId={id} />
      </main>
    </div>
  );
}
