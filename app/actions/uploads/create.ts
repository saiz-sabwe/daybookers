"use server";

import { getApiBaseUrl } from "@/lib/api/config";
import { requirePartnerToken } from "@/lib/api/partner/fetch";

export async function uploadHotelImage(
  formData: FormData,
): Promise<{ success: boolean; url?: string; error?: string }> {
  try {
    const token = await requirePartnerToken();
    if (!token) {
      return { success: false, error: "Session expirée." };
    }

    const file = formData.get("file");
    if (!(file instanceof File) || file.size === 0) {
      return { success: false, error: "Fichier manquant." };
    }

    const payload = new FormData();
    payload.append("file", file, file.name);

    const response = await fetch(`${getApiBaseUrl()}/api/hotels/uploads/`, {
      method: "POST",
      headers: { Authorization: `Token ${token}` },
      body: payload,
      cache: "no-store",
    });

    const data = (await response.json().catch(() => null)) as {
      url?: string;
      error?: string;
    } | null;

    if (!response.ok || !data?.url) {
      return {
        success: false,
        error: data?.error ?? `Erreur API (${response.status})`,
      };
    }

    return { success: true, url: data.url };
  } catch (error) {
    console.error("Error uploading hotel image:", error);
    return { success: false, error: "Erreur lors de l'envoi de la photo." };
  }
}
