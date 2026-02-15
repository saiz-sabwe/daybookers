"use server";

import db from "@/lib/db";
import { getUserById } from "@/app/actions/users/get";

export async function getComplaints(userId?: string, hotelId?: string) {
  try {
    let where: any = {};

    // Si un userId est fourni, filtrer par hôtels accessibles
    if (userId && !hotelId) {
      const user = await getUserById(userId);
      if (!user) {
        // Utilisateur non trouvé, retourner un tableau vide
        return [];
      }

      const isReceptionist = user.roles.includes("ROLE_HOTEL_RECEPTIONIST");
      const isManager = user.roles.includes("ROLE_HOTEL_MANAGER");
      const isGroupManager = user.roles.includes("ROLE_HOTEL_GROUP_MANAGER");

      // Si l'utilisateur n'a aucun de ces rôles, retourner un tableau vide
      if (!isReceptionist && !isManager && !isGroupManager) {
        console.log(`[getComplaints] User ${userId} has no relevant roles, returning empty array`);
        return [];
      }

      let accessibleHotelIds: string[] = [];

      // Combiner les hôtels de tous les rôles de l'utilisateur
      if (isReceptionist) {
        // Récupérer les hôtels où l'utilisateur est réceptionniste
        const receptionistAssignments = await db.hotelReceptionist.findMany({
          where: { userId: userId },
          select: { hotelId: true },
        });
        const receptionistHotelIds = receptionistAssignments.map((a) => a.hotelId);
        accessibleHotelIds = [...accessibleHotelIds, ...receptionistHotelIds];
        console.log(`[getComplaints] Receptionist ${userId} assigned to hotels:`, receptionistHotelIds);
      }

      if (isManager) {
        // Récupérer les hôtels où l'utilisateur est manager
        const managerAssignments = await db.hotelManager.findMany({
          where: { userId: userId },
          select: { hotelId: true },
        });
        const managerHotelIds = managerAssignments.map((a) => a.hotelId);
        accessibleHotelIds = [...accessibleHotelIds, ...managerHotelIds];
        console.log(`[getComplaints] Manager ${userId} manages hotels:`, managerHotelIds);
      }

      if (isGroupManager) {
        // Récupérer tous les hôtels des groupes gérés par l'utilisateur
        const groupAssignments = await db.hotelGroupManager.findMany({
          where: { userId: userId },
          select: { groupId: true },
        });
        const groupIds = groupAssignments.map((a) => a.groupId);
        if (groupIds.length > 0) {
          const hotels = await db.hotel.findMany({
            where: { groupId: { in: groupIds } },
            select: { id: true },
          });
          const groupHotelIds = hotels.map((h) => h.id);
          accessibleHotelIds = [...accessibleHotelIds, ...groupHotelIds];
          console.log(`[getComplaints] Group Manager ${userId} manages groups:`, groupIds, `with hotels:`, groupHotelIds);
        }
      }

      // Supprimer les doublons
      accessibleHotelIds = [...new Set(accessibleHotelIds)];

      if (accessibleHotelIds.length > 0) {
        where.hotelId = { in: accessibleHotelIds };
        console.log(`[getComplaints] User ${userId} final accessible hotels:`, accessibleHotelIds);
      } else {
        // Si l'utilisateur n'a accès à aucun hôtel, retourner un tableau vide
        console.log(`[getComplaints] User ${userId} has no accessible hotels, returning empty array`);
        return [];
      }
    } else if (hotelId) {
      where.hotelId = hotelId;
    }
    
    return await db.complaint.findMany({
      where,
      include: {
        hotel: { select: { id: true, name: true } },
        booking: { select: { id: true } },
        user: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    console.error("Error fetching complaints:", error);
    return [];
  }
}

