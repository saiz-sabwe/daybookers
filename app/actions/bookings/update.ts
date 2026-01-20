"use server";

import db from "@/lib/db";

export async function cancelBooking(
  bookingId: string,
  userId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // Vérifier que la réservation existe et appartient à l'utilisateur
    const booking = await db.booking.findUnique({
      where: { id: bookingId },
    });

    if (!booking) {
      return {
        success: false,
        error: "Réservation introuvable",
      };
    }

    if (booking.userId !== userId) {
      return {
        success: false,
        error: "Vous n'avez pas l'autorisation d'annuler cette réservation",
      };
    }

    // Vérifier que la réservation peut être annulée (pas déjà annulée ou terminée)
    if (booking.status === "CANCELLED") {
      return {
        success: false,
        error: "Cette réservation est déjà annulée",
      };
    }

    if (booking.status === "COMPLETED") {
      return {
        success: false,
        error: "Impossible d'annuler une réservation terminée",
      };
    }

    // Mettre à jour le statut de la réservation
    await db.booking.update({
      where: { id: bookingId },
      data: {
        status: "CANCELLED",
      },
    });

    // TODO: Gérer les remboursements si nécessaire
    // TODO: Envoyer une notification au partenaire
    // TODO: Créer un log de modification

    return {
      success: true,
    };
  } catch (error) {
    console.error("Erreur lors de l'annulation de la réservation:", error);
    return {
      success: false,
      error: "Une erreur est survenue lors de l'annulation de la réservation",
    };
  }
}

