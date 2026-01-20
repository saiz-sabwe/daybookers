"use server";

import db from "@/lib/db";
import { getPartnerHotels } from "@/app/actions/partner/hotels/get";

export interface UpdateRoomTypeData {
  name?: string;
  description?: string;
  maxGuests?: number;
  basePrice?: number;
  currency?: string;
  images?: string[];
}

export async function updateRoomType(
  userId: string,
  roomTypeId: string,
  data: UpdateRoomTypeData
): Promise<{ success: boolean; error?: string; roomType?: any }> {
  try {
    // Récupérer le roomType pour vérifier l'accès
    const roomType = await db.roomType.findUnique({
      where: { id: roomTypeId },
      select: { hotelId: true },
    });

    if (!roomType) {
      return {
        success: false,
        error: "Type de chambre introuvable",
      };
    }

    // Vérifier que l'utilisateur gère cet hôtel
    const partnerHotels = await getPartnerHotels(userId);
    const hasAccess = partnerHotels.some((hotel) => hotel.id === roomType.hotelId);

    if (!hasAccess) {
      return {
        success: false,
        error: "Vous n'avez pas accès à ce type de chambre",
      };
    }

    // Validation des données
    if (data.name !== undefined && data.name.trim().length === 0) {
      return {
        success: false,
        error: "Le nom du type de chambre ne peut pas être vide",
      };
    }

    if (data.maxGuests !== undefined && (data.maxGuests < 1 || data.maxGuests > 10)) {
      return {
        success: false,
        error: "Le nombre de personnes doit être entre 1 et 10",
      };
    }

    if (data.basePrice !== undefined && data.basePrice < 0) {
      return {
        success: false,
        error: "Le prix de base doit être positif",
      };
    }

    // Préparer les données de mise à jour
    const updateData: any = {};
    if (data.name !== undefined) updateData.name = data.name.trim();
    if (data.description !== undefined) {
      updateData.description = data.description.trim() || null;
    }
    if (data.maxGuests !== undefined) updateData.maxGuests = data.maxGuests;
    if (data.basePrice !== undefined) updateData.basePrice = data.basePrice;
    if (data.currency !== undefined) updateData.currency = data.currency;
    if (data.images !== undefined) updateData.images = data.images;

    // Mettre à jour le type de chambre
    const updatedRoomType = await db.roomType.update({
      where: { id: roomTypeId },
      data: updateData,
    });

    return { success: true, roomType: updatedRoomType };
  } catch (error) {
    console.error("Erreur lors de la mise à jour du type de chambre:", error);
    return {
      success: false,
      error: "Une erreur est survenue lors de la mise à jour du type de chambre",
    };
  }
}

