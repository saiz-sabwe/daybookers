"use server";

import { pendingMutation } from "@/lib/api/pending-django";

export interface RespondToReviewData {
  response: string;
}

export async function respondToReview(
  userId: string,
  reviewId: string,
  data: RespondToReviewData
): Promise<{ success: boolean; error?: string }> {
  return pendingMutation("partner.reviews.respond");
}
