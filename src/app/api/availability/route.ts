import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";

function roundToHour(d: Date) {
  const x = new Date(d);
  x.setMinutes(0,0,0);
  return x;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const resourceId = searchParams.get("resourceId");
  const from = searchParams.get("from"); // ISO
  const to = searchParams.get("to");     // ISO

  if (!resourceId || !from || !to) {
    return NextResponse.json({ error: "Missing params" }, { status: 400 });
  }

  const resource = await prisma.resource.findUnique({
    where: { id: resourceId },
  });

  if (!resource) return NextResponse.json({ slots: [] });

  const rules = resource.rules as any;
  const unit: "hour" | "day" = rules.unit || "hour";
  const gran = rules.slot_granularity_minutes ?? (unit === "hour" ? 60 : 24*60);
  const bufferBefore = rules.buffer_before_minutes ?? 0;
  const bufferAfter  = rules.buffer_after_minutes ?? 0;
  const minDurMin = unit === "hour" ? (rules.min_duration_minutes ?? 60) : (rules.min_duration_days ?? 1) * 1440;

  const fromD = new Date(from);
  const toD = new Date(to);

  // Fetch existing confirmed bookings & blackouts
  const bookings = await prisma.booking.findMany({
    where: {
      resourceId,
      status: "confirmed",
      OR: [
        { startTs: { lt: toD }, endTs: { gt: fromD } }
      ]
    },
    select: { startTs: true, endTs: true },
  });
  const blackouts = await prisma.blackout.findMany({
    where: {
      resourceId,
      OR: [{ startTs: { lt: toD }, endTs: { gt: fromD } }]
    },
    select: { startTs: true, endTs: true },
  });

  const blocks = [...bookings, ...blackouts].map(b => ({
    start: new Date(new Date(b.startTs).getTime() - bufferBefore*60000),
    end: new Date(new Date(b.endTs).getTime() + bufferAfter*60000),
  }));

  // generate grid
  const slots: { start: string, end: string }[] = [];
  const cursor = roundToHour(fromD);
  while (cursor < toD) {
    const end = new Date(cursor.getTime() + gran*60000);
    const overlaps = blocks.some(b => b.start < end && b.end > cursor);
    if (!overlaps) {
      // only include if can fit minimum duration from here without hitting a block/toD
      const minEnd = new Date(cursor.getTime() + minDurMin*60000);
      const blockedAhead = blocks.some(b => b.start < minEnd && b.end > cursor);
      if (!blockedAhead && minEnd <= toD) {
        slots.push({ start: cursor.toISOString(), end: end.toISOString() });
      }
    }
    cursor.setMinutes(cursor.getMinutes() + gran);
  }

  return NextResponse.json({ unit, slots });
}
