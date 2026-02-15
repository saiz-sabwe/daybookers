"use server";

import db from "@/lib/db";
import { revalidatePath } from "next/cache";
import { getUserById } from "@/app/actions/users/get";

export async function performCheckIn(bookingId: string, userId: string) {
  try {
    // Vérifier que l'utilisateur a accès à cette réservation
    const booking = await db.booking.findUnique({
      where: { id: bookingId },
      include: {
        hotel: {
          include: {
            managers: true,
            receptionists: true,
          },
        },
      },
    });

    if (!booking) {
      return { success: false, error: "Réservation non trouvée" };
    }

    // Vérifier les permissions
    const user = await getUserById(userId);
    if (!user) {
      return { success: false, error: "Utilisateur non trouvé" };
    }

    const isManager = booking.hotel.managers.some((m) => m.userId === userId);
    const isReceptionist = booking.hotel.receptionists.some((r) => r.userId === userId);
    const isGroupManager = user.roles.includes("ROLE_HOTEL_GROUP_MANAGER");

    if (!isManager && !isReceptionist && !isGroupManager) {
      return { success: false, error: "Vous n'avez pas la permission d'effectuer ce check-in" };
    }

    // Vérifier que la réservation est confirmée
    if (booking.status !== "CONFIRMED") {
      return { success: false, error: "Seules les réservations confirmées peuvent être check-in" };
    }

    // Mettre à jour le statut de la réservation
    await db.booking.update({
      where: { id: bookingId },
      data: {
        status: "COMPLETED",
      },
    });

    revalidatePath("/partner/checkin-checkout");
    revalidatePath("/partner/bookings");

    return { success: true };
  } catch (error: any) {
    console.error("Error performing check-in:", error);
    return { success: false, error: error.message || "Erreur lors du check-in" };
  }
}

export async function performCheckOut(bookingId: string, userId: string) {
  try {
    // Vérifier que l'utilisateur a accès à cette réservation
    const booking = await db.booking.findUnique({
      where: { id: bookingId },
      include: {
        hotel: {
          include: {
            managers: true,
            receptionists: true,
          },
        },
      },
    });

    if (!booking) {
      return { success: false, error: "Réservation non trouvée" };
    }

    // Vérifier les permissions
    const user = await getUserById(userId);
    if (!user) {
      return { success: false, error: "Utilisateur non trouvé" };
    }

    const isManager = booking.hotel.managers.some((m) => m.userId === userId);
    const isReceptionist = booking.hotel.receptionists.some((r) => r.userId === userId);
    const isGroupManager = user.roles.includes("ROLE_HOTEL_GROUP_MANAGER");

    if (!isManager && !isReceptionist && !isGroupManager) {
      return { success: false, error: "Vous n'avez pas la permission d'effectuer ce check-out" };
    }

    // Vérifier que la réservation est complétée (check-in fait)
    if (booking.status !== "COMPLETED") {
      return { success: false, error: "Le check-in doit être effectué avant le check-out" };
    }

    // Le statut reste COMPLETED, mais on pourrait ajouter un champ checkOutAt si nécessaire
    // Pour l'instant, on considère que COMPLETED signifie check-out effectué

    revalidatePath("/partner/checkin-checkout");
    revalidatePath("/partner/bookings");

    return { success: true };
  } catch (error: any) {
    console.error("Error performing check-out:", error);
    return { success: false, error: error.message || "Erreur lors du check-out" };
  }
}

