import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function ResourcesPage(){
  const resources = await prisma.resource.findMany({ include: { pricing: true } });
  return (
    <div className="container">
      <h1 className="text-2xl font-bold mb-4">Kalender & Ressourcen</h1>
      <div className="grid-layout">
        {resources.map(r => (
          <div key={r.id} className="card">
            <h3 className="font-semibold text-lg">{r.name} <span className="text-gray-500 text-sm">({r.type})</span></h3>
            <p className="text-gray-600 mt-1">Zeitzone: {r.timezone}</p>
            <div className="mt-4 flex gap-3">
              <Link href={`/resources/${r.id}/calendar`} className="btn">Kalender ansehen</Link>
              <Link href={`/book?type=${r.type}`} className="btn bg-white text-brand-600 border border-brand-500">Buchen</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
