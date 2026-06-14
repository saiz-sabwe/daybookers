"use server";

import { pendingDjango } from "@/lib/api/pending-django";

export async function getRoomTypesByHotel(
  hotelId: string,
  userId: string
): Promise<any[]> {
  return pendingDjango([], "partner.roomTypes.getByHotel");
}
