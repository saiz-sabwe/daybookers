"use client";

import { useState, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, Loader2, Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { getAvailabilities } from "@/app/actions/partner/availability/get";
import { updateAvailability } from "@/app/actions/partner/availability/update";
import { createAvailability } from "@/app/actions/partner/availability/create";
import { getTimeSlots } from "@/app/actions/time-slots/get";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import type { AvailabilityData } from "@/app/actions/partner/availability/get";
import type { TimeSlot } from "@/app/actions/time-slots/get";

interface AvailabilityCalendarProps {
  hotelId: string | null;
  roomTypeId: string | null;
  userId: string;
}

export function AvailabilityCalendar({
  hotelId,
  roomTypeId,
  userId,
}: AvailabilityCalendarProps) {
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [availabilities, setAvailabilities] = useState<AvailabilityData[]>([]);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [selectedTimeSlotId, setSelectedTimeSlotId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [month, setMonth] = useState<Date>(new Date());

  // Récupérer les créneaux horaires
  useEffect(() => {
    const fetchTimeSlots = async () => {
      const slots = await getTimeSlots();
      setTimeSlots(slots);
      if (slots.length > 0) {
        setSelectedTimeSlotId(slots[0].id);
      }
    };
    fetchTimeSlots();
  }, []);

  // Récupérer les disponibilités quand l'hôtel, le type de chambre ou le mois change
  useEffect(() => {
    if (!hotelId || !roomTypeId || !selectedTimeSlotId) {
      if (availabilities.length > 0) {
        setAvailabilities([]);
      }
      return;
    }

    const fetchAvailabilities = async () => {
      setIsLoading(true);
      try {
        // Calculer le début et la fin du mois
        const startDate = new Date(month.getFullYear(), month.getMonth(), 1);
        const endDate = new Date(month.getFullYear(), month.getMonth() + 1, 0);

        const data = await getAvailabilities(
          hotelId,
          roomTypeId,
          startDate,
          endDate,
          userId
        );
        setAvailabilities(data);
      } catch (error) {
        console.error("Erreur lors de la récupération des disponibilités:", error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les disponibilités",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchAvailabilities();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hotelId, roomTypeId, selectedTimeSlotId, month, userId]);

  const getAvailabilityForDate = (date: Date): AvailabilityData | null => {
    if (!selectedTimeSlotId) return null;
    // Normaliser la date pour la comparaison
    const normalizedDate = new Date(date);
    normalizedDate.setHours(0, 0, 0, 0);
    const dateStr = format(normalizedDate, "yyyy-MM-dd");
    return (
      availabilities.find(
        (av) => {
          const avDate = new Date(av.date);
          avDate.setHours(0, 0, 0, 0);
          return (
            format(avDate, "yyyy-MM-dd") === dateStr &&
            av.timeSlotId === selectedTimeSlotId
          );
        }
      ) || null
    );
  };

  const toggleAvailability = async (date: Date) => {
    if (!hotelId || !roomTypeId || !selectedTimeSlotId) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner un hôtel et un type de chambre",
        variant: "destructive",
      });
      return;
    }

    // Normaliser la date (sans heures)
    const normalizedDate = new Date(date);
    normalizedDate.setHours(0, 0, 0, 0);

    setIsUpdating(true);
    try {
      const existing = getAvailabilityForDate(date);

      if (existing) {
        // Mettre à jour la disponibilité existante
        const result = await updateAvailability(userId, existing.id, {
          available: !existing.available,
        });

        if (result.success) {
          setAvailabilities((prev) =>
            prev.map((av) =>
              av.id === existing.id
                ? { ...av, available: !av.available }
                : av
            )
          );
          toast({
            title: existing.available ? "Date bloquée" : "Date débloquée",
            description: `La date du ${format(date, "dd/MM/yyyy")} a été ${
              existing.available ? "bloquée" : "débloquée"
            }`,
            variant: "default",
          });
        } else {
          toast({
            title: "Erreur",
            description: result.error || "Impossible de mettre à jour la disponibilité",
            variant: "destructive",
          });
        }
      } else {
        // Créer une nouvelle disponibilité (bloquée par défaut)
        const result = await createAvailability(userId, {
          roomTypeId,
          timeSlotId: selectedTimeSlotId,
          date: normalizedDate,
          available: false,
        });

        if (result.success && result.availability) {
          setAvailabilities((prev) => [
            ...prev,
            {
              id: result.availability!.id,
              roomTypeId,
              timeSlotId: selectedTimeSlotId,
              date: normalizedDate,
              available: false,
            },
          ]);
          toast({
            title: "Date bloquée",
            description: `La date du ${format(date, "dd/MM/yyyy")} a été bloquée`,
            variant: "default",
          });
        } else {
          toast({
            title: "Erreur",
            description: result.error || "Impossible de créer la disponibilité",
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const modifiers = {
    available: (date: Date) => {
      const av = getAvailabilityForDate(date);
      return av?.available === true;
    },
    unavailable: (date: Date) => {
      const av = getAvailabilityForDate(date);
      return av?.available === false;
    },
    past: (date: Date) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return date < today;
    },
  };

  const modifiersClassNames = {
    available: "bg-green-100 hover:bg-green-200 border-green-300",
    unavailable: "bg-red-100 hover:bg-red-200 border-red-300",
    past: "opacity-50 cursor-not-allowed",
  };

  if (!hotelId || !roomTypeId) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Calendrier des disponibilités</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12">
            <CalendarIcon className="w-16 h-16 text-gray-400 mb-4" />
            <p className="text-gray-600 mb-2 text-center">
              Sélectionnez un hôtel et un type de chambre pour voir le calendrier
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Calendrier des disponibilités</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Sélection du créneau horaire */}
        {timeSlots.length > 0 && (
          <div className="space-y-2">
            <label className="text-sm font-medium">Créneau horaire</label>
            <div className="flex flex-wrap gap-2">
              {timeSlots.map((slot) => (
                <Button
                  key={slot.id}
                  variant={selectedTimeSlotId === slot.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedTimeSlotId(slot.id)}
                  className={
                    selectedTimeSlotId === slot.id
                      ? "bg-client-primary-500 hover:bg-client-primary-600 text-white"
                      : ""
                  }
                >
                  {slot.name}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Légende */}
        <div className="flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded border-2 border-green-300 bg-green-100" />
            <span>Disponible</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded border-2 border-red-300 bg-red-100" />
            <span>Bloqué</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded border-2 border-gray-300 bg-gray-100" />
            <span>Non configuré</span>
          </div>
        </div>

        {/* Calendrier */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <div className="w-full flex justify-center">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => {
                  setSelectedDate(date);
                }}
                month={month}
                onMonthChange={setMonth}
                modifiers={modifiers}
                modifiersClassNames={modifiersClassNames}
                className="rounded-md border"
                disabled={(date) => {
                  const today = new Date();
                  today.setHours(0, 0, 0, 0);
                  return date < today;
                }}
              />
            </div>

            {/* Informations sur la date sélectionnée */}
            {selectedDate && (
              <div className="mt-4 w-full max-w-md">
                <Card>
                  <CardContent className="pt-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">
                          {format(selectedDate, "EEEE d MMMM yyyy")}
                        </span>
                        {(() => {
                          const av = getAvailabilityForDate(selectedDate);
                          if (av) {
                            return av.available ? (
                              <Badge className="bg-green-500">
                                <CheckCircle2 className="w-3 h-3 mr-1" />
                                Disponible
                              </Badge>
                            ) : (
                              <Badge className="bg-red-500">
                                <XCircle className="w-3 h-3 mr-1" />
                                Bloqué
                              </Badge>
                            );
                          }
                          return (
                            <Badge variant="outline">
                              <CalendarIcon className="w-3 h-3 mr-1" />
                              Non configuré
                            </Badge>
                          );
                        })()}
                      </div>
                      {(() => {
                        const av = getAvailabilityForDate(selectedDate);
                        if (av && av.price) {
                          return (
                            <p className="text-xs text-gray-500">
                              Prix: {av.price} {av.roomTypeId ? "USD" : ""}
                            </p>
                          );
                        }
                        return null;
                      })()}
                      <Button
                        onClick={() => toggleAvailability(selectedDate)}
                        disabled={isUpdating}
                        className="w-full bg-client-primary-500 hover:bg-client-primary-600 text-white"
                        size="sm"
                      >
                        {isUpdating ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Mise à jour...
                          </>
                        ) : (
                          (() => {
                            const av = getAvailabilityForDate(selectedDate);
                            return av?.available ? "Bloquer cette date" : "Débloquer cette date";
                          })()
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

