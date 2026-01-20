"use server";

import db from "@/lib/db";
import { getPartnerHotels } from "@/app/actions/partner/hotels/get";
import { BookingStatus } from "@/lib/generated/prisma/client";

export interface PartnerEarnings {
  totalRevenue: number;
  commission: number;
  net: number;
  bookingsCount: number;
  period: string;
}

export async function getPartnerEarnings(
  userId: string,
  period: "today" | "week" | "month" | "year" | "all" = "all"
): Promise<PartnerEarnings> {
  try {
    // Récupérer les hôtels du partenaire
    const partnerHotels = await getPartnerHotels(userId);
    const hotelIds = partnerHotels.map((hotel) => hotel.id);

    if (hotelIds.length === 0) {
      return {
        totalRevenue: 0,
        commission: 0,
        net: 0,
        bookingsCount: 0,
        period,
      };
    }

    // Calculer les dates de la période
    const now = new Date();
    let startDate: Date | null = null;

    switch (period) {
      case "today":
        startDate = new Date(now);
        startDate.setHours(0, 0, 0, 0);
        break;
      case "week":
        startDate = new Date(now);
        startDate.setDate(now.getDate() - 7);
        break;
      case "month":
        startDate = new Date(now);
        startDate.setMonth(now.getMonth() - 1);
        break;
      case "year":
        startDate = new Date(now);
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        startDate = null;
    }

    // Récupérer les réservations confirmées
    const whereClause: any = {
      hotelId: { in: hotelIds },
      status: BookingStatus.CONFIRMED,
    };

    if (startDate) {
      whereClause.createdAt = { gte: startDate };
    }

    const bookings = await db.booking.findMany({
      where: whereClause,
      select: {
        finalPrice: true,
        currency: true,
      },
    });

    // Calculer le chiffre d'affaires total
    const totalRevenue = bookings.reduce((sum, booking) => sum + booking.finalPrice, 0);

    // Récupérer le taux de commission (par défaut 10%)
    const partnerSettings = await db.partnerSettings.findUnique({
      where: { partnerId: userId },
      select: { commissionRate: true },
    });

    const commissionRate = partnerSettings?.commissionRate || 0.1;
    const commission = totalRevenue * commissionRate;
    const net = totalRevenue - commission;

    return {
      totalRevenue,
      commission,
      net,
      bookingsCount: bookings.length,
      period,
    };
  } catch (error) {
    console.error("Erreur lors du calcul des revenus:", error);
    return {
      totalRevenue: 0,
      commission: 0,
      net: 0,
      bookingsCount: 0,
      period,
    };
  }
}

