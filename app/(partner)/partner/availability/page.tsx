"use client";

import { useState } from "react";
import { DashboardPageHeader } from "@/components/shared/dashboard/DashboardPageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { useClientAuth } from "@/hooks/use-client-auth";
import { HotelRoomTypeSelector } from "@/components/partner/availability/HotelRoomTypeSelector";
import { AvailabilityCalendar } from "@/components/partner/availability/AvailabilityCalendar";
import { BulkAvailabilityActions } from "@/components/partner/availability/BulkAvailabilityActions";
import { CalendarDays } from "lucide-react";

export default function PartnerAvailabilityPage() {
  const { isAuthenticated, isAuthPending } = useClientAuth();
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

  if (isAuthPending || !isAuthenticated) {
    return null;
  }

  const userId = "";

  return (
    <div>
      <DashboardPageHeader
        theme="partner"
        icon={CalendarDays}
        title="Disponibilités"
        description="Gérez les disponibilités de vos hôtels"
      >
        <BulkAvailabilityActions
          hotelId={selectedHotelId}
          roomTypeId={selectedRoomTypeId}
          userId={userId}
          onSuccess={handleBulkActionSuccess}
        />
      </DashboardPageHeader>

      <div className="space-y-6">
        <Card>
          <CardContent className="pt-6">
            <HotelRoomTypeSelector
              userId={userId}
              onSelectionChange={handleSelectionChange}
            />
          </CardContent>
        </Card>

        <AvailabilityCalendar
          key={refreshKey}
          hotelId={selectedHotelId}
          roomTypeId={selectedRoomTypeId}
          userId={userId}
        />
      </div>
    </div>
  );
}
