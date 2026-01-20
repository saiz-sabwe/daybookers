"use client";

import { BreadcrumbPartner } from "@/components/partner/layout/BreadcrumbPartner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Hotel } from "@/types";
import { HotelEditForm } from "./HotelEditForm";
import { RoomTypesList } from "./RoomTypesList";
import { authClient } from "@/lib/better-auth-client";
import { useEffect, useState } from "react";
import { redirect } from "next/navigation";
import { getRoomTypesByHotel } from "@/app/actions/partner/room-types/get";

interface PartnerHotelDetailClientProps {
  hotel: Hotel;
  roomTypes?: any[];
}

export function PartnerHotelDetailClient({
  hotel: initialHotel,
  roomTypes: initialRoomTypes,
}: PartnerHotelDetailClientProps) {
  const { data: session } = authClient.useSession();
  const [isLoading, setIsLoading] = useState(true);
  const [roomTypes, setRoomTypes] = useState<any[]>(initialRoomTypes || []);
  const [hotel, setHotel] = useState<Hotel>(initialHotel);

  useEffect(() => {
    const fetchRoomTypes = async () => {
      if (session?.user?.id) {
        try {
          // Toujours récupérer les roomTypes pour avoir les données à jour
          const fetchedRoomTypes = await getRoomTypesByHotel(hotel.id, session.user.id);
          setRoomTypes(fetchedRoomTypes);
        } catch (error) {
          console.error("Erreur lors de la récupération des roomTypes:", error);
          setRoomTypes([]);
        }
        setIsLoading(false);
      }
    };

    fetchRoomTypes();
  }, [session?.user?.id, hotel.id]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-partner-primary-500"></div>
      </div>
    );
  }

  if (!session?.user?.id) {
    return null;
  }

  return (
    <div>
      <BreadcrumbPartner
        items={[
          { label: "Mes hôtels", href: "/partner/hotels" },
          { label: hotel.name },
        ]}
      />

      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-partner-text-primary mb-2">
            {hotel.name}
          </h1>
          <p className="text-gray-600">Gérez les paramètres de votre hôtel</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informations générales</CardTitle>
            </CardHeader>
            <CardContent>
              <HotelEditForm 
                hotel={hotel} 
                userId={session.user.id}
                onSuccess={(updatedData) => {
                  // Mettre à jour le state local avec les nouvelles données
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
              <RoomTypesList hotelId={hotel.id} userId={session.user.id} initialRoomTypes={roomTypes} />
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
  );
}

