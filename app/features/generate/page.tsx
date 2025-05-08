'use client';

import { useState } from 'react';
import Papa from 'papaparse';

export default function GenerateDescriptionPage() {
  const [title, setTitle] = useState('');
  const [feature, setFeature] = useState('');
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [description, setDescription] = useState('');
  const [csvResults, setCsvResults] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [csvLoading, setCsvLoading] = useState(false);

  const handleSingleGenerate = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        'https://<your-project-id>.supabase.co/functions/v1/generate-description',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('sb-access-token')}`,
          },
          body: JSON.stringify({ title, feature }),
        }
      );
      const data = await res.json();
      setDescription(data.description || 'Failed to generate.');
    } catch (err) {
      setDescription('An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const handleCsvUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setCsvFile(e.target.files[0]);
    }
  };

  const handleCsvGenerate = () => {
    if (!csvFile) return;
    setCsvLoading(true);
    setCsvResults([]);

    Papa.parse(csvFile, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        const rows = results.data as { title: string; feature: string }[];
        const outputs: string[] = [];

        for (const row of rows) {
          try {
            const res = await fetch(
              'https://<your-project-id>.supabase.co/functions/v1/generate-description',
              {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${localStorage.getItem('sb-access-token')}`,
                },
                body: JSON.stringify({ title: row.title, feature: row.feature }),
              }
            );
            const data = await res.json();
            outputs.push(`• ${row.title}: ${data.description || 'Failed to generate.'}`);
          } catch {
            outputs.push(`• ${row.title}: [Error generating]`);
          }
        }

        setCsvResults(outputs);
        setCsvLoading(false);
      },
    });
  };

  const downloadCsv = () => {
    if (!csvResults.length) return;

    const csv = Papa.unparse(
      csvResults.map((line) => {
        const [title, description] = line.split(': ');
        return {
          title: title?.replace('• ', '').trim(),
          description: description?.trim(),
        };
      })
    );

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'generated_descriptions.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <main className="min-h-screen bg-white px-6 py-12 text-center">
      <h1 className="text-3xl font-bold text-gray-900 mb-10">Generate Product Description</h1>

      <div className="max-w-3xl mx-auto text-left space-y-10">
        {/* Single Entry */}
        <section className="bg-white p-6 rounded-xl shadow border border-gray-200">
          <h2 className="text-xl font-semibold mb-6 text-gray-900">Single Product Description</h2>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Product Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md text-gray-900 placeholder-gray-500 bg-white"
            />
            <input
              type="text"
              placeholder="Key Feature"
              value={feature}
              onChange={(e) => setFeature(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md text-gray-900 placeholder-gray-500 bg-white"
            />
            <button
              onClick={handleSingleGenerate}
              disabled={loading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 rounded-md"
            >
              {loading ? 'Generating...' : 'Generate Description'}
            </button>
            {description && (
              <p className="mt-4 text-gray-700 whitespace-pre-line">{description}</p>
            )}
          </div>
        </section>

        {/* CSV Upload */}
        <section className="bg-white p-6 rounded-xl shadow border border-gray-200">
          <h2 className="text-xl font-semibold mb-6 text-gray-900">Bulk Generate via CSV Upload</h2>
          <div className="space-y-4">
            <input
              type="file"
              accept=".csv"
              onChange={handleCsvUpload}
              className="w-full p-2 border border-gray-300 rounded-md bg-white text-gray-900"
            />
            {csvFile && (
              <p className="text-sm text-gray-600">Selected File: {csvFile.name}</p>
            )}
            <p className="text-sm text-gray-500">
              * CSV must contain <code>title</code> and <code>feature</code> columns
            </p>
            <button
              onClick={handleCsvGenerate}
              disabled={csvLoading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 rounded-md"
            >
              {csvLoading ? 'Generating Descriptions...' : 'Generate All Descriptions'}
            </button>

            {csvResults.length > 0 && (
              <>
                <div className="mt-6 space-y-2 p-4 border rounded bg-gray-50 text-sm text-gray-800">
                  {csvResults.map((line, idx) => (
                    <p key={idx}>{line}</p>
                  ))}
                </div>

                <div className="text-right mt-4">
                  <button
                    onClick={downloadCsv}
                    className="inline-block bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-md font-medium"
                  >
                    Download CSV
                  </button>
                </div>
              </>
            )}
          </div>
        </section>
      </div>

      <div className="mt-12 text-center">
        <a
          href="/dashboard"
          className="inline-block text-emerald-700 font-medium hover:underline"
        >
          ← Back to Dashboard
        </a>
      </div>
    </main>
  );
}
