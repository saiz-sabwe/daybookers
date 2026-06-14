"use server";

import { djangoFetch, DjangoApiError } from "@/lib/api/django-client";
import { getServerApiToken } from "@/lib/api/server-auth";
import {
  mapApiUserProfile,
  StoredUserProfile,
} from "@/lib/api/user-profile";

interface UpdateProfileData {
  name?: string;
  phone?: string;
}

function splitFullName(name: string): {
  first_name: string;
  last_name: string;
} {
  const trimmed = name.trim();
  const parts = trimmed.split(/\s+/);
  if (parts.length === 0) {
    return { first_name: "", last_name: "" };
  }
  if (parts.length === 1) {
    return { first_name: parts[0], last_name: "" };
  }
  return {
    first_name: parts[0],
    last_name: parts.slice(1).join(" "),
  };
}

export async function updateProfile(
  data: UpdateProfileData,
): Promise<{ success: boolean; profile?: StoredUserProfile; error?: string }> {
  try {
    const token = await getServerApiToken();
    if (!token) {
      return { success: false, error: "Vous devez être connecté" };
    }

    const payload: Record<string, string> = {};

    if (data.name !== undefined) {
      const { first_name, last_name } = splitFullName(data.name);
      payload.first_name = first_name;
      payload.last_name = last_name;
    }

    if (data.phone !== undefined) {
      payload.phone = data.phone;
    }

    const result = await djangoFetch<Record<string, unknown>>(
      "/api/accounts/auth/me/",
      token,
      {
        method: "PATCH",
        body: JSON.stringify(payload),
      },
    );

    return {
      success: true,
      profile: mapApiUserProfile(result),
    };
  } catch (error) {
    if (error instanceof DjangoApiError) {
      return { success: false, error: error.message };
    }
    console.error("Error updating profile:", error);
    return {
      success: false,
      error: "Une erreur est survenue lors de la mise à jour du profil",
    };
  }
}
