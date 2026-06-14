"use server";

import {
  djangoFetch,
  djangoFetchPublic,
  DjangoPaginatedResponse,
  DjangoTimeSlotRecord,
} from "@/lib/api/django-client";
import { getServerApiToken } from "@/lib/api/server-auth";

export interface TimeSlot {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
  description: string | null;
}

const DEFAULT_TIME_SLOTS: TimeSlot[] = [
  {
    id: "1",
    name: "Matinée",
    startTime: "08:00:00",
    endTime: "12:00:00",
    description: "Créneau matinal.",
  },
  {
    id: "2",
    name: "Après-midi",
    startTime: "13:00:00",
    endTime: "18:00:00",
    description: "Créneau après-midi.",
  },
];

function mapDjangoTimeSlot(slot: DjangoTimeSlotRecord): TimeSlot {
  return {
    id: slot.uuid,
    name: slot.name,
    startTime: slot.start_time,
    endTime: slot.end_time,
    description: slot.description,
  };
}

function sortTimeSlots(slots: TimeSlot[]): TimeSlot[] {
  return [...slots].sort((a, b) => a.startTime.localeCompare(b.startTime));
}

async function fetchTimeSlotsFromDjango(token?: string): Promise<TimeSlot[]> {
  const path = "/api/hotels/time-slots/";
  const payload = token
    ? await djangoFetch<
        DjangoPaginatedResponse<DjangoTimeSlotRecord> | DjangoTimeSlotRecord[]
      >(path, token)
    : await djangoFetchPublic<
        DjangoPaginatedResponse<DjangoTimeSlotRecord> | DjangoTimeSlotRecord[]
      >(path);

  const records = Array.isArray(payload) ? payload : payload.results;
  return sortTimeSlots(records.map(mapDjangoTimeSlot));
}

export async function getTimeSlots(): Promise<TimeSlot[]> {
  try {
    let token: string | undefined;
    try {
      token = await getServerApiToken();
    } catch {
      token = undefined;
    }
    return await fetchTimeSlotsFromDjango(token);
  } catch (error) {
    console.error("Error fetching time slots from Django:", error);
    return DEFAULT_TIME_SLOTS;
  }
}

export async function getTimeSlotById(id: string): Promise<TimeSlot | null> {
  try {
    let token: string | undefined;
    try {
      token = await getServerApiToken();
    } catch {
      token = undefined;
    }
    const path = `/api/hotels/time-slots/${id}/`;
    const slot = token
      ? await djangoFetch<DjangoTimeSlotRecord>(path, token)
      : await djangoFetchPublic<DjangoTimeSlotRecord>(path);
    return mapDjangoTimeSlot(slot);
  } catch (error) {
    console.error("Error fetching time slot from Django:", error);
    return DEFAULT_TIME_SLOTS.find((slot) => slot.id === id) ?? null;
  }
}
