"use server";

import db from "@/lib/db";
import { getPartnerHotels } from "@/app/actions/partner/hotels/get";

export interface UpdatePricingRuleData {
  name?: string;
  description?: string;
  multiplier?: number;
  fixedAmount?: number;
  percentage?: number;
  dayOfWeek?: number[];
  startDate?: Date | null;
  endDate?: Date | null;
  minDaysAdvance?: number;
  maxDaysAdvance?: number;
  priority?: number;
  active?: boolean;
}

export async function updatePricingRule(
  userId: string,
  ruleId: string,
  data: UpdatePricingRuleData
): Promise<{ success: boolean; error?: string; rule?: any }> {
  try {
    // Récupérer la règle pour vérifier l'accès
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

    // Vérifier l'accès si hotelId existe
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

    // Préparer les données de mise à jour
    const updateData: any = {};
    if (data.name !== undefined) updateData.name = data.name.trim();
    if (data.description !== undefined)
      updateData.description = data.description?.trim() || null;
    if (data.multiplier !== undefined) updateData.multiplier = data.multiplier;
    if (data.fixedAmount !== undefined) updateData.fixedAmount = data.fixedAmount;
    if (data.percentage !== undefined) updateData.percentage = data.percentage;
    if (data.dayOfWeek !== undefined) updateData.dayOfWeek = data.dayOfWeek;
    if (data.startDate !== undefined) {
      updateData.startDate = data.startDate
        ? (() => {
            const d = new Date(data.startDate!);
            d.setHours(0, 0, 0, 0);
            return d;
          })()
        : null;
    }
    if (data.endDate !== undefined) {
      updateData.endDate = data.endDate
        ? (() => {
            const d = new Date(data.endDate!);
            d.setHours(0, 0, 0, 0);
            return d;
          })()
        : null;
    }
    if (data.minDaysAdvance !== undefined) updateData.minDaysAdvance = data.minDaysAdvance;
    if (data.maxDaysAdvance !== undefined) updateData.maxDaysAdvance = data.maxDaysAdvance;
    if (data.priority !== undefined) updateData.priority = data.priority;
    if (data.active !== undefined) updateData.active = data.active;

    const updatedRule = await db.pricingRule.update({
      where: { id: ruleId },
      data: updateData,
    });

    return { success: true, rule: updatedRule };
  } catch (error) {
    console.error("Erreur lors de la mise à jour de la règle:", error);
    return {
      success: false,
      error: "Une erreur est survenue lors de la mise à jour de la règle",
    };
  }
}

