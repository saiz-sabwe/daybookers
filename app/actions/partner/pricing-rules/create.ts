"use server";

import { pendingMutation } from "@/lib/api/pending-django";

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
  return pendingMutation("partner.pricingRules.create");
}
