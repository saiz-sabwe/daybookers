"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar as CalendarIcon, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { bulkUpdateAvailability } from "@/app/actions/partner/availability/bulk";
import { getTimeSlots } from "@/app/actions/time-slots/get";
import { useToast } from "@/hooks/use-toast";
import type { TimeSlot } from "@/app/actions/time-slots/get";

interface BulkAvailabilityActionsProps {
  hotelId: string | null;
  roomTypeId: string | null;
  userId: string;
  onSuccess?: () => void;
}

export function BulkAvailabilityActions({
  hotelId,
  roomTypeId,
  userId,
  onSuccess,
}: BulkAvailabilityActionsProps) {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [selectedTimeSlotIds, setSelectedTimeSlotIds] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined,
  });
  const [available, setAvailable] = useState(true);

  // Charger les créneaux horaires
  useEffect(() => {
    const fetchTimeSlots = async () => {
      const slots = await getTimeSlots();
      setTimeSlots(slots);
      setSelectedTimeSlotIds(slots.map((s) => s.id));
    };
    fetchTimeSlots();
  }, []);

  const handleSubmit = async () => {
    if (!hotelId || !roomTypeId) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner un hôtel et un type de chambre",
        variant: "destructive",
      });
      return;
    }

    if (!dateRange.from || !dateRange.to) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner une plage de dates",
        variant: "destructive",
      });
      return;
    }

    if (selectedTimeSlotIds.length === 0) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner au moins un créneau horaire",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // Générer toutes les dates entre from et to
      const dates: Date[] = [];
      const currentDate = new Date(dateRange.from);
      const endDate = new Date(dateRange.to);

      while (currentDate <= endDate) {
        dates.push(new Date(currentDate));
        currentDate.setDate(currentDate.getDate() + 1);
      }

      const result = await bulkUpdateAvailability(userId, {
        roomTypeId,
        timeSlotIds: selectedTimeSlotIds,
        dates,
        available,
      });

      if (result.success) {
        toast({
          title: "Mise à jour réussie",
          description: `${result.count} disponibilité(s) mise(s) à jour`,
          variant: "default",
        });
        setIsOpen(false);
        // Réinitialiser le formulaire
        setDateRange({ from: undefined, to: undefined });
        setAvailable(true);
        onSuccess?.();
      } else {
        toast({
          title: "Erreur",
          description: result.error || "Impossible de mettre à jour les disponibilités",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour en masse:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleTimeSlot = (timeSlotId: string) => {
    setSelectedTimeSlotIds((prev) =>
      prev.includes(timeSlotId)
        ? prev.filter((id) => id !== timeSlotId)
        : [...prev, timeSlotId]
    );
  };

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        disabled={!hotelId || !roomTypeId}
        className="bg-client-primary-500 hover:bg-client-primary-600 text-white"
      >
        <CalendarIcon className="w-4 h-4 mr-2" />
        Actions en masse
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Actions en masse sur les disponibilités</DialogTitle>
            <DialogDescription>
              Bloque ou débloque plusieurs dates en une seule fois
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Plage de dates */}
            <div className="space-y-2">
              <Label>Plage de dates</Label>
              <Calendar
                mode="range"
                selected={dateRange}
                onSelect={(range) =>
                  setDateRange({
                    from: range?.from,
                    to: range?.to,
                  })
                }
                numberOfMonths={2}
                className="rounded-md border"
              />
              {dateRange.from && dateRange.to && (
                <p className="text-sm text-gray-500">
                  Du {format(dateRange.from, "dd/MM/yyyy")} au{" "}
                  {format(dateRange.to, "dd/MM/yyyy")}
                </p>
              )}
            </div>

            {/* Créneaux horaires */}
            <div className="space-y-2">
              <Label>Créneaux horaires</Label>
              <div className="flex flex-wrap gap-2">
                {timeSlots.map((slot) => (
                  <div key={slot.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`slot-${slot.id}`}
                      checked={selectedTimeSlotIds.includes(slot.id)}
                      onCheckedChange={() => toggleTimeSlot(slot.id)}
                    />
                    <label
                      htmlFor={`slot-${slot.id}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                    >
                      {slot.name}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Action */}
            <div className="space-y-2">
              <Label>Action</Label>
              <Select
                value={available ? "available" : "unavailable"}
                onValueChange={(value) => setAvailable(value === "available")}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="available">Débloquer (Rendre disponible)</SelectItem>
                  <SelectItem value="unavailable">Bloquer (Rendre indisponible)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setIsOpen(false)} disabled={isSubmitting}>
                Annuler
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="bg-client-primary-500 hover:bg-client-primary-600 text-white"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Mise à jour...
                  </>
                ) : (
                  "Appliquer"
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

