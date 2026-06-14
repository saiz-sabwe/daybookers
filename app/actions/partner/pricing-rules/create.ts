"use server";

import { DjangoPricingRuleRecord } from "@/lib/api/django-client";
import {
  formatDateParam,
  partnerMutate,
  parsePartnerError,
  requirePartnerToken,
} from "@/lib/api/partner/fetch";
import { mapPartnerPricingRule } from "@/lib/api/partner/mappers";

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
  _userId: string,
  data: CreatePricingRuleData,
): Promise<{ success: boolean; error?: string; rule?: ReturnType<typeof mapPartnerPricingRule> }> {
  try {
    const token = await requirePartnerToken();
    if (!token) {
      return { success: false, error: "Session expirée." };
    }

    const record = await partnerMutate<DjangoPricingRuleRecord>(
      token,
      "/api/hotels/pricing-rules/",
      "POST",
      {
        hotel: data.hotelId ?? null,
        room_type: data.roomTypeId ?? null,
        name: data.name,
        type: data.type,
        description: data.description ?? "",
        multiplier: data.multiplier ?? null,
        fixed_amount: data.fixedAmount ?? null,
        percentage: data.percentage ?? null,
        day_of_week: data.dayOfWeek ?? [],
        start_date: data.startDate ? formatDateParam(data.startDate) : null,
        end_date: data.endDate ? formatDateParam(data.endDate) : null,
        min_days_advance: data.minDaysAdvance ?? null,
        max_days_advance: data.maxDaysAdvance ?? null,
        priority: data.priority ?? 0,
        active: data.active ?? true,
      },
    );

    return { success: true, rule: mapPartnerPricingRule(record) };
  } catch (error) {
    console.error("Error creating pricing rule:", error);
    return { success: false, error: parsePartnerError(error) };
  }
}
