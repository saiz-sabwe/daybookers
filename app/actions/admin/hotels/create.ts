"use server";

import { pendingMutation } from "@/lib/api/pending-django";

export interface CreateHotelData {
  name: string;
  description?: string;
  address: string;
  phone?: string;
  email?: string;
  website?: string;
  stars?: number;
  cityId?: string;
  status?: string;
  images?: string[];
}

export async function createHotel(
  userId: string,
  data: CreateHotelData
): Promise<{ success: boolean; error?: string; hotel?: any }> {
  return pendingMutation("admin.hotels.create");
}
