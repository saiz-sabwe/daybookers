const LOCAL_API_BASE_URL = "http://127.0.0.1:8000";
const PRODUCTION_API_BASE_URL = "https://www.daybooker.online";

function normalizeBaseUrl(url: string): string {
  return url.replace(/\/+$/, "");
}

/**
 * Base URL for Django API calls (server-side Next.js → Django).
 * - Development: http://127.0.0.1:8000
 * - Production: https://www.daybooker.online
 * Override with API_BASE_URL in .env.local or deployment env.
 */
export function getApiBaseUrl(): string {
  const fromEnv = process.env.API_BASE_URL?.trim();
  if (fromEnv) {
    return normalizeBaseUrl(fromEnv);
  }

  const nextPublicUrl = process.env.NEXT_PUBLIC_API_URL?.trim();
  if (nextPublicUrl) {
    return normalizeBaseUrl(nextPublicUrl);
  }

  if (process.env.NODE_ENV === "production") {
    return PRODUCTION_API_BASE_URL;
  }

  return LOCAL_API_BASE_URL;
}
