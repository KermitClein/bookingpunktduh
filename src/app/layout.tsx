import "./globals.css";
import Link from "next/link";

export const metadata = {
  title: "Booking MVP",
  description: "Auto stundenweise, Segelboot tageweise buchen"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de">
      <body>
        <header style={{padding:"1rem", borderBottom:"1px solid #ddd"}}>
          <nav style={{display:"flex", gap:"1rem"}}>
            <Link href="/">Start</Link>
            <Link href="/book">Buchen</Link>
            <Link href="/dashboard">Mein Konto</Link>
          </nav>
        </header>
        <main style={{padding:"1rem"}}>{children}</main>
      </body>
    </html>
  );
}
