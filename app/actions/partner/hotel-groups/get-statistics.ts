"use server";

import { pendingDjango } from "@/lib/api/pending-django";

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
  userId: string,
  groupId?: string,
  startDate?: Date,
  endDate?: Date
): Promise<GroupStatistics | null> {
  return pendingDjango(null, "partner.hotelGroups.getStatistics");
}
