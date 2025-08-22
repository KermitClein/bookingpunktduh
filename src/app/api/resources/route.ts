import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const resources = await prisma.resource.findMany({
    include: { pricing: true }
  });
  return NextResponse.json(resources);
}
