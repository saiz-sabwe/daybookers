"use server";

import { pendingMutation } from "@/lib/api/pending-django";

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
  return pendingMutation("partner.complaints.create");
}
