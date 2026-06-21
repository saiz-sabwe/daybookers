"use client";

import { useState } from "react";
import { DashboardPageHeader } from "@/components/shared/dashboard/DashboardPageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { useClientAuth } from "@/hooks/use-client-auth";
import { HotelRoomTypeSelector } from "@/components/partner/availability/HotelRoomTypeSelector";
import { PricingRulesList } from "@/components/partner/pricing/PricingRulesList";
import { PricingHelp } from "@/components/partner/pricing/PricingHelp";
import { Tags } from "lucide-react";
import { RequirePagePermission } from "@/components/shared/auth/RequirePagePermission";

export default function PartnerPricingPage() {
  const { isAuthenticated, isAuthPending } = useClientAuth();
  const [selectedHotelId, setSelectedHotelId] = useState<string | null>(null);
  const [selectedRoomTypeId, setSelectedRoomTypeId] = useState<string | null>(null);

  const handleSelectionChange = (hotelId: string | null, roomTypeId: string | null) => {
    setSelectedHotelId(hotelId);
    setSelectedRoomTypeId(roomTypeId);
  };

  if (isAuthPending || !isAuthenticated) {
    return null;
  }

  const userId = "";

  return (
    <RequirePagePermission redirectTo="/partner/dashboard">
    <div>
      <DashboardPageHeader
        theme="partner"
        icon={Tags}
        title="Tarification"
        description="Gérez les prix et règles de tarification"
      />

      <div className="space-y-6">
        {/* Guide d'aide */}
        <PricingHelp />

        <Card>
          <CardContent className="pt-6">
            <HotelRoomTypeSelector
              userId={userId}
              onSelectionChange={handleSelectionChange}
            />
          </CardContent>
        </Card>

        <PricingRulesList
          hotelId={selectedHotelId}
          roomTypeId={selectedRoomTypeId}
          userId={userId}
        />
      </div>
    </div>
    </RequirePagePermission>
  );
}
