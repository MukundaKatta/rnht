// Guard a URL that comes from the database (admin-entered priest WhatsApp links,
// volunteer group links, etc.) before it is placed into an <a href>. Without
// this, an admin-set value like `javascript:alert(1)` would execute when a
// public visitor clicks the link (stored XSS). We allow only the schemes the
// app actually uses, plus site-relative URLs. Anything else (javascript:,
// data:, vbscript:, unknown schemes) is rejected -> the caller renders no link.
const ALLOWED_SCHEMES = ["http:", "https:", "tel:", "mailto:"];

export function safeHref(url?: string | null): string | undefined {
  if (!url) return undefined;
  const trimmed = url.trim();
  if (!trimmed) return undefined;
  // Site-relative / anchor / protocol-relative links are safe.
  if (/^(\/|#|\.\/|\.\.\/)/.test(trimmed)) return trimmed;
  if (trimmed.startsWith("//")) return `https:${trimmed}`;
  try {
    const scheme = new URL(trimmed).protocol.toLowerCase();
    return ALLOWED_SCHEMES.includes(scheme) ? trimmed : undefined;
  } catch {
    // No parseable scheme (e.g. "wa.me/123", "example.com/x") — treat as https.
    return `https://${trimmed}`;
  }
}

/**
 * Resolves a ?next= value against our own origin and keeps it ONLY when it
 * stays on this site. Pattern matching is not enough: "/\\evil.com" passes a
 * leading-slash test, but the URL parser (and Next's router) treat the
 * backslash as a slash and navigate to https://evil.com.
 */
export function safeNextPath(nextParam: string | null | undefined): string {
  // The URL parser trims surrounding whitespace, so "  " would resolve to the
  // site root; treat a blank value as no value at all.
  const raw = (nextParam ?? "").trim();
  if (!raw) return "/dashboard";
  const base =
    typeof window !== "undefined" ? window.location.origin : "https://rnht.org";
  try {
    const url = new URL(raw, base);
    if (url.origin !== new URL(base).origin) return "/dashboard";
    return `${url.pathname}${url.search}${url.hash}` || "/dashboard";
  } catch {
    return "/dashboard";
  }
}
