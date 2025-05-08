'use client';

import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Top Navigation */}
      <header className="flex justify-between items-center px-6 py-4 border-b shadow-sm">
        <h2 className="text-xl font-bold text-emerald-600">CopyNest</h2>
        <div className="space-x-4">
          <Link href="/login" className="text-sm text-gray-700 hover:underline">Login</Link>
          <Link href="/signup" className="text-sm text-emerald-700 hover:underline">Signup</Link>
        </div>
      </header>

      {/* Main Landing Content */}
      <main className="flex-1 px-4 py-12 text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-14 md:text-3xl">
          AI PRODUCT DESCRIPTION GENERATOR
        </h1>
        <p className="mt-6 text-gray-700 text-lg md:text-xl max-w-2xl mx-auto mb-20">
          Generate compelling, SEO-friendly product descriptions in seconds with AI.
          Increase your e-commerce conversions effortlessly.
        </p>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 max-w-4xl mx-auto mb-8 text-left">
          <Feature
            title="AI-Powered"
            description="Utilizes advanced AI models to create compelling product descriptions."
          />
          <Feature
            title="Saves Time"
            description="Quickly generate descriptions without manual effort."
          />
          <Feature
            title="Enhances SEO"
            description="Produces optimized content to improve search engine rankings."
          />
          <Feature
            title="Customizable"
            description="Tailor descriptions to match your brand’s tone and style."
          />
        </div>

        <Link href="/signup">
          <button className="mt-10 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold py-3 px-6 rounded-md">
            Start Free Trial
          </button>
        </Link>
      </main>
    </div>
  );
}

function Feature({ title, description }: { title: string; description: string }) {
  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
      <p className="mt-1 text-sm text-gray-600">{description}</p>
    </div>
  );
}
