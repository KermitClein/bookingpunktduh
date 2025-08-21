import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/src/lib/prisma";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const sig = req.headers.get("stripe-signature") as string;
  const secret = process.env.STRIPE_WEBHOOK_SECRET as string;
  const body = await req.text();
  let event: Stripe.Event;
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", { apiVersion: "2024-06-20" });
    event = stripe.webhooks.constructEvent(body, sig, secret);
  } catch (err: any) {
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const bookingId = session.metadata?.bookingId;
    if (bookingId) {
      await prisma.booking.update({
        where: { id: bookingId },
        data: { status: "confirmed", paymentId: session.id }
      });
    }
  }

  return NextResponse.json({ received: true });
}
