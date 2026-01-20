"use server";

import db from "@/lib/db";
import { UserRole } from "@/lib/generated/prisma/client";

export async function getUserById(userId: string) {
  try {
    const user = await db.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        roles: true,
      },
    });
    return user;
  } catch (error) {
    console.error("Erreur lors de la récupération de l'utilisateur:", error);
    return null;
  }
}

export async function hasRole(
  userId: string,
  role: UserRole
): Promise<boolean> {
  try {
    const user = await db.user.findUnique({
      where: { id: userId },
      select: { roles: true },
    });

    if (!user) {
      return false;
    }

    return user.roles.includes(role);
  } catch (error) {
    console.error("Erreur lors de la vérification du rôle:", error);
    return false;
  }
}

export async function hasAnyPartnerRole(userId: string): Promise<boolean> {
  try {
    const user = await db.user.findUnique({
      where: { id: userId },
      select: { roles: true },
    });

    if (!user) {
      return false;
    }

    const partnerRoles: UserRole[] = [
      "ROLE_HOTEL_MANAGER",
      "ROLE_HOTEL_GROUP_MANAGER",
      "ROLE_HOTEL_RECEPTIONIST",
    ];

    return user.roles.some((role) => partnerRoles.includes(role));
  } catch (error) {
    console.error("Erreur lors de la vérification du rôle partenaire:", error);
    return false;
  }
}

export async function hasAdminRole(userId: string): Promise<boolean> {
  try {
    const user = await db.user.findUnique({
      where: { id: userId },
      select: { roles: true },
    });

    if (!user) {
      return false;
    }

    const adminRoles: UserRole[] = ["ROLE_ADMIN", "ROLE_SUPER_ADMIN"];

    return user.roles.some((role) => adminRoles.includes(role));
  } catch (error) {
    console.error("Erreur lors de la vérification du rôle admin:", error);
    return false;
  }
}

