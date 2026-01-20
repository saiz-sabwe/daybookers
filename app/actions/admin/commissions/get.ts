"use server";

import db from "@/lib/db";
import { hasAdminRole } from "@/app/actions/users/get";

export interface PartnerCommission {
  hotelId: string;
  hotelName: string;
  hotelAddress: string;
  commissionRate: number | null;
  managerName: string | null;
  managerEmail: string | null;
}

export async function getAllPartnerCommissions(
  adminUserId: string
): Promise<PartnerCommission[]> {
  try {
    // Vérifier que l'utilisateur est admin
    const isAdmin = await hasAdminRole(adminUserId);
    if (!isAdmin) {
      throw new Error("Accès refusé: droits administrateur requis");
    }

    // Récupérer tous les hôtels
    const hotels = await db.hotel.findMany({
      select: {
        id: true,
        name: true,
        address: true,
        managers: {
          take: 1, // Prendre le premier manager
          select: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
      orderBy: {
        name: "asc",
      },
    });

    // Récupérer les commissions pour chaque hôtel via leur manager
    const commissions: PartnerCommission[] = await Promise.all(
      hotels.map(async (hotel) => {
        // Récupérer le premier manager de l'hôtel
        const manager = hotel.managers[0]?.user;

        // Si l'hôtel a un manager, récupérer son taux de commission
        let commissionRate: number | null = null;
        if (manager) {
          const settings = await db.partnerSettings.findUnique({
            where: { partnerId: manager.id },
            select: { commissionRate: true },
          });
          commissionRate = settings?.commissionRate ?? null;
        }

        return {
          hotelId: hotel.id,
          hotelName: hotel.name,
          hotelAddress: hotel.address,
          commissionRate,
          managerName: manager?.name ?? null,
          managerEmail: manager?.email ?? null,
        };
      })
    );

    return commissions;
  } catch (error) {
    console.error("Erreur lors de la récupération des commissions:", error);
    throw error;
  }
}

