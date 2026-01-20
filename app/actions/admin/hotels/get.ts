"use server";

import db from "@/lib/db";
import { hasAdminRole } from "@/app/actions/users/get";
import { HotelStatus } from "@/lib/generated/prisma/client";

export interface GetAllHotelsParams {
  status?: HotelStatus;
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
  try {
    // Vérifier que l'utilisateur est admin
    const isAdmin = await hasAdminRole(userId);
    if (!isAdmin) {
      throw new Error("Accès refusé: droits administrateur requis");
    }

    const { status, search, page = 1, pageSize = 10 } = params;

    // Construire la clause WHERE
    const where: any = {};
    if (status) {
      where.status = status;
    }
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { address: { contains: search, mode: "insensitive" } },
      ];
    }

    // Compter le total
    const total = await db.hotel.count({ where });

    // Récupérer les hôtels avec pagination
    const hotels = await db.hotel.findMany({
      where,
      select: {
        id: true,
        name: true,
        address: true,
        status: true,
        stars: true,
        createdAt: true,
        cityId: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    const totalPages = Math.ceil(total / pageSize);

    return {
      hotels: hotels.map((hotel) => ({
        id: hotel.id,
        name: hotel.name,
        address: hotel.address,
        status: hotel.status,
        stars: hotel.stars,
        createdAt: hotel.createdAt,
        cityId: hotel.cityId,
      })),
      total,
      totalPages,
    };
  } catch (error) {
    console.error("Erreur lors de la récupération des hôtels:", error);
    throw error;
  }
}

