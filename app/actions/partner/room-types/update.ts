"use server";

import { pendingMutation } from "@/lib/api/pending-django";

export interface UpdateRoomTypeData {
  id: string;
  name?: string;
  description?: string;
  basePrice?: number;
  currency?: string;
  maxGuests?: number;
  images?: string[];
  amenities?: string[];
  roomCount?: number;
  timeSlotIds?: string[];
}

export async function updateRoomType(userId: string, data: UpdateRoomTypeData) {
  return pendingMutation("partner.roomTypes.update");
}
