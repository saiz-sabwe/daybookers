"use server";

import db from "@/lib/db";
import { hasAdminRole } from "@/app/actions/users/get";
import { BookingStatus } from "@/lib/generated/prisma/client";

export interface AdminStats {
  totalHotels: number;
  activeHotels: number;
  totalUsers: number;
  totalBookings: number;
  totalRevenue: number;
  pendingBookings: number;
}

export async function getAdminStats(userId: string): Promise<AdminStats> {
  try {
    // Vérifier que l'utilisateur est admin
    const isAdmin = await hasAdminRole(userId);
    if (!isAdmin) {
      throw new Error("Accès refusé: droits administrateur requis");
    }

    // Récupérer les statistiques
    const [
      totalHotels,
      activeHotels,
      totalUsers,
      totalBookings,
      confirmedBookings,
      pendingBookings,
    ] = await Promise.all([
      db.hotel.count(),
      db.hotel.count({ where: { status: "ACTIVE" } }),
      db.user.count(),
      db.booking.count(),
      db.booking.findMany({
        where: { status: BookingStatus.CONFIRMED },
        select: { finalPrice: true },
      }),
      db.booking.count({ where: { status: BookingStatus.PENDING } }),
    ]);

    const totalRevenue = confirmedBookings.reduce(
      (sum, booking) => sum + booking.finalPrice,
      0
    );

    return {
      totalHotels,
      activeHotels,
      totalUsers,
      totalBookings,
      totalRevenue,
      pendingBookings,
    };
  } catch (error) {
    console.error("Erreur lors de la récupération des statistiques admin:", error);
    throw error;
  }
}

