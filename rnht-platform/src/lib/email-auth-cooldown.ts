const EMAIL_AUTH_COOLDOWN_KEY = "rnht_email_auth_cooldown_until";

// Every access is guarded: Safari private mode and "block all cookies" make
// localStorage THROW on read and write, and an unguarded call here took the
// whole sign-in page down with "Something went wrong".
export function readEmailAuthCooldownUntil(): number {
  if (typeof window === "undefined") return 0;
  try {
    const raw = window.localStorage.getItem(EMAIL_AUTH_COOLDOWN_KEY);
    const value = raw ? Number(raw) : 0;
    return Number.isFinite(value) ? value : 0;
  } catch {
    return 0;
  }
}

export function writeEmailAuthCooldownUntil(until: number) {
  if (typeof window === "undefined") return;
  try {
    if (until > Date.now()) {
      window.localStorage.setItem(EMAIL_AUTH_COOLDOWN_KEY, String(until));
    } else {
      window.localStorage.removeItem(EMAIL_AUTH_COOLDOWN_KEY);
    }
  } catch {
    // Storage blocked: the cooldown simply does not persist across reloads.
  }
}

export function getEmailAuthCooldownSeconds(until: number, now = Date.now()) {
  return Math.max(0, Math.ceil((until - now) / 1000));
}
