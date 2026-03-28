import { Capacitor } from "@capacitor/core";
import { Browser } from "@capacitor/browser";
import { App } from "@capacitor/app";

/**
 * Open a URL in the system browser (on native) or new tab (on web).
 * Use this for ALL external links: WhatsApp, social media, Google Calendar, etc.
 */
export async function openExternal(url: string) {
  if (Capacitor.isNativePlatform()) {
    await Browser.open({ url });
  } else {
    window.open(url, "_blank", "noopener,noreferrer");
  }
}

/**
 * Check if running inside a native Capacitor app.
 */
export function isNative(): boolean {
  return Capacitor.isNativePlatform();
}

/**
 * Initialize Android back button handler.
 * Call this once in the root layout.
 */
export function initBackButton(onBack: () => void) {
  if (!Capacitor.isNativePlatform()) return;

  App.addListener("backButton", ({ canGoBack }) => {
    if (canGoBack) {
      onBack();
    } else {
      App.exitApp();
    }
  });
}
