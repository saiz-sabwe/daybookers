"use client";

import { useState, useEffect } from "react";
import { DashboardPageHeader } from "@/components/shared/dashboard/DashboardPageHeader";
import { useClientAuth } from "@/hooks/use-client-auth";
import { getHotelGroupsByManager } from "@/app/actions/partner/hotel-groups/get";
import { HotelGroupsList } from "@/components/partner/hotel-groups/HotelGroupsList";
import { HotelGroupData } from "@/app/actions/partner/hotel-groups/get";
import { Building2 } from "lucide-react";
import { RequirePagePermission } from "@/components/shared/auth/RequirePagePermission";

export default function HotelGroupsPage() {
  const { isAuthenticated, isAuthPending } = useClientAuth();
  const [groups, setGroups] = useState<HotelGroupData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadGroups = async () => {
    if (!isAuthenticated) {
      return;
    }

    setIsLoading(true);
    try {
      const data = await getHotelGroupsByManager("");
      setGroups(data);
    } catch (error) {
      console.error("Error loading groups:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthPending) {
      return;
    }

    loadGroups();
  }, [isAuthenticated, isAuthPending]);

  if (isAuthPending || !isAuthenticated) {
    return null;
  }

  return (
    <RequirePagePermission redirectTo="/partner/dashboard">
    <div>
      <DashboardPageHeader
        theme="partner"
        icon={Building2}
        title="Groupes d'hôtels"
        description="Organisez vos hôtels en groupes pour une gestion centralisée"
      />

      {isLoading ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-partner-primary-500"></div>
        </div>
      ) : (
        <HotelGroupsList groups={groups} userId="" onUpdate={loadGroups} />
      )}
    </div>
    </RequirePagePermission>
  );
}
