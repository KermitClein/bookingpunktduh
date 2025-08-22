import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import Link from "next/link";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";

async function getUserEmail() {
  try { const s = await auth?.(); return s?.user?.email ?? "demo@example.com"; }
  catch { return "demo@example.com"; }
}

async function cancelBooking(id: string) {
  "use server";
  await prisma.booking.update({ where: { id }, data: { status: "cancelled" } });
  revalidatePath("/dashboard");
}

export default async function Dashboard() {
  const email = await getUserEmail();
  const user = await prisma.user.findUnique({ where: { email } });
  const bookings = await prisma.booking.findMany({
    where: { userId: user?.id },
    include: { resource: true },
    orderBy: { startTs: "desc" },
  });

  return (
    <div className="container">
      <h1 className="text-2xl font-bold">Meine Buchungen</h1>
      <p className="label mt-1">eingeloggt als <b>{email}</b></p>

      <div className="grid-layout mt-4">
        <div className="card">
          <h3 className="font-semibold text-lg mb-2">Übersicht</h3>
          {bookings.length === 0 && <div className="text-gray-600">Noch keine Buchungen.</div>}
          <ul className="space-y-3">
            {bookings.map(b => (
              <li key={b.id} className="border rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{b.resource?.name} <span className="text-gray-500 text-sm">({b.resource?.type})</span></div>
                    <div className="text-sm text-gray-600">
                      {new Date(b.startTs).toLocaleString()} → {new Date(b.endTs).toLocaleString()} • Status: <b>{b.status}</b>
                    </div>
                  </div>
                  {b.status === "pending" || b.status === "confirmed" ? (
                    <form action={cancelBooking.bind(null, b.id)}>
                      <button className="btn bg-white text-red-600 border border-red-400 hover:bg-red-50" type="submit">Stornieren</button>
                    </form>
                  ) : null}
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-4">
            <Link href="/book" className="btn">Neue Buchung</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
