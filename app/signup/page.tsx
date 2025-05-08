'use client';

import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useRouter } from 'next/navigation';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const [error, setError] = useState('');

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    } else {
      alert('Signup successful. Please login to continue.');
      router.push('/login'); // ✅ redirect to login
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center">
      <form onSubmit={handleSignup} className="w-full max-w-sm space-y-4">
        <h2 className="text-2xl font-bold">Create Account</h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button type="submit" className="w-full bg-emerald-600 text-white p-2 rounded hover:bg-emerald-700">
          Sign Up
        </button>

        <p className="text-sm text-center">
          Already have an account?{' '}
          <a href="/login" className="text-blue-600 underline hover:text-blue-800">Log in</a>
        </p>
      </form>
    </main>
  );
}
