import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-bold text-blue-600 mb-4">
          PaintingBuddy
        </h1>
        <p className="text-lg md:text-xl text-gray-600 mb-8">
          Mobile-First Painting Contractor Management
        </p>

        <div className="mt-12">
          <Link href="/login" className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-md">
            Sign In
          </Link>
          <p className="mt-4 text-sm text-gray-600">
            Access is automatically granted based on your credentials
          </p>
        </div>

        <p className="mt-8 text-sm text-gray-500">
          ✅ Next.js 15 • ✅ TypeScript • ✅ Tailwind CSS • ✅ Mobile-First
        </p>
      </div>
    </main>
  );
}
