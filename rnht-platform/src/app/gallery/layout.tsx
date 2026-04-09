import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gallery",
  description: "Photos from temple ceremonies, festivals, community events, and darshan at Rudra Narayana Hindu Temple.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
