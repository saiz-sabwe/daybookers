"use server";

import { DjangoPricingRuleRecord } from "@/lib/api/django-client";
import { fetchPartnerAll, requirePartnerToken } from "@/lib/api/partner/fetch";
import { mapPartnerPricingRule } from "@/lib/api/partner/mappers";

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
  _userId: string,
): Promise<PricingRuleData[]> {
  try {
    const token = await requirePartnerToken();
    if (!token) {
      return [];
    }

    const records = await fetchPartnerAll<DjangoPricingRuleRecord>(
      token,
      "/api/hotels/pricing-rules/",
      {
        ...(hotelId ? { hotel: hotelId } : {}),
        ...(roomTypeId ? { room_type: roomTypeId } : {}),
      },
    );

    return records.map(mapPartnerPricingRule);
  } catch (error) {
    console.error("Error fetching pricing rules:", error);
    return [];
  }
}
