import Link from "next/link";

export default function Home() {
  return (
    <div className="container">
      <section className="grid md:grid-cols-2 gap-8 items-center">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight">Miete Auto & Segelboot – schnell & intuitiv</h1>
          <p className="text-gray-600 mt-3">Stundenweise Carsharing und tageweise Bootscharter. In wenigen Klicks buchen, zahlen und losfahren.</p>
          <div className="mt-6 flex gap-3">
            <Link href="/book?type=car" className="btn">Auto buchen</Link>
            <Link href="/book?type=boat" className="btn bg-white text-brand-600 border border-brand-500">Segelboot buchen</Link>
          </div>
        </div>
        <div className="rounded-2xl overflow-hidden shadow-lg">
          <img src="https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1200&auto=format&fit=crop" alt="Hero" />
        </div>
      </section>

      <section className="mt-12 grid md:grid-cols-3 gap-6">
        <div className="card"><h3 className="font-semibold text-lg">Echtzeit-Verfügbarkeit</h3><p className="text-gray-600 mt-1">Kalender prüft Überschneidungen automatisch.</p></div>
        <div className="card"><h3 className="font-semibold text-lg">Fair & flexibel</h3><p className="text-gray-600 mt-1">Storno-Regeln je Ressource – klar kommuniziert.</p></div>
        <div className="card"><h3 className="font-semibold text-lg">iCal & Rechnungen</h3><p className="text-gray-600 mt-1">Exportiere Buchungen in deinen Kalender.</p></div>
      </section>
    </div>
  );
}
