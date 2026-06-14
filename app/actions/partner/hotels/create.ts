"use server";

import { DjangoHotelRecord } from "@/lib/api/django-client";
import {
  getPrimaryOrganizationId,
  resolveCityUuid,
} from "@/lib/api/partner/context";
import {
  partnerMutate,
  parsePartnerError,
  requirePartnerToken,
  slugifyHotelName,
} from "@/lib/api/partner/fetch";

export interface CreateHotelData {
  name: string;
  description?: string;
  address: string;
  city: string;
  country?: string;
  zipCode?: string;
  latitude?: number;
  longitude?: number;
  phone?: string;
  email?: string;
  website?: string;
  stars?: number;
  groupId?: string;
  images?: string[];
  amenities?: string[];
}

export async function createHotel(_userId: string, data: CreateHotelData) {
  try {
    const token = await requirePartnerToken();
    if (!token) {
      return { success: false, error: "Session expirée." };
    }

    const organization =
      data.groupId ?? (await getPrimaryOrganizationId());
    if (!organization) {
      return {
        success: false,
        error: "Aucune organisation associée à votre compte.",
      };
    }

    const cityUuid = await resolveCityUuid(token, data.city);
    if (!cityUuid) {
      return {
        success: false,
        error: `Ville « ${data.city} » introuvable. Lancez seed_core ou choisissez une ville existante.`,
      };
    }

    const hotel = await partnerMutate<DjangoHotelRecord>(
      token,
      "/api/hotels/hotels/",
      "POST",
      {
        name: data.name,
        slug: slugifyHotelName(data.name),
        description: data.description ?? "",
        address: data.address,
        city: cityUuid,
        organization,
        latitude: data.latitude ?? null,
        longitude: data.longitude ?? null,
        phone: data.phone ?? null,
        email: data.email ?? null,
        website: data.website ?? null,
        stars: data.stars ?? 3,
        status: "ACTIVE",
        images: data.images ?? [],
      },
    );

    return { success: true, hotelId: hotel.uuid };
  } catch (error) {
    console.error("Error creating hotel:", error);
    return { success: false, error: parsePartnerError(error) };
  }
}
