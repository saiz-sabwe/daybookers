"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Building2, Check, X } from "lucide-react";
import { getPartnerHotels } from "@/app/actions/partner/hotels/get";
import { associateHotelToGroup } from "@/app/actions/partner/hotel-groups/associate-hotel";
import { Hotel } from "@/types";

interface GroupHotelsManagerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  groupId: string;
  userId: string;
  onUpdate: () => void;
}

export function GroupHotelsManager({
  open,
  onOpenChange,
  groupId,
  userId,
  onUpdate,
}: GroupHotelsManagerProps) {
  const { toast } = useToast();
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (open) {
      loadHotels();
    }
  }, [open, userId]);

  const loadHotels = async () => {
    setIsLoading(true);
    try {
      const data = await getPartnerHotels(userId);
      setHotels(data);
    } catch (error) {
      console.error("Error loading hotels:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleHotel = async (hotelId: string, currentGroupId: string | null) => {
    try {
      const newGroupId = currentGroupId === groupId ? null : groupId;
      const result = await associateHotelToGroup(userId, hotelId, newGroupId);

      if (result.success) {
        toast({
          title: newGroupId ? "Hôtel ajouté au groupe" : "Hôtel retiré du groupe",
          description: newGroupId
            ? "L'hôtel a été ajouté au groupe avec succès"
            : "L'hôtel a été retiré du groupe avec succès",
          variant: "default",
        });
        loadHotels();
        onUpdate();
      } else {
        toast({
          title: "Erreur",
          description: result.error || "Une erreur est survenue",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Gérer les hôtels du groupe</DialogTitle>
          <DialogDescription>
            Associez ou dissociez des hôtels à ce groupe
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="py-8 text-center text-gray-500">Chargement...</div>
        ) : hotels.length === 0 ? (
          <div className="py-8 text-center text-gray-500">
            Aucun hôtel disponible
          </div>
        ) : (
          <div className="space-y-2">
            {hotels.map((hotel) => {
              const isInGroup = hotel.groupId === groupId;
              return (
                <div
                  key={hotel.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Building2 className="w-5 h-5 text-gray-400" />
                    <div>
                      <h4 className="font-medium text-gray-900">{hotel.name}</h4>
                      <p className="text-sm text-gray-500">
                        {hotel.city}, {hotel.country}
                      </p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant={isInGroup ? "default" : "outline"}
                    onClick={() => handleToggleHotel(hotel.id, hotel.groupId ?? null)}
                    className={
                      isInGroup
                        ? "bg-green-600 hover:bg-green-700 text-white"
                        : ""
                    }
                  >
                    {isInGroup ? (
                      <>
                        <Check className="w-4 h-4 mr-1" />
                        Dans le groupe
                      </>
                    ) : (
                      <>
                        <X className="w-4 h-4 mr-1" />
                        Ajouter
                      </>
                    )}
                  </Button>
                </div>
              );
            })}
          </div>
        )}

        <div className="flex justify-end pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Fermer
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

