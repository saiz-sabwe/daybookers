"use server";

import { DjangoAvailabilityRecord } from "@/lib/api/django-client";
import {
  formatDateParam,
  partnerMutate,
  parsePartnerError,
  requirePartnerToken,
} from "@/lib/api/partner/fetch";
import { mapPartnerAvailability } from "@/lib/api/partner/mappers";

export interface CreateAvailabilityData {
  roomTypeId: string;
  timeSlotId: string;
  date: Date;
  available?: boolean;
  price?: number;
  maxGuests?: number;
}

export async function createAvailability(
  _userId: string,
  data: CreateAvailabilityData,
): Promise<{ success: boolean; error?: string; availability?: ReturnType<typeof mapPartnerAvailability> }> {
  try {
    const token = await requirePartnerToken();
    if (!token) {
      return { success: false, error: "Session expirée." };
    }

    const record = await partnerMutate<DjangoAvailabilityRecord>(
      token,
      "/api/hotels/availabilities/",
      "POST",
      {
        room_type: data.roomTypeId,
        time_slot: data.timeSlotId,
        date: formatDateParam(data.date),
        available: data.available ?? true,
        price: data.price ?? null,
        max_guests: data.maxGuests ?? null,
      },
    );

    return {
      success: true,
      availability: mapPartnerAvailability(record),
    };
  } catch (error) {
    console.error("Error creating availability:", error);
    return { success: false, error: parsePartnerError(error) };
  }
}
