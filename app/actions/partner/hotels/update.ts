"use server";

import { pendingMutation } from "@/lib/api/pending-django";

export interface UpdateHotelData {
  name?: string;
  description?: string;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  stars?: number;
}

export async function updateHotel(
  hotelId: string,
  data: UpdateHotelData,
  userId: string
): Promise<{ success: boolean; error?: string }> {
  return pendingMutation("partner.hotels.update");
}
