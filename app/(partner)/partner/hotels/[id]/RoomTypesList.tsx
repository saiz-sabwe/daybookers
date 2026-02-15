"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2, Users, DollarSign } from "lucide-react";
import { RoomTypeForm } from "./RoomTypeForm";
import { getRoomTypesByHotel } from "@/app/actions/partner/room-types/get";
import { deleteRoomType } from "@/app/actions/partner/room-types/delete";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface RoomTypesListProps {
  hotelId: string;
  userId: string;
  initialRoomTypes: any[];
}

export function RoomTypesList({ hotelId, userId, initialRoomTypes }: RoomTypesListProps) {
  const [roomTypes, setRoomTypes] = useState(initialRoomTypes || []);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingRoomType, setEditingRoomType] = useState<any | null>(null);
  const [deletingRoomType, setDeletingRoomType] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

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

  const handleDeleteClick = (roomType: any) => {
    setDeletingRoomType(roomType);
  };

  const handleConfirmDelete = async () => {
    if (!deletingRoomType) return;

    try {
      const result = await deleteRoomType(userId, deletingRoomType.id);
      
      if (result.success) {
        toast({
          title: "Type de chambre supprimé",
          description: "Le type de chambre a été supprimé avec succès",
          variant: "default",
        });
        refreshRoomTypes();
      } else {
        toast({
          title: "Erreur",
          description: result.error || "Impossible de supprimer ce type de chambre",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la suppression",
        variant: "destructive",
      });
    } finally {
      setDeletingRoomType(null);
    }
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
        <Card key={roomType.id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex justify-between items-start gap-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">{roomType.name}</h3>
                {roomType.description && (
                  <p className="text-sm text-gray-600 mt-1">{roomType.description}</p>
                )}
                
                <div className="flex flex-wrap gap-4 mt-3">
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <DollarSign className="w-4 h-4 text-partner-primary-600" />
                    <span className="font-semibold">{roomType.basePrice} {roomType.currency}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <Users className="w-4 h-4 text-partner-primary-600" />
                    <span>Jusqu'à {roomType.maxGuests} personne{roomType.maxGuests > 1 ? "s" : ""}</span>
                  </div>
                  {roomType.roomCount && (
                    <div className="text-sm text-gray-700">
                      <span className="font-medium">{roomType.roomCount}</span> chambre{roomType.roomCount > 1 ? "s" : ""} disponible{roomType.roomCount > 1 ? "s" : ""}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="text-partner-primary-600 border-partner-primary-600 hover:bg-partner-primary-50"
                  onClick={() => handleEditClick(roomType)}
                >
                  <Edit className="w-4 h-4 mr-1" />
                  Modifier
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-red-600 border-red-600 hover:bg-red-50"
                  onClick={() => handleDeleteClick(roomType)}
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Supprimer
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
      
      <Button 
        className="w-full bg-partner-primary-600 hover:bg-partner-primary-700 text-white"
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

      {/* Dialog de confirmation de suppression */}
      <AlertDialog open={!!deletingRoomType} onOpenChange={(open) => !open && setDeletingRoomType(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer le type de chambre "{deletingRoomType?.name}" ?
              Cette action est irréversible et supprimera également toutes les options associées.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

