"use server";

import { pendingMutation } from "@/lib/api/pending-django";

export interface BulkAvailabilityData {
  roomTypeId: string;
  timeSlotIds: string[];
  dates: Date[];
  available: boolean;
  price?: number;
  maxGuests?: number;
}

export async function bulkUpdateAvailability(
  userId: string,
  data: BulkAvailabilityData
): Promise<{ success: boolean; error?: string; count?: number }> {
  return pendingMutation("partner.availability.bulk");
}
