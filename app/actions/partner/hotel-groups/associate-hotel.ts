"use server";

import { pendingMutation } from "@/lib/api/pending-django";

export async function associateHotelToGroup(
  userId: string,
  hotelId: string,
  groupId: string | null
) {
  return pendingMutation("partner.hotelGroups.associateHotel");
}
