'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import DashboardLayout from '@/components/DashboardLayout';

export default function DashboardPage() {
  const [descriptions, setDescriptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDescriptions = async () => {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !session) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('descriptions')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (!error && data) {
        setDescriptions(data);
      }

      setLoading(false);
    };

    fetchDescriptions();
  }, []);

  return (
    <DashboardLayout>
      <main className="min-h-screen bg-white px-6 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Welcome to Your Dashboard</h1>

        {loading ? (
          <p className="text-gray-600">Loading...</p>
        ) : descriptions.length === 0 ? (
          <p className="text-gray-600">No descriptions generated yet.</p>
        ) : (
          <section className="bg-white border rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Recent Descriptions</h2>
            <table className="w-full text-left text-sm text-gray-700 border-t">
              <thead className="border-b text-gray-500">
                <tr>
                  <th className="py-2 px-2">Title</th>
                  <th className="py-2 px-2">Feature</th>
                  <th className="py-2 px-2">Description</th>
                  <th className="py-2 px-2">Created</th>
                </tr>
              </thead>
              <tbody>
                {descriptions.map((desc) => (
                  <tr key={desc.id} className="border-b">
                    <td className="py-2 px-2">{desc.title}</td>
                    <td className="py-2 px-2">{desc.feature}</td>
                    <td className="py-2 px-2 line-clamp-2">{desc.description}</td>
                    <td className="py-2 px-2">{new Date(desc.created_at).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )}
      </main>
    </DashboardLayout>
  );
}
