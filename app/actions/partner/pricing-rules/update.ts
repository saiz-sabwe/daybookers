"use server";

import { pendingMutation } from "@/lib/api/pending-django";

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
  return pendingMutation("partner.pricingRules.update");
}
