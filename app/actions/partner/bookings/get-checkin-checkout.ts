"use server";

import db from "@/lib/db";
import { startOfDay, endOfDay, addDays } from "date-fns";
import { getUserById } from "@/app/actions/users/get";

export interface CheckInOutBooking {
  id: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string | null;
  roomType: {
    id: string;
    name: string;
  };
  hotel: {
    id: string;
    name: string;
  };
  date: Date;
  timeSlot: {
    id: string;
    name: string;
    startTime: string;
    endTime: string;
  };
  status: string;
  guestCount: number;
  finalPrice: number;
  currency: string;
  specialRequests: string | null;
}

export async function getTodayCheckIns(
  userId?: string,
  hotelId?: string
): Promise<CheckInOutBooking[]> {
  try {
    const today = new Date();
    const startDay = startOfDay(today);
    const endDay = endOfDay(today);

    const where: any = {
      date: {
        gte: startDay,
        lte: endDay,
      },
      status: {
        in: ["PENDING", "CONFIRMED"],
      },
    };

    // Si un userId est fourni, filtrer par hôtels accessibles
    if (userId && !hotelId) {
      const user = await getUserById(userId);
      if (user) {
        const isReceptionist = user.roles.includes("ROLE_HOTEL_RECEPTIONIST");
        const isManager = user.roles.includes("ROLE_HOTEL_MANAGER");
        const isGroupManager = user.roles.includes("ROLE_HOTEL_GROUP_MANAGER");

        let accessibleHotelIds: string[] = [];

        if (isReceptionist) {
          const receptionistAssignments = await db.hotelReceptionist.findMany({
            where: { userId: userId },
            select: { hotelId: true },
          });
          accessibleHotelIds = receptionistAssignments.map((a) => a.hotelId);
        } else if (isManager) {
          const managerAssignments = await db.hotelManager.findMany({
            where: { userId: userId },
            select: { hotelId: true },
          });
          accessibleHotelIds = managerAssignments.map((a) => a.hotelId);
        } else if (isGroupManager) {
          const groupAssignments = await db.hotelGroupManager.findMany({
            where: { userId: userId },
            select: { groupId: true },
          });
          const groupIds = groupAssignments.map((a) => a.groupId);
          const hotels = await db.hotel.findMany({
            where: { groupId: { in: groupIds } },
            select: { id: true },
          });
          accessibleHotelIds = hotels.map((h) => h.id);
        }

        if (accessibleHotelIds.length > 0) {
          where.hotelId = { in: accessibleHotelIds };
        } else {
          // Si l'utilisateur n'a accès à aucun hôtel, retourner un tableau vide
          return [];
        }
      }
    } else if (hotelId) {
      where.hotelId = hotelId;
    }

    const bookings = await db.booking.findMany({
      where,
      include: {
        roomType: {
          select: {
            id: true,
            name: true,
          },
        },
        hotel: {
          select: {
            id: true,
            name: true,
          },
        },
        timeSlot: {
          select: {
            id: true,
            name: true,
            startTime: true,
            endTime: true,
          },
        },
      },
      orderBy: {
        date: "asc",
      },
    });

    return bookings.map((booking) => ({
      id: booking.id,
      guestName: booking.guestName,
      guestEmail: booking.guestEmail,
      guestPhone: booking.guestPhone,
      roomType: booking.roomType,
      hotel: booking.hotel,
      date: booking.date,
      timeSlot: booking.timeSlot,
      status: booking.status,
      guestCount: booking.guestCount,
      finalPrice: booking.finalPrice,
      currency: booking.currency,
      specialRequests: booking.specialRequests,
    }));
  } catch (error) {
    console.error("Error fetching today check-ins:", error);
    return [];
  }
}

export async function getTodayCheckOuts(
  userId?: string,
  hotelId?: string
): Promise<CheckInOutBooking[]> {
  try {
    const today = new Date();
    const yesterday = addDays(today, -1);
    const startYesterday = startOfDay(yesterday);
    const endToday = endOfDay(today);

    const where: any = {
      date: {
        gte: startYesterday,
        lte: endToday,
      },
      status: "COMPLETED", // Seules les réservations check-in peuvent être check-out
    };

    // Si un userId est fourni, filtrer par hôtels accessibles
    if (userId && !hotelId) {
      const user = await getUserById(userId);
      if (user) {
        const isReceptionist = user.roles.includes("ROLE_HOTEL_RECEPTIONIST");
        const isManager = user.roles.includes("ROLE_HOTEL_MANAGER");
        const isGroupManager = user.roles.includes("ROLE_HOTEL_GROUP_MANAGER");

        let accessibleHotelIds: string[] = [];

        if (isReceptionist) {
          const receptionistAssignments = await db.hotelReceptionist.findMany({
            where: { userId: userId },
            select: { hotelId: true },
          });
          accessibleHotelIds = receptionistAssignments.map((a) => a.hotelId);
        } else if (isManager) {
          const managerAssignments = await db.hotelManager.findMany({
            where: { userId: userId },
            select: { hotelId: true },
          });
          accessibleHotelIds = managerAssignments.map((a) => a.hotelId);
        } else if (isGroupManager) {
          const groupAssignments = await db.hotelGroupManager.findMany({
            where: { userId: userId },
            select: { groupId: true },
          });
          const groupIds = groupAssignments.map((a) => a.groupId);
          const hotels = await db.hotel.findMany({
            where: { groupId: { in: groupIds } },
            select: { id: true },
          });
          accessibleHotelIds = hotels.map((h) => h.id);
        }

        if (accessibleHotelIds.length > 0) {
          where.hotelId = { in: accessibleHotelIds };
        } else {
          // Si l'utilisateur n'a accès à aucun hôtel, retourner un tableau vide
          return [];
        }
      }
    } else if (hotelId) {
      where.hotelId = hotelId;
    }

    const bookings = await db.booking.findMany({
      where,
      include: {
        roomType: {
          select: {
            id: true,
            name: true,
          },
        },
        hotel: {
          select: {
            id: true,
            name: true,
          },
        },
        timeSlot: {
          select: {
            id: true,
            name: true,
            startTime: true,
            endTime: true,
          },
        },
      },
      orderBy: {
        date: "asc",
      },
    });

    return bookings.map((booking) => ({
      id: booking.id,
      guestName: booking.guestName,
      guestEmail: booking.guestEmail,
      guestPhone: booking.guestPhone,
      roomType: booking.roomType,
      hotel: booking.hotel,
      date: booking.date,
      timeSlot: booking.timeSlot,
      status: booking.status,
      guestCount: booking.guestCount,
      finalPrice: booking.finalPrice,
      currency: booking.currency,
      specialRequests: booking.specialRequests,
    }));
  } catch (error) {
    console.error("Error fetching today check-outs:", error);
    return [];
  }
}

