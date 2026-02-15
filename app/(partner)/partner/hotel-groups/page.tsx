"use client";

import { useState, useEffect } from "react";
import { BreadcrumbPartner } from "@/components/partner/layout/BreadcrumbPartner";
import { authClient } from "@/lib/better-auth-client";
import { getHotelGroupsByManager } from "@/app/actions/partner/hotel-groups/get";
import { HotelGroupsList } from "@/components/partner/hotel-groups/HotelGroupsList";
import { HotelGroupData } from "@/app/actions/partner/hotel-groups/get";
import { Building2 } from "lucide-react";

export default function HotelGroupsPage() {
  const { data: session } = authClient.useSession();
  const [groups, setGroups] = useState<HotelGroupData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadGroups = async () => {
    if (session?.user?.id) {
      setIsLoading(true);
      try {
        const data = await getHotelGroupsByManager(session.user.id);
        setGroups(data);
      } catch (error) {
        console.error("Error loading groups:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    loadGroups();
  }, [session?.user?.id]);

  if (!session?.user?.id) {
    return null;
  }

  return (
    <div>
      <BreadcrumbPartner items={[{ label: "Groupes d'hôtels" }]} />

      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-partner-primary-100 rounded-lg">
            <Building2 className="w-6 h-6 text-partner-primary-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Groupes d'hôtels</h1>
        </div>
        <p className="text-gray-600">
          Organisez vos hôtels en groupes pour une gestion centralisée
        </p>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <p className="text-gray-500">Chargement...</p>
        </div>
      ) : (
        <HotelGroupsList groups={groups} userId={session.user.id} onUpdate={loadGroups} />
      )}
    </div>
  );
}

