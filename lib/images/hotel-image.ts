export const DEFAULT_HOTEL_IMAGE =
  "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop";

const ALLOWED_IMAGE_HOSTNAMES = new Set(["images.unsplash.com"]);

export function resolveHotelImage(src?: string | null): string {
  if (!src?.trim()) {
    return DEFAULT_HOTEL_IMAGE;
  }

  try {
    const { hostname } = new URL(src);
    if (ALLOWED_IMAGE_HOSTNAMES.has(hostname)) {
      return src;
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
