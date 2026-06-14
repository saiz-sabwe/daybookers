"use server";

import { DjangoAvailabilityRecord } from "@/lib/api/django-client";
import {
  formatDateParam,
  fetchPartnerAll,
  requirePartnerToken,
} from "@/lib/api/partner/fetch";
import { mapPartnerAvailability } from "@/lib/api/partner/mappers";

export interface AvailabilityData {
  id: string;
  roomTypeId: string;
  timeSlotId: string;
  date: Date;
  available: boolean;
  price?: number;
  maxGuests?: number;
}

export async function getAvailabilities(
  hotelId: string,
  roomTypeId: string,
  startDate: Date,
  endDate: Date,
  _userId: string,
): Promise<AvailabilityData[]> {
  try {
    const token = await requirePartnerToken();
    if (!token) {
      return [];
    }

    const records = await fetchPartnerAll<DjangoAvailabilityRecord>(
      token,
      "/api/hotels/availabilities/",
      {
        hotel: hotelId,
        room_type: roomTypeId,
        date_from: formatDateParam(startDate),
        date_to: formatDateParam(endDate),
      },
    );

    return records.map(mapPartnerAvailability);
  } catch (error) {
    console.error("Error fetching availabilities:", error);
    return [];
  }
}

export async function getAvailabilityByDate(
  roomTypeId: string,
  timeSlotId: string,
  date: Date,
  _userId: string,
): Promise<AvailabilityData | null> {
  try {
    const token = await requirePartnerToken();
    if (!token) {
      return null;
    }

    const records = await fetchPartnerAll<DjangoAvailabilityRecord>(
      token,
      "/api/hotels/availabilities/",
      {
        room_type: roomTypeId,
        date: formatDateParam(date),
      },
    );

    const match = records.find((record) => record.time_slot === timeSlotId);
    return match ? mapPartnerAvailability(match) : null;
  } catch (error) {
    console.error("Error fetching availability by date:", error);
    return null;
  }
}
