"use server";

import { updateAvailability } from "./update";

export async function deleteAvailability(
  userId: string,
  availabilityId: string,
): Promise<{ success: boolean; error?: string }> {
  return updateAvailability(userId, availabilityId, { available: false });
}
