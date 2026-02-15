"use server";

import db from "@/lib/db";
import { getUserById } from "@/app/actions/users/get";

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
  try {
    // Vérifier que l'utilisateur est gestionnaire de groupe
    const user = await getUserById(userId);
    if (!user) {
      return null;
    }

    const isGroupManager = user.roles.includes("ROLE_HOTEL_GROUP_MANAGER");
    if (!isGroupManager) {
      return null;
    }

    // Déterminer les hôtels à inclure
    let hotelIds: string[] = [];

    if (groupId) {
      // Vérifier que l'utilisateur gère ce groupe
      const isManagerOfGroup = await db.hotelGroupManager.findFirst({
        where: {
          groupId,
          userId: userId,
        },
      });

      if (!isManagerOfGroup) {
        return null;
      }

      // Récupérer les hôtels du groupe
      const hotels = await db.hotel.findMany({
        where: { groupId },
        select: { id: true },
      });
      hotelIds = hotels.map((h) => h.id);
    } else {
      // Récupérer tous les hôtels gérés par l'utilisateur
      const groupManagers = await db.hotelGroupManager.findMany({
        where: { userId: userId },
        select: { groupId: true },
      });
      const groupIds = groupManagers.map((gm) => gm.groupId);

      const hotels = await db.hotel.findMany({
        where: { groupId: { in: groupIds } },
        select: { id: true },
      });
      hotelIds = hotels.map((h) => h.id);
    }

    if (hotelIds.length === 0) {
      return {
        totalBookings: 0,
        totalRevenue: 0,
        occupancyRate: 0,
        bookingsByPeriod: [],
        hotelPerformance: [],
      };
    }

    // Construire la requête de filtrage par date
    const dateFilter: any = {
      hotelId: { in: hotelIds },
    };

    if (startDate || endDate) {
      dateFilter.date = {};
      if (startDate) {
        dateFilter.date.gte = startDate;
      }
      if (endDate) {
        dateFilter.date.lte = endDate;
      }
    }

    // Récupérer les réservations
    const bookings = await db.booking.findMany({
      where: dateFilter,
      include: {
        hotel: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    // Calculer les statistiques globales
    const totalBookings = bookings.length;
    const totalRevenue = bookings.reduce((sum, b) => sum + b.finalPrice, 0);

    // Calculer les réservations par période (par jour)
    const bookingsByDate = bookings.reduce((acc, booking) => {
      const dateKey = booking.date.toISOString().split("T")[0];
      if (!acc[dateKey]) {
        acc[dateKey] = { bookings: 0, revenue: 0 };
      }
      acc[dateKey].bookings++;
      acc[dateKey].revenue += booking.finalPrice;
      return acc;
    }, {} as Record<string, { bookings: number; revenue: number }>);

    const bookingsByPeriod = Object.entries(bookingsByDate)
      .map(([date, data]) => ({
        date,
        bookings: data.bookings,
        revenue: data.revenue,
      }))
      .sort((a, b) => a.date.localeCompare(b.date));

    // Calculer les performances par hôtel
    const hotelPerformanceMap = bookings.reduce((acc, booking) => {
      const hotelId = booking.hotelId;
      if (!acc[hotelId]) {
        acc[hotelId] = {
          hotelId,
          hotelName: booking.hotel.name,
          bookings: 0,
          revenue: 0,
        };
      }
      acc[hotelId].bookings++;
      acc[hotelId].revenue += booking.finalPrice;
      return acc;
    }, {} as Record<string, { hotelId: string; hotelName: string; bookings: number; revenue: number }>);

    const hotelPerformance = Object.values(hotelPerformanceMap).map((hp) => ({
      ...hp,
      occupancyRate: 0, // TODO: Calculer le taux d'occupation réel
    }));

    return {
      totalBookings,
      totalRevenue,
      occupancyRate: 0, // TODO: Calculer le taux d'occupation global
      bookingsByPeriod,
      hotelPerformance,
    };
  } catch (error) {
    console.error("Error fetching group statistics:", error);
    return null;
  }
}

