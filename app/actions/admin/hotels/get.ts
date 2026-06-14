"use server";

import {
  filterHotelsBySearch,
  mapAdminHotel,
} from "@/lib/api/admin/mappers";
import {
  fetchPartnerPage,
  requirePartnerToken,
} from "@/lib/api/partner/fetch";
import { DjangoHotelRecord } from "@/lib/api/django-client";

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
  _userId: string,
  params: GetAllHotelsParams = {},
): Promise<{
  hotels: HotelListItem[];
  total: number;
  totalPages: number;
}> {
  try {
    const token = await requirePartnerToken();
    if (!token) {
      return { hotels: [], total: 0, totalPages: 0 };
    }

    const pageSize = params.pageSize ?? 10;
    const page = params.page ?? 1;

    const { results, total, totalPages } = await fetchPartnerPage<DjangoHotelRecord>(
      token,
      "/api/hotels/hotels/",
      {
        ...(params.status ? { status: params.status } : {}),
        page,
        pageSize,
      },
    );

    let hotels = results.map(mapAdminHotel);
    hotels = filterHotelsBySearch(hotels, params.search);

    if (params.search) {
      return {
        hotels,
        total: hotels.length,
        totalPages: Math.ceil(hotels.length / pageSize) || 0,
      };
    }

    return { hotels, total, totalPages };
  } catch (error) {
    console.error("Error fetching admin hotels:", error);
    return { hotels: [], total: 0, totalPages: 0 };
  }
}
