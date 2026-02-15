"use server";

import { getGroupStatistics } from "./get-statistics";

export async function exportGroupDataAsCSV(
  userId: string,
  groupId?: string,
  startDate?: Date,
  endDate?: Date
): Promise<{ success: boolean; data?: string; error?: string }> {
  try {
    const stats = await getGroupStatistics(userId, groupId, startDate, endDate);

    if (!stats) {
      return { success: false, error: "Impossible de récupérer les données" };
    }

    // Créer le CSV
    let csv = "Type,Données\n";
    csv += `Réservations totales,${stats.totalBookings}\n`;
    csv += `Revenus totaux,${stats.totalRevenue}\n`;
    csv += `Taux d'occupation,${stats.occupancyRate}%\n`;
    csv += "\n";

    // Ajouter les réservations par période
    csv += "Date,Réservations,Revenus\n";
    stats.bookingsByPeriod.forEach((period) => {
      csv += `${period.date},${period.bookings},${period.revenue}\n`;
    });
    csv += "\n";

    // Ajouter les performances par hôtel
    csv += "Hôtel,Réservations,Revenus,Taux d'occupation\n";
    stats.hotelPerformance.forEach((hp) => {
      csv += `${hp.hotelName},${hp.bookings},${hp.revenue},${hp.occupancyRate}%\n`;
    });

    return { success: true, data: csv };
  } catch (error: any) {
    console.error("Error exporting data:", error);
    return { success: false, error: error.message };
  }
}

