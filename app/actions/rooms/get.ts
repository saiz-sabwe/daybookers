"use server";

import db from "@/lib/db";

export interface RoomTypeWithAvailability {
  id: string;
  name: string;
  description: string | null;
  maxGuests: number;
  basePrice: number;
  currency: string;
  images: string[];
  hotelId: string;
  timeSlots: {
    id: string;
    name: string;
    startTime: string;
    endTime: string;
    price?: number;
  }[];
}

export async function getRoomTypesByHotelId(hotelId: string): Promise<RoomTypeWithAvailability[]> {
  try {
    const roomTypes = await db.roomType.findMany({
      where: {
        hotelId,
      },
      include: {
        hotel: true,
      },
      orderBy: {
        basePrice: "asc",
      },
    });

    // Récupérer tous les time slots disponibles
    const timeSlots = await db.timeSlot.findMany({
      orderBy: {
        startTime: "asc",
      },
    });

    // Mapper les room types avec leurs time slots
    return roomTypes.map((roomType) => ({
      id: roomType.id,
      name: roomType.name,
      description: roomType.description,
      maxGuests: roomType.maxGuests,
      basePrice: roomType.basePrice,
      currency: roomType.currency,
      images: roomType.images || [],
      hotelId: roomType.hotelId,
      timeSlots: timeSlots.map((slot) => ({
        id: slot.id,
        name: slot.name,
        startTime: slot.startTime,
        endTime: slot.endTime,
      })),
    }));
  } catch (error) {
    console.error("Error fetching room types:", error);
    return [];
  }
}

export async function getRoomTypeById(id: string) {
  try {
    const roomType = await db.roomType.findUnique({
      where: { id },
      include: {
        hotel: true,
      },
    });

    if (!roomType) {
      return null;
    }

    return {
      id: roomType.id,
      name: roomType.name,
      description: roomType.description,
      maxGuests: roomType.maxGuests,
      basePrice: roomType.basePrice,
      currency: roomType.currency,
      images: roomType.images || [],
      hotelId: roomType.hotelId,
    };
  } catch (error) {
    console.error("Error fetching room type:", error);
    return null;
  }
}

