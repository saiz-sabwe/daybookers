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
import { Building2, Eye, EyeOff } from "lucide-react";
import { getPartnerHotels } from "@/app/actions/partner/hotels/get";
import { updateHotel } from "@/app/actions/partner/hotels/update";
import { Hotel } from "@/types";
import { PermissionGate } from "@/components/shared/auth/PermissionGate";
import { djangoPerm } from "@/lib/auth/django-perm";

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
  const [pendingId, setPendingId] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      loadHotels();
    }
  }, [open, userId, groupId]);

  const loadHotels = async () => {
    setIsLoading(true);
    try {
      const data = await getPartnerHotels(userId);
      // Uniquement les hôtels déjà attribués à CE groupe par le super admin
      setHotels(data.filter((hotel) => hotel.groupId === groupId));
    } catch (error) {
      console.error("Error loading hotels:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleVisibility = async (hotel: Hotel) => {
    const nextStatus = hotel.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
    setPendingId(hotel.id);
    try {
      const result = await updateHotel(hotel.id, { status: nextStatus }, userId);
      if (result.success) {
        toast({
          title: nextStatus === "ACTIVE" ? "Hôtel activé" : "Hôtel masqué",
          description:
            nextStatus === "ACTIVE"
              ? "L'hôtel est visible pour les clients"
              : "L'hôtel n'apparaît plus dans le catalogue clients",
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
    } catch {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue",
        variant: "destructive",
      });
    } finally {
      setPendingId(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Hôtels du groupe</DialogTitle>
          <DialogDescription>
            Activez ou masquez les hôtels déjà attribués à ce groupe. Seul un
            super admin peut rattacher de nouveaux hôtels.
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="py-8 text-center text-gray-500">Chargement...</div>
        ) : hotels.length === 0 ? (
          <div className="py-8 text-center text-gray-500">
            Aucun hôtel attribué à ce groupe pour le moment
          </div>
        ) : (
          <div className="space-y-2">
            {hotels.map((hotel) => {
              const isActive = hotel.status === "ACTIVE";
              return (
                <div
                  key={hotel.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Building2 className="w-5 h-5 text-gray-400" />
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium text-gray-900">
                          {hotel.name}
                        </h4>
                        <Badge variant={isActive ? "default" : "secondary"}>
                          {hotel.status === "ACTIVE"
                            ? "Actif"
                            : hotel.status === "DRAFT"
                              ? "Brouillon"
                              : hotel.status === "SUSPENDED"
                                ? "Suspendu"
                                : "Masqué"}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-500">
                        {hotel.city}, {hotel.country}
                      </p>
                    </div>
                  </div>
                  <PermissionGate
                    permissions={[djangoPerm("hotels", "hotel", "change")]}
                  >
                    <Button
                      size="sm"
                      variant={isActive ? "outline" : "default"}
                      disabled={pendingId === hotel.id}
                      onClick={() => handleToggleVisibility(hotel)}
                      className={
                        !isActive
                          ? "bg-partner-primary-600 hover:bg-partner-primary-700 text-white"
                          : ""
                      }
                    >
                      {isActive ? (
                        <>
                          <EyeOff className="w-4 h-4 mr-1" />
                          Masquer
                        </>
                      ) : (
                        <>
                          <Eye className="w-4 h-4 mr-1" />
                          Activer
                        </>
                      )}
                    </Button>
                  </PermissionGate>
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
