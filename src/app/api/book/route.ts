import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { calcTotalCents } from "@/lib/price";

export async function POST(req: NextRequest) {
  try {
    const { resourceId, startTs, endTs } = await req.json();
    if (!resourceId || !startTs || !endTs) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // Demo-User immer vorhanden machen
    const user = await prisma.user.upsert({
      where: { email: "demo@example.com" },
      update: {},
      create: { email: "demo@example.com", name: "Demo User" },
    });

    const resource = await prisma.resource.findUnique({
      where: { id: resourceId },
      include: { pricing: true },
    });
    if (!resource) return NextResponse.json({ error: "Resource not found" }, { status: 404 });

    const unit: "hour" | "day" = resource.rules?.unit || (resource.type === "car" ? "hour" : "day");
    const priceRow = resource.pricing.find(p => p.unit === unit);
    if (!priceRow) return NextResponse.json({ error: "Pricing not set" }, { status: 400 });

    const start = new Date(startTs);
    const end = new Date(endTs);
    const totalPrice = calcTotalCents({ unit, basePriceCents: priceRow.basePrice, start, end });

    const booking = await prisma.booking.create({
      data: {
        resourceId,
        userId: user.id,
        startTs: start,
        endTs: end,
        status: "pending",
        totalPrice,
        currency: "EUR",
      },
    });

    return NextResponse.json({ bookingId: booking.id, totalPrice, currency: "EUR", unit });
  } catch (e:any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
