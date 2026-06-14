"use server";

import {
  partnerMutate,
  parsePartnerError,
  requirePartnerToken,
} from "@/lib/api/partner/fetch";

export interface UpdateRoomTypeData {
  id: string;
  name?: string;
  description?: string;
  basePrice?: number;
  currency?: string;
  maxGuests?: number;
  images?: string[];
  amenities?: string[];
  roomCount?: number;
  timeSlotIds?: string[];
}

export async function updateRoomType(_userId: string, data: UpdateRoomTypeData) {
  try {
    const token = await requirePartnerToken();
    if (!token) {
      return { success: false, error: "Session expirée." };
    }

    await partnerMutate(token, `/api/hotels/rooms/${data.id}/`, "PATCH", {
      ...(data.name ? { name: data.name } : {}),
      ...(data.description !== undefined
        ? { description: data.description }
        : {}),
      ...(data.basePrice !== undefined ? { base_price: data.basePrice } : {}),
      ...(data.currency ? { currency: data.currency } : {}),
      ...(data.maxGuests !== undefined ? { max_guests: data.maxGuests } : {}),
      ...(data.images ? { images: data.images } : {}),
    });

    return { success: true };
  } catch (error) {
    console.error("Error updating room type:", error);
    return { success: false, error: parsePartnerError(error) };
  }
}
