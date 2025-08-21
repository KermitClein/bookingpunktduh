import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { resourceId, userId, startTs, endTs, priceCents } = body || {};
  if (!resourceId || !userId || !startTs || !endTs || !priceCents) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }
  const booking = await prisma.booking.create({
    data: {
      resourceId,
      userId,
      startTs: new Date(startTs),
      endTs: new Date(endTs),
      status: "pending",
      totalPrice: priceCents,
      currency: "EUR"
    }
  });
  // Stripe session (placeholder)
  return NextResponse.json({ bookingId: booking.id });
}
