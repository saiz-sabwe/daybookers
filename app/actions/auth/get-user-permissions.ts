"use server";

import { djangoFetch, DjangoApiError } from "@/lib/api/django-client";
import { parsePermissions } from "@/lib/auth/permissions";
import { getServerApiToken } from "@/lib/api/server-auth";
import { Permission } from "@/types/auth";

export async function getUserPermissions(): Promise<Permission[]> {
  try {
    const token = await getServerApiToken();
    if (!token) {
      return [];
    }

    const data = await djangoFetch<Record<string, unknown>>(
      "/api/accounts/auth/me/",
      token,
    );

    return parsePermissions(data.permissions);
  } catch (error) {
    if (error instanceof DjangoApiError && error.status === 404) {
      return [];
    }
    console.error("Error fetching user permissions:", error);
    return [];
  }
}
