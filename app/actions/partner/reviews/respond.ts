"use server";

import {
  partnerMutate,
  parsePartnerError,
  requirePartnerToken,
} from "@/lib/api/partner/fetch";

export interface RespondToReviewData {
  response: string;
}

export async function respondToReview(
  _userId: string,
  reviewId: string,
  data: RespondToReviewData,
): Promise<{ success: boolean; error?: string }> {
  try {
    const token = await requirePartnerToken();
    if (!token) {
      return { success: false, error: "Session expirée." };
    }

    await partnerMutate(
      token,
      `/api/hotels/reviews/${reviewId}/`,
      "PATCH",
      { response: data.response },
    );

    return { success: true };
  } catch (error) {
    console.error("Error responding to review:", error);
    return { success: false, error: parsePartnerError(error) };
  }
}
