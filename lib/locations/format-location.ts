const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function isUuid(value: string): boolean {
  return UUID_RE.test(value);
}

export function extractCityFromAddress(address: string): string {
  const parts = address
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);
  return parts[parts.length - 1] ?? "Kinshasa";
}

export function resolveCityName(
  cityField: string,
  cityName?: string | null,
  address?: string,
): string {
  if (cityName) {
    return cityName;
  }
  if (cityField && !isUuid(cityField)) {
    return cityField;
  }
  if (address) {
    return extractCityFromAddress(address);
  }
  return "Kinshasa";
}

export function resolveCountryName(countryName?: string | null): string {
  return countryName ?? "RDC";
}

export function formatLocationLabel(
  location: string | null | undefined,
  hotels?: Array<{ city: string; country?: string }>,
): string {
  if (!location) {
    return "Kinshasa, RDC";
  }

  if (!isUuid(location)) {
    return location;
  }

  const hotel = hotels?.[0];
  if (hotel?.city && !isUuid(hotel.city)) {
    return hotel.country ? `${hotel.city}, ${hotel.country}` : hotel.city;
  }

  return "Kinshasa, RDC";
}
