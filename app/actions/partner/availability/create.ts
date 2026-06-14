"use server";

import { pendingMutation } from "@/lib/api/pending-django";

export interface CreateAvailabilityData {
  roomTypeId: string;
  timeSlotId: string;
  date: Date;
  available?: boolean;
  price?: number;
  maxGuests?: number;
}

export async function createAvailability(
  userId: string,
  data: CreateAvailabilityData
): Promise<{ success: boolean; error?: string; availability?: any }> {
  return pendingMutation("partner.availability.create");
}
