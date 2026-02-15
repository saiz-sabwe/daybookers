"use server";

import db from "@/lib/db";

export async function createComplaint(data: {
  hotelId: string;
  bookingId?: string;
  userId: string;
  guestName: string;
  guestEmail?: string;
  guestPhone?: string;
  title: string;
  description: string;
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
}): Promise<{ success: boolean; complaintId?: string; error?: string }> {
  try {
    const complaint = await db.complaint.create({
      data: {
        ...data,
        status: "OPEN",
      },
    });

    return { success: true, complaintId: complaint.id };
  } catch (error) {
    console.error("Error creating complaint:", error);
    return { success: false, error: "Erreur lors de la création de la plainte" };
  }
}

