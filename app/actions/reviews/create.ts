"use server";

import db from "@/lib/db";

interface CreateReviewData {
  hotelId: string;
  bookingId: string;
  rating: number;
  title?: string;
  comment: string;
}

export async function createReview(
  data: CreateReviewData,
  userId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // Vérifier que la réservation existe
    const booking = await db.booking.findUnique({
      where: { id: data.bookingId },
    });

    if (!booking) {
      return {
        success: false,
        error: "Réservation introuvable",
      };
    }

    // Vérifier que l'utilisateur a bien effectué cette réservation
    if (booking.userId !== userId) {
      return {
        success: false,
        error: "Vous n'avez pas l'autorisation de laisser un avis pour cette réservation",
      };
    }

    // Vérifier que la réservation est terminée (status = "COMPLETED")
    if (booking.status !== "COMPLETED") {
      return {
        success: false,
        error: "Vous ne pouvez laisser un avis que pour les réservations terminées",
      };
    }

    // Vérifier qu'un avis n'existe pas déjà pour cette réservation (bookingId unique)
    const existingReview = await db.review.findFirst({
      where: { bookingId: data.bookingId },
    });

    if (existingReview) {
      return {
        success: false,
        error: "Vous avez déjà laissé un avis pour cette réservation",
      };
    }

    // Vérifier que l'hôtel correspond à la réservation
    if (booking.hotelId !== data.hotelId) {
      return {
        success: false,
        error: "L'hôtel ne correspond pas à la réservation",
      };
    }

    // Valider le rating (1-5)
    if (data.rating < 1 || data.rating > 5) {
      return {
        success: false,
        error: "La note doit être comprise entre 1 et 5",
      };
    }

    // Créer l'avis dans la BD
    await db.review.create({
      data: {
        userId,
        hotelId: data.hotelId,
        bookingId: data.bookingId,
        rating: data.rating,
        title: data.title || null,
        comment: data.comment || null,
        verified: booking.status === "CONFIRMED", // Vérifié si la réservation était confirmée
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Erreur lors de la création de l'avis:", error);
    return {
      success: false,
      error: "Une erreur est survenue lors de la publication de votre avis",
    };
  }
}

