"use server";

import { pendingMutation } from "@/lib/api/pending-django";

export async function deleteRoomType(userId: string, roomTypeId: string) {
  return pendingMutation("partner.roomTypes.delete");
}
