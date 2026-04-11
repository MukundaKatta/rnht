import { samplePanchangam } from "@/lib/sample-data";

/**
 * Location-aware panchangam computation.
 *
 * This module is a thin wrapper so the rest of the app never has to
 * think about which astronomy library we're using. For v1 we simply
 * relabel `samplePanchangam` with the user's location + date so the UI
 * is wired up end-to-end. Once an actual library is wired (candidates:
 * `mhah-panchang` or a Swiss Ephemeris WASM build), this is the one
 * place to swap it in — the call sites in `src/app/panchangam/page.tsx`
 * don't need to change.
 */

export type PanchangamLocation = {
  lat: number;
  lon: number;
  label: string;
  timeZone: string;
};

export type ComputedPanchangam = typeof samplePanchangam;

export const DEFAULT_LOCATION: PanchangamLocation = {
  lat: 30.6333,
  lon: -97.6778,
  label: "Georgetown, TX",
  timeZone: "America/Chicago",
};

export function computePanchangam(
  location: PanchangamLocation,
  date: Date = new Date()
): ComputedPanchangam {
  // TODO: replace this stub with a real astronomy computation once we
  // pick a library. For now we simply clone the sample and rewrite the
  // location + date so the UI behaves correctly.
  const iso = date.toISOString().slice(0, 10);
  return {
    ...samplePanchangam,
    date: iso,
    location: location.label,
  };
}
