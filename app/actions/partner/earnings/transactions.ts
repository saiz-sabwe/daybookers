"use server";

import { loadPartnerBookings } from "@/lib/api/partner/data";
import {
  DEFAULT_COMMISSION_RATE,
  filterBookingsByPeriod,
} from "@/lib/api/partner/mappers";
import { requirePartnerToken } from "@/lib/api/partner/fetch";

export interface TransactionData {
  id: string;
  date: Date;
  hotelName: string;
  roomTypeName: string;
  guestName: string;
  guestEmail: string;
  totalAmount: number;
  commission: number;
  net: number;
  currency: string;
  bookingStatus: string;
  paymentStatus: string | null;
  createdAt: Date;
}

export async function getPartnerTransactions(
  _userId: string,
  period: "today" | "week" | "month" | "year" | "all" = "all",
  page: number = 1,
  pageSize: number = 10,
): Promise<{
  transactions: TransactionData[];
  total: number;
  totalPages: number;
}> {
  try {
    const token = await requirePartnerToken();
    if (!token) {
      return { transactions: [], total: 0, totalPages: 0 };
    }

    const bookings = filterBookingsByPeriod(
      (await loadPartnerBookings(token)).filter(
        (b) => b.status === "CONFIRMED" || b.status === "COMPLETED",
      ),
      period,
    );

    const transactions: TransactionData[] = bookings.map((booking) => {
      const amount = booking.finalPrice ?? booking.totalPrice;
      const commission = amount * DEFAULT_COMMISSION_RATE;
      return {
        id: booking.id,
        date: new Date(booking.date),
        hotelName: booking.hotel.name,
        roomTypeName: "Chambre",
        guestName: booking.guestName ?? booking.user.name,
        guestEmail: booking.user.email ?? "",
        totalAmount: amount,
        commission,
        net: amount - commission,
        currency: booking.currency,
        bookingStatus: booking.status,
        paymentStatus: "COMPLETED",
        createdAt: new Date(booking.date),
      };
    });

    const total = transactions.length;
    const start = (page - 1) * pageSize;

    return {
      transactions: transactions.slice(start, start + pageSize),
      total,
      totalPages: Math.ceil(total / pageSize) || 0,
    };
  } catch (error) {
    console.error("Error fetching partner transactions:", error);
    return { transactions: [], total: 0, totalPages: 0 };
  }
}
