"use server";

import { pendingMutation } from "@/lib/api/pending-django";

export interface UpdatePartnerSettingsData {
  commissionRate?: number;
  payoutMethod?: string;
  payoutSchedule?: string;
  autoConfirm?: boolean;
  emailNotifications?: boolean;
  smsNotifications?: boolean;
}

export async function updatePartnerSettings(
  userId: string,
  data: UpdatePartnerSettingsData
): Promise<{ success: boolean; error?: string }> {
  return pendingMutation("partner.settings.update");
}
