"use client";

import Link from "next/link";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { ArrowLeft, Building2, Mail, MapPin, Phone, Globe } from "lucide-react";
import { DashboardPageHeader } from "@/components/shared/dashboard/DashboardPageHeader";
import { AdminPageGuard } from "@/components/shared/auth/AdminPageGuard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { resolveHotelImages } from "@/lib/images/hotel-image";
import type { AdminHotelDetail } from "@/app/actions/admin/hotels/get";

function getStatusBadgeVariant(status: string) {
  switch (status) {
    case "ACTIVE":
      return "default" as const;
    case "DRAFT":
      return "secondary" as const;
    case "INACTIVE":
      return "outline" as const;
    case "SUSPENDED":
      return "destructive" as const;
    default:
      return "outline" as const;
  }
}

function getStatusLabel(status: string) {
  switch (status) {
    case "ACTIVE":
      return "Actif";
    case "DRAFT":
      return "Brouillon";
    case "INACTIVE":
      return "Inactif";
    case "SUSPENDED":
      return "Suspendu";
    default:
      return status;
  }
}

interface AdminHotelDetailClientProps {
  hotel: AdminHotelDetail;
}

export function AdminHotelDetailClient({ hotel }: AdminHotelDetailClientProps) {
  const images = resolveHotelImages(hotel.images);
  const location = [hotel.cityName, hotel.countryName].filter(Boolean).join(", ");

  return (
    <AdminPageGuard>
      <div>
        <DashboardPageHeader
          theme="sadmin"
          icon={Building2}
          title={hotel.name}
          description="Détail de l'hôtel"
        >
          <Button variant="outline" size="sm" asChild>
            <Link href="/admin/hotels">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour à la liste
            </Link>
          </Button>
        </DashboardPageHeader>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {images.length > 0 && (
              <Card>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {images.slice(0, 4).map((image, index) => (
                      <img
                        key={`${hotel.id}-${index}`}
                        src={image}
                        alt={`${hotel.name} ${index + 1}`}
                        className="h-40 w-full rounded-lg object-cover"
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle>Informations générales</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {hotel.description ? (
                  <p className="text-gray-700 whitespace-pre-wrap">{hotel.description}</p>
                ) : (
                  <p className="text-gray-500 italic">Aucune description</p>
                )}

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 mt-1 text-gray-400 shrink-0" />
                    <div>
                      <p className="text-sm text-gray-500">Adresse</p>
                      <p className="font-medium">{hotel.address}</p>
                      {location && <p className="text-sm text-gray-600">{location}</p>}
                    </div>
                  </div>

                  {hotel.phone && (
                    <div className="flex items-start gap-2">
                      <Phone className="w-4 h-4 mt-1 text-gray-400 shrink-0" />
                      <div>
                        <p className="text-sm text-gray-500">Téléphone</p>
                        <p className="font-medium">{hotel.phone}</p>
                      </div>
                    </div>
                  )}

                  {hotel.email && (
                    <div className="flex items-start gap-2">
                      <Mail className="w-4 h-4 mt-1 text-gray-400 shrink-0" />
                      <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <p className="font-medium">{hotel.email}</p>
                      </div>
                    </div>
                  )}

                  {hotel.website && (
                    <div className="flex items-start gap-2">
                      <Globe className="w-4 h-4 mt-1 text-gray-400 shrink-0" />
                      <div>
                        <p className="text-sm text-gray-500">Site web</p>
                        <a
                          href={hotel.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-medium text-admin-primary-600 hover:underline"
                        >
                          {hotel.website}
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Statut</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Badge variant={getStatusBadgeVariant(hotel.status)}>
                  {getStatusLabel(hotel.status)}
                </Badge>
                <div>
                  <p className="text-sm text-gray-500">Étoiles</p>
                  <p className="font-medium">{hotel.stars} ⭐</p>
                </div>
                {hotel.minPrice != null && (
                  <div>
                    <p className="text-sm text-gray-500">Prix minimum</p>
                    <p className="font-medium">$ {hotel.minPrice}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-gray-500">Créé le</p>
                  <p className="font-medium">
                    {format(hotel.createdAt, "dd MMMM yyyy", { locale: fr })}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Identifiants</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div>
                  <p className="text-gray-500">UUID</p>
                  <p className="font-mono text-xs break-all">{hotel.id}</p>
                </div>
                <div>
                  <p className="text-gray-500">Slug</p>
                  <p className="font-medium">{hotel.slug}</p>
                </div>
                {hotel.organizationId && (
                  <div>
                    <p className="text-gray-500">Organisation</p>
                    <p className="font-mono text-xs break-all">{hotel.organizationId}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AdminPageGuard>
  );
}
