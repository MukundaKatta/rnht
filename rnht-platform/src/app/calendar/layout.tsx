import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Temple Calendar",
  description: "View upcoming festivals, poojas, community events, and classes at Rudra Narayana Hindu Temple.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
