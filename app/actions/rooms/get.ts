"use server";

import {
  djangoFetch,
  djangoFetchPublic,
  DjangoPaginatedResponse,
  DjangoRoomTypeRecord,
} from "@/lib/api/django-client";
import { getServerApiToken } from "@/lib/api/server-auth";
import { resolveHotelImages } from "@/lib/images/hotel-image";
import { getTimeSlots, TimeSlot } from "@/app/actions/time-slots/get";

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

function normalizeImages(images: unknown): string[] {
  if (Array.isArray(images)) {
    return images.filter((item): item is string => typeof item === "string");
  }
  if (typeof images === "string" && images.trim()) {
    return images.split(/\s+/);
  }
  return [];
}

function mapTimeSlots(timeSlots: TimeSlot[]) {
  return timeSlots.map((slot) => ({
    id: slot.id,
    name: slot.name,
    startTime: slot.startTime,
    endTime: slot.endTime,
  }));
}

function mapDjangoRoomType(
  room: DjangoRoomTypeRecord,
  hotelId: string,
  timeSlots: TimeSlot[],
): RoomTypeWithAvailability {
  return {
    id: room.uuid,
    name: room.name,
    description: room.description,
    maxGuests: room.max_guests,
    basePrice: Number(room.base_price),
    currency: room.currency,
    images: resolveHotelImages(normalizeImages(room.images)),
    hotelId,
    timeSlots: mapTimeSlots(timeSlots),
  };
}

async function fetchRoomTypesFromDjango(
  hotelId: string,
  token?: string,
): Promise<DjangoRoomTypeRecord[]> {
  const path = `/api/hotels/rooms/?hotel=${encodeURIComponent(hotelId)}`;
  const payload = token
    ? await djangoFetch<
        DjangoPaginatedResponse<DjangoRoomTypeRecord> | DjangoRoomTypeRecord[]
      >(path, token)
    : await djangoFetchPublic<
        DjangoPaginatedResponse<DjangoRoomTypeRecord> | DjangoRoomTypeRecord[]
      >(path);

  const records = Array.isArray(payload) ? payload : payload.results;
  return [...records].sort(
    (a, b) => Number(a.base_price) - Number(b.base_price),
  );
}

export async function getRoomTypesByHotelId(
  hotelId: string,
): Promise<RoomTypeWithAvailability[]> {
  try {
    const token = await getServerApiToken();
    const [roomTypes, timeSlots] = await Promise.all([
      fetchRoomTypesFromDjango(hotelId, token ?? undefined),
      getTimeSlots(),
    ]);

    return roomTypes.map((room) => mapDjangoRoomType(room, hotelId, timeSlots));
  } catch (error) {
    console.error("Error fetching room types from Django:", error);
    return [];
  }
}

export async function getRoomTypeById(id: string) {
  try {
    const token = await getServerApiToken();
    const path = `/api/hotels/rooms/${id}/`;
    const room = token
      ? await djangoFetch<DjangoRoomTypeRecord>(path, token)
      : await djangoFetchPublic<DjangoRoomTypeRecord>(path);

    return {
      id: room.uuid,
      name: room.name,
      description: room.description,
      maxGuests: room.max_guests,
      basePrice: Number(room.base_price),
      currency: room.currency,
      images: resolveHotelImages(normalizeImages(room.images)),
      hotelId: room.hotel,
    };
  } catch (error) {
    console.error("Error fetching room type from Django:", error);
    return null;
  }
}
