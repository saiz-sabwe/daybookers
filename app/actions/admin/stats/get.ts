"use server";

import {
  buildCommissionRows,
  computeAdminStats,
  filterHotelsBySearch,
  filterUsersByRole,
  mapAdminHotel,
  mapAdminUser,
} from "@/lib/api/admin/mappers";
import {
  loadAllBookings,
  loadAllHotels,
  loadAllOrganizations,
  loadAllProfiles,
} from "@/lib/api/admin/data";
import { requirePartnerToken } from "@/lib/api/partner/fetch";

export interface AdminStats {
  totalHotels: number;
  activeHotels: number;
  totalUsers: number;
  totalBookings: number;
  totalRevenue: number;
  pendingBookings: number;
}

export async function getAdminStats(_userId: string): Promise<AdminStats> {
  try {
    const token = await requirePartnerToken();
    if (!token) {
      return {
        totalHotels: 0,
        activeHotels: 0,
        totalUsers: 0,
        totalBookings: 0,
        totalRevenue: 0,
        pendingBookings: 0,
      };
    }

    const [hotels, profiles, bookings] = await Promise.all([
      loadAllHotels(token),
      loadAllProfiles(token),
      loadAllBookings(token),
    ]);

    return computeAdminStats(hotels, profiles.length, bookings);
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    return {
      totalHotels: 0,
      activeHotels: 0,
      totalUsers: 0,
      totalBookings: 0,
      totalRevenue: 0,
      pendingBookings: 0,
    };
  }
}
