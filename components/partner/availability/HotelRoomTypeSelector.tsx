"use client";

import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getPartnerHotels } from "@/app/actions/partner/hotels/get";
import { getRoomTypesByHotel } from "@/app/actions/partner/room-types/get";
import { Hotel } from "@/types";

interface HotelRoomTypeSelectorProps {
  userId: string;
  onSelectionChange: (hotelId: string | null, roomTypeId: string | null) => void;
}

export function HotelRoomTypeSelector({
  userId,
  onSelectionChange,
}: HotelRoomTypeSelectorProps) {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [roomTypes, setRoomTypes] = useState<any[]>([]);
  const [selectedHotelId, setSelectedHotelId] = useState<string | null>(null);
  const [selectedRoomTypeId, setSelectedRoomTypeId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const hotelsData = await getPartnerHotels(userId);
        setHotels(hotelsData);
      } catch (error) {
        console.error("Erreur lors de la récupération des hôtels:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHotels();
  }, [userId]);

  useEffect(() => {
    const fetchRoomTypes = async () => {
      if (!selectedHotelId) {
        setRoomTypes([]);
        setSelectedRoomTypeId(null);
        onSelectionChange(null, null);
        return;
      }

      try {
        const roomTypesData = await getRoomTypesByHotel(selectedHotelId, userId);
        setRoomTypes(roomTypesData);
        setSelectedRoomTypeId(null);
        onSelectionChange(selectedHotelId, null);
      } catch (error) {
        console.error("Erreur lors de la récupération des types de chambres:", error);
        setRoomTypes([]);
      }
    };

    fetchRoomTypes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedHotelId, userId]);

  const handleHotelChange = (hotelId: string) => {
    setSelectedHotelId(hotelId);
  };

  const handleRoomTypeChange = (roomTypeId: string) => {
    setSelectedRoomTypeId(roomTypeId);
    onSelectionChange(selectedHotelId, roomTypeId);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-10 bg-gray-200 animate-pulse rounded-md" />
        <div className="h-10 bg-gray-200 animate-pulse rounded-md" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="hotel-select">Hôtel</Label>
        <Select value={selectedHotelId || ""} onValueChange={handleHotelChange}>
          <SelectTrigger id="hotel-select">
            <SelectValue placeholder="Sélectionnez un hôtel" />
          </SelectTrigger>
          <SelectContent>
            {hotels.length === 0 ? (
              <SelectItem value="no-hotels" disabled>
                Aucun hôtel disponible
              </SelectItem>
            ) : (
              hotels.map((hotel) => (
                <SelectItem key={hotel.id} value={hotel.id}>
                  {hotel.name}
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="room-type-select">Type de chambre</Label>
        <Select
          value={selectedRoomTypeId || ""}
          onValueChange={handleRoomTypeChange}
          disabled={!selectedHotelId || roomTypes.length === 0}
        >
          <SelectTrigger id="room-type-select">
            <SelectValue
              placeholder={
                !selectedHotelId
                  ? "Sélectionnez d'abord un hôtel"
                  : roomTypes.length === 0
                  ? "Aucun type de chambre disponible"
                  : "Sélectionnez un type de chambre"
              }
            />
          </SelectTrigger>
          <SelectContent>
            {roomTypes.map((roomType) => (
              <SelectItem key={roomType.id} value={roomType.id}>
                {roomType.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

