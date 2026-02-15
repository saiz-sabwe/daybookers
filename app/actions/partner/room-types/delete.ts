"use server";

import db from "@/lib/db";
import { getUserById } from "@/app/actions/users/get";

export async function deleteRoomType(userId: string, roomTypeId: string) {
  try {
    // Récupérer le type de chambre existant
    const existingRoomType = await db.roomType.findUnique({
      where: { id: roomTypeId },
      include: {
        hotel: true,
        _count: {
          select: {
            bookings: true,
          },
        },
      },
    });

    if (!existingRoomType) {
      throw new Error("Type de chambre non trouvé");
    }

    // Vérifier que l'utilisateur est manager de l'hôtel
    const user = await getUserById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    const isManager = await db.hotelManager.findFirst({
      where: {
        userId: userId,
        hotelId: existingRoomType.hotelId,
      },
    });

    const isGroupManager = user.roles.includes("ROLE_HOTEL_GROUP_MANAGER");

    if (!isManager && !isGroupManager) {
      throw new Error("Vous n'avez pas la permission de supprimer ce type de chambre");
    }

    // Vérifier qu'il n'y a pas de réservations actives
    if (existingRoomType._count.bookings > 0) {
      throw new Error(
        "Impossible de supprimer ce type de chambre car il a des réservations associées"
      );
    }

    // Supprimer le type de chambre (les RoomOptions seront supprimées en cascade)
    await db.roomType.delete({
      where: { id: roomTypeId },
    });

    return { success: true };
  } catch (error: any) {
    console.error("Error deleting room type:", error);
    return { success: false, error: error.message };
  }
}

