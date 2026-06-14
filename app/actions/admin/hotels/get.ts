"use server";

import { pendingDjango } from "@/lib/api/pending-django";

export interface GetAllHotelsParams {
  status?: string;
  search?: string;
  page?: number;
  pageSize?: number;
}

export interface HotelListItem {
  id: string;
  name: string;
  address: string;
  status: string;
  stars: number;
  createdAt: Date;
  cityId: string | null;
}

export async function getAllHotels(
  userId: string,
  params: GetAllHotelsParams = {}
): Promise<{
  hotels: HotelListItem[];
  total: number;
  totalPages: number;
}> {
  return pendingDjango({ hotels: [], total: 0, totalPages: 0 }, "admin.hotels.getAll");
}
