import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Education & Classes",
  description: "Vedic chanting, Sanskrit, Telugu, yoga, and children's programs at Rudra Narayana Hindu Temple.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
