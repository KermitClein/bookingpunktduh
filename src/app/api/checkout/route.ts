import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", { apiVersion: "2024-06-20" });

export async function POST(req: NextRequest) {
  try {
    const { bookingId, priceId, quantity = 1 } = await req.json();
    if (!bookingId || !priceId) return NextResponse.json({ error: "Missing fields" }, { status: 400 });

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [{ price: priceId, quantity }],
      success_url: `${req.nextUrl.origin}/success?bookingId=${bookingId}`,
      cancel_url: `${req.nextUrl.origin}/cancel?bookingId=${bookingId}`,
      metadata: { bookingId }
    });

    return NextResponse.json({ url: session.url });
  } catch (e:any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
