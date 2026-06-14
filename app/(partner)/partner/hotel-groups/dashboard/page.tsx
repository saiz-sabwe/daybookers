"use client";

import { useState, useEffect } from "react";
import { DashboardPageHeader } from "@/components/shared/dashboard/DashboardPageHeader";
import { useClientAuth } from "@/hooks/use-client-auth";
import { getHotelGroupsByManager } from "@/app/actions/partner/hotel-groups/get";
import { getGroupStatistics, GroupStatistics } from "@/app/actions/partner/hotel-groups/get-statistics";
import { StatisticsCards } from "@/components/partner/hotel-groups/StatisticsCards";
import { HotelPerformanceTable } from "@/components/partner/hotel-groups/HotelPerformanceTable";
import { ExportButtons } from "@/components/partner/hotel-groups/ExportButtons";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BarChart3 } from "lucide-react";

export default function GroupDashboardPage() {
  const { isAuthenticated, isAuthPending } = useClientAuth();
  const [groups, setGroups] = useState<Array<{ id: string; name: string }>>([]);
  const [selectedGroupId, setSelectedGroupId] = useState<string>("all");
  const [statistics, setStatistics] = useState<GroupStatistics | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isAuthPending || !isAuthenticated) {
      return;
    }

    getHotelGroupsByManager("").then((data) => {
      setGroups(data);
    });
  }, [isAuthenticated, isAuthPending]);

  useEffect(() => {
    if (isAuthPending || !isAuthenticated) {
      return;
    }

    loadStatistics();
  }, [isAuthenticated, isAuthPending, selectedGroupId]);

  const loadStatistics = async () => {
    if (!isAuthenticated) return;

    setIsLoading(true);
    try {
      const groupId = selectedGroupId === "all" ? undefined : selectedGroupId;
      const data = await getGroupStatistics("", groupId);
      setStatistics(data);
    } catch (error) {
      console.error("Error loading statistics:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isAuthPending || !isAuthenticated) {
    return null;
  }

  return (
    <div>
      <DashboardPageHeader
        theme="partner"
        icon={BarChart3}
        title="Dashboard & Reporting"
        description="Analysez les performances de vos hôtels et groupes"
      >
        {statistics && (
          <ExportButtons
            userId=""
            groupId={selectedGroupId === "all" ? undefined : selectedGroupId}
          />
        )}
      </DashboardPageHeader>

      {/* Filtres */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Filtrer par groupe
              </label>
              <Select value={selectedGroupId} onValueChange={setSelectedGroupId}>
                <SelectTrigger>
                  <SelectValue placeholder="Tous les groupes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les groupes</SelectItem>
                  {groups.map((group) => (
                    <SelectItem key={group.id} value={group.id}>
                      {group.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contenu */}
      {isLoading ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-partner-primary-500"></div>
        </div>
      ) : statistics ? (
        <div className="space-y-6">
          {/* Cartes de statistiques */}
          <StatisticsCards
            totalBookings={statistics.totalBookings}
            totalRevenue={statistics.totalRevenue}
            occupancyRate={statistics.occupancyRate}
          />

          {/* Tableau des performances */}
          <HotelPerformanceTable hotels={statistics.hotelPerformance} />

          {/* Note */}
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="pt-6">
              <p className="text-sm text-blue-800">
                <strong>Note:</strong> Les données affichées incluent toutes les réservations 
                {selectedGroupId === "all" 
                  ? " de tous vos groupes d'hôtels" 
                  : " du groupe sélectionné"}. 
                Utilisez les filtres ci-dessus pour affiner votre analyse.
              </p>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500">Aucune donnée disponible</p>
        </div>
      )}
    </div>
  );
}
