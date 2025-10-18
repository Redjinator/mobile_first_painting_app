import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Authentication - Painting Buddy',
  description: 'Login to access your account',
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {children}
    </div>
  );
}
