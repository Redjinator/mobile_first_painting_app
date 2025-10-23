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

        <div className="mt-12 space-y-4">
          <Link href="/login" className="block w-full md:inline-block md:w-auto bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
            Admin Login
          </Link>
          <Link href="/login" className="block w-full md:inline-block md:w-auto bg-gray-200 text-gray-800 px-8 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors md:ml-4">
            Employee Login
          </Link>
        </div>

        <p className="mt-8 text-sm text-gray-500">
          ✅ Next.js 15 • ✅ TypeScript • ✅ Tailwind CSS • ✅ Mobile-First
        </p>
      </div>
    </main>
  );
}
