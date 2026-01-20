"use server";

import db from "@/lib/db";
import { getRoomTypeById } from "@/app/actions/rooms/get";

interface CreateBookingData {
  hotelId: string;
  roomTypeId: string;
  date: string;
  timeSlotId: string;
  guestCount: {
    adults: number;
    children: number;
  };
  guestInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  specialRequests?: string;
  promotionCode?: string;
}

export async function createBooking(
  data: CreateBookingData,
  userId: string
): Promise<{ success: boolean; bookingId?: string; error?: string }> {
  try {
    // Récupérer le type de chambre pour obtenir le prix
    const roomType = await getRoomTypeById(data.roomTypeId);
    if (!roomType) {
      return {
        success: false,
        error: "Type de chambre introuvable",
      };
    }

    // Vérifier que le créneau horaire existe
    const timeSlot = await db.timeSlot.findUnique({
      where: { id: data.timeSlotId },
    });
    if (!timeSlot) {
      return {
        success: false,
        error: "Créneau horaire introuvable",
      };
    }

    // Vérifier que l'hôtel existe
    const hotel = await db.hotel.findUnique({
      where: { id: data.hotelId },
    });
    if (!hotel) {
      return {
        success: false,
        error: "Hôtel introuvable",
      };
    }

    // TODO: Vérifier la disponibilité

    // Calculer le prix (pour l'instant, on utilise le prix de base)
    const originalPrice = roomType.basePrice;
    const discountAmount = 0; // TODO: Appliquer les promotions si promotionCode est fourni
    const finalPrice = originalPrice - discountAmount;
    const currency = roomType.currency;

    // Convertir la date string en Date
    const bookingDate = new Date(data.date);

    // Créer le nom complet du client
    const guestName = `${data.guestInfo.firstName} ${data.guestInfo.lastName}`;

    // Calculer le nombre total de clients (adults + children)
    const totalGuestCount = data.guestCount.adults + data.guestCount.children;

    // Créer la réservation dans la base de données
    const booking = await db.booking.create({
      data: {
        userId,
        hotelId: data.hotelId,
        roomTypeId: data.roomTypeId,
        date: bookingDate,
        timeSlotId: data.timeSlotId,
        guestCount: totalGuestCount,
        status: "PENDING",
        originalPrice,
        discountAmount,
        finalPrice,
        currency,
        guestName,
        guestEmail: data.guestInfo.email,
        guestPhone: data.guestInfo.phone || null,
        specialRequests: data.specialRequests || null,
        promotionId: null, // TODO: Gérer les promotions
        cancellationPolicyId: null, // TODO: Gérer les politiques d'annulation
      },
    });

    return {
      success: true,
      bookingId: booking.id,
    };
  } catch (error) {
    console.error("Erreur lors de la création de la réservation:", error);
    return {
      success: false,
      error: "Une erreur est survenue lors de la création de la réservation",
    };
  }
}

