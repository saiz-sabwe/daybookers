"use server";

import db from "@/lib/db";
import { BookingStatus } from "@/lib/generated/prisma/client";
import { getPartnerHotels } from "@/app/actions/partner/hotels/get";

export async function confirmBooking(
  bookingId: string,
  userId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // Vérifier que la réservation existe
    const booking = await db.booking.findUnique({
      where: { id: bookingId },
      include: {
        hotel: true,
      },
    });

    if (!booking) {
      return {
        success: false,
        error: "Réservation introuvable",
      };
    }

    // Vérifier que l'utilisateur gère cet hôtel
    const partnerHotels = await getPartnerHotels(userId);
    const hasAccess = partnerHotels.some((hotel) => hotel.id === booking.hotelId);

    if (!hasAccess) {
      return {
        success: false,
        error: "Vous n'avez pas l'autorisation de gérer cette réservation",
      };
    }

    // Vérifier que la réservation peut être confirmée (status = PENDING)
    if (booking.status !== BookingStatus.PENDING) {
      return {
        success: false,
        error: "Seules les réservations en attente peuvent être confirmées",
      };
    }

    // Mettre à jour le statut
    await db.booking.update({
      where: { id: bookingId },
      data: {
        status: BookingStatus.CONFIRMED,
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Erreur lors de la confirmation de la réservation:", error);
    return {
      success: false,
      error: "Une erreur est survenue lors de la confirmation de la réservation",
    };
  }
}

export async function cancelBookingByPartner(
  bookingId: string,
  userId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // Vérifier que la réservation existe
    const booking = await db.booking.findUnique({
      where: { id: bookingId },
      include: {
        hotel: true,
      },
    });

    if (!booking) {
      return {
        success: false,
        error: "Réservation introuvable",
      };
    }

    // Vérifier que l'utilisateur gère cet hôtel
    const partnerHotels = await getPartnerHotels(userId);
    const hasAccess = partnerHotels.some((hotel) => hotel.id === booking.hotelId);

    if (!hasAccess) {
      return {
        success: false,
        error: "Vous n'avez pas l'autorisation de gérer cette réservation",
      };
    }

    // Vérifier que la réservation peut être annulée
    if (booking.status === BookingStatus.CANCELLED) {
      return {
        success: false,
        error: "Cette réservation est déjà annulée",
      };
    }

    if (booking.status === BookingStatus.COMPLETED) {
      return {
        success: false,
        error: "Impossible d'annuler une réservation terminée",
      };
    }

    // Mettre à jour le statut
    await db.booking.update({
      where: { id: bookingId },
      data: {
        status: BookingStatus.CANCELLED,
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Erreur lors de l'annulation de la réservation:", error);
    return {
      success: false,
      error: "Une erreur est survenue lors de l'annulation de la réservation",
    };
  }
}

