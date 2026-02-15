"use server";

import db from "@/lib/db";
import { Hotel } from "@/types";
import { getHotels } from "@/app/actions/hotels/get";
import { getUserById } from "@/app/actions/users/get";

export async function getPartnerHotels(userId: string): Promise<Hotel[]> {
  try {
    const user = await getUserById(userId);
    if (!user) {
      return [];
    }

    const isReceptionist = user.roles.includes("ROLE_HOTEL_RECEPTIONIST");
    const isManager = user.roles.includes("ROLE_HOTEL_MANAGER");
    const isGroupManager = user.roles.includes("ROLE_HOTEL_GROUP_MANAGER");

    let allHotelIds: string[] = [];

    // Récupérer les hôtels selon le rôle
    if (isReceptionist) {
      // Récupérer les hôtels où l'utilisateur est réceptionniste
      const receptionistAssignments = await db.hotelReceptionist.findMany({
        where: { userId: userId },
        select: { hotelId: true },
      });
      allHotelIds = receptionistAssignments.map((a) => a.hotelId);
    }

    if (isManager) {
      // Récupérer les IDs d'hôtels gérés directement par l'utilisateur (HotelManager)
      const hotelManagers = await db.hotelManager.findMany({
        where: { userId },
        select: { hotelId: true },
      });
      const managerHotelIds = hotelManagers.map((hm) => hm.hotelId);
      allHotelIds = [...allHotelIds, ...managerHotelIds];
    }

    if (isGroupManager) {
      // Récupérer les IDs d'hôtels gérés via les groupes d'hôtels (HotelGroupManager)
      const hotelGroupManagers = await db.hotelGroupManager.findMany({
        where: { userId },
        select: { groupId: true },
      });

      const groupIds = hotelGroupManagers.map((hgm) => hgm.groupId);
      if (groupIds.length > 0) {
        const hotelsFromGroups = await db.hotel.findMany({
          where: {
            groupId: {
              in: groupIds,
            },
          },
          select: { id: true },
        });
        const groupHotelIds = hotelsFromGroups.map((h) => h.id);
        allHotelIds = [...allHotelIds, ...groupHotelIds];
      }
    }

    // Supprimer les doublons
    allHotelIds = [...new Set(allHotelIds)];

    if (allHotelIds.length === 0) {
      return [];
    }

    // Récupérer tous les hôtels avec leurs relations
    const hotels = await db.hotel.findMany({
      where: {
        id: {
          in: allHotelIds,
        },
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
      orderBy: {
        createdAt: "desc",
      },
    });

    // Mapper vers le format Hotel
    return hotels.map((hotel) => {
      // Calculer la note moyenne
      const ratings = hotel.reviews.map((r) => r.rating);
      const avgRating =
        ratings.length > 0
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
        currency: "USD",
        images: hotel.images || [],
        amenities: hotel.amenities.map((ha) => ha.amenity.name.toLowerCase()),
        latitude: hotel.latitude || undefined,
        longitude: hotel.longitude || undefined,
      } satisfies Hotel;
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des hôtels du partenaire:", error);
    return [];
  }
}

