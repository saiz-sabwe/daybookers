"use server";

import {
  partnerMutate,
  parsePartnerError,
  requirePartnerToken,
} from "@/lib/api/partner/fetch";

export interface UpdateHotelData {
  name?: string;
  description?: string;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  stars?: number;
}

export async function updateHotel(
  hotelId: string,
  data: UpdateHotelData,
  _userId: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    const token = await requirePartnerToken();
    if (!token) {
      return { success: false, error: "Session expirée." };
    }

    await partnerMutate(token, `/api/hotels/hotels/${hotelId}/`, "PATCH", {
      ...(data.name ? { name: data.name } : {}),
      ...(data.description !== undefined
        ? { description: data.description }
        : {}),
      ...(data.address ? { address: data.address } : {}),
      ...(data.phone !== undefined ? { phone: data.phone } : {}),
      ...(data.email !== undefined ? { email: data.email } : {}),
      ...(data.website !== undefined ? { website: data.website } : {}),
      ...(data.stars !== undefined ? { stars: data.stars } : {}),
    });

    return { success: true };
  } catch (error) {
    console.error("Error updating hotel:", error);
    return { success: false, error: parsePartnerError(error) };
  }
}
