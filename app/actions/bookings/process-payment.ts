"use server";

import db from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function processPayment(
  bookingId: string,
  paymentMethod: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // Vérifier que la réservation existe et est en attente
    const booking = await db.booking.findUnique({
      where: { id: bookingId },
      include: {
        payment: true,
      },
    });

    if (!booking) {
      return { success: false, error: "Réservation non trouvée" };
    }

    if (booking.status !== "PENDING") {
      return { success: false, error: "Cette réservation n'est plus en attente de paiement" };
    }

    // Mettre à jour le statut de la réservation
    await db.booking.update({
      where: { id: bookingId },
      data: {
        status: "CONFIRMED",
      },
    });

    // Mettre à jour le paiement s'il existe
    if (booking.payment) {
      await db.payment.update({
        where: { id: booking.payment.id },
        data: {
          amount: booking.finalPrice,
          status: "COMPLETED",
          method: paymentMethod,
          paidAt: new Date(),
        },
      });
    } else {
      // Créer un paiement si inexistant
      await db.payment.create({
        data: {
          bookingId: bookingId,
          amount: booking.finalPrice,
          currency: booking.currency,
          status: "COMPLETED",
          method: paymentMethod,
          paidAt: new Date(),
          transactionId: `TXN-${Date.now()}-${Math.random().toString(36).substring(7)}`,
        },
      });
    }

    // Revalider les chemins concernés
    revalidatePath(`/booking/confirm/${bookingId}`);
    revalidatePath("/dashboard");

    return { success: true };
  } catch (error: any) {
    console.error("Error processing payment:", error);
    return { success: false, error: error.message || "Erreur lors du traitement du paiement" };
  }
}

