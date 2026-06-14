"use server";

import { DjangoRoomTypeRecord } from "@/lib/api/django-client";
import {
  partnerMutate,
  parsePartnerError,
  requirePartnerToken,
} from "@/lib/api/partner/fetch";

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

export async function createRoomType(_userId: string, data: CreateRoomTypeData) {
  try {
    const token = await requirePartnerToken();
    if (!token) {
      return { success: false, error: "Session expirée." };
    }

    const roomType = await partnerMutate<DjangoRoomTypeRecord>(
      token,
      "/api/hotels/rooms/",
      "POST",
      {
        hotel: data.hotelId,
        name: data.name,
        description: data.description ?? "",
        base_price: data.basePrice,
        currency: data.currency,
        max_guests: data.maxGuests,
        images: data.images ?? [],
      },
    );

    if (data.roomOptions?.length) {
      for (const option of data.roomOptions) {
        await partnerMutate(token, "/api/hotels/room-options/", "POST", {
          room_type: roomType.uuid,
          name: option.name,
          description: option.description ?? "",
          price: option.price,
          currency: data.currency,
        });
      }
    }

    return { success: true, roomTypeId: roomType.uuid };
  } catch (error) {
    console.error("Error creating room type:", error);
    return { success: false, error: parsePartnerError(error) };
  }
}
