"use client";

import { Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { TimeSlot } from "@/types";

interface TimeSlotSelectorProps {
  slots: TimeSlot[];
  selectedSlotId: string | null;
  onSelect: (slot: TimeSlot) => void;
  disabled?: boolean;
}

export function TimeSlotSelector({
  slots,
  selectedSlotId,
  onSelect,
  disabled = false,
}: TimeSlotSelectorProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-gray-700">
        <Clock className="w-5 h-5 text-client-primary-500" />
        <h3 className="text-lg font-semibold">Sélectionnez un créneau horaire</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {slots.map((slot) => {
          const isSelected = selectedSlotId === slot.id;
          return (
            <Button
              key={slot.id}
              type="button"
              variant={isSelected ? "default" : "outline"}
              className={cn(
                "h-auto py-4 px-6 flex flex-col items-start justify-start text-left transition-all",
                isSelected
                  ? "bg-client-primary-500 text-white border-client-primary-500 hover:bg-client-primary-600"
                  : "bg-white border-gray-200 hover:border-client-primary-300 hover:bg-client-primary-50",
                disabled && "opacity-50 cursor-not-allowed"
              )}
              onClick={() => !disabled && onSelect(slot)}
              disabled={disabled}
            >
              <span className="font-semibold text-base">{slot.label}</span>
              <span
                className={cn(
                  "text-sm mt-1",
                  isSelected ? "text-white/90" : "text-gray-500"
                )}
              >
                {slot.startTime} - {slot.endTime}
              </span>
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

