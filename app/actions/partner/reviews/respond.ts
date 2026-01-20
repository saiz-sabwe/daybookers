"use server";

import db from "@/lib/db";
import { getPartnerHotels } from "@/app/actions/partner/hotels/get";

export interface RespondToReviewData {
  response: string;
}

export async function respondToReview(
  userId: string,
  reviewId: string,
  data: RespondToReviewData
): Promise<{ success: boolean; error?: string }> {
  try {
    // Récupérer l'avis pour vérifier l'accès
    const review = await db.review.findUnique({
      where: { id: reviewId },
      select: { hotelId: true },
    });

    if (!review) {
      return {
        success: false,
        error: "Avis introuvable",
      };
    }

    // Vérifier que l'utilisateur gère cet hôtel
    const partnerHotels = await getPartnerHotels(userId);
    const hasAccess = partnerHotels.some((hotel) => hotel.id === review.hotelId);

    if (!hasAccess) {
      return {
        success: false,
        error: "Vous n'avez pas accès à cet avis",
      };
    }

    // Validation
    if (!data.response || data.response.trim().length === 0) {
      return {
        success: false,
        error: "La réponse ne peut pas être vide",
      };
    }

    if (data.response.trim().length > 2000) {
      return {
        success: false,
        error: "La réponse ne peut pas dépasser 2000 caractères",
      };
    }

    // Mettre à jour l'avis avec la réponse
    await db.review.update({
      where: { id: reviewId },
      data: {
        response: data.response.trim(),
        responseAt: new Date(),
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Erreur lors de l'ajout de la réponse:", error);
    return {
      success: false,
      error: "Une erreur est survenue lors de l'ajout de la réponse",
    };
  }
}

