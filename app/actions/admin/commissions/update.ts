"use server";

import { pendingMutation } from "@/lib/api/pending-django";

export async function updatePartnerCommission(
  adminUserId: string,
  hotelId: string,
  commissionRate: number
): Promise<{ success: boolean; error?: string }> {
  return pendingMutation("admin.commissions.update");
}
