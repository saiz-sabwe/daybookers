"use client";

import { useState, useEffect } from "react";
import { DashboardPageHeader } from "@/components/shared/dashboard/DashboardPageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAdminStats } from "@/app/actions/admin/stats/get";
import { useClientAuth } from "@/hooks/use-client-auth";
import { Building2, Users, Calendar, DollarSign, AlertCircle, LayoutDashboard } from "lucide-react";

export default function AdminDashboardPage() {
  const { isAuthenticated, isAuthPending } = useClientAuth();
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
    if (isAuthPending || !isAuthenticated) {
      return;
    }

    getAdminStats("")
      .then((statsData) => {
        setStats(statsData);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération des statistiques:", error);
        setIsLoading(false);
      });
  }, [isAuthenticated, isAuthPending]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-admin-primary-500"></div>
      </div>
    );
  }

  return (
    <div>
      <DashboardPageHeader
        theme="sadmin"
        icon={LayoutDashboard}
        title="Tableau de bord"
        description="Vue d'ensemble de la plateforme"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="rounded-2xl border border-gray-100 shadow-sm">
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

        <Card className="rounded-2xl border border-gray-100 shadow-sm">
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

        <Card className="rounded-2xl border border-gray-100 shadow-sm">
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

        <Card className="rounded-2xl border border-gray-100 shadow-sm">
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

        <Card className="rounded-2xl border border-gray-100 shadow-sm">
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

