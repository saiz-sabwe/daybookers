"use server";

import {
  partnerMutate,
  parsePartnerError,
  requirePartnerToken,
} from "@/lib/api/partner/fetch";

export async function updateComplaintStatus(
  complaintId: string,
  status: "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED",
  resolution?: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    const token = await requirePartnerToken();
    if (!token) {
      return { success: false, error: "Session expirée." };
    }

    await partnerMutate(
      token,
      `/api/hotels/complaints/${complaintId}/`,
      "PATCH",
      {
        status,
        ...(resolution !== undefined ? { resolution } : {}),
        ...(status === "RESOLVED" || status === "CLOSED"
          ? { resolved_at: new Date().toISOString() }
          : {}),
      },
    );

    return { success: true };
  } catch (error) {
    console.error("Error updating complaint:", error);
    return { success: false, error: parsePartnerError(error) };
  }
}
