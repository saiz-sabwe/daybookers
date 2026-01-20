"use server";

import db from "@/lib/db";
import { getPartnerHotels } from "@/app/actions/partner/hotels/get";

export interface CreatePricingRuleData {
  hotelId?: string | null;
  roomTypeId?: string | null;
  name: string;
  type: string;
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

export async function createPricingRule(
  userId: string,
  data: CreatePricingRuleData
): Promise<{ success: boolean; error?: string; rule?: any }> {
  try {
    // Vérifier l'accès si hotelId est fourni
    if (data.hotelId) {
      const partnerHotels = await getPartnerHotels(userId);
      const hasAccess = partnerHotels.some((hotel) => hotel.id === data.hotelId);
      if (!hasAccess) {
        return {
          success: false,
          error: "Vous n'avez pas accès à cet hôtel",
        };
      }
    }

    // Validation
    if (!data.name || data.name.trim().length === 0) {
      return {
        success: false,
        error: "Le nom de la règle est requis",
      };
    }

    // Normaliser les dates
    const normalizedStartDate = data.startDate
      ? (() => {
          const d = new Date(data.startDate);
          d.setHours(0, 0, 0, 0);
          return d;
        })()
      : null;
    const normalizedEndDate = data.endDate
      ? (() => {
          const d = new Date(data.endDate);
          d.setHours(0, 0, 0, 0);
          return d;
        })()
      : null;

    const rule = await db.pricingRule.create({
      data: {
        hotelId: data.hotelId || null,
        roomTypeId: data.roomTypeId || null,
        name: data.name.trim(),
        type: data.type as any,
        description: data.description?.trim() || null,
        multiplier: data.multiplier,
        fixedAmount: data.fixedAmount,
        percentage: data.percentage,
        dayOfWeek: data.dayOfWeek || [],
        startDate: normalizedStartDate,
        endDate: normalizedEndDate,
        minDaysAdvance: data.minDaysAdvance,
        maxDaysAdvance: data.maxDaysAdvance,
        priority: data.priority || 0,
        active: data.active ?? true,
      },
    });

    return { success: true, rule };
  } catch (error) {
    console.error("Erreur lors de la création de la règle:", error);
    return {
      success: false,
      error: "Une erreur est survenue lors de la création de la règle",
    };
  }
}

