"use server";

import { DjangoAvailabilityRecord } from "@/lib/api/django-client";
import {
  partnerMutate,
  parsePartnerError,
  requirePartnerToken,
} from "@/lib/api/partner/fetch";
import { mapPartnerAvailability } from "@/lib/api/partner/mappers";

export interface UpdateAvailabilityData {
  available?: boolean;
  price?: number;
  maxGuests?: number;
}

export async function updateAvailability(
  _userId: string,
  availabilityId: string,
  data: UpdateAvailabilityData,
): Promise<{ success: boolean; error?: string; availability?: ReturnType<typeof mapPartnerAvailability> }> {
  try {
    const token = await requirePartnerToken();
    if (!token) {
      return { success: false, error: "Session expirée." };
    }

    const record = await partnerMutate<DjangoAvailabilityRecord>(
      token,
      `/api/hotels/availabilities/${availabilityId}/`,
      "PATCH",
      {
        ...(data.available !== undefined ? { available: data.available } : {}),
        ...(data.price !== undefined ? { price: data.price } : {}),
        ...(data.maxGuests !== undefined ? { max_guests: data.maxGuests } : {}),
      },
    );

    return {
      success: true,
      availability: mapPartnerAvailability(record),
    };
  } catch (error) {
    console.error("Error updating availability:", error);
    return { success: false, error: parsePartnerError(error) };
  }
}
