"use server";

import { loadPartnerBookings } from "@/lib/api/partner/data";
import { loadPartnerHotels } from "@/lib/api/partner/data";
import { requirePartnerToken } from "@/lib/api/partner/fetch";

export interface GroupStatistics {
  totalBookings: number;
  totalRevenue: number;
  occupancyRate: number;
  bookingsByPeriod: Array<{
    date: string;
    bookings: number;
    revenue: number;
  }>;
  hotelPerformance: Array<{
    hotelId: string;
    hotelName: string;
    bookings: number;
    revenue: number;
    occupancyRate: number;
  }>;
}

export async function getGroupStatistics(
  _userId: string,
  groupId?: string,
  startDate?: Date,
  endDate?: Date,
): Promise<GroupStatistics | null> {
  try {
    const token = await requirePartnerToken();
    if (!token) {
      return null;
    }

    const [bookings, hotels] = await Promise.all([
      loadPartnerBookings(token),
      loadPartnerHotels(token),
    ]);

    const scopedHotels = groupId
      ? hotels.filter((hotel) => hotel.groupId === groupId)
      : hotels;
    const hotelIds = new Set(scopedHotels.map((hotel) => hotel.id));

    let scopedBookings = bookings.filter((booking) =>
      hotelIds.has(booking.hotelId),
    );

    if (startDate) {
      scopedBookings = scopedBookings.filter(
        (booking) => new Date(booking.date) >= startDate,
      );
    }
    if (endDate) {
      scopedBookings = scopedBookings.filter(
        (booking) => new Date(booking.date) <= endDate,
      );
    }

    const confirmed = scopedBookings.filter(
      (b) => b.status === "CONFIRMED" || b.status === "COMPLETED",
    );
    const totalRevenue = confirmed.reduce(
      (sum, b) => sum + (b.finalPrice ?? b.totalPrice),
      0,
    );

    const byDate = new Map<string, { bookings: number; revenue: number }>();
    for (const booking of scopedBookings) {
      const date = new Date(booking.date).toISOString().slice(0, 10);
      const current = byDate.get(date) ?? { bookings: 0, revenue: 0 };
      current.bookings += 1;
      if (booking.status === "CONFIRMED" || booking.status === "COMPLETED") {
        current.revenue += booking.finalPrice ?? booking.totalPrice;
      }
      byDate.set(date, current);
    }

    const hotelPerformance = scopedHotels.map((hotel) => {
      const hotelBookings = scopedBookings.filter(
        (booking) => booking.hotelId === hotel.id,
      );
      const hotelConfirmed = hotelBookings.filter(
        (b) => b.status === "CONFIRMED" || b.status === "COMPLETED",
      );
      const revenue = hotelConfirmed.reduce(
        (sum, b) => sum + (b.finalPrice ?? b.totalPrice),
        0,
      );
      return {
        hotelId: hotel.id,
        hotelName: hotel.name,
        bookings: hotelBookings.length,
        revenue,
        occupancyRate:
          hotelBookings.length > 0
            ? Math.round((hotelConfirmed.length / hotelBookings.length) * 100)
            : 0,
      };
    });

    return {
      totalBookings: scopedBookings.length,
      totalRevenue,
      occupancyRate:
        scopedBookings.length > 0
          ? Math.round((confirmed.length / scopedBookings.length) * 100)
          : 0,
      bookingsByPeriod: [...byDate.entries()]
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([date, stats]) => ({
          date,
          bookings: stats.bookings,
          revenue: stats.revenue,
        })),
      hotelPerformance,
    };
  } catch (error) {
    console.error("Error fetching group statistics:", error);
    return null;
  }
}
