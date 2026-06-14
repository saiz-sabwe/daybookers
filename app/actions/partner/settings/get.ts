"use server";

import { pendingDjango } from "@/lib/api/pending-django";

export interface PartnerSettings {
  commissionRate: number | null;
  payoutMethod: string | null;
  payoutSchedule: string | null;
  autoConfirm: boolean;
  emailNotifications: boolean;
  smsNotifications: boolean;
}

export async function getPartnerSettings(
  _userId: string,
): Promise<PartnerSettings | null> {
  return pendingDjango(null, "partner.settings.get");
}
