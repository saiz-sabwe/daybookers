"use server";

import { loadPartnerBookings } from "@/lib/api/partner/data";
import {
  DEFAULT_COMMISSION_RATE,
  filterBookingsByPeriod,
} from "@/lib/api/partner/mappers";
import { requirePartnerToken } from "@/lib/api/partner/fetch";

export interface PartnerEarnings {
  totalRevenue: number;
  commission: number;
  net: number;
  bookingsCount: number;
  period: string;
}

export async function getPartnerEarnings(
  _userId: string,
  period: "today" | "week" | "month" | "year" | "all" = "all",
): Promise<PartnerEarnings> {
  try {
    const token = await requirePartnerToken();
    if (!token) {
      return {
        totalRevenue: 0,
        commission: 0,
        net: 0,
        bookingsCount: 0,
        period,
      };
    }

    const bookings = await loadPartnerBookings(token);
    const confirmed = filterBookingsByPeriod(
      bookings.filter((b) => b.status === "CONFIRMED" || b.status === "COMPLETED"),
      period,
    );

    const totalRevenue = confirmed.reduce(
      (sum, booking) => sum + (booking.finalPrice ?? booking.totalPrice),
      0,
    );
    const commission = totalRevenue * DEFAULT_COMMISSION_RATE;

    return {
      totalRevenue,
      commission,
      net: totalRevenue - commission,
      bookingsCount: confirmed.length,
      period,
    };
  } catch (error) {
    console.error("Error fetching partner earnings:", error);
    return {
      totalRevenue: 0,
      commission: 0,
      net: 0,
      bookingsCount: 0,
      period,
    };
  }
}
