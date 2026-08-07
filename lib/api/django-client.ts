import { getApiBaseUrl } from "@/lib/api/config";

export class DjangoApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

export async function djangoFetchPublic<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const response = await fetch(`${getApiBaseUrl()}${path}`, {
    ...options,
    headers: {
      Accept: "application/json",
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...options.headers,
    },
    cache: "no-store",
  });

  const payload: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    const message =
      payload &&
      typeof payload === "object" &&
      ("detail" in payload || "error" in payload)
        ? String(
            (payload as { detail?: string; error?: string }).detail ??
              (payload as { error?: string }).error,
          )
        : `Erreur API (${response.status})`;
    throw new DjangoApiError(message, response.status);
  }

  return payload as T;
}

export async function djangoFetch<T>(
  path: string,
  token: string,
  options: RequestInit = {},
): Promise<T> {
  const response = await fetch(`${getApiBaseUrl()}${path}`, {
    ...options,
    headers: {
      Accept: "application/json",
      Authorization: `Token ${token}`,
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...options.headers,
    },
    cache: "no-store",
  });

  const payload: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    const message =
      payload &&
      typeof payload === "object" &&
      ("detail" in payload || "error" in payload)
        ? String(
            (payload as { detail?: string; error?: string }).detail ??
              (payload as { error?: string }).error,
          )
        : `Erreur API (${response.status})`;
    throw new DjangoApiError(message, response.status);
  }

  return payload as T;
}

export interface DjangoPaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface DjangoTimeSlotRecord {
  uuid: string;
  name: string;
  start_time: string;
  end_time: string;
  description: string | null;
}

export interface DjangoRoomTypeRecord {
  uuid: string;
  hotel: string;
  name: string;
  description: string | null;
  max_guests: number;
  base_price: string | number;
  currency: string;
  images: string[] | string;
}

export interface DjangoHotelRecord {
  uuid: string;
  name: string;
  slug: string;
  description: string | null;
  address: string;
  city: string;
  city_name?: string;
  country_name?: string;
  organization: string | null;
  latitude: number | null;
  longitude: number | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  stars: number;
  status: string;
  images: string[];
  min_price?: number | null;
}

export interface DjangoFavoriteRecord {
  uuid: string;
  profile: string;
  hotel: string;
}

export interface DjangoBookingRecord {
  uuid: string;
  profile: string;
  hotel: string;
  room_type: string;
  time_slot: string;
  date: string;
  guest_count: number;
  status: string;
  original_price?: string | number;
  final_price: string | number;
  currency: string;
  guest_name?: string;
  guest_email?: string;
  guest_phone?: string | null;
  special_requests?: string | null;
  create: string;
  last_update: string;
}

export interface DjangoReviewRecord {
  uuid: string;
  profile: string;
  hotel: string;
  booking: string;
  rating: number;
  title: string | null;
  comment: string | null;
  response: string | null;
  response_at: string | null;
  verified: boolean;
  helpful: number;
  create: string;
  last_update: string;
}

export interface DjangoComplaintRecord {
  uuid: string;
  profile: string;
  hotel: string;
  booking: string | null;
  guest_name: string;
  guest_email: string | null;
  guest_phone: string | null;
  title: string;
  description: string;
  status: string;
  priority: string;
  resolution: string | null;
  resolved_at: string | null;
  create: string;
  last_update: string;
}

export interface DjangoAvailabilityRecord {
  uuid: string;
  room_type: string;
  time_slot: string;
  date: string;
  available: boolean;
  price: string | number | null;
  max_guests: number | null;
}

export interface DjangoPricingRuleRecord {
  uuid: string;
  hotel: string | null;
  room_type: string | null;
  name: string;
  type: string;
  description: string | null;
  multiplier: string | number | null;
  fixed_amount: string | number | null;
  percentage: string | number | null;
  day_of_week: number[];
  start_date: string | null;
  end_date: string | null;
  min_days_advance: number | null;
  max_days_advance: number | null;
  priority: number;
  active: boolean;
}

export interface DjangoOrganizationRecord {
  uuid: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  commission_rate?: string | number | null;
  manager_name?: string | null;
  manager_email?: string | null;
}

export interface DjangoAdminProfileRecord {
  id: string;
  first_name: string | null;
  last_name: string | null;
  pseudo: string | null;
  email: string | null;
  phone: string | null;
  kind: string;
  is_staff: boolean;
  is_superuser: boolean;
  has_organization: boolean;
  create: string;
}
