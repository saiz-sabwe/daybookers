"use server";

import db from "@/lib/db";
import { headers } from "next/headers";

export interface UpdatePartnerSettingsData {
  commissionRate?: number;
  payoutMethod?: string;
  payoutSchedule?: string;
  autoConfirm?: boolean;
  emailNotifications?: boolean;
  smsNotifications?: boolean;
}

const VALID_PAYOUT_METHODS = ["bank_transfer", "mobile_money"];
const VALID_PAYOUT_SCHEDULES = ["weekly", "monthly", "on_demand"];

export async function updatePartnerSettings(
  userId: string,
  data: UpdatePartnerSettingsData
): Promise<{ success: boolean; error?: string }> {
  try {
    // Validation des données
    // Les partenaires ne peuvent pas modifier leur taux de commission
    if (data.commissionRate !== undefined) {
      return {
        success: false,
        error: "Le taux de commission ne peut être modifié que par un administrateur",
      };
    }

    if (data.payoutMethod !== undefined) {
      if (!VALID_PAYOUT_METHODS.includes(data.payoutMethod)) {
        return {
          success: false,
          error: "Méthode de paiement invalide",
        };
      }
    }

    if (data.payoutSchedule !== undefined) {
      if (!VALID_PAYOUT_SCHEDULES.includes(data.payoutSchedule)) {
        return {
          success: false,
          error: "Fréquence de paiement invalide",
        };
      }
    }

    // Récupérer les anciennes valeurs pour l'audit
    const oldSettings = await db.partnerSettings.findUnique({
      where: { partnerId: userId },
    });

    // Mise à jour
    const updatedSettings = await db.partnerSettings.upsert({
      where: { partnerId: userId },
      create: {
        partnerId: userId,
        commissionRate: null, // Ne pas définir de commissionRate lors de la création par le partenaire
        payoutMethod: data.payoutMethod,
        payoutSchedule: data.payoutSchedule,
        autoConfirm: data.autoConfirm ?? false,
        emailNotifications: data.emailNotifications ?? true,
        smsNotifications: data.smsNotifications ?? false,
      },
      update: {
        // Ne pas mettre à jour commissionRate - il est géré uniquement par l'admin
        payoutMethod: data.payoutMethod,
        payoutSchedule: data.payoutSchedule,
        autoConfirm: data.autoConfirm,
        emailNotifications: data.emailNotifications,
        smsNotifications: data.smsNotifications,
      },
    });

    // Créer un log d'audit (dans un try/catch séparé pour ne pas bloquer la mise à jour)
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
          type: "SETTINGS_UPDATED",
          entityType: "PartnerSettings",
          entityId: updatedSettings.id,
          description: "Paramètres du partenaire mis à jour",
          metadata: {
            oldValues: oldSettings
              ? {
                  commissionRate: oldSettings.commissionRate,
                  payoutMethod: oldSettings.payoutMethod,
                  payoutSchedule: oldSettings.payoutSchedule,
                  autoConfirm: oldSettings.autoConfirm,
                  emailNotifications: oldSettings.emailNotifications,
                  smsNotifications: oldSettings.smsNotifications,
                }
              : null,
            newValues: {
              commissionRate: updatedSettings.commissionRate,
              payoutMethod: updatedSettings.payoutMethod,
              payoutSchedule: updatedSettings.payoutSchedule,
              autoConfirm: updatedSettings.autoConfirm,
              emailNotifications: updatedSettings.emailNotifications,
              smsNotifications: updatedSettings.smsNotifications,
            },
          },
          ipAddress,
          userAgent,
        },
      });
    } catch (auditError) {
      // Ne pas bloquer la mise à jour si le log d'audit échoue
      console.error("Erreur lors de la création du log d'audit:", auditError);
    }

    return { success: true };
  } catch (error) {
    console.error("Erreur lors de la mise à jour des paramètres:", error);
    return {
      success: false,
      error: "Une erreur est survenue lors de la mise à jour des paramètres",
    };
  }
}

