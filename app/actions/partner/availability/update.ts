"use server";

import { pendingMutation } from "@/lib/api/pending-django";

export interface UpdateAvailabilityData {
  available?: boolean;
  price?: number;
  maxGuests?: number;
}

export async function updateAvailability(
  userId: string,
  availabilityId: string,
  data: UpdateAvailabilityData
): Promise<{ success: boolean; error?: string; availability?: any }> {
  return pendingMutation("partner.availability.update");
}
