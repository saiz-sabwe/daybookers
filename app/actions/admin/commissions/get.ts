"use server";

import { buildCommissionRows } from "@/lib/api/admin/mappers";
import {
  loadAllHotels,
  loadAllOrganizations,
} from "@/lib/api/admin/data";
import { requirePartnerToken } from "@/lib/api/partner/fetch";

export interface PartnerCommission {
  hotelId: string;
  hotelName: string;
  hotelAddress: string;
  commissionRate: number | null;
  managerName: string | null;
  managerEmail: string | null;
}

export async function getAllPartnerCommissions(
  _adminUserId: string,
): Promise<PartnerCommission[]> {
  try {
    const token = await requirePartnerToken();
    if (!token) {
      return [];
    }

    const [hotels, organizations] = await Promise.all([
      loadAllHotels(token),
      loadAllOrganizations(token),
    ]);

    return buildCommissionRows(hotels, organizations).map((row) => ({
      hotelId: row.hotelId,
      hotelName: row.hotelName,
      hotelAddress: row.hotelAddress,
      commissionRate: row.commissionRate,
      managerName: row.managerName,
      managerEmail: row.managerEmail,
    }));
  } catch (error) {
    console.error("Error fetching partner commissions:", error);
    return [];
  }
}
