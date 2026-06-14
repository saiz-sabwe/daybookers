"use server";

import { DjangoHotelRecord } from "@/lib/api/django-client";
import { loadAllOrganizations } from "@/lib/api/admin/data";
import { resolveCityUuid } from "@/lib/api/partner/context";
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
  phone?: string;
  email?: string;
  website?: string;
  stars?: number;
  cityId?: string;
  status?: string;
  images?: string[];
}

export async function createHotel(
  _userId: string,
  data: CreateHotelData,
): Promise<{ success: boolean; error?: string; hotel?: { id: string } }> {
  try {
    const token = await requirePartnerToken();
    if (!token) {
      return { success: false, error: "Session expirée." };
    }

    const organizations = await loadAllOrganizations(token);
    const organization = organizations[0]?.uuid;
    if (!organization) {
      return {
        success: false,
        error: "Aucune organisation disponible. Lancez seed_profil.",
      };
    }

    let cityUuid = data.cityId ?? null;
    if (!cityUuid) {
      cityUuid = await resolveCityUuid(token, "Kinshasa");
    }
    if (!cityUuid) {
      return {
        success: false,
        error: "Ville introuvable. Lancez seed_core ou fournissez cityId.",
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
        phone: data.phone ?? null,
        email: data.email ?? null,
        website: data.website ?? null,
        stars: data.stars ?? 3,
        status: data.status ?? "DRAFT",
        images: data.images ?? [],
      },
    );

    return { success: true, hotel: { id: hotel.uuid } };
  } catch (error) {
    console.error("Error creating admin hotel:", error);
    return { success: false, error: parsePartnerError(error) };
  }
}
