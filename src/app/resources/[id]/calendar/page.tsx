import { prisma } from "@/lib/prisma";
import MonthCalendar from "@/components/MonthCalendar";

export const dynamic = "force-dynamic";

function dateOnly(d: Date) {
  const x = new Date(d); x.setHours(0,0,0,0); return x;
}
function eachDay(start: Date, end: Date) {
  const s = dateOnly(start), e = dateOnly(end);
  const out: Date[] = [];
  for (let d = new Date(s); d <= e; d.setDate(d.getDate()+1)) out.push(new Date(d));
  return out;
}

export default async function ResourceCalendar({ params }: { params: { id: string } }) {
  const resource = await prisma.resource.findUnique({ where: { id: params.id } });
  if (!resource) return <div className="container">Ressource nicht gefunden.</div>;

  const bookings = await prisma.booking.findMany({
    where: { resourceId: resource.id, status: "confirmed" },
    include: { user: true },
    orderBy: { startTs: "asc" },
  });

  const bookedDays = bookings.flatMap(b => eachDay(b.startTs, b.endTs));

  return (
    <div className="container">
      <h1 className="text-2xl font-bold mb-4">
        Kalender: {resource.name} <span className="text-gray-500 text-base">({resource.type})</span>
      </h1>

      <div className="grid-layout">
        <div className="card">
          <MonthCalendar bookedDays={bookedDays} />
          <p className="label mt-2">Rot markierte Tage sind belegt (confirmed).</p>
        </div>

        <div className="card">
          <h3 className="font-semibold text-lg">Details</h3>
          <ul className="mt-2 space-y-2">
            {bookings.length === 0 && <li className="text-gray-600">Keine bestätigten Buchungen.</li>}
            {bookings.map(b => (
              <li key={b.id} className="border rounded-lg p-3">
                <div className="font-medium">
                  {new Date(b.startTs).toLocaleString()} → {new Date(b.endTs).toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">von {b.user?.email || "—"}</div>
              </li>
            ))}
          </ul>
          <a href={`/book?type=${resource.type}`} className="btn mt-4 inline-block">Neue Buchung</a>
        </div>
      </div>
    </div>
  );
}
