"use server";

import db from "@/lib/db";
import { getPartnerHotels } from "@/app/actions/partner/hotels/get";

export async function deletePricingRule(
  userId: string,
  ruleId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const rule = await db.pricingRule.findUnique({
      where: { id: ruleId },
      select: { hotelId: true },
    });

    if (!rule) {
      return {
        success: false,
        error: "Règle introuvable",
      };
    }

    if (rule.hotelId) {
      const partnerHotels = await getPartnerHotels(userId);
      const hasAccess = partnerHotels.some((hotel) => hotel.id === rule.hotelId);
      if (!hasAccess) {
        return {
          success: false,
          error: "Vous n'avez pas accès à cette règle",
        };
      }
    }

    await db.pricingRule.delete({
      where: { id: ruleId },
    });

    return { success: true };
  } catch (error) {
    console.error("Erreur lors de la suppression de la règle:", error);
    return {
      success: false,
      error: "Une erreur est survenue lors de la suppression de la règle",
    };
  }
}

