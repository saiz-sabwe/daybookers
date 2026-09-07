"use server";

import { djangoFetch } from "@/lib/api/django-client";
import {
  parsePartnerError,
  requirePartnerToken,
} from "@/lib/api/partner/fetch";

export interface UpdateAdminUserData {
  firstName?: string;
  lastName?: string;
  pseudo?: string;
  email?: string;
  phone?: string;
  address?: string;
}

export async function updateAdminUser(
  profileId: string,
  data: UpdateAdminUserData,
): Promise<{ success: boolean; error?: string }> {
  try {
    const token = await requirePartnerToken();
    if (!token) {
      return { success: false, error: "Session expirée." };
    }

    await djangoFetch(`/api/accounts/profiles/${profileId}/`, token, {
      method: "PATCH",
      body: JSON.stringify({
        ...(data.firstName !== undefined ? { first_name: data.firstName } : {}),
        ...(data.lastName !== undefined ? { last_name: data.lastName } : {}),
        ...(data.pseudo !== undefined ? { pseudo: data.pseudo } : {}),
        ...(data.email !== undefined ? { email: data.email } : {}),
        ...(data.phone !== undefined ? { phone: data.phone } : {}),
        ...(data.address !== undefined ? { address: data.address } : {}),
      }),
    });

    return { success: true };
  } catch (error) {
    console.error("Error updating admin user:", error);
    return { success: false, error: parsePartnerError(error) };
  }
}
