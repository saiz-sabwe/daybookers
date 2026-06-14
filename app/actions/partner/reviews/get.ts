"use server";

import { pendingDjango } from "@/lib/api/pending-django";

export interface GetPartnerReviewsParams {
  hotelId?: string;
  rating?: number;
  page?: number;
  pageSize?: number;
}

export async function getPartnerReviews(
  userId: string,
  params: GetPartnerReviewsParams = {}
) {
  return pendingDjango({ reviews: [], total: 0, totalPages: 0 }, "partner.reviews.get");
}
