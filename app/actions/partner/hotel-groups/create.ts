"use server";

import db from "@/lib/db";
import { getUserById } from "@/app/actions/users/get";

export interface CreateHotelGroupData {
  name: string;
  description?: string;
}

export async function createHotelGroup(userId: string, data: CreateHotelGroupData) {
  try {
    // Vérifier que l'utilisateur est gestionnaire de groupe
    const user = await getUserById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    const isGroupManager = user.roles.includes("ROLE_HOTEL_GROUP_MANAGER");
    if (!isGroupManager) {
      throw new Error("Seuls les gestionnaires de groupe peuvent créer des groupes");
    }

    // Créer le groupe
    const hotelGroup = await db.hotelGroup.create({
      data: {
        name: data.name,
        description: data.description,
      },
    });

    // Créer automatiquement le lien HotelGroupManager
    await db.hotelGroupManager.create({
      data: {
        groupId: hotelGroup.id,
        userId: userId,
      },
    });

    return { success: true, hotelGroup };
  } catch (error: any) {
    console.error("Error creating hotel group:", error);
    return { success: false, error: error.message };
  }
}

