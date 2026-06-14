"use server";

import { loadPartnerBookings } from "@/lib/api/partner/data";
import { requirePartnerToken } from "@/lib/api/partner/fetch";

export interface CheckInOutBooking {
  id: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string | null;
  roomType: {
    id: string;
    name: string;
  };
  hotel: {
    id: string;
    name: string;
  };
  date: Date;
  timeSlot: {
    id: string;
    name: string;
    startTime: string;
    endTime: string;
  };
  status: string;
  guestCount: number;
  finalPrice: number;
  currency: string;
  specialRequests: string | null;
}

function isToday(date: string | Date): boolean {
  const value = new Date(date);
  const today = new Date();
  return value.toDateString() === today.toDateString();
}

async function getTodayBookings(hotelId?: string): Promise<CheckInOutBooking[]> {
  const token = await requirePartnerToken();
  if (!token) {
    return [];
  }

  const bookings = await loadPartnerBookings(token, hotelId);

  return bookings
    .filter((booking) => isToday(booking.date))
    .map((booking) => ({
      id: booking.id,
      guestName: booking.guestName ?? booking.user.name,
      guestEmail: booking.user.email ?? "",
      guestPhone: null,
      roomType: { id: booking.hotelId, name: "Chambre" },
      hotel: booking.hotel,
      date: new Date(booking.date),
      timeSlot: {
        id: booking.timeSlot.id,
        name: booking.timeSlot.label ?? "Créneau",
        startTime: booking.timeSlot.startTime,
        endTime: booking.timeSlot.endTime,
      },
      status: booking.status,
      guestCount: booking.guestCount,
      finalPrice: booking.finalPrice ?? booking.totalPrice,
      currency: booking.currency,
      specialRequests: null,
    }));
}

export async function getTodayCheckIns(
  _userId?: string,
  hotelId?: string,
): Promise<CheckInOutBooking[]> {
  try {
    const bookings = await getTodayBookings(hotelId);
    return bookings.filter(
      (booking) =>
        booking.status === "CONFIRMED" || booking.status === "PENDING",
    );
  } catch (error) {
    console.error("Error fetching today check-ins:", error);
    return [];
  }
}

export async function getTodayCheckOuts(
  _userId?: string,
  hotelId?: string,
): Promise<CheckInOutBooking[]> {
  try {
    const bookings = await getTodayBookings(hotelId);
    return bookings.filter((booking) => booking.status === "COMPLETED");
  } catch (error) {
    console.error("Error fetching today check-outs:", error);
    return [];
  }
}
