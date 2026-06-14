"use server";

import { loadAllHotels } from "@/lib/api/admin/data";
import {
  partnerMutate,
  parsePartnerError,
  requirePartnerToken,
} from "@/lib/api/partner/fetch";

export async function updatePartnerCommission(
  _adminUserId: string,
  hotelId: string,
  commissionRate: number,
): Promise<{ success: boolean; error?: string }> {
  try {
    const token = await requirePartnerToken();
    if (!token) {
      return { success: false, error: "Session expirée." };
    }

    const hotels = await loadAllHotels(token);
    const hotel = hotels.find((item) => item.uuid === hotelId);
    if (!hotel?.organization) {
      return {
        success: false,
        error: "Cet hôtel n'est rattaché à aucune organisation.",
      };
    }

    await partnerMutate(
      token,
      `/api/accounts/organizations/${hotel.organization}/`,
      "PATCH",
      { commission_rate: commissionRate },
    );

    return { success: true };
  } catch (error) {
    console.error("Error updating partner commission:", error);
    return { success: false, error: parsePartnerError(error) };
  }
}
