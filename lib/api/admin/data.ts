"use server";

import {
  DjangoAdminProfileRecord,
  DjangoBookingRecord,
  DjangoHotelRecord,
  DjangoOrganizationRecord,
} from "@/lib/api/django-client";
import { fetchPartnerAll } from "@/lib/api/partner/fetch";

export async function loadAllHotels(token: string): Promise<DjangoHotelRecord[]> {
  return fetchPartnerAll<DjangoHotelRecord>(token, "/api/hotels/hotels/", {});
}

export async function loadAllBookings(token: string): Promise<DjangoBookingRecord[]> {
  return fetchPartnerAll<DjangoBookingRecord>(token, "/api/hotels/bookings/", {
    admin_scope: true,
  });
}

export async function loadAllOrganizations(
  token: string,
): Promise<DjangoOrganizationRecord[]> {
  return fetchPartnerAll<DjangoOrganizationRecord>(
    token,
    "/api/accounts/organizations/",
    { admin_scope: true },
  );
}

export async function loadAllProfiles(
  token: string,
): Promise<DjangoAdminProfileRecord[]> {
  return fetchPartnerAll<DjangoAdminProfileRecord>(
    token,
    "/api/accounts/profiles/",
    { admin_scope: true },
  );
}
