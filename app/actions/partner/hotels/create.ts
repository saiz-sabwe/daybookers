"use server";

import { pendingMutation } from "@/lib/api/pending-django";

export interface CreateHotelData {
  name: string;
  description?: string;
  address: string;
  city: string;
  country?: string;
  zipCode?: string;
  latitude?: number;
  longitude?: number;
  phone?: string;
  email?: string;
  website?: string;
  stars?: number;
  groupId?: string;
  images?: string[];
  amenities?: string[];
}

export async function createHotel(userId: string, data: CreateHotelData) {
  return pendingMutation("partner.hotels.create");
}
