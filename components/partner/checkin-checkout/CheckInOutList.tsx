"use client";

import { useState } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CheckCircle, Clock, User, Phone, Mail, MessageSquare, Hotel, Loader2 } from "lucide-react";
import { CheckInOutBooking } from "@/app/actions/partner/bookings/get-checkin-checkout";
import { performCheckIn, performCheckOut } from "@/app/actions/partner/bookings/checkin-checkout";
import { useToast } from "@/hooks/use-toast";
import { useClientAuth } from "@/hooks/use-client-auth";
import { useRouter } from "next/navigation";

interface CheckInOutListProps {
  bookings: CheckInOutBooking[];
  type: "checkin" | "checkout";
}

export function CheckInOutList({ bookings, type }: CheckInOutListProps) {
  const { toast } = useToast();
  const router = useRouter();
  const { isAuthenticated } = useClientAuth();
  const [selectedBooking, setSelectedBooking] = useState<CheckInOutBooking | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const title = type === "checkin" ? "Check-in du jour" : "Check-out du jour";
  const emptyMessage = type === "checkin" 
    ? "Aucun check-in prévu aujourd'hui"
    : "Aucun check-out prévu aujourd'hui";

  const handleViewDetails = (booking: CheckInOutBooking) => {
    setSelectedBooking(booking);
    setIsDialogOpen(true);
  };

  const handleCheckIn = async (bookingId: string) => {
    if (!isAuthenticated) {
      toast({
        title: "Erreur",
        description: "Vous devez être connecté pour effectuer cette action",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    try {
      const result = await performCheckIn(bookingId, "");
      if (result.success) {
        toast({
          title: "Check-in effectué",
          description: "Le check-in a été effectué avec succès",
          variant: "default",
        });
        router.refresh();
      } else {
        toast({
          title: "Erreur",
          description: result.error || "Une erreur est survenue",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error performing check-in:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors du check-in",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCheckOut = async (bookingId: string) => {
    if (!isAuthenticated) {
      toast({
        title: "Erreur",
        description: "Vous devez être connecté pour effectuer cette action",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    try {
      const result = await performCheckOut(bookingId, "");
      if (result.success) {
        toast({
          title: "Check-out effectué",
          description: "Le check-out a été effectué avec succès",
          variant: "default",
        });
        router.refresh();
      } else {
        toast({
          title: "Erreur",
          description: result.error || "Une erreur est survenue",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error performing check-out:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors du check-out",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return "bg-green-100 text-green-800";
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "COMPLETED":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return "Confirmé";
      case "PENDING":
        return "En attente";
      case "COMPLETED":
        return "Complété";
      case "CANCELLED":
        return "Annulé";
      default:
        return status;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {type === "checkin" ? (
            <CheckCircle className="w-5 h-5 text-green-600" />
          ) : (
            <Clock className="w-5 h-5 text-blue-600" />
          )}
          {title} ({bookings.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {bookings.length === 0 ? (
          <p className="text-center text-gray-500 py-8">{emptyMessage}</p>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <div
                key={booking.id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                      <User className="w-4 h-4" />
                      {booking.guestName}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Réservation #{booking.id.slice(0, 8)}
                    </p>
                  </div>
                  <Badge className={getStatusColor(booking.status)}>
                    {getStatusLabel(booking.status)}
                  </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Hotel className="w-4 h-4" />
                    <span>{booking.hotel.name}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span>
                      {booking.timeSlot.name} ({booking.timeSlot.startTime} - {booking.timeSlot.endTime})
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Mail className="w-4 h-4" />
                    <span>{booking.guestEmail}</span>
                  </div>
                  {booking.guestPhone && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <Phone className="w-4 h-4" />
                      <span>{booking.guestPhone}</span>
                    </div>
                  )}
                </div>

                <div className="mt-3 pt-3 border-t border-gray-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Type de chambre</p>
                      <p className="font-medium text-gray-900">{booking.roomType.name}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Prix total</p>
                      <p className="font-bold text-gray-900">
                        {booking.finalPrice} {booking.currency}
                      </p>
                    </div>
                  </div>
                </div>

                {booking.specialRequests && (
                  <div className="mt-3 p-2 bg-gray-50 rounded flex items-start gap-2">
                    <MessageSquare className="w-4 h-4 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-500 font-medium">Demandes spéciales</p>
                      <p className="text-sm text-gray-700">{booking.specialRequests}</p>
                    </div>
                  </div>
                )}

                <div className="mt-3 flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => handleViewDetails(booking)}
                  >
                    Voir détails
                  </Button>
                  {type === "checkin" && booking.status === "CONFIRMED" && (
                    <Button
                      size="sm"
                      className="flex-1 bg-green-600 hover:bg-green-700"
                      onClick={() => handleCheckIn(booking.id)}
                      disabled={isProcessing}
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Traitement...
                        </>
                      ) : (
                        "Effectuer le check-in"
                      )}
                    </Button>
                  )}
                  {type === "checkout" && booking.status === "COMPLETED" && (
                    <Button
                      size="sm"
                      className="flex-1 bg-blue-600 hover:bg-blue-700"
                      onClick={() => handleCheckOut(booking.id)}
                      disabled={isProcessing}
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Traitement...
                        </>
                      ) : (
                        "Effectuer le check-out"
                      )}
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>

      {/* Dialog pour voir les détails */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Détails de la réservation
            </DialogTitle>
            <DialogDescription>
              Informations complètes de la réservation #{selectedBooking?.id.slice(0, 8)}
            </DialogDescription>
          </DialogHeader>

          {selectedBooking && (
            <div className="space-y-4 mt-4">
              {/* Informations client */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Informations client
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-gray-500">Nom</p>
                    <p className="font-medium text-gray-900">{selectedBooking.guestName}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Email</p>
                    <p className="font-medium text-gray-900">{selectedBooking.guestEmail}</p>
                  </div>
                  {selectedBooking.guestPhone && (
                    <div>
                      <p className="text-gray-500">Téléphone</p>
                      <p className="font-medium text-gray-900">{selectedBooking.guestPhone}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-gray-500">Nombre de personnes</p>
                    <p className="font-medium text-gray-900">{selectedBooking.guestCount}</p>
                  </div>
                </div>
              </div>

              {/* Informations réservation */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Hotel className="w-4 h-4" />
                  Informations réservation
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-gray-500">Hôtel</p>
                    <p className="font-medium text-gray-900">{selectedBooking.hotel.name}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Type de chambre</p>
                    <p className="font-medium text-gray-900">{selectedBooking.roomType.name}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Date</p>
                    <p className="font-medium text-gray-900">
                      {format(new Date(selectedBooking.date), "PPP", { locale: fr })}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">Créneau horaire</p>
                    <p className="font-medium text-gray-900">
                      {selectedBooking.timeSlot.name} ({selectedBooking.timeSlot.startTime} - {selectedBooking.timeSlot.endTime})
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">Statut</p>
                    <Badge className={getStatusColor(selectedBooking.status)}>
                      {getStatusLabel(selectedBooking.status)}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-gray-500">Prix total</p>
                    <p className="font-bold text-gray-900">
                      {selectedBooking.finalPrice} {selectedBooking.currency}
                    </p>
                  </div>
                </div>
              </div>

              {/* Demandes spéciales */}
              {selectedBooking.specialRequests && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <MessageSquare className="w-4 h-4" />
                    Demandes spéciales
                  </h3>
                  <p className="text-sm text-gray-700">{selectedBooking.specialRequests}</p>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2 pt-4 border-t">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Fermer
                </Button>
                {type === "checkin" && selectedBooking.status === "CONFIRMED" && (
                  <Button
                    className="flex-1 bg-green-600 hover:bg-green-700"
                    onClick={() => {
                      setIsDialogOpen(false);
                      handleCheckIn(selectedBooking.id);
                    }}
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Traitement...
                      </>
                    ) : (
                      "Effectuer le check-in"
                    )}
                  </Button>
                )}
                {type === "checkout" && selectedBooking.status === "COMPLETED" && (
                  <Button
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                    onClick={() => {
                      setIsDialogOpen(false);
                      handleCheckOut(selectedBooking.id);
                    }}
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Traitement...
                      </>
                    ) : (
                      "Effectuer le check-out"
                    )}
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
}

