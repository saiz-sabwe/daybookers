"use server";

import db from "@/lib/db";
import { hasAdminRole } from "@/app/actions/users/get";
import { headers } from "next/headers";

export async function updatePartnerCommission(
  adminUserId: string,
  hotelId: string,
  commissionRate: number
): Promise<{ success: boolean; error?: string }> {
  try {
    // Vérifier que l'utilisateur est admin
    const isAdmin = await hasAdminRole(adminUserId);
    if (!isAdmin) {
      return {
        success: false,
        error: "Accès refusé: droits administrateur requis",
      };
    }

    // Validation
    if (commissionRate < 0 || commissionRate > 1) {
      return {
        success: false,
        error: "Le taux de commission doit être entre 0% et 100%",
      };
    }

    // Vérifier que l'hôtel existe et récupérer son manager
    const hotel = await db.hotel.findUnique({
      where: { id: hotelId },
      select: {
        id: true,
        name: true,
        managers: {
          take: 1,
          select: {
            userId: true,
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
    });

    if (!hotel) {
      return {
        success: false,
        error: "Hôtel introuvable",
      };
    }

    const manager = hotel.managers[0];
    if (!manager) {
      return {
        success: false,
        error: "Cet hôtel n'a pas de manager associé",
      };
    }

    const partnerUserId = manager.userId;

    // Récupérer les anciennes valeurs pour l'audit
    const oldSettings = await db.partnerSettings.findUnique({
      where: { partnerId: partnerUserId },
    });

    // Mettre à jour ou créer les paramètres
    const updatedSettings = await db.partnerSettings.upsert({
      where: { partnerId: partnerUserId },
      create: {
        partnerId: partnerUserId,
        commissionRate,
      },
      update: {
        commissionRate,
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
          userId: adminUserId,
          type: "SETTINGS_UPDATED",
          entityType: "PartnerSettings",
          entityId: updatedSettings.id,
          description: `Taux de commission mis à jour pour l'hôtel ${hotel.name}`,
          metadata: {
            hotelId: hotel.id,
            hotelName: hotel.name,
            partnerId: partnerUserId,
            partnerName: manager.user.name,
            oldCommissionRate: oldSettings?.commissionRate ?? null,
            newCommissionRate: commissionRate,
          },
          ipAddress,
          userAgent,
        },
      });
    } catch (auditError) {
      console.error("Erreur lors de la création du log d'audit:", auditError);
    }

    return { success: true };
  } catch (error) {
    console.error("Erreur lors de la mise à jour de la commission:", error);
    return {
      success: false,
      error: "Une erreur est survenue lors de la mise à jour de la commission",
    };
  }
}

