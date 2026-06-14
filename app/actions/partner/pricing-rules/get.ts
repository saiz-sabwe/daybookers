"use server";

import { pendingDjango } from "@/lib/api/pending-django";

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
  return pendingDjango([], "partner.pricingRules.get");
}
