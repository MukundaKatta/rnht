import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import "./globals.css";

export const metadata: Metadata = {
  title: "Rudra Narayana Hindu Temple - Las Vegas",
  description:
    "RNHT - Your spiritual home in Las Vegas. Book poojas, view daily panchangam, temple events, and make donations online.",
  keywords: [
    "Hindu Temple",
    "Las Vegas",
    "Pooja",
    "Panchangam",
    "RNHT",
    "Rudra Narayana",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col font-body">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
