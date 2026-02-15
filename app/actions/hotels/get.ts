"use server";

import db from "@/lib/db";
import { Hotel } from "@/types";

export interface HotelSearchParams {
  location?: string;
  searchTerm?: string;
  date?: string;
  timeSlotId?: string;
}

export async function getHotels(params?: HotelSearchParams): Promise<Hotel[]> {
  try {
    // Construction dynamique des filtres
    const whereClause: any = {
      status: "ACTIVE",
    };

    // Filtrage par localisation (nom de ville)
    if (params?.location) {
      whereClause.city = {
        name: {
          contains: params.location,
          mode: "insensitive",
        },
      };
    }

    // Filtrage par terme de recherche (nom d'hôtel ou adresse)
    if (params?.searchTerm) {
      whereClause.OR = [
        {
          name: {
            contains: params.searchTerm,
            mode: "insensitive",
          },
        },
        {
          address: {
            contains: params.searchTerm,
            mode: "insensitive",
          },
        },
      ];
    }

    const hotels = await db.hotel.findMany({
      where: whereClause,
      include: {
        city: true,
        amenities: {
          include: {
            amenity: true,
          },
        },
        reviews: {
          select: {
            rating: true,
          },
        },
        roomTypes: {
          select: {
            basePrice: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return hotels.map((hotel) => {
      // Calculer la note moyenne
      const ratings = hotel.reviews.map((r) => r.rating);
      const avgRating = ratings.length > 0
        ? ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length
        : 0;

      // Trouver le prix minimum
      const prices = hotel.roomTypes.map((rt) => rt.basePrice);
      const minPrice = prices.length > 0 ? Math.min(...prices) : 0;

      return {
        id: hotel.id,
        name: hotel.name,
        city: hotel.city.name,
        country: hotel.city.country,
        address: hotel.address,
        description: hotel.description || "",
        stars: hotel.stars,
        rating: Math.round(avgRating * 10) / 10, // Arrondir à 1 décimale
        reviewCount: hotel.reviews.length,
        minPrice,
        currency: "USD", // Les roomTypes dans le schéma ont currency, mais on simplifie ici
        images: hotel.images || [],
        amenities: hotel.amenities.map((ha) => ha.amenity.name.toLowerCase()),
        latitude: hotel.latitude || undefined,
        longitude: hotel.longitude || undefined,
      } satisfies Hotel;
    });
  } catch (error) {
    console.error("Error fetching hotels:", error);
    return [];
  }
}

export async function getHotelById(id: string): Promise<Hotel | null> {
  try {
    const hotel = await db.hotel.findUnique({
      where: {
        id,
      },
      include: {
        city: true,
        amenities: {
          include: {
            amenity: true,
          },
        },
        reviews: {
          select: {
            rating: true,
          },
        },
        roomTypes: {
          select: {
            basePrice: true,
          },
        },
      },
    });

    if (!hotel) {
      return null;
    }

    // Calculer la note moyenne
    const ratings = hotel.reviews.map((r) => r.rating);
    const avgRating = ratings.length > 0
      ? ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length
      : 0;

    // Trouver le prix minimum
    const prices = hotel.roomTypes.map((rt) => rt.basePrice);
    const minPrice = prices.length > 0 ? Math.min(...prices) : 0;

    return {
      id: hotel.id,
      name: hotel.name,
      city: hotel.city.name,
      country: hotel.city.country,
      address: hotel.address,
      description: hotel.description || "",
      stars: hotel.stars,
      rating: Math.round(avgRating * 10) / 10,
      reviewCount: hotel.reviews.length,
      minPrice,
      currency: "USD", // Les roomTypes dans le schéma ont currency, mais on simplifie ici
      images: hotel.images || [],
      amenities: hotel.amenities.map((ha) => ha.amenity.name.toLowerCase()),
      latitude: hotel.latitude || undefined,
      longitude: hotel.longitude || undefined,
    } satisfies Hotel;
  } catch (error) {
    console.error("Error fetching hotel:", error);
    return null;
  }
}

