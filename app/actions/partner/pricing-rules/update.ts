"use server";

import { DjangoPricingRuleRecord } from "@/lib/api/django-client";
import {
  formatDateParam,
  partnerMutate,
  parsePartnerError,
  requirePartnerToken,
} from "@/lib/api/partner/fetch";
import { mapPartnerPricingRule } from "@/lib/api/partner/mappers";

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
  _userId: string,
  ruleId: string,
  data: UpdatePricingRuleData,
): Promise<{ success: boolean; error?: string; rule?: ReturnType<typeof mapPartnerPricingRule> }> {
  try {
    const token = await requirePartnerToken();
    if (!token) {
      return { success: false, error: "Session expirée." };
    }

    const record = await partnerMutate<DjangoPricingRuleRecord>(
      token,
      `/api/hotels/pricing-rules/${ruleId}/`,
      "PATCH",
      {
        ...(data.name ? { name: data.name } : {}),
        ...(data.description !== undefined
          ? { description: data.description }
          : {}),
        ...(data.multiplier !== undefined ? { multiplier: data.multiplier } : {}),
        ...(data.fixedAmount !== undefined
          ? { fixed_amount: data.fixedAmount }
          : {}),
        ...(data.percentage !== undefined ? { percentage: data.percentage } : {}),
        ...(data.dayOfWeek ? { day_of_week: data.dayOfWeek } : {}),
        ...(data.startDate !== undefined
          ? {
              start_date: data.startDate
                ? formatDateParam(data.startDate)
                : null,
            }
          : {}),
        ...(data.endDate !== undefined
          ? {
              end_date: data.endDate ? formatDateParam(data.endDate) : null,
            }
          : {}),
        ...(data.minDaysAdvance !== undefined
          ? { min_days_advance: data.minDaysAdvance }
          : {}),
        ...(data.maxDaysAdvance !== undefined
          ? { max_days_advance: data.maxDaysAdvance }
          : {}),
        ...(data.priority !== undefined ? { priority: data.priority } : {}),
        ...(data.active !== undefined ? { active: data.active } : {}),
      },
    );

    return { success: true, rule: mapPartnerPricingRule(record) };
  } catch (error) {
    console.error("Error updating pricing rule:", error);
    return { success: false, error: parsePartnerError(error) };
  }
}
