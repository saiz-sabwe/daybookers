"use server";

import { DjangoComplaintRecord } from "@/lib/api/django-client";
import {
  partnerMutate,
  parsePartnerError,
  requirePartnerToken,
} from "@/lib/api/partner/fetch";

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
    const token = await requirePartnerToken();
    if (!token) {
      return { success: false, error: "Session expirée." };
    }

    const complaint = await partnerMutate<DjangoComplaintRecord>(
      token,
      "/api/hotels/complaints/",
      "POST",
      {
        hotel: data.hotelId,
        ...(data.bookingId ? { booking: data.bookingId } : {}),
        guest_name: data.guestName,
        guest_email: data.guestEmail ?? null,
        guest_phone: data.guestPhone ?? null,
        title: data.title,
        description: data.description,
        priority: data.priority,
        status: "OPEN",
      },
    );

    return { success: true, complaintId: complaint.uuid };
  } catch (error) {
    console.error("Error creating complaint:", error);
    return { success: false, error: parsePartnerError(error) };
  }
}
