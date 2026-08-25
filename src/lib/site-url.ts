const LOCAL_FALLBACK = "http://localhost:3000";

function looksLikeEmail(value: string): boolean {
  return /^[^\s/:]+@[^\s/]+$/.test(value);
}

export function toAbsoluteHttpUrl(value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed || looksLikeEmail(trimmed)) {
    return null;
  }

  const withProtocol = /^https?:\/\//i.test(trimmed)
    ? trimmed
    : `https://${trimmed}`;

  try {
    const parsed = new URL(withProtocol);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      return null;
    }
    if (!parsed.hostname) {
      return null;
    }
    // Origin only. AUTH_URL must not include /api/auth/callback/github.
    return parsed.origin;
  } catch {
    return null;
  }
}

function warnInvalidSiteUrl(source: string, value: string) {
  console.warn(
    `[site-url] Ignoring invalid ${source}="${value}". Expected an http(s) origin such as https://your-domain.com, not an email.`,
  );
}

export function getCanonicalSiteUrl(): string {
  const candidates: Array<[string, string | undefined]> = [
    ["NEXT_PUBLIC_APP_URL", process.env.NEXT_PUBLIC_APP_URL],
    ["APP_URL", process.env.APP_URL],
    ["AUTH_URL", process.env.AUTH_URL],
    ["NEXTAUTH_URL", process.env.NEXTAUTH_URL],
    ["VERCEL_PROJECT_PRODUCTION_URL", process.env.VERCEL_PROJECT_PRODUCTION_URL],
    ["VERCEL_URL", process.env.VERCEL_URL],
  ];

  for (const [source, raw] of candidates) {
    if (!raw?.trim()) continue;
    const resolved = toAbsoluteHttpUrl(raw);
    if (resolved) return resolved;
    warnInvalidSiteUrl(source, raw.trim());
  }

  return LOCAL_FALLBACK;
}

export function getPublicSiteUrl(): string {
  return getCanonicalSiteUrl();
}
