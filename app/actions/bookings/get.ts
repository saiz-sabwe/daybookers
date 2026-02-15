"use server";

import db from "@/lib/db";
import { Booking } from "@/types";

export async function getBookings(userId?: string): Promise<Booking[]> {
  try {
    const bookings = await db.booking.findMany({
      where: userId ? { userId } : undefined,
      include: {
        hotel: {
          include: {
            city: true,
          },
        },
        timeSlot: true,
        user: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return bookings.map((booking) => {
      return {
        id: booking.id,
        hotelId: booking.hotelId,
        userId: booking.userId,
        date: booking.date,
        timeSlot: {
          id: booking.timeSlot.id,
          label: booking.timeSlot.name,
          startTime: booking.timeSlot.startTime,
          endTime: booking.timeSlot.endTime,
        },
        guestCount: {
          adults: booking.guestCount,
          children: 0, // Pas de distinction dans le schéma actuel
        },
        totalPrice: booking.finalPrice,
        currency: booking.currency,
        status: booking.status as Booking["status"], // Garder le statut en majuscules
        createdAt: booking.createdAt,
        updatedAt: booking.updatedAt,
      } satisfies Booking;
    });
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return [];
  }
}

export async function getBookingById(id: string): Promise<Booking | null> {
  try {
    const booking = await db.booking.findUnique({
      where: {
        id,
      },
      include: {
        hotel: {
          include: {
            city: true,
          },
        },
        timeSlot: true,
        user: true,
      },
    });

    if (!booking) {
      return null;
    }

    return {
      id: booking.id,
      hotelId: booking.hotelId,
      userId: booking.userId,
      date: booking.date,
      timeSlot: {
        id: booking.timeSlot.id,
        label: booking.timeSlot.name,
        startTime: booking.timeSlot.startTime,
        endTime: booking.timeSlot.endTime,
      },
      guestCount: {
        adults: booking.guestCount,
        children: 0,
      },
      totalPrice: booking.finalPrice,
      currency: booking.currency,
      status: booking.status as Booking["status"], // Garder le statut en majuscules
      createdAt: booking.createdAt,
      updatedAt: booking.updatedAt,
    } satisfies Booking;
  } catch (error) {
    console.error("Error fetching booking:", error);
    return null;
  }
}

export async function getBookingsByHotelId(hotelId: string): Promise<Booking[]> {
  try {
    const bookings = await db.booking.findMany({
      where: {
        hotelId,
      },
      include: {
        hotel: {
          include: {
            city: true,
          },
        },
        timeSlot: true,
        user: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return bookings.map((booking) => ({
      id: booking.id,
      hotelId: booking.hotelId,
      userId: booking.userId,
      date: booking.date,
      timeSlot: {
        id: booking.timeSlot.id,
        label: booking.timeSlot.name,
        startTime: booking.timeSlot.startTime,
        endTime: booking.timeSlot.endTime,
      },
      guestCount: {
        adults: booking.guestCount,
        children: 0,
      },
      totalPrice: booking.finalPrice,
      currency: booking.currency,
      status: booking.status as Booking["status"], // Garder le statut en majuscules
      createdAt: booking.createdAt,
      updatedAt: booking.updatedAt,
    })) satisfies Booking[];
  } catch (error) {
    console.error("Error fetching bookings by hotel:", error);
    return [];
  }
}

