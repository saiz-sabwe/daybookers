"use client";

import { Users, User, Baby } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface GuestCounterProps {
  adults: number;
  children: number;
  onAdultsChange: (count: number) => void;
  onChildrenChange: (count: number) => void;
  maxAdults?: number;
  maxChildren?: number;
  disabled?: boolean;
}

export function GuestCounter({
  adults,
  children,
  onAdultsChange,
  onChildrenChange,
  maxAdults = 10,
  maxChildren = 5,
  disabled = false,
}: GuestCounterProps) {
  const totalGuests = adults + children;

  const incrementAdults = () => {
    if (adults < maxAdults) {
      onAdultsChange(adults + 1);
    }
  };

  const decrementAdults = () => {
    if (adults > 1) {
      onAdultsChange(adults - 1);
    }
  };

  const incrementChildren = () => {
    if (children < maxChildren) {
      onChildrenChange(children + 1);
    }
  };

  const decrementChildren = () => {
    if (children > 0) {
      onChildrenChange(children - 1);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-gray-700">
        <Users className="w-5 h-5 text-client-primary-500" />
        <h3 className="text-lg font-semibold">Nombre de personnes</h3>
      </div>

      <div className="bg-gray-50 rounded-lg p-4 space-y-4">
        {/* Adults Counter */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <User className="w-5 h-5 text-gray-600" />
            <div>
              <p className="font-medium text-gray-900">Adultes</p>
              <p className="text-sm text-gray-500">13 ans et plus</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={decrementAdults}
              disabled={disabled || adults <= 1}
            >
              -
            </Button>
            <span className="w-8 text-center font-semibold text-gray-900">
              {adults}
            </span>
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={incrementAdults}
              disabled={disabled || adults >= maxAdults}
            >
              +
            </Button>
          </div>
        </div>

        {/* Children Counter */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Baby className="w-5 h-5 text-gray-600" />
            <div>
              <p className="font-medium text-gray-900">Enfants</p>
              <p className="text-sm text-gray-500">2 à 12 ans</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={decrementChildren}
              disabled={disabled || children <= 0}
            >
              -
            </Button>
            <span className="w-8 text-center font-semibold text-gray-900">
              {children}
            </span>
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={incrementChildren}
              disabled={disabled || children >= maxChildren}
            >
              +
            </Button>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="bg-client-primary-50 rounded-lg p-4 border border-client-primary-200">
        <p className="text-sm text-gray-600">
          <span className="font-semibold text-client-primary-700">
            {totalGuests} {totalGuests > 1 ? "personnes" : "personne"}
          </span>
          {" "}au total ({adults} {adults > 1 ? "adultes" : "adulte"}
          {children > 0 && `, ${children} ${children > 1 ? "enfants" : "enfant"}`})
        </p>
      </div>
    </div>
  );
}

