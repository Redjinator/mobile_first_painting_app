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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-12">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-3xl font-bold text-blue-600 mb-2">3</div>
            <div className="text-sm text-gray-600">Active Sites</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-3xl font-bold text-green-600 mb-2">25</div>
            <div className="text-sm text-gray-600">Painters</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-3xl font-bold text-orange-600 mb-2">66%</div>
            <div className="text-sm text-gray-600">Avg Progress</div>
          </div>
        </div>

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
