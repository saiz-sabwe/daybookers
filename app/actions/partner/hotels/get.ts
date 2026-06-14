"use server";

import { pendingDjango } from "@/lib/api/pending-django";
import { Hotel } from "@/types";

export async function getPartnerHotels(userId: string): Promise<Hotel[]> {
  return pendingDjango([], "partner.hotels.get");
}
