"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { RoomTypeForm } from "./RoomTypeForm";
import { getRoomTypesByHotel } from "@/app/actions/partner/room-types/get";

interface RoomTypesListProps {
  hotelId: string;
  userId: string;
  initialRoomTypes: any[];
}

export function RoomTypesList({ hotelId, userId, initialRoomTypes }: RoomTypesListProps) {
  const [roomTypes, setRoomTypes] = useState(initialRoomTypes || []);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingRoomType, setEditingRoomType] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Rafraîchir la liste après création/modification
  const refreshRoomTypes = async () => {
    setIsLoading(true);
    try {
      const updatedRoomTypes = await getRoomTypesByHotel(hotelId, userId);
      setRoomTypes(updatedRoomTypes);
    } catch (error) {
      console.error("Erreur lors du rafraîchissement des roomTypes:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateSuccess = () => {
    refreshRoomTypes();
  };

  const handleEditClick = (roomType: any) => {
    setEditingRoomType(roomType);
  };

  const handleEditModalClose = () => {
    setEditingRoomType(null);
  };

  const handleEditSuccess = () => {
    handleEditModalClose();
    refreshRoomTypes();
  };

  if (!roomTypes || roomTypes.length === 0) {
    return (
      <>
      <div className="text-center py-8">
        <p className="text-gray-500 mb-4">Aucun type de chambre configuré</p>
           <Button 
             className="bg-client-primary-500 hover:bg-client-primary-600 text-white"
             onClick={() => setIsCreateModalOpen(true)}
           >
          <Plus className="w-4 h-4 mr-2" />
          Ajouter un type de chambre
        </Button>
      </div>
        <RoomTypeForm
          open={isCreateModalOpen}
          onOpenChange={setIsCreateModalOpen}
          hotelId={hotelId}
          userId={userId}
          onSuccess={handleCreateSuccess}
        />
      </>
    );
  }

  return (
    <>
    <div className="space-y-4">
      {roomTypes.map((roomType) => (
        <Card key={roomType.id}>
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium">{roomType.name}</h3>
                <p className="text-sm text-gray-600 mt-1">
                  {roomType.basePrice} {roomType.currency} • {roomType.maxGuests} personne
                  {roomType.maxGuests > 1 ? "s" : ""}
                </p>
                  {roomType.description && (
                    <p className="text-xs text-gray-500 mt-1">{roomType.description}</p>
                  )}
              </div>
                 <Button
                   size="sm"
                   className="bg-client-primary-500 hover:bg-client-primary-600 text-white"
                   onClick={() => handleEditClick(roomType)}
                 >
                Modifier
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
         <Button 
           className="w-full bg-client-primary-500 hover:bg-client-primary-600 text-white"
           onClick={() => setIsCreateModalOpen(true)}
         >
        <Plus className="w-4 h-4 mr-2" />
        Ajouter un type de chambre
      </Button>
    </div>

      {/* Modal de création */}
      <RoomTypeForm
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        hotelId={hotelId}
        userId={userId}
        onSuccess={handleCreateSuccess}
      />

      {/* Modal de modification */}
      {editingRoomType && (
        <RoomTypeForm
          open={!!editingRoomType}
          onOpenChange={(open) => {
            if (!open) handleEditModalClose();
          }}
          hotelId={hotelId}
          userId={userId}
          roomType={editingRoomType}
          onSuccess={handleEditSuccess}
        />
      )}
    </>
  );
}

