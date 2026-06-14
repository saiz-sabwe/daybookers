"use server";

import { pendingMutation } from "@/lib/api/pending-django";

export interface CreateHotelGroupData {
  name: string;
  description?: string;
}

export async function createHotelGroup(userId: string, data: CreateHotelGroupData) {
  return pendingMutation("partner.hotelGroups.create");
}
