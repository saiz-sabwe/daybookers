"use server";

import { createAvailability } from "./create";

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
  data: BulkAvailabilityData,
): Promise<{ success: boolean; error?: string; count?: number }> {
  try {
    let count = 0;

    for (const date of data.dates) {
      for (const timeSlotId of data.timeSlotIds) {
        const result = await createAvailability(userId, {
          roomTypeId: data.roomTypeId,
          timeSlotId,
          date,
          available: data.available,
          price: data.price,
          maxGuests: data.maxGuests,
        });

        if (!result.success) {
          return {
            success: false,
            error: result.error,
            count,
          };
        }
        count += 1;
      }
    }

    return { success: true, count };
  } catch (error) {
    console.error("Error bulk updating availability:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Une erreur est survenue.",
    };
  }
}
