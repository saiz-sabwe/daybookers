"use server";

import { pendingMutation } from "@/lib/api/pending-django";

export async function deleteAvailability(
  userId: string,
  availabilityId: string
): Promise<{ success: boolean; error?: string }> {
  return pendingMutation("partner.availability.delete");
}
