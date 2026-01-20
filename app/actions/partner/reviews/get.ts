"use server";

import db from "@/lib/db";
import { getPartnerHotels } from "@/app/actions/partner/hotels/get";

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
  try {
    const partnerHotels = await getPartnerHotels(userId);
    const hotelIds = partnerHotels.map((hotel) => hotel.id);

    if (hotelIds.length === 0) {
      return {
        reviews: [],
        total: 0,
        totalPages: 0,
      };
    }

    const page = params.page || 1;
    const pageSize = params.pageSize || 10;

    // Construire la clause WHERE
    const whereClause: any = {
      hotelId: {
        in: hotelIds,
      },
    };

    if (params.hotelId && hotelIds.includes(params.hotelId)) {
      whereClause.hotelId = params.hotelId;
    }

    if (params.rating) {
      whereClause.rating = params.rating;
    }

    // Compter le total
    const total = await db.review.count({
      where: whereClause,
    });

    // Récupérer les avis avec pagination
    const reviews = await db.review.findMany({
      where: whereClause,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        hotel: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    const totalPages = Math.ceil(total / pageSize);

    return {
      reviews,
      total,
      totalPages,
    };
  } catch (error) {
    console.error("Erreur lors de la récupération des avis:", error);
    return {
      reviews: [],
      total: 0,
      totalPages: 0,
    };
  }
}

