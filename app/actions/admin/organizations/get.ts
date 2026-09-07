"use server";

import { loadAllOrganizations } from "@/lib/api/admin/data";
import { requirePartnerToken } from "@/lib/api/partner/fetch";

export interface AdminOrganizationOption {
  uuid: string;
  name: string;
}

export async function getAllOrganizationOptions(): Promise<
  AdminOrganizationOption[]
> {
  try {
    const token = await requirePartnerToken();
    if (!token) {
      return [];
    }

    const records = await loadAllOrganizations(token);
    return records
      .map((record) => ({
        uuid: String(record.uuid),
        name: record.name ?? "Organisation",
      }))
      .sort((a, b) => a.name.localeCompare(b.name));
  } catch (error) {
    console.error("Error fetching admin organizations:", error);
    return [];
  }
}
