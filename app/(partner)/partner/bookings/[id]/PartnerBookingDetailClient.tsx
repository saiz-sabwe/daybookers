"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { ArrowLeft, CheckCircle2, XCircle } from "lucide-react";
import { DashboardPageHeader } from "@/components/shared/dashboard/DashboardPageHeader";
import { RequirePagePermission } from "@/components/shared/auth/RequirePagePermission";
import { PermissionGate } from "@/components/shared/auth/PermissionGate";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { djangoPerm } from "@/lib/auth/django-perm";
import {
  PartnerBooking,
  getPartnerBookingById,
} from "@/app/actions/partner/bookings/get";
import {
  confirmBooking,
  cancelBookingByPartner,
} from "@/app/actions/partner/bookings/update";

function statusLabel(status: string) {
  switch (status) {
    case "CONFIRMED":
      return "Confirmé";
    case "PENDING":
      return "En attente";
    case "CANCELLED":
      return "Annulé";
    default:
      return "Terminé";
  }
}

function statusVariant(status: string) {
  switch (status) {
    case "CONFIRMED":
      return "default" as const;
    case "PENDING":
      return "secondary" as const;
    case "CANCELLED":
      return "destructive" as const;
    default:
      return "outline" as const;
  }
}

interface PartnerBookingDetailClientProps {
  booking: PartnerBooking;
}

export function PartnerBookingDetailClient({
  booking: initialBooking,
}: PartnerBookingDetailClientProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [booking, setBooking] = useState(initialBooking);
  const [isProcessing, setIsProcessing] = useState(false);

  const refreshBooking = async () => {
    const updated = await getPartnerBookingById(booking.id);
    if (updated) {
      setBooking(updated);
    }
  };

  const handleConfirm = async () => {
    setIsProcessing(true);
    const result = await confirmBooking(booking.id, "");
    setIsProcessing(false);

    if (result.success) {
      toast({ title: "Réservation confirmée" });
      await refreshBooking();
      router.refresh();
    } else {
      toast({
        title: "Erreur",
        description: result.error,
        variant: "destructive",
      });
    }
  };

  const handleCancel = async () => {
    setIsProcessing(true);
    const result = await cancelBookingByPartner(booking.id, "");
    setIsProcessing(false);

    if (result.success) {
      toast({ title: "Réservation annulée" });
      await refreshBooking();
      router.refresh();
    } else {
      toast({
        title: "Erreur",
        description: result.error,
        variant: "destructive",
      });
    }
  };

  const price = booking.finalPrice ?? booking.totalPrice;
  const currencySymbol = booking.currency === "USD" ? "$" : booking.currency;

  return (
    <RequirePagePermission>
      <div className="space-y-6">
        <DashboardPageHeader
          title="Détail de la réservation"
          description={`Réservation #${booking.id.slice(0, 8)}`}
          theme="partner"
        >
          <Button variant="outline" size="sm" asChild>
            <Link href="/partner/bookings">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour
            </Link>
          </Button>
        </DashboardPageHeader>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>{booking.hotel.name}</CardTitle>
            <Badge variant={statusVariant(booking.status)}>
              {statusLabel(booking.status)}
            </Badge>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-sm text-gray-500">Client</p>
                <p className="font-medium">
                  {booking.guestName || booking.user.name}
                </p>
                {booking.user.email && (
                  <p className="text-sm text-gray-600">{booking.user.email}</p>
                )}
              </div>
              <div>
                <p className="text-sm text-gray-500">Date</p>
                <p className="font-medium">
                  {format(new Date(booking.date), "EEEE d MMMM yyyy", {
                    locale: fr,
                  })}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Créneau</p>
                <p className="font-medium">
                  {booking.timeSlot.startTime} - {booking.timeSlot.endTime}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Personnes</p>
                <p className="font-medium">{booking.guestCount}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Montant</p>
                <p className="font-bold text-partner-primary-600">
                  {currencySymbol} {price}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              {booking.status === "PENDING" && (
                <PermissionGate
                  permissions={[djangoPerm("hotels", "booking", "change")]}
                >
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleConfirm}
                    disabled={isProcessing}
                    className="text-green-600 hover:text-green-700 hover:border-green-300 hover:bg-green-50"
                  >
                    <CheckCircle2 className="w-4 h-4 mr-1" />
                    Confirmer
                  </Button>
                </PermissionGate>
              )}
              {(booking.status === "PENDING" ||
                booking.status === "CONFIRMED") && (
                <PermissionGate
                  permissions={[djangoPerm("hotels", "booking", "change")]}
                >
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleCancel}
                    disabled={isProcessing}
                    className="text-red-600 hover:text-red-700 hover:border-red-300 hover:bg-red-50"
                  >
                    <XCircle className="w-4 h-4 mr-1" />
                    Annuler
                  </Button>
                </PermissionGate>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </RequirePagePermission>
  );
}
