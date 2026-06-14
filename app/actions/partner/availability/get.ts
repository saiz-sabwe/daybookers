"use server";

import { pendingDjango } from "@/lib/api/pending-django";

export interface AvailabilityData {
  id: string;
  roomTypeId: string;
  timeSlotId: string;
  date: Date;
  available: boolean;
  price?: number;
  maxGuests?: number;
}

export async function getAvailabilities(
  hotelId: string,
  roomTypeId: string,
  startDate: Date,
  endDate: Date,
  userId: string
): Promise<AvailabilityData[]> {
  return pendingDjango([], "partner.availability.get");
}

export async function getAvailabilityByDate(
  roomTypeId: string,
  timeSlotId: string,
  date: Date,
  userId: string
): Promise<AvailabilityData | null> {
  return pendingDjango(null, "partner.availability.getByDate");
}
