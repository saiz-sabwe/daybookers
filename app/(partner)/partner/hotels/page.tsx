"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DashboardPageHeader } from "@/components/shared/dashboard/DashboardPageHeader";
import { getPartnerHotels } from "@/app/actions/partner/hotels/get";
import { getHotelGroupsByManager } from "@/app/actions/partner/hotel-groups/get";
import { Hotel } from "@/types";
import { Plus, Building2, Edit, Eye } from "lucide-react";
import Image from "next/image";
import { useClientAuth } from "@/hooks/use-client-auth";
import { usePermissions } from "@/hooks/use-permissions";
import { CreateHotelDialog } from "@/components/partner/hotels/CreateHotelDialog";
import { PermissionGate } from "@/components/shared/auth/PermissionGate";
import { RequirePagePermission } from "@/components/shared/auth/RequirePagePermission";
import { djangoPerm } from "@/lib/auth/django-perm";

export default function PartnerHotelsPage() {
  const [partnerHotels, setPartnerHotels] = useState<Hotel[]>([]);
  const [hotelGroups, setHotelGroups] = useState<Array<{ id: string; name: string }>>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const { isAuthenticated, isAuthPending } = useClientAuth();
  const { can } = usePermissions();
  const canAddHotels = can(djangoPerm("hotels", "hotel", "add"));

  useEffect(() => {
    if (isAuthPending || !isAuthenticated) {
      return;
    }

    getPartnerHotels("").then(setPartnerHotels);
    getHotelGroupsByManager("").then(setHotelGroups);
  }, [isAuthPending, isAuthenticated]);

  const handleCreateSuccess = () => {
    if (isAuthenticated) {
      getPartnerHotels("").then(setPartnerHotels);
    }
  };

  return (
    <RequirePagePermission redirectTo="/partner/dashboard">
      <div>
        <DashboardPageHeader
          theme="partner"
          icon={Building2}
          title="Mes hôtels"
          description="Gérez tous vos hôtels en un seul endroit"
        >
          <PermissionGate permissions={[djangoPerm("hotels", "hotel", "add")]}>
            <Button
              onClick={() => setIsCreateDialogOpen(true)}
              className="bg-partner-primary-600 hover:bg-partner-primary-700 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Ajouter un hôtel
            </Button>
          </PermissionGate>
        </DashboardPageHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {partnerHotels.map((hotel) => (
            <Card key={hotel.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              {hotel.images && hotel.images[0] && (
                <div className="relative w-full h-48">
                  <Image
                    src={hotel.images[0]}
                    alt={hotel.name}
                    fill
                    className="object-cover"
                  />
                  <Badge className="absolute top-2 right-2 bg-green-500">
                    Actif
                  </Badge>
                </div>
              )}
              <CardHeader>
                <CardTitle className="text-lg">{hotel.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>{hotel.city}, {hotel.country}</span>
                    <span className="font-semibold text-partner-primary-600">
                      {hotel.currency === "USD" ? "$" : hotel.currency} {hotel.minPrice}/jour
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <PermissionGate permissions={[djangoPerm("hotels", "hotel", "change")]}>
                      <Button variant="outline" size="sm" asChild className="flex-1">
                        <Link href={`/partner/hotels/${hotel.id}`}>
                          <Edit className="w-4 h-4 mr-2" />
                          Modifier
                        </Link>
                      </Button>
                    </PermissionGate>
                    <Button variant="outline" size="sm" asChild className="flex-1">
                      <Link href={`/hotels/${hotel.id}`}>
                        <Eye className="w-4 h-4 mr-2" />
                        Voir
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {partnerHotels.length === 0 && (
          <Card className="p-12 text-center">
            <Building2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucun hôtel</h3>
            <p className="text-gray-600 mb-4">
              {canAddHotels
                ? "Commencez par ajouter votre premier hôtel"
                : "Aucun hôtel disponible pour le moment"}
            </p>
            <PermissionGate permissions={[djangoPerm("hotels", "hotel", "add")]}>
              <Button
                onClick={() => setIsCreateDialogOpen(true)}
                className="bg-partner-primary-600 hover:bg-partner-primary-700 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Ajouter un hôtel
              </Button>
            </PermissionGate>
          </Card>
        )}

        {isAuthenticated && canAddHotels && (
          <CreateHotelDialog
            open={isCreateDialogOpen}
            onOpenChange={setIsCreateDialogOpen}
            userId=""
            hotelGroups={hotelGroups}
            onSuccess={handleCreateSuccess}
          />
        )}
      </div>
    </RequirePagePermission>
  );
}
