"use client";

import { Wifi, Car, Utensils, Dumbbell, Waves, Tv, Snowflake, Shield } from "lucide-react";
import { cn } from "@/lib/utils";

const amenityIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  wifi: Wifi,
  parking: Car,
  restaurant: Utensils,
  gym: Dumbbell,
  pool: Waves,
  tv: Tv,
  ac: Snowflake,
  security: Shield,
};

const amenityLabels: Record<string, string> = {
  wifi: "Wi-Fi gratuit",
  parking: "Parking",
  restaurant: "Restaurant",
  gym: "Salle de sport",
  pool: "Piscine",
  tv: "TV",
  ac: "Climatisation",
  security: "Sécurité 24/7",
};

interface AmenitiesListProps {
  amenities: string[];
  className?: string;
  showLabels?: boolean;
}

export function AmenitiesList({ amenities, className, showLabels = true }: AmenitiesListProps) {
  if (!amenities || amenities.length === 0) {
    return (
      <div className={cn("text-sm text-gray-500", className)}>
        Aucun équipement disponible
      </div>
    );
  }

  return (
    <div className={cn("space-y-4", className)}>
      {showLabels && (
        <h3 className="text-lg font-semibold text-gray-900">Équipements et services</h3>
      )}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {amenities.map((amenity) => {
          const Icon = amenityIcons[amenity.toLowerCase()] || Shield;
          const label = amenityLabels[amenity.toLowerCase()] || amenity;

          return (
            <div
              key={amenity}
              className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Icon className="w-5 h-5 text-client-primary-500 flex-shrink-0" />
              {showLabels && (
                <span className="text-sm text-gray-700">{label}</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

