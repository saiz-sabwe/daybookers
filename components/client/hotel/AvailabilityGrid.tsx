"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { TimeSlot } from "@/types";
import { cn } from "@/lib/utils";
import { Clock } from "lucide-react";

interface AvailabilityGridProps {
  date: Date;
  slots: Array<{
    slot: TimeSlot;
    available: boolean;
    price: number;
  }>;
  onSelect?: (slot: TimeSlot) => void;
  selectedSlotId?: string | null;
  currency?: string;
}

export function AvailabilityGrid({
  date,
  slots,
  onSelect,
  selectedSlotId,
  currency = "USD",
}: AvailabilityGridProps) {
  const handleSlotClick = (slot: TimeSlot) => {
    if (onSelect) {
      onSelect(slot);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Clock className="w-5 h-5 text-client-primary-500" />
        <h3 className="text-lg font-semibold text-gray-900">Disponibilités</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {slots.map(({ slot, available, price }) => {
          const isSelected = selectedSlotId === slot.id;
          const isDisabled = !available;

          return (
            <Button
              key={slot.id}
              type="button"
              variant={isSelected ? "default" : "outline"}
              disabled={isDisabled}
              className={cn(
                "h-auto py-4 px-6 flex flex-col items-start justify-start text-left transition-all",
                isSelected &&
                  "bg-client-primary-500 text-white border-client-primary-500 hover:bg-client-primary-600",
                !isSelected &&
                  !isDisabled &&
                  "bg-white border-gray-200 hover:border-client-primary-300 hover:bg-client-primary-50",
                isDisabled && "opacity-50 cursor-not-allowed"
              )}
              onClick={() => !isDisabled && handleSlotClick(slot)}
            >
              <div className="flex items-center justify-between w-full mb-2">
                <span className="font-semibold text-base">{slot.label}</span>
                {isSelected && (
                  <span className="text-xs bg-white/20 px-2 py-1 rounded">Sélectionné</span>
                )}
              </div>
              <span
                className={cn(
                  "text-sm mb-2",
                  isSelected ? "text-white/90" : "text-gray-500"
                )}
              >
                {slot.startTime} - {slot.endTime}
              </span>
              {available ? (
                <span
                  className={cn(
                    "text-lg font-bold",
                    isSelected ? "text-white" : "text-client-primary-600"
                  )}
                >
                  {currency === "USD" ? "$" : currency} {price}
                </span>
              ) : (
                <span className="text-sm text-gray-400">Indisponible</span>
              )}
            </Button>
          );
        })}
      </div>

      {slots.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>Aucun créneau disponible pour cette date</p>
        </div>
      )}
    </div>
  );
}

