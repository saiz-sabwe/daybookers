"use server";

import db from "@/lib/db";
import { getUserById } from "@/app/actions/users/get";

export async function associateHotelToGroup(
  userId: string,
  hotelId: string,
  groupId: string | null
) {
  try {
    const user = await getUserById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    const isGroupManager = user.roles.includes("ROLE_HOTEL_GROUP_MANAGER");

    // Seul le gestionnaire de groupe peut gérer les associations/dissociations
    if (!isGroupManager) {
      throw new Error("Seuls les gestionnaires de groupe peuvent gérer les associations d'hôtels aux groupes");
    }

    // Vérifier que l'utilisateur gère le groupe concerné
    if (groupId) {
      // Association : vérifier que l'utilisateur gère ce groupe
      const isManagerOfGroup = await db.hotelGroupManager.findFirst({
        where: {
          groupId,
          userId: userId,
        },
      });

      if (!isManagerOfGroup) {
        throw new Error("Vous n'avez pas accès à ce groupe");
      }
    } else {
      // Dissociation : vérifier que l'hôtel appartient à un groupe géré par cet utilisateur
      const hotel = await db.hotel.findUnique({
        where: { id: hotelId },
        include: {
          group: {
            include: {
              groupManagers: true,
            },
          },
        },
      });

      if (hotel?.groupId) {
        const isManagerOfGroup = hotel.group?.groupManagers.some(
          (gm) => gm.userId === userId
        );
        if (!isManagerOfGroup) {
          throw new Error("Vous ne pouvez dissocier que les hôtels des groupes que vous gérez");
        }
      }
    }

    // Mettre à jour le groupId de l'hôtel
    await db.hotel.update({
      where: { id: hotelId },
      data: { groupId },
    });

    return { success: true };
  } catch (error: any) {
    console.error("Error associating hotel to group:", error);
    return { success: false, error: error.message };
  }
}

