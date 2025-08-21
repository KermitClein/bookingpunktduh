import { prisma } from "@/src/lib/prisma";

export const dynamic = "force-dynamic";

export default async function Dashboard() {
  const bookings = await prisma.booking.findMany({
    take: 20,
    orderBy: { createdAt: "desc" },
    include: { resource: true }
  });
  return (
    <div className="container">
      <h1>Mein Konto</h1>
      <div className="card">
        <h3>Letzte Buchungen</h3>
        <ul>
          {bookings.map(b => (
            <li key={b.id}>
              {b.resource.name}: {new Date(b.startTs).toLocaleString()} → {new Date(b.endTs).toLocaleString()} — {b.status}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
