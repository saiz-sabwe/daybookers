"use server";

import db from "@/lib/db";
import { getPartnerHotels } from "@/app/actions/partner/hotels/get";

export interface PricingRuleData {
  id: string;
  hotelId: string | null;
  roomTypeId: string | null;
  name: string;
  type: string;
  description: string | null;
  multiplier: number | null;
  fixedAmount: number | null;
  percentage: number | null;
  dayOfWeek: number[];
  startDate: Date | null;
  endDate: Date | null;
  minDaysAdvance: number | null;
  maxDaysAdvance: number | null;
  priority: number;
  active: boolean;
}

export async function getPricingRules(
  hotelId: string | null,
  roomTypeId: string | null,
  userId: string
): Promise<PricingRuleData[]> {
  try {
    // Si hotelId est fourni, vérifier l'accès
    if (hotelId) {
      const partnerHotels = await getPartnerHotels(userId);
      const hasAccess = partnerHotels.some((hotel) => hotel.id === hotelId);
      if (!hasAccess) {
        return [];
      }
    }

    const where: any = {};
    if (hotelId) where.hotelId = hotelId;
    if (roomTypeId) where.roomTypeId = roomTypeId;

    const rules = await db.pricingRule.findMany({
      where,
      orderBy: [
        { priority: "desc" },
        { createdAt: "desc" },
      ],
    });

    return rules.map((rule) => ({
      id: rule.id,
      hotelId: rule.hotelId,
      roomTypeId: rule.roomTypeId,
      name: rule.name,
      type: rule.type,
      description: rule.description,
      multiplier: rule.multiplier,
      fixedAmount: rule.fixedAmount,
      percentage: rule.percentage,
      dayOfWeek: rule.dayOfWeek,
      startDate: rule.startDate,
      endDate: rule.endDate,
      minDaysAdvance: rule.minDaysAdvance,
      maxDaysAdvance: rule.maxDaysAdvance,
      priority: rule.priority,
      active: rule.active,
    }));
  } catch (error) {
    console.error("Erreur lors de la récupération des règles de tarification:", error);
    return [];
  }
}

