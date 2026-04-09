import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Financial Transparency",
  description: "View annual financial statements, building fund progress, and donor recognition for Rudra Narayana Hindu Temple. 501(c)(3) nonprofit.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
