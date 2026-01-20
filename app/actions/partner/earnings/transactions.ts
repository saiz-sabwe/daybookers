"use server";

import db from "@/lib/db";
import { getPartnerHotels } from "@/app/actions/partner/hotels/get";
import { BookingStatus } from "@/lib/generated/prisma/client";

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
  userId: string,
  period: "today" | "week" | "month" | "year" | "all" = "all",
  page: number = 1,
  pageSize: number = 10
): Promise<{
  transactions: TransactionData[];
  total: number;
  totalPages: number;
}> {
  try {
    // Récupérer les hôtels du partenaire
    const partnerHotels = await getPartnerHotels(userId);
    const hotelIds = partnerHotels.map((hotel) => hotel.id);

    if (hotelIds.length === 0) {
      return {
        transactions: [],
        total: 0,
        totalPages: 0,
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

    // Construire la clause WHERE
    const whereClause: any = {
      hotelId: { in: hotelIds },
      status: BookingStatus.CONFIRMED,
    };

    if (startDate) {
      whereClause.createdAt = { gte: startDate };
    }

    // Récupérer le taux de commission
    const partnerSettings = await db.partnerSettings.findUnique({
      where: { partnerId: userId },
      select: { commissionRate: true },
    });

    const commissionRate = partnerSettings?.commissionRate || 0.1;

    // Compter le total
    const total = await db.booking.count({
      where: whereClause,
    });

    // Récupérer les réservations avec pagination
    const bookings = await db.booking.findMany({
      where: whereClause,
      include: {
        hotel: {
          select: {
            name: true,
          },
        },
        roomType: {
          select: {
            name: true,
          },
        },
        payment: {
          select: {
            status: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    // Transformer les données
    const transactions: TransactionData[] = bookings.map((booking) => {
      const commission = booking.finalPrice * commissionRate;
      const net = booking.finalPrice - commission;

      return {
        id: booking.id,
        date: booking.date,
        hotelName: booking.hotel.name,
        roomTypeName: booking.roomType.name,
        guestName: booking.guestName,
        guestEmail: booking.guestEmail,
        totalAmount: booking.finalPrice,
        commission,
        net,
        currency: booking.currency,
        bookingStatus: booking.status,
        paymentStatus: booking.payment?.status || null,
        createdAt: booking.createdAt,
      };
    });

    const totalPages = Math.ceil(total / pageSize);

    return {
      transactions,
      total,
      totalPages,
    };
  } catch (error) {
    console.error("Erreur lors de la récupération des transactions:", error);
    return {
      transactions: [],
      total: 0,
      totalPages: 0,
    };
  }
}

