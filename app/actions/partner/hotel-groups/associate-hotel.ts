"use server";

import {
  partnerMutate,
  parsePartnerError,
  requirePartnerToken,
} from "@/lib/api/partner/fetch";

export async function associateHotelToGroup(
  _userId: string,
  hotelId: string,
  groupId: string | null,
) {
  try {
    const token = await requirePartnerToken();
    if (!token) {
      return { success: false, error: "Session expirée." };
    }

    await partnerMutate(token, `/api/hotels/hotels/${hotelId}/`, "PATCH", {
      organization: groupId,
    });

    return { success: true };
  } catch (error) {
    console.error("Error associating hotel to group:", error);
    return { success: false, error: parsePartnerError(error) };
  }
}
