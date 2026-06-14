"use server";

import { getPartnerOrganizations } from "@/lib/api/partner/context";
import { loadPartnerHotels } from "@/lib/api/partner/data";
import { requirePartnerToken } from "@/lib/api/partner/fetch";

export interface HotelGroupData {
  id: string;
  name: string;
  description: string | null;
  createdAt: Date;
  _count?: {
    hotels: number;
  };
}

export async function getHotelGroupsByManager(
  _userId: string,
): Promise<HotelGroupData[]> {
  try {
    const token = await requirePartnerToken();
    if (!token) {
      return [];
    }

    const [organizations, hotels] = await Promise.all([
      getPartnerOrganizations(),
      loadPartnerHotels(token),
    ]);

    return organizations.map((org) => ({
      id: org.uuid,
      name: org.name,
      description: null,
      createdAt: new Date(),
      _count: {
        hotels: hotels.filter((hotel) => hotel.groupId === org.uuid).length,
      },
    }));
  } catch (error) {
    console.error("Error fetching hotel groups:", error);
    return [];
  }
}
