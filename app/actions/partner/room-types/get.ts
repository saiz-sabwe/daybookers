"use server";

import { getRoomTypesByHotelId } from "@/app/actions/rooms/get";

export async function getRoomTypesByHotel(
  hotelId: string,
  _userId: string,
): Promise<Awaited<ReturnType<typeof getRoomTypesByHotelId>>> {
  try {
    return await getRoomTypesByHotelId(hotelId);
  } catch (error) {
    console.error("Error fetching partner room types:", error);
    return [];
  }
}
