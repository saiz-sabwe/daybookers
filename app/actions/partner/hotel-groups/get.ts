"use server";

import { pendingDjango } from "@/lib/api/pending-django";

export interface HotelGroupData {
  id: string;
  name: string;
  description: string | null;
  createdAt: Date;
  _count?: {
    hotels: number;
  };
}

export async function getHotelGroupsByManager(userId: string): Promise<HotelGroupData[]> {
  return pendingDjango([], "partner.hotelGroups.get");
}
