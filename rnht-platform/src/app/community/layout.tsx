import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Community Hub",
  description: "Volunteer, participate in Annadanam, and stay connected with Rudra Narayana Hindu Temple community events and announcements.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
