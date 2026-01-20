"use server";

import db from "@/lib/db";
import { getPartnerHotels } from "@/app/actions/partner/hotels/get";

export interface AvailabilityData {
  id: string;
  roomTypeId: string;
  timeSlotId: string;
  date: Date;
  available: boolean;
  price?: number;
  maxGuests?: number;
}

export async function getAvailabilities(
  hotelId: string,
  roomTypeId: string,
  startDate: Date,
  endDate: Date,
  userId: string
): Promise<AvailabilityData[]> {
  try {
    // Vérifier que l'utilisateur gère cet hôtel
    const partnerHotels = await getPartnerHotels(userId);
    const hasAccess = partnerHotels.some((hotel) => hotel.id === hotelId);

    if (!hasAccess) {
      return [];
    }

    // Normaliser les dates (sans heures)
    const normalizedStartDate = new Date(startDate);
    normalizedStartDate.setHours(0, 0, 0, 0);
    const normalizedEndDate = new Date(endDate);
    normalizedEndDate.setHours(23, 59, 59, 999);

    // Récupérer les disponibilités
    const availabilities = await db.availability.findMany({
      where: {
        roomTypeId,
        date: {
          gte: normalizedStartDate,
          lte: normalizedEndDate,
        },
      },
      orderBy: {
        date: "asc",
      },
    });

    return availabilities.map((av) => ({
      id: av.id,
      roomTypeId: av.roomTypeId,
      timeSlotId: av.timeSlotId,
      date: av.date,
      available: av.available,
      price: av.price || undefined,
      maxGuests: av.maxGuests || undefined,
    }));
  } catch (error) {
    console.error("Erreur lors de la récupération des disponibilités:", error);
    return [];
  }
}

export async function getAvailabilityByDate(
  roomTypeId: string,
  timeSlotId: string,
  date: Date,
  userId: string
): Promise<AvailabilityData | null> {
  try {
    // Normaliser la date (sans heures)
    const normalizedDate = new Date(date);
    normalizedDate.setHours(0, 0, 0, 0);

    // Récupérer le roomType pour vérifier l'accès
    const roomType = await db.roomType.findUnique({
      where: { id: roomTypeId },
      select: { hotelId: true },
    });

    if (!roomType) {
      return null;
    }

    // Vérifier que l'utilisateur gère cet hôtel
    const partnerHotels = await getPartnerHotels(userId);
    const hasAccess = partnerHotels.some((hotel) => hotel.id === roomType.hotelId);

    if (!hasAccess) {
      return null;
    }

    const availability = await db.availability.findUnique({
      where: {
        roomTypeId_timeSlotId_date: {
          roomTypeId,
          timeSlotId,
          date: normalizedDate,
        },
      },
    });

    if (!availability) {
      return null;
    }

    return {
      id: availability.id,
      roomTypeId: availability.roomTypeId,
      timeSlotId: availability.timeSlotId,
      date: availability.date,
      available: availability.available,
      price: availability.price || undefined,
      maxGuests: availability.maxGuests || undefined,
    };
  } catch (error) {
    console.error("Erreur lors de la récupération de la disponibilité:", error);
    return null;
  }
}

