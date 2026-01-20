"use server";

import db from "@/lib/db";
import { hasAdminRole } from "@/app/actions/users/get";
import { UserRole } from "@/lib/generated/prisma/client";

export interface GetAllUsersParams {
  role?: UserRole;
  search?: string;
  page?: number;
  pageSize?: number;
}

export interface UserListItem {
  id: string;
  name: string;
  email: string;
  roles: string[];
  createdAt: Date;
  emailVerified: boolean;
}

export async function getAllUsers(
  userId: string,
  params: GetAllUsersParams = {}
): Promise<{
  users: UserListItem[];
  total: number;
  totalPages: number;
}> {
  try {
    // Vérifier que l'utilisateur est admin
    const isAdmin = await hasAdminRole(userId);
    if (!isAdmin) {
      throw new Error("Accès refusé: droits administrateur requis");
    }

    const { role, search, page = 1, pageSize = 10 } = params;

    // Construire la clause WHERE
    const where: any = {};
    if (role) {
      where.roles = { has: role };
    }
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
      ];
    }

    // Compter le total
    const total = await db.user.count({ where });

    // Récupérer les utilisateurs avec pagination
    const users = await db.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        roles: true,
        createdAt: true,
        emailVerified: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    const totalPages = Math.ceil(total / pageSize);

    return {
      users: users.map((user) => ({
        id: user.id,
        name: user.name,
        email: user.email,
        roles: user.roles,
        createdAt: user.createdAt,
        emailVerified: user.emailVerified,
      })),
      total,
      totalPages,
    };
  } catch (error) {
    console.error("Erreur lors de la récupération des utilisateurs:", error);
    throw error;
  }
}

