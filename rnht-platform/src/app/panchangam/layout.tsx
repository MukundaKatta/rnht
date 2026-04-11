import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Daily Panchangam",
  description:
    "Daily Hindu Panchangam localized to your city. Tithi, Nakshatra, Yoga, Karana, Rahu Kalam, and auspicious timings.",
};

export default function PanchangamLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
