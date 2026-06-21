"use client";

import { DashboardPageHeader } from "@/components/shared/dashboard/DashboardPageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Hotel } from "@/types";
import { HotelEditForm } from "./HotelEditForm";
import { RoomTypesList } from "./RoomTypesList";
import { useClientAuth } from "@/hooks/use-client-auth";
import { useEffect, useState } from "react";
import { getRoomTypesByHotel } from "@/app/actions/partner/room-types/get";
import { RequirePagePermission } from "@/components/shared/auth/RequirePagePermission";
import { Building2 } from "lucide-react";

interface PartnerHotelDetailClientProps {
  hotel: Hotel;
  roomTypes?: any[];
}

export function PartnerHotelDetailClient({
  hotel: initialHotel,
  roomTypes: initialRoomTypes,
}: PartnerHotelDetailClientProps) {
  const { isAuthenticated, isAuthPending } = useClientAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [roomTypes, setRoomTypes] = useState<any[]>(initialRoomTypes || []);
  const [hotel, setHotel] = useState<Hotel>(initialHotel);

  useEffect(() => {
    const fetchRoomTypes = async () => {
      if (isAuthPending || !isAuthenticated) {
        return;
      }

      try {
        const fetchedRoomTypes = await getRoomTypesByHotel(hotel.id, "");
        setRoomTypes(fetchedRoomTypes);
      } catch (error) {
        console.error("Erreur lors de la récupération des roomTypes:", error);
        setRoomTypes([]);
      }
      setIsLoading(false);
    };

    fetchRoomTypes();
  }, [isAuthenticated, isAuthPending, hotel.id]);

  if (isLoading || isAuthPending) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-partner-primary-500"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <RequirePagePermission redirectTo="/partner/hotels">
    <div>
      <DashboardPageHeader
        theme="partner"
        icon={Building2}
        title={hotel.name}
        description="Gérez les paramètres de votre hôtel"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informations générales</CardTitle>
            </CardHeader>
            <CardContent>
              <HotelEditForm 
                hotel={hotel} 
                userId=""
                onSuccess={(updatedData) => {
                  if (updatedData) {
                    setHotel((prev) => ({ ...prev, ...updatedData }));
                  }
                }}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Types de chambres</CardTitle>
            </CardHeader>
            <CardContent>
              <RoomTypesList hotelId={hotel.id} userId="" initialRoomTypes={roomTypes} />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Statut</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div>
                  <span className="text-sm text-gray-600">Étoiles:</span>
                  <span className="ml-2 font-medium">{hotel.stars} ⭐</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
    </RequirePagePermission>
  );
}
