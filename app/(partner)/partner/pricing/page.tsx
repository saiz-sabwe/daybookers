"use client";

import { useState } from "react";
import { BreadcrumbPartner } from "@/components/partner/layout/BreadcrumbPartner";
import { Card, CardContent } from "@/components/ui/card";
import { useClientAuth } from "@/hooks/use-client-auth";
import { HotelRoomTypeSelector } from "@/components/partner/availability/HotelRoomTypeSelector";
import { PricingRulesList } from "@/components/partner/pricing/PricingRulesList";
import { PricingHelp } from "@/components/partner/pricing/PricingHelp";

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
    <div>
      <BreadcrumbPartner items={[{ label: "Tarification" }]} />

      <div className="mb-6">
        <h1 className="text-3xl font-bold text-partner-text-primary mb-2">
          Tarification
        </h1>
        <p className="text-gray-600">Gérez les prix et règles de tarification</p>
      </div>

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
  );
}
