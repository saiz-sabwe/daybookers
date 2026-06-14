"use server";

import { djangoFetch, DjangoHotelRecord } from "@/lib/api/django-client";
import {
  ApiOrganization,
  mapApiUserProfile,
  StoredUserProfile,
} from "@/lib/api/user-profile";
import {
  fetchPartnerAll,
  requirePartnerToken,
} from "@/lib/api/partner/fetch";

export async function getPartnerProfile(): Promise<StoredUserProfile | null> {
  const token = await requirePartnerToken();
  if (!token) {
    return null;
  }

  try {
    const data = await djangoFetch<Record<string, unknown>>(
      "/api/accounts/auth/me/",
      token,
    );
    return mapApiUserProfile(data);
  } catch {
    return null;
  }
}

export async function getPartnerOrganizations(): Promise<ApiOrganization[]> {
  const profile = await getPartnerProfile();
  return profile?.organizations ?? [];
}

export async function getPrimaryOrganizationId(): Promise<string | null> {
  const organizations = await getPartnerOrganizations();
  return organizations[0]?.uuid ?? null;
}

export async function resolveCityUuid(
  token: string,
  cityName: string,
): Promise<string | null> {
  const hotels = await fetchPartnerAll<DjangoHotelRecord>(
    token,
    "/api/hotels/hotels/",
    { city: cityName },
  );

  return hotels[0]?.city ?? null;
}
