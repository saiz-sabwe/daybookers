"use server";

import { pendingDjango } from "@/lib/api/pending-django";

export interface PartnerCommission {
  hotelId: string;
  hotelName: string;
  hotelAddress: string;
  commissionRate: number | null;
  managerName: string | null;
  managerEmail: string | null;
}

export async function getAllPartnerCommissions(
  adminUserId: string
): Promise<PartnerCommission[]> {
  return pendingDjango([], "admin.commissions.getAll");
}
