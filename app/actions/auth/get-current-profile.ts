"use server";

import { djangoFetch, DjangoApiError } from "@/lib/api/django-client";
import { getServerApiToken } from "@/lib/api/server-auth";
import { mapApiUserProfile, StoredUserProfile } from "@/lib/api/user-profile";

export async function getCurrentProfile(): Promise<StoredUserProfile | null> {
  try {
    const token = await getServerApiToken();
    if (!token) {
      return null;
    }

    const data = await djangoFetch<Record<string, unknown>>(
      "/api/accounts/auth/me/",
      token,
    );

    return mapApiUserProfile(data);
  } catch (error) {
    if (error instanceof DjangoApiError && error.status === 404) {
      return null;
    }
    console.error("Error fetching current profile:", error);
    return null;
  }
}
