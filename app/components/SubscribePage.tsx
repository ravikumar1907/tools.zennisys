'use client';

import { useState } from 'react';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function SubscribePage() {
  const [email, setEmail] = useState('');
  const [plan, setPlan] = useState('basic');
  const [loading, setLoading] = useState(false);

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Create order on backend
    const orderResponse = await fetch('/api/createOrder', {
      method: 'POST',
      body: JSON.stringify({ amount: plan === 'basic' ? 50000 : 100000 }), // ₹500 or ₹1000
    });

    const orderData = await orderResponse.json();

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
      amount: orderData.amount,
      currency: orderData.currency,
      name: "AI Description Generator",
      description: `${plan.charAt(0).toUpperCase() + plan.slice(1)} Plan Subscription`,
      order_id: orderData.id,
      handler: async function (response: any) {
        console.log('Payment Success', response);

        // Save in Supabase
        const { error } = await supabase.from('subscriptions').insert([
          {
            email,
            plan,
            payment_id: response.razorpay_payment_id,
            order_id: response.razorpay_order_id,
            signature: response.razorpay_signature,
            payment_status: 'paid',
          },
        ]);

        if (error) {
          alert('Error saving to DB: ' + error.message);
        } else {
          alert('Subscribed Successfully!');
          setEmail('');
        }
      },
      prefill: {
        email,
      },
      theme: {
        color: "#10B981",
      },
    };

    const rzp = new (window as any).Razorpay(options);
    rzp.open();
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-white px-4 py-12 text-center">
      <h1 className="text-3xl font-bold text-gray-900 md:text-4xl">Subscribe to Our AI Tool</h1>
      <p className="mt-4 text-gray-700 text-lg max-w-xl mx-auto">
        Stay updated and get early access to new AI features.
      </p>

      <form onSubmit={handlePayment} className="mt-8 flex flex-col items-center space-y-4">
        <input
          type="email"
          value={email}
          required
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-md text-black"
        />

        {/* Plan Selection */}
        <select
          value={plan}
          onChange={(e) => setPlan(e.target.value)}
          className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-md text-black"
        >
          <option value="basic">Basic Plan - ₹1</option>
          <option value="premium">Premium Plan - ₹2</option>
        </select>

        <button
          type="submit"
          disabled={loading}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 px-6 rounded-md"
        >
          {loading ? 'Processing...' : 'Subscribe & Pay'}
        </button>
      </form>

      <Link href="/">
        <button className="mt-6 text-blue-600 hover:underline">Back to Home</button>
      </Link>
    </main>
  );
}
