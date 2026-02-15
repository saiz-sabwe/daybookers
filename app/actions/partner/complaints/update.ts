"use server";

import db from "@/lib/db";

export async function updateComplaintStatus(
  complaintId: string,
  status: "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED",
  resolution?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    await db.complaint.update({
      where: { id: complaintId },
      data: {
        status,
        resolution: resolution || undefined,
        resolvedAt: status === "RESOLVED" || status === "CLOSED" ? new Date() : undefined,
        updatedAt: new Date(),
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Error updating complaint:", error);
    return { success: false, error: "Erreur lors de la mise à jour de la plainte" };
  }
}

