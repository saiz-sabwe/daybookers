"use client";

import { useState } from "react";
import { BreadcrumbPartner } from "@/components/partner/layout/BreadcrumbPartner";
import { Card, CardContent } from "@/components/ui/card";
import { authClient } from "@/lib/better-auth-client";
import { HotelRoomTypeSelector } from "@/components/partner/availability/HotelRoomTypeSelector";
import { AvailabilityCalendar } from "@/components/partner/availability/AvailabilityCalendar";
import { BulkAvailabilityActions } from "@/components/partner/availability/BulkAvailabilityActions";

export default function PartnerAvailabilityPage() {
  const { data: session } = authClient.useSession();
  const [selectedHotelId, setSelectedHotelId] = useState<string | null>(null);
  const [selectedRoomTypeId, setSelectedRoomTypeId] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleSelectionChange = (hotelId: string | null, roomTypeId: string | null) => {
    setSelectedHotelId(hotelId);
    setSelectedRoomTypeId(roomTypeId);
  };

  const handleBulkActionSuccess = () => {
    // Forcer le rafraîchissement du calendrier
    setRefreshKey((prev) => prev + 1);
  };

  if (!session?.user?.id) {
    return null;
  }

  return (
    <div>
      <BreadcrumbPartner items={[{ label: "Disponibilités" }]} />

      <div className="mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-partner-text-primary mb-2">
              Disponibilités
            </h1>
            <p className="text-gray-600">Gérez les disponibilités de vos hôtels</p>
          </div>
          <BulkAvailabilityActions
            hotelId={selectedHotelId}
            roomTypeId={selectedRoomTypeId}
            userId={session.user.id}
            onSuccess={handleBulkActionSuccess}
          />
        </div>
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

        <AvailabilityCalendar
          key={refreshKey}
          hotelId={selectedHotelId}
          roomTypeId={selectedRoomTypeId}
          userId={session.user.id}
        />
      </div>
    </div>
  );
}
