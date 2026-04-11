"use client";

import { useMemo } from "react";
import { MapPin, Navigation } from "lucide-react";
import { PanchangamWidget } from "@/components/panchangam/PanchangamWidget";
import { computePanchangam } from "@/lib/panchangam";
import { usePanchangamStore, PRESET_LOCATIONS } from "@/store/panchangam";

export default function PanchangamPage() {
  const location = usePanchangamStore((s) => s.location);
  const setLocation = usePanchangamStore((s) => s.setLocation);
  const detectCurrentLocation = usePanchangamStore((s) => s.detectCurrentLocation);

  const computed = useMemo(() => computePanchangam(location), [location]);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="text-center">
        <h1 className="section-heading">Daily Panchangam</h1>
        <p className="mt-3 text-gray-600">
          Your daily Hindu almanac with Tithi, Nakshatra, Yoga, Karana, and
          auspicious/inauspicious timings, localized to your chosen location.
        </p>
      </div>

      {/* Location picker */}
      <div className="mt-6 rounded-2xl border border-temple-gold/25 bg-temple-cream/50 p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-temple-maroon">
            <MapPin className="h-5 w-5 text-temple-gold" />
            <span className="font-semibold">
              Showing Panchangam for <span className="underline">{location.label}</span>
            </span>
          </div>
          <button
            onClick={() => detectCurrentLocation()}
            className="inline-flex items-center gap-2 rounded-lg bg-temple-maroon px-3 py-1.5 text-xs font-semibold text-white hover:bg-temple-maroon/90"
          >
            <Navigation className="h-3.5 w-3.5" />
            Use current location
          </button>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {PRESET_LOCATIONS.map((preset) => {
            const active = preset.label === location.label;
            return (
              <button
                key={preset.label}
                onClick={() => setLocation(preset)}
                className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
                  active
                    ? "bg-temple-red text-white"
                    : "bg-white text-temple-maroon hover:bg-temple-gold/10 border border-temple-gold/30"
                }`}
              >
                {preset.label}
              </button>
            );
          })}
        </div>
        <p className="mt-3 text-xs text-gray-500">
          Timings are shown in your selected location&apos;s timezone.
        </p>
      </div>

      <div className="mt-8">
        <PanchangamWidget panchangam={computed} />
      </div>

      {/* Quick Reference */}
      <div className="mt-12 grid gap-6 sm:grid-cols-2">
        <div className="card p-6">
          <h3 className="font-heading text-lg font-bold text-gray-900">
            What is Panchangam?
          </h3>
          <p className="mt-3 text-sm text-gray-600">
            Panchangam (Panchanga) is a Hindu calendar and almanac that tracks
            five key attributes of each day: <strong>Tithi</strong> (lunar day),{" "}
            <strong>Vaara</strong> (weekday), <strong>Nakshatra</strong> (lunar
            mansion), <strong>Yoga</strong> (luni-solar day), and{" "}
            <strong>Karana</strong> (half of Tithi). It is essential for
            determining auspicious times for rituals, ceremonies, and
            important activities.
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
                <strong>Yama Gandam:</strong> Inauspicious period associated
                with Yama. Avoid important decisions.
              </p>
            </div>
            <div className="flex items-start gap-2">
              <span className="mt-0.5 h-3 w-3 rounded-full bg-yellow-600 flex-shrink-0" />
              <p>
                <strong>Gulika Kalam:</strong> Another inauspicious interval
                best reserved for routine tasks.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
