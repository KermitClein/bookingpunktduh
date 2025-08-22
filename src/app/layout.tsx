import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata = {
  title: "Booking MVP",
  description: "Auto stundenweise, Segelboot tageweise buchen",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de">
      <body className="bg-gray-50">
        <Navbar />
        <main className="min-h-screen py-6">{children}</main>
      </body>
    </html>
  );
}
