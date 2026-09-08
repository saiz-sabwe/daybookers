import { getApiBaseUrl } from "@/lib/api/config";

export const DEFAULT_HOTEL_IMAGE =
  "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop";

const ALLOWED_IMAGE_HOSTNAMES = new Set(["images.unsplash.com"]);

function getApiHostname(): string | null {
  try {
    return new URL(getApiBaseUrl()).hostname;
  } catch {
    return null;
  }
}

export function resolveHotelImage(src?: string | null): string {
  if (!src?.trim()) {
    return DEFAULT_HOTEL_IMAGE;
  }

  const value = src.trim();

  // Photos uploadées sur le serveur DayBooker (chemin relatif /media/...)
  if (value.startsWith("/media/")) {
    return `${getApiBaseUrl()}${value}`;
  }

  try {
    const { hostname } = new URL(value);
    const apiHostname = getApiHostname();
    if (
      ALLOWED_IMAGE_HOSTNAMES.has(hostname) ||
      (apiHostname !== null && hostname === apiHostname)
    ) {
      return value;
    }
  } catch {
    // URL invalide
  }

  return DEFAULT_HOTEL_IMAGE;
}

export function resolveHotelImages(images?: string[] | null): string[] {
  if (!images?.length) {
    return [DEFAULT_HOTEL_IMAGE];
  }

  return images.map(resolveHotelImage);
}
