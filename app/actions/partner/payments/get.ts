"use server";

import db from "@/lib/db";
import { getUserById } from "@/app/actions/users/get";

export interface PaymentWithDetails {
  id: string;
  bookingId: string;
  amount: number;
  currency: string;
  status: "PENDING" | "COMPLETED" | "FAILED" | "REFUNDED" | "PARTIALLY_REFUNDED";
  method: string | null;
  transactionId: string | null;
  paidAt: Date | null;
  createdAt: Date;
  booking: {
    id: string;
    guestName: string;
    guestEmail: string;
    date: Date;
    hotel: {
      id: string;
      name: string;
    };
    roomType: {
      id: string;
      name: string;
    };
    timeSlot: {
      id: string;
      name: string;
    };
  };
}

export async function getPaymentsByHotelId(
  userId: string,
  hotelId: string,
  filters?: {
    status?: string;
    startDate?: string;
    endDate?: string;
    searchTerm?: string;
  }
): Promise<PaymentWithDetails[]> {
  try {
    // Vérifier que l'utilisateur a accès à cet hôtel (manager ou réceptionniste)
    const user = await getUserById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    const whereClause: any = {
      booking: {
        hotelId,
      },
    };

    // Filtrer par statut
    if (filters?.status && filters.status !== "ALL") {
      whereClause.status = filters.status;
    }

    // Filtrer par date
    if (filters?.startDate || filters?.endDate) {
      whereClause.createdAt = {};
      if (filters.startDate) {
        whereClause.createdAt.gte = new Date(filters.startDate);
      }
      if (filters.endDate) {
        whereClause.createdAt.lte = new Date(filters.endDate);
      }
    }

    // Récupérer les paiements
    let payments = await db.payment.findMany({
      where: whereClause,
      include: {
        booking: {
          include: {
            hotel: {
              select: {
                id: true,
                name: true,
              },
            },
            roomType: {
              select: {
                id: true,
                name: true,
              },
            },
            timeSlot: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Filtrer par terme de recherche (nom client ou numéro de réservation)
    if (filters?.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      payments = payments.filter(
        (payment) =>
          payment.booking.guestName.toLowerCase().includes(searchLower) ||
          payment.booking.guestEmail.toLowerCase().includes(searchLower) ||
          payment.bookingId.toLowerCase().includes(searchLower) ||
          payment.transactionId?.toLowerCase().includes(searchLower)
      );
    }

    return payments as PaymentWithDetails[];
  } catch (error) {
    console.error("Error fetching payments:", error);
    return [];
  }
}

export async function getPaymentsByUserId(userId: string): Promise<PaymentWithDetails[]> {
  try {
    // Récupérer tous les hôtels gérés par l'utilisateur
    const user = await getUserById(userId);
    if (!user) {
      return [];
    }

    const isReceptionist = user.roles.includes("ROLE_HOTEL_RECEPTIONIST");
    const isManager = user.roles.includes("ROLE_HOTEL_MANAGER");
    const isGroupManager = user.roles.includes("ROLE_HOTEL_GROUP_MANAGER");

    let hotelIds: string[] = [];

    if (isReceptionist) {
      // Récupérer les hôtels où l'utilisateur est réceptionniste
      const receptionistAssignments = await db.hotelReceptionist.findMany({
        where: { userId: userId },
        select: { hotelId: true },
      });
      hotelIds = receptionistAssignments.map((a) => a.hotelId);
    } else if (isManager) {
      // Récupérer les hôtels où l'utilisateur est manager
      const managerAssignments = await db.hotelManager.findMany({
        where: { userId: userId },
        select: { hotelId: true },
      });
      hotelIds = managerAssignments.map((a) => a.hotelId);
    } else if (isGroupManager) {
      // Récupérer tous les hôtels des groupes gérés par l'utilisateur
      const groupAssignments = await db.hotelGroupManager.findMany({
        where: { userId: userId },
        select: { groupId: true },
      });
      const groupIds = groupAssignments.map((a) => a.groupId);

      const hotels = await db.hotel.findMany({
        where: { groupId: { in: groupIds } },
        select: { id: true },
      });
      hotelIds = hotels.map((h) => h.id);
    }

    if (hotelIds.length === 0) {
      return [];
    }

    // Récupérer les paiements pour ces hôtels
    const payments = await db.payment.findMany({
      where: {
        booking: {
          hotelId: { in: hotelIds },
        },
      },
      include: {
        booking: {
          include: {
            hotel: {
              select: {
                id: true,
                name: true,
              },
            },
            roomType: {
              select: {
                id: true,
                name: true,
              },
            },
            timeSlot: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return payments as PaymentWithDetails[];
  } catch (error) {
    console.error("Error fetching payments:", error);
    return [];
  }
}

