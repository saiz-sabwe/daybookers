"use server";

import { pendingDjango } from "@/lib/api/pending-django";

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

export async function getPaymentsByHotelId(
  userId: string,
  hotelId: string,
  filters?: {
    status?: string;
    startDate?: string;
    endDate?: string;
    searchTerm?: string;
  }
): Promise<PaymentWithDetails[]> {
  return pendingDjango([], "partner.payments.getByHotel");
}

export async function getPaymentsByUserId(userId: string): Promise<PaymentWithDetails[]> {
  return pendingDjango([], "partner.payments.getByUser");
}
