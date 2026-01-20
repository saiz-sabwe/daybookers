"use server";

import { auth } from "@/lib/auth";
import db from "@/lib/db";

interface UpdateProfileData {
  name?: string;
  phone?: string;
  image?: string;
}

export async function updateProfile(
  data: UpdateProfileData,
  userId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // TODO: Vérifier que l'utilisateur est authentifié et peut modifier ce profil
    // Pour l'instant, on accepte tous les utilisateurs

    await db.user.update({
      where: { id: userId },
      data: {
        name: data.name,
        phone: data.phone,
        image: data.image,
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Erreur lors de la mise à jour du profil:", error);
    return {
      success: false,
      error: "Une erreur est survenue lors de la mise à jour du profil",
    };
  }
}

