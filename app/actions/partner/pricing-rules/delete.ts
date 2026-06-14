"use server";

import { pendingMutation } from "@/lib/api/pending-django";

export async function deletePricingRule(
  userId: string,
  ruleId: string
): Promise<{ success: boolean; error?: string }> {
  return pendingMutation("partner.pricingRules.delete");
}
