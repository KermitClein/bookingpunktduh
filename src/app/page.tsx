import Link from "next/link";

export default function Home() {
  return (
    <div className="container">
      <h1>Willkommen 👋</h1>
      <p>Buche schnell & intuitiv:</p>
      <div className="grid">
        <div className="card">
          <h3>Auto buchen</h3>
          <p>Stundenweise, heute noch.</p>
          <Link href="/book?type=car">Los geht's →</Link>
        </div>
        <div className="card">
          <h3>Segelboot buchen</h3>
          <p>Ganze Tage (optional stundenweise).</p>
          <Link href="/book?type=boat">Leinen los →</Link>
        </div>
      </div>
    </div>
  );
}
