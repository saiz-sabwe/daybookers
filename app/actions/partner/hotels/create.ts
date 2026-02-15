"use server";

import db from "@/lib/db";
import { getUserById } from "@/app/actions/users/get";

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
  try {
    // Vérifier que l'utilisateur est gestionnaire de groupe
    const user = await getUserById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    const isGroupManager = user.roles.includes("ROLE_HOTEL_GROUP_MANAGER");
    if (!isGroupManager) {
      throw new Error("Seuls les gestionnaires de groupe peuvent créer des hôtels");
    }

    // Si un groupId est fourni, vérifier que l'utilisateur gère ce groupe
    if (data.groupId) {
      const isManagerOfGroup = await db.hotelGroupManager.findFirst({
        where: {
          userId: userId,
          groupId: data.groupId,
        },
      });

      if (!isManagerOfGroup) {
        throw new Error("Vous n'avez pas accès à ce groupe d'hôtels");
      }
    }

    // Créer l'hôtel
    const hotel = await db.hotel.create({
      data: {
        name: data.name,
        description: data.description,
        address: data.address,
        city: data.city,
        country: data.country || "République Démocratique du Congo",
        zipCode: data.zipCode,
        latitude: data.latitude,
        longitude: data.longitude,
        phone: data.phone,
        email: data.email,
        website: data.website,
        stars: data.stars || 3,
        groupId: data.groupId,
        images: data.images || [],
        amenities: data.amenities || [],
      },
    });

    // Créer automatiquement le lien HotelManager pour l'utilisateur
    await db.hotelManager.create({
      data: {
        hotelId: hotel.id,
        userId: userId,
      },
    });

    return { success: true, hotel };
  } catch (error: any) {
    console.error("Error creating hotel:", error);
    return { success: false, error: error.message };
  }
}

