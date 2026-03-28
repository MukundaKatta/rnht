import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pooja & Spiritual Services",
  description: "Book authentic Vedic poojas, homams, weddings, and spiritual services. Serving Austin, Kyle, Georgetown, Round Rock, and the greater Texas area.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
