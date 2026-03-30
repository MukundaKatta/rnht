import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Donate",
  description: "Support Rudra Narayana Hindu Temple with tax-deductible donations. Choose from General, Building, Priest, Annadanam, Festival, or Education funds.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
