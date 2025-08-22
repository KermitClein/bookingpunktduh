"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NavLink = ({ href, children }:{ href:string; children:React.ReactNode }) => {
  const p = usePathname();
  const active = p === href;
  return (
    <Link className={active? "text-brand-600 font-semibold" : "text-gray-700 hover:text-brand-600"} href={href}>
      {children}
    </Link>
  );
};

export default function Navbar(){
  return (
    <header className="border-b sticky top-0 bg-white/70 backdrop-blur z-20">
      <div className="container flex items-center justify-between py-3">
        <Link href="/" className="text-xl font-bold text-brand-600">bookingpunkt</Link>
        <nav className="flex gap-5">
          <NavLink href="/">Start</NavLink>
          <NavLink href="/book">Buchen</NavLink>
          <NavLink href="/resources">Kalender</NavLink>
          <NavLink href="/dashboard">Mein Konto</NavLink>
        </nav>
      </div>
    </header>
  );
}
