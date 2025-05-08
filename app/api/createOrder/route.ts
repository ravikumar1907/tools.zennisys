import Razorpay from 'razorpay';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const body = await req.json();

  const instance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_KEY_SECRET!,
  });

  const options = {
    amount: body.amount,
    currency: "INR",
    receipt: "receipt#1",
  };

  try {
    const order = await instance.orders.create(options);
    return NextResponse.json(order);
  } catch (err) {
    return NextResponse.json({ error: err }, { status: 500 });
  }
}
