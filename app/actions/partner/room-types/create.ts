"use server";

import db from "@/lib/db";
import { getPartnerHotels } from "@/app/actions/partner/hotels/get";

export interface CreateRoomTypeData {
  hotelId: string;
  name: string;
  description?: string;
  maxGuests: number;
  basePrice: number;
  currency?: string;
  images?: string[];
}

export async function createRoomType(
  userId: string,
  data: CreateRoomTypeData
): Promise<{ success: boolean; error?: string; roomType?: any }> {
  try {
    // Vérifier que l'utilisateur gère cet hôtel
    const partnerHotels = await getPartnerHotels(userId);
    const hasAccess = partnerHotels.some((hotel) => hotel.id === data.hotelId);

    if (!hasAccess) {
      return {
        success: false,
        error: "Vous n'avez pas accès à cet hôtel",
      };
    }

    // Validation des données
    if (!data.name || data.name.trim().length === 0) {
      return {
        success: false,
        error: "Le nom du type de chambre est requis",
      };
    }

    if (data.maxGuests < 1 || data.maxGuests > 10) {
      return {
        success: false,
        error: "Le nombre de personnes doit être entre 1 et 10",
      };
    }

    if (data.basePrice < 0) {
      return {
        success: false,
        error: "Le prix de base doit être positif",
      };
    }

    // Créer le type de chambre
    const roomType = await db.roomType.create({
      data: {
        hotelId: data.hotelId,
        name: data.name.trim(),
        description: data.description?.trim() || null,
        maxGuests: data.maxGuests,
        basePrice: data.basePrice,
        currency: data.currency || "USD",
        images: data.images || [],
      },
    });

    return { success: true, roomType };
  } catch (error) {
    console.error("Erreur lors de la création du type de chambre:", error);
    return {
      success: false,
      error: "Une erreur est survenue lors de la création du type de chambre",
    };
  }
}

