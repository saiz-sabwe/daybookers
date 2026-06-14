"use server";

import { pendingMutation } from "@/lib/api/pending-django";

export async function updateComplaintStatus(
  complaintId: string,
  status: "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED",
  resolution?: string
): Promise<{ success: boolean; error?: string }> {
  return pendingMutation("partner.complaints.update");
}
