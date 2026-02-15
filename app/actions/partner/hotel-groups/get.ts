"use server";

import db from "@/lib/db";
import { getUserById } from "@/app/actions/users/get";

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
  try {
    // Vérifier que l'utilisateur est gestionnaire de groupe
    const user = await getUserById(userId);
    if (!user) {
      return [];
    }

    const isGroupManager = user.roles.includes("ROLE_HOTEL_GROUP_MANAGER");
    if (!isGroupManager) {
      return [];
    }

    // Récupérer les groupes gérés par l'utilisateur
    const groupManagers = await db.hotelGroupManager.findMany({
      where: {
        userId: userId,
      },
      include: {
        group: {
          include: {
            _count: {
              select: {
                hotels: true,
              },
            },
          },
        },
      },
    });

    return groupManagers.map((gm) => gm.group);
  } catch (error) {
    console.error("Error fetching hotel groups:", error);
    return [];
  }
}

