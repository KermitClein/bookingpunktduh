import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";

export async function GET(_: NextRequest, { params }: { params: { resourceId: string } }) {
  const { resourceId } = params;
  const bookings = await prisma.booking.findMany({
    where: { resourceId, status: "confirmed" },
    orderBy: { startTs: "asc" }
  });
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//booking-mvp//EN"
  ];
  for (const b of bookings) {
    lines.push("BEGIN:VEVENT");
    lines.push("UID:" + b.id);
    lines.push("DTSTART:" + b.startTs.toISOString().replace(/[-:]/g,"").split(".")[0] + "Z");
    lines.push("DTEND:" + b.endTs.toISOString().replace(/[-:]/g,"").split(".")[0] + "Z");
    lines.push("SUMMARY:Buchung");
    lines.push("END:VEVENT");
  }
  lines.push("END:VCALENDAR");
  return new NextResponse(lines.join("\r\n"), {
    headers: { "Content-Type": "text/calendar; charset=utf-8" }
  });
}
