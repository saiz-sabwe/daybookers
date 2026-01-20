"use client";

import { useState, useEffect } from "react";
import { BreadcrumbAdmin } from "@/components/admin/layout/BreadcrumbAdmin";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAdminStats } from "@/app/actions/admin/stats/get";
import { authClient } from "@/lib/better-auth-client";
import { Building2, Users, Calendar, DollarSign, AlertCircle } from "lucide-react";

export default function AdminDashboardPage() {
  const { data: session } = authClient.useSession();
  const [stats, setStats] = useState({
    totalHotels: 0,
    activeHotels: 0,
    totalUsers: 0,
    totalBookings: 0,
    totalRevenue: 0,
    pendingBookings: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (session?.user?.id) {
      getAdminStats(session.user.id)
        .then((statsData) => {
          setStats(statsData);
          setIsLoading(false);
        })
        .catch((error) => {
          console.error("Erreur lors de la récupération des statistiques:", error);
          setIsLoading(false);
        });
    }
  }, [session?.user?.id]);

  if (isLoading) {
    return (
      <div>
        <BreadcrumbAdmin items={[{ label: "Tableau de bord" }]} />
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-admin-primary-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <BreadcrumbAdmin items={[{ label: "Tableau de bord" }]} />

      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Tableau de bord Admin
        </h1>
        <p className="text-gray-600">Vue d'ensemble de la plateforme</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="border-l-4 border-admin-primary-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Hôtels
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold text-admin-primary-600">
                {stats.totalHotels}
              </div>
              <Building2 className="w-8 h-8 text-admin-primary-400" />
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {stats.activeHotels} actifs
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-blue-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Utilisateurs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold text-blue-600">
                {stats.totalUsers}
              </div>
              <Users className="w-8 h-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-green-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Réservations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold text-green-600">
                {stats.totalBookings}
              </div>
              <Calendar className="w-8 h-8 text-green-400" />
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {stats.pendingBookings} en attente
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-yellow-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Revenus Totaux
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold text-yellow-600">
                ${stats.totalRevenue.toLocaleString("fr-FR", {
                  maximumFractionDigits: 0,
                })}
              </div>
              <DollarSign className="w-8 h-8 text-yellow-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-red-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Réservations en attente
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold text-red-600">
                {stats.pendingBookings}
              </div>
              <AlertCircle className="w-8 h-8 text-red-400" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

