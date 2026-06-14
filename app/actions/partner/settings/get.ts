"use server";

import { getPartnerOrganizations } from "@/lib/api/partner/context";

export interface PartnerSettings {
  commissionRate: number | null;
  payoutMethod: string | null;
  payoutSchedule: string | null;
  autoConfirm: boolean;
  emailNotifications: boolean;
  smsNotifications: boolean;
}

const DEFAULT_SETTINGS: PartnerSettings = {
  commissionRate: 10,
  payoutMethod: "bank_transfer",
  payoutSchedule: "monthly",
  autoConfirm: false,
  emailNotifications: true,
  smsNotifications: false,
};

export async function getPartnerSettings(
  _userId: string,
): Promise<PartnerSettings | null> {
  try {
    const organizations = await getPartnerOrganizations();
    if (organizations.length === 0) {
      return null;
    }
    return DEFAULT_SETTINGS;
  } catch (error) {
    console.error("Error fetching partner settings:", error);
    return null;
  }
}
