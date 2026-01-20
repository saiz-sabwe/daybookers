"use server";

import db from "@/lib/db";
import { hasAdminRole } from "@/app/actions/users/get";
import { headers } from "next/headers";
import { HotelStatus } from "@/lib/generated/prisma/client";

export interface CreateHotelData {
  name: string;
  description?: string;
  address: string;
  phone?: string;
  email?: string;
  website?: string;
  stars?: number;
  cityId?: string;
  status?: HotelStatus;
  images?: string[];
}

export async function createHotel(
  userId: string,
  data: CreateHotelData
): Promise<{ success: boolean; error?: string; hotel?: any }> {
  try {
    // Vérifier que l'utilisateur est admin
    const isAdmin = await hasAdminRole(userId);
    if (!isAdmin) {
      return {
        success: false,
        error: "Accès refusé: droits administrateur requis",
      };
    }

    // Validation
    if (!data.name || data.name.trim().length === 0) {
      return {
        success: false,
        error: "Le nom de l'hôtel est requis",
      };
    }

    if (!data.address || data.address.trim().length === 0) {
      return {
        success: false,
        error: "L'adresse est requise",
      };
    }

    // Créer l'hôtel
    const hotel = await db.hotel.create({
      data: {
        name: data.name.trim(),
        description: data.description?.trim() || null,
        address: data.address.trim(),
        phone: data.phone?.trim() || null,
        email: data.email?.trim() || null,
        website: data.website?.trim() || null,
        stars: data.stars || 0,
        cityId: data.cityId || null,
        status: data.status || HotelStatus.DRAFT,
        images: data.images || [],
      },
    });

    // Créer un log d'audit
    try {
      const headersList = headers();
      const ipAddress =
        headersList.get("x-forwarded-for") ||
        headersList.get("x-real-ip") ||
        undefined;
      const userAgent = headersList.get("user-agent") || undefined;

      await db.activityLog.create({
        data: {
          userId: userId,
          type: "HOTEL_CREATED",
          entityType: "Hotel",
          entityId: hotel.id,
          description: `Hôtel créé: ${hotel.name}`,
          metadata: {
            hotelName: hotel.name,
            hotelAddress: hotel.address,
          },
          ipAddress,
          userAgent,
        },
      });
    } catch (auditError) {
      console.error("Erreur lors de la création du log d'audit:", auditError);
    }

    return { success: true, hotel };
  } catch (error) {
    console.error("Erreur lors de la création de l'hôtel:", error);
    return {
      success: false,
      error: "Une erreur est survenue lors de la création de l'hôtel",
    };
  }
}

