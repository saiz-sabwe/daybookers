"use server";

import { djangoFetch } from "@/lib/api/django-client";
import { getServerApiToken } from "@/lib/api/server-auth";

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

interface DjangoBookingRecord {
  uuid: string;
}

export async function createBooking(
  data: CreateBookingData,
): Promise<{ success: boolean; bookingId?: string; error?: string }> {
  try {
    const token = await getServerApiToken();
    if (!token) {
      return {
        success: false,
        error: "Vous devez être connecté pour réserver",
      };
    }

    const guestName = `${data.guestInfo.firstName} ${data.guestInfo.lastName}`;
    const guestCount = data.guestCount.adults + data.guestCount.children;

    const booking = await djangoFetch<DjangoBookingRecord>(
      "/api/hotels/bookings/",
      token,
      {
        method: "POST",
        body: JSON.stringify({
          hotel: data.hotelId,
          room_type: data.roomTypeId,
          time_slot: data.timeSlotId,
          date: data.date,
          guest_count: guestCount,
          guest_name: guestName,
          guest_email: data.guestInfo.email,
          guest_phone: data.guestInfo.phone || null,
          special_requests: data.specialRequests || null,
        }),
      },
    );

    return {
      success: true,
      bookingId: booking.uuid,
    };
  } catch (error) {
    console.error("Erreur lors de la création de la réservation:", error);
    const message =
      error instanceof Error ? error.message : "Une erreur est survenue lors de la création de la réservation";
    return {
      success: false,
      error: message,
    };
  }
}
