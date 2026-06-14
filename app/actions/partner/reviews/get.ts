"use server";

import { DjangoReviewRecord } from "@/lib/api/django-client";
import { loadPartnerHotels } from "@/lib/api/partner/data";
import {
  buildHotelNameMap,
  mapPartnerReview,
} from "@/lib/api/partner/mappers";
import {
  fetchPartnerPage,
  requirePartnerToken,
} from "@/lib/api/partner/fetch";

export interface GetPartnerReviewsParams {
  hotelId?: string;
  rating?: number;
  page?: number;
  pageSize?: number;
}

export async function getPartnerReviews(
  _userId: string,
  params: GetPartnerReviewsParams = {},
) {
  try {
    const token = await requirePartnerToken();
    if (!token) {
      return { reviews: [], total: 0, totalPages: 0 };
    }

    const pageSize = params.pageSize ?? 10;
    const page = params.page ?? 1;

    const { results, total, totalPages } = await fetchPartnerPage<DjangoReviewRecord>(
      token,
      "/api/hotels/reviews/",
      {
        organization_scope: true,
        ...(params.hotelId ? { hotel: params.hotelId } : {}),
        page,
        pageSize,
      },
    );

    const hotels = await loadPartnerHotels(token);
    const hotelMap = buildHotelNameMap(hotels);

    let reviews = results.map((record) => mapPartnerReview(record, hotelMap));

    if (params.rating) {
      reviews = reviews.filter((review) => review.rating === params.rating);
      return {
        reviews,
        total: reviews.length,
        totalPages: Math.ceil(reviews.length / pageSize) || 0,
      };
    }

    return { reviews, total, totalPages };
  } catch (error) {
    console.error("Error fetching partner reviews:", error);
    return { reviews: [], total: 0, totalPages: 0 };
  }
}
