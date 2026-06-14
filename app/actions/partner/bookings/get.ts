"use server";

import { loadPartnerBookings } from "@/lib/api/partner/data";
import { requirePartnerToken } from "@/lib/api/partner/fetch";

export interface PartnerBooking {
  id: string;
  hotelId: string;
  userId: string;
  date: string | Date;
  guestName?: string;
  guestCount: number;
  totalPrice: number;
  finalPrice?: number;
  currency: string;
  status: string;
  hotel: {
    id: string;
    name: string;
  };
  user: {
    id: string;
    name: string;
    email?: string;
  };
  timeSlot: {
    id: string;
    label?: string;
    startTime: string;
    endTime: string;
  };
}

export async function getPartnerBookings(
  _userId: string,
  hotelId?: string,
): Promise<PartnerBooking[]> {
  try {
    const token = await requirePartnerToken();
    if (!token) {
      return [];
    }
    return await loadPartnerBookings(token, hotelId);
  } catch (error) {
    console.error("Error fetching partner bookings:", error);
    return [];
  }
}
