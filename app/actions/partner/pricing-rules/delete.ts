"use server";

import { updatePricingRule } from "./update";

export async function deletePricingRule(
  userId: string,
  ruleId: string,
): Promise<{ success: boolean; error?: string }> {
  const result = await updatePricingRule(userId, ruleId, { active: false });
  return { success: result.success, error: result.error };
}
