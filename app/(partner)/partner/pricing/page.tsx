"use client";

import { useState } from "react";
import { BreadcrumbPartner } from "@/components/partner/layout/BreadcrumbPartner";
import { Card, CardContent } from "@/components/ui/card";
import { authClient } from "@/lib/better-auth-client";
import { HotelRoomTypeSelector } from "@/components/partner/availability/HotelRoomTypeSelector";
import { PricingRulesList } from "@/components/partner/pricing/PricingRulesList";

export default function PartnerPricingPage() {
  const { data: session } = authClient.useSession();
  const [selectedHotelId, setSelectedHotelId] = useState<string | null>(null);
  const [selectedRoomTypeId, setSelectedRoomTypeId] = useState<string | null>(null);

  const handleSelectionChange = (hotelId: string | null, roomTypeId: string | null) => {
    setSelectedHotelId(hotelId);
    setSelectedRoomTypeId(roomTypeId);
  };

  if (!session?.user?.id) {
    return null;
  }

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
        <Card>
          <CardContent className="pt-6">
            <HotelRoomTypeSelector
              userId={session.user.id}
              onSelectionChange={handleSelectionChange}
            />
          </CardContent>
        </Card>

        <PricingRulesList
          hotelId={selectedHotelId}
          roomTypeId={selectedRoomTypeId}
          userId={session.user.id}
        />
      </div>
    </div>
  );
}
