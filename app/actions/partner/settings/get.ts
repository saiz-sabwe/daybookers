"use server";

import db from "@/lib/db";

export async function getPartnerSettings(userId: string) {
  try {
    const settings = await db.partnerSettings.findUnique({
      where: { partnerId: userId },
    });

    return settings || null;
  } catch (error) {
    console.error("Erreur lors de la récupération des paramètres:", error);
    return null;
  }
}

