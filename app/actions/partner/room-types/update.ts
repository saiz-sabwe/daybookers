"use server";

import db from "@/lib/db";
import { getUserById } from "@/app/actions/users/get";

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
  try {
    // Récupérer le type de chambre existant
    const existingRoomType = await db.roomType.findUnique({
      where: { id: data.id },
      include: { hotel: true },
    });

    if (!existingRoomType) {
      throw new Error("Type de chambre non trouvé");
    }

    // Vérifier que l'utilisateur est manager de l'hôtel
    const user = await getUserById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    const isManager = await db.hotelManager.findFirst({
      where: {
        userId: userId,
        hotelId: existingRoomType.hotelId,
      },
    });

    const isGroupManager = user.roles.includes("ROLE_HOTEL_GROUP_MANAGER");

    if (!isManager && !isGroupManager) {
      throw new Error("Vous n'avez pas la permission de modifier ce type de chambre");
    }

    // Préparer les données de mise à jour
    const updateData: any = {
      name: data.name,
      description: data.description,
      basePrice: data.basePrice,
      currency: data.currency,
      maxGuests: data.maxGuests,
      images: data.images,
      amenities: data.amenities,
      roomCount: data.roomCount,
    };

    // Mettre à jour les time slots si fournis
    if (data.timeSlotIds) {
      updateData.timeSlots = {
        set: data.timeSlotIds.map((id) => ({ id })),
      };
    }

    // Mettre à jour le type de chambre
    const roomType = await db.roomType.update({
      where: { id: data.id },
      data: updateData,
    });

    return { success: true, roomType };
  } catch (error: any) {
    console.error("Error updating room type:", error);
    return { success: false, error: error.message };
  }
}
