"use server";

import db from "@/lib/db";
import { getUserById } from "@/app/actions/users/get";

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
  try {
    // Vérifier que l'utilisateur est manager de l'hôtel
    const user = await getUserById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    const isManager = await db.hotelManager.findFirst({
      where: {
        userId: userId,
        hotelId: data.hotelId,
      },
    });

    const isGroupManager = user.roles.includes("ROLE_HOTEL_GROUP_MANAGER");

    if (!isManager && !isGroupManager) {
      throw new Error("Vous n'avez pas la permission de créer des types de chambres pour cet hôtel");
    }

    // Créer le type de chambre
    const roomType = await db.roomType.create({
      data: {
        hotelId: data.hotelId,
        name: data.name,
        description: data.description,
        basePrice: data.basePrice,
        currency: data.currency,
        maxGuests: data.maxGuests,
        images: data.images || [],
        amenities: data.amenities || [],
        roomCount: data.roomCount || 1,
        timeSlots: {
          connect: data.timeSlotIds.map((id) => ({ id })),
        },
      },
    });

    // Créer les options de chambre si présentes
    if (data.roomOptions && data.roomOptions.length > 0) {
      await db.roomOption.createMany({
        data: data.roomOptions.map((option) => ({
          roomTypeId: roomType.id,
          name: option.name,
          price: option.price,
          description: option.description,
        })),
      });
    }

    return { success: true, roomType };
  } catch (error: any) {
    console.error("Error creating room type:", error);
    return { success: false, error: error.message };
  }
}
