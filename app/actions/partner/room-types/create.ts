"use server";

import { pendingMutation } from "@/lib/api/pending-django";

export interface CreateRoomTypeData {
  hotelId: string;
  name: string;
  description?: string;
  basePrice: number;
  currency: string;
  maxGuests: number;
  images?: string[];
  amenities?: string[];
  roomCount?: number;
  timeSlotIds: string[];
  roomOptions?: Array<{
    name: string;
    price: number;
    description?: string;
  }>;
}

export async function createRoomType(userId: string, data: CreateRoomTypeData) {
  return pendingMutation("partner.roomTypes.create");
}
