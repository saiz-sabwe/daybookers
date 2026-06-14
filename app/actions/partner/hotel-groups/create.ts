"use server";

import { DjangoOrganizationRecord } from "@/lib/api/django-client";
import {
  partnerMutate,
  parsePartnerError,
  requirePartnerToken,
} from "@/lib/api/partner/fetch";

export interface CreateHotelGroupData {
  name: string;
  description?: string;
}

export async function createHotelGroup(
  _userId: string,
  data: CreateHotelGroupData,
) {
  try {
    const token = await requirePartnerToken();
    if (!token) {
      return { success: false, error: "Session expirée." };
    }

    const org = await partnerMutate<DjangoOrganizationRecord>(
      token,
      "/api/accounts/organizations/",
      "POST",
      {
        name: data.name,
        address: data.description ?? "",
      },
    );

    return { success: true, groupId: org.uuid };
  } catch (error) {
    console.error("Error creating hotel group:", error);
    return { success: false, error: parsePartnerError(error) };
  }
}
