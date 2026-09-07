"use server";

import { djangoFetch } from "@/lib/api/django-client";
import {
  parsePartnerError,
  requirePartnerToken,
} from "@/lib/api/partner/fetch";

export interface CreateAdminUserData {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  role?: string;
  organizationUuid?: string;
}

export async function createAdminUser(
  data: CreateAdminUserData,
): Promise<{ success: boolean; error?: string }> {
  try {
    const token = await requirePartnerToken();
    if (!token) {
      return { success: false, error: "Session expirée." };
    }

    await djangoFetch("/api/accounts/profiles/create-user/", token, {
      method: "POST",
      body: JSON.stringify({
        email: data.email,
        password: data.password,
        first_name: data.firstName || "",
        last_name: data.lastName || "",
        phone: data.phone || "",
        ...(data.role ? { role: data.role } : {}),
        ...(data.organizationUuid
          ? { organization_uuid: data.organizationUuid }
          : {}),
      }),
    });

    return { success: true };
  } catch (error) {
    console.error("Error creating admin user:", error);
    return { success: false, error: parsePartnerError(error) };
  }
}
