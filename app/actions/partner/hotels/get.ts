"use server";

import { Hotel } from "@/types";
import { loadPartnerHotels } from "@/lib/api/partner/data";
import { requirePartnerToken } from "@/lib/api/partner/fetch";

export async function getPartnerHotels(_userId: string): Promise<Hotel[]> {
  try {
    const token = await requirePartnerToken();
    if (!token) {
      return [];
    }
    return await loadPartnerHotels(token);
  } catch (error) {
    console.error("Error fetching partner hotels:", error);
    return [];
  }
}
