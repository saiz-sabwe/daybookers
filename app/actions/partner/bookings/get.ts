"use server";

import db from "@/lib/db";
import { Booking } from "@/types";
import { getPartnerHotels } from "@/app/actions/partner/hotels/get";

export async function getPartnerBookings(userId: string): Promise<Booking[]> {
  try {
    // Récupérer les hôtels gérés par le partenaire
    const partnerHotels = await getPartnerHotels(userId);
    const hotelIds = partnerHotels.map((hotel) => hotel.id);

    if (hotelIds.length === 0) {
      return [];
    }

    // Récupérer toutes les réservations pour ces hôtels
    const bookings = await db.booking.findMany({
      where: {
        hotelId: {
          in: hotelIds,
        },
      },
      include: {
        hotel: {
          include: {
            city: true,
          },
        },
        timeSlot: true,
        user: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Mapper le statut Prisma vers le format attendu
    const statusMap: Record<string, "confirmed" | "pending" | "cancelled" | "completed"> = {
      CONFIRMED: "confirmed",
      PENDING: "pending",
      CANCELLED: "cancelled",
      COMPLETED: "completed",
      REFUNDED: "cancelled", // REFUNDED est traité comme cancelled
    };

    return bookings.map((booking) => ({
      id: booking.id,
      userId: booking.userId,
      hotelId: booking.hotelId,
      roomTypeId: booking.roomTypeId,
      date: booking.date.toISOString(),
      timeSlotId: booking.timeSlotId,
      guestCount: booking.guestCount,
      status: statusMap[booking.status] || "pending",
      originalPrice: booking.originalPrice,
      discountAmount: booking.discountAmount,
      finalPrice: booking.finalPrice,
      totalPrice: booking.finalPrice, // Alias pour compatibilité
      currency: booking.currency,
      guestName: booking.guestName,
      guestEmail: booking.guestEmail,
      guestPhone: booking.guestPhone || undefined,
      specialRequests: booking.specialRequests || undefined,
      hotel: {
        id: booking.hotel.id,
        name: booking.hotel.name,
        slug: booking.hotel.slug,
        description: booking.hotel.description || undefined,
        address: booking.hotel.address,
        city: booking.hotel.city.name,
        country: booking.hotel.city.country,
        latitude: booking.hotel.latitude || undefined,
        longitude: booking.hotel.longitude || undefined,
        phone: booking.hotel.phone || undefined,
        email: booking.hotel.email || undefined,
        website: booking.hotel.website || undefined,
        stars: booking.hotel.stars,
        status: booking.hotel.status,
        images: booking.hotel.images,
        amenities: [],
        minPrice: 0,
        currency: "USD",
      },
      timeSlot: {
        id: booking.timeSlot.id,
        startTime: booking.timeSlot.startTime,
        endTime: booking.timeSlot.endTime,
        label: booking.timeSlot.label || undefined,
      },
      user: {
        id: booking.user.id,
        name: booking.user.name,
        email: booking.user.email,
        image: booking.user.image || undefined,
      },
    }));
  } catch (error) {
    console.error("Erreur lors de la récupération des réservations du partenaire:", error);
    return [];
  }
}

