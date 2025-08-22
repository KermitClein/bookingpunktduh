import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const resourceId = req.nextUrl.searchParams.get("resourceId") || undefined;
  const userOnly = req.nextUrl.searchParams.get("mine") === "1";

  const where: any = {};
  if (resourceId) where.resourceId = resourceId;
  if (userOnly) {
    // Demo-User fallback – dieselbe Logik wie in /api/book
    const email = "demo@example.com";
    const user = await prisma.user.findUnique({ where: { email } });
    where.userId = user?.id ?? "";
  }

  const bookings = await prisma.booking.findMany({
    where,
    orderBy: { startTs: "asc" },
    include: { user: true, resource: true },
  });
  return NextResponse.json(bookings);
}

