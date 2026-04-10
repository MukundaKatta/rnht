import type { Metadata } from "next";
import { samplePanchangam } from "@/lib/sample-data";
import { PanchangamWidget } from "@/components/panchangam/PanchangamWidget";

export const metadata: Metadata = {
  title: "Daily Panchangam",
  description:
    "Daily Hindu Panchangam for Austin, TX. Tithi, Nakshatra, Yoga, Karana, Rahu Kalam, and auspicious timings.",
};

export default function PanchangamPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="text-center">
        <h1 className="section-heading">Daily Panchangam</h1>
        <p className="mt-3 text-gray-600">
          Your daily Hindu almanac with Tithi, Nakshatra, Yoga, Karana, and
          auspicious/inauspicious timings.
        </p>
      </div>

      <div className="mt-6 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
        <strong>Note:</strong> Sample data shown below. Live daily Panchangam integration with DrikPanchang API coming soon.
      </div>

      <div className="mt-8">
        <PanchangamWidget panchangam={{ ...samplePanchangam, date: new Date().toISOString().split("T")[0] }} />
      </div>

      {/* Quick Reference */}
      <div className="mt-12 grid gap-6 sm:grid-cols-2">
        <div className="card p-6">
          <h3 className="font-heading text-lg font-bold text-gray-900">
            What is Panchangam?
          </h3>
          <p className="mt-3 text-sm text-gray-600">
            Panchangam (Panchanga) is a Hindu calendar and almanac that tracks
            five key attributes of each day:{" "}
            <strong>Tithi</strong> (lunar day),{" "}
            <strong>Vaara</strong> (weekday),{" "}
            <strong>Nakshatra</strong> (lunar mansion),{" "}
            <strong>Yoga</strong> (luni-solar day), and{" "}
            <strong>Karana</strong> (half of Tithi). It is essential for
            determining auspicious times for rituals, ceremonies, and important
            activities.
          </p>
        </div>
        <div className="card p-6">
          <h3 className="font-heading text-lg font-bold text-gray-900">
            Understanding Timings
          </h3>
          <div className="mt-3 space-y-3 text-sm text-gray-600">
            <div className="flex items-start gap-2">
              <span className="mt-0.5 h-3 w-3 rounded-full bg-red-500 flex-shrink-0" />
              <p>
                <strong>Rahu Kalam:</strong> Inauspicious period ruled by Rahu.
                Avoid starting new activities.
              </p>
            </div>
            <div className="flex items-start gap-2">
              <span className="mt-0.5 h-3 w-3 rounded-full bg-orange-500 flex-shrink-0" />
              <p>
                <strong>Yama Gandam:</strong> Inauspicious period associated with
                Yama. Avoid important decisions.
              </p>
            </div>
            <div className="flex items-start gap-2">
              <span className="mt-0.5 h-3 w-3 rounded-full bg-green-500 flex-shrink-0" />
              <p>
                <strong>Abhijit Muhurtham:</strong> The most auspicious time of
                the day, ideal for beginning new ventures.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
