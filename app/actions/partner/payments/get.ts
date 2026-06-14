"use server";

import { loadPartnerBookings } from "@/lib/api/partner/data";
import { requirePartnerToken } from "@/lib/api/partner/fetch";

export interface PaymentWithDetails {
  id: string;
  bookingId: string;
  amount: number;
  currency: string;
  status: "PENDING" | "COMPLETED" | "FAILED" | "REFUNDED" | "PARTIALLY_REFUNDED";
  method: string | null;
  transactionId: string | null;
  paidAt: Date | null;
  createdAt: Date;
  booking: {
    id: string;
    guestName: string;
    guestEmail: string;
    date: Date;
    hotel: {
      id: string;
      name: string;
    };
    roomType: {
      id: string;
      name: string;
    };
    timeSlot: {
      id: string;
      name: string;
    };
  };
}

function mapBookingToPayment(
  booking: Awaited<ReturnType<typeof loadPartnerBookings>>[number],
  roomTypeName: string,
): PaymentWithDetails {
  const status =
    booking.status === "REFUNDED"
      ? "REFUNDED"
      : booking.status === "PENDING"
        ? "PENDING"
        : "COMPLETED";

  return {
    id: booking.id,
    bookingId: booking.id,
    amount: booking.finalPrice ?? booking.totalPrice,
    currency: booking.currency,
    status,
    method: "card",
    transactionId: booking.id,
    paidAt:
      booking.status === "CONFIRMED" || booking.status === "COMPLETED"
        ? new Date(booking.date)
        : null,
    createdAt: new Date(booking.date),
    booking: {
      id: booking.id,
      guestName: booking.guestName ?? booking.user.name,
      guestEmail: booking.user.email ?? "",
      date: new Date(booking.date),
      hotel: booking.hotel,
      roomType: {
        id: booking.hotelId,
        name: roomTypeName,
      },
      timeSlot: {
        id: booking.timeSlot.id,
        name: booking.timeSlot.label ?? booking.timeSlot.startTime,
      },
    },
  };
}

async function buildPayments(
  hotelId?: string,
): Promise<PaymentWithDetails[]> {
  const token = await requirePartnerToken();
  if (!token) {
    return [];
  }

  const bookings = await loadPartnerBookings(token, hotelId);
  const payments: PaymentWithDetails[] = [];

  for (const booking of bookings) {
    payments.push(mapBookingToPayment(booking, "Chambre"));
  }

  return payments;
}

export async function getPaymentsByHotelId(
  _userId: string,
  hotelId: string,
  filters?: {
    status?: string;
    startDate?: string;
    endDate?: string;
    searchTerm?: string;
  },
): Promise<PaymentWithDetails[]> {
  try {
    let payments = await buildPayments(hotelId);

    if (filters?.status && filters.status !== "all") {
      payments = payments.filter((p) => p.status === filters.status);
    }
    if (filters?.startDate) {
      const start = new Date(filters.startDate);
      payments = payments.filter((p) => p.booking.date >= start);
    }
    if (filters?.endDate) {
      const end = new Date(filters.endDate);
      payments = payments.filter((p) => p.booking.date <= end);
    }
    if (filters?.searchTerm) {
      const term = filters.searchTerm.toLowerCase();
      payments = payments.filter(
        (p) =>
          p.booking.guestName.toLowerCase().includes(term) ||
          p.booking.guestEmail.toLowerCase().includes(term),
      );
    }

    return payments;
  } catch (error) {
    console.error("Error fetching payments by hotel:", error);
    return [];
  }
}

export async function getPaymentsByUserId(
  _userId: string,
): Promise<PaymentWithDetails[]> {
  try {
    return await buildPayments();
  } catch (error) {
    console.error("Error fetching payments:", error);
    return [];
  }
}
