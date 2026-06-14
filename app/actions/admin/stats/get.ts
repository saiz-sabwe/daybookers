"use server";

import { pendingDjango } from "@/lib/api/pending-django";

export interface AdminStats {
  totalHotels: number;
  activeHotels: number;
  totalUsers: number;
  totalBookings: number;
  totalRevenue: number;
  pendingBookings: number;
}

export async function getAdminStats(userId: string): Promise<AdminStats> {
  return pendingDjango(
    {
      totalHotels: 0,
      activeHotels: 0,
      totalUsers: 0,
      totalBookings: 0,
      totalRevenue: 0,
      pendingBookings: 0,
    },
    "admin.stats.get"
  );
}
