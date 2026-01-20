"use client";

import { MapPin } from "lucide-react";
import { Hotel } from "@/types";
import { cn } from "@/lib/utils";

interface HotelMapProps {
  hotel: Hotel;
  className?: string;
  height?: string;
}

export function HotelMap({ hotel, className, height = "400px" }: HotelMapProps) {
  // Pour l'instant, on utilise une carte statique via Google Maps Embed API
  // TODO: Implémenter une carte interactive avec Leaflet ou Google Maps API
  const mapUrl = `https://www.google.com/maps/embed/v1/place?key=YOUR_API_KEY&q=${hotel.location.lat},${hotel.location.lng}`;

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center gap-2">
        <MapPin className="w-5 h-5 text-client-primary-500" />
        <h3 className="text-lg font-semibold text-gray-900">Localisation</h3>
      </div>

      <div className="rounded-lg overflow-hidden border border-gray-200 shadow-sm">
        {/* Fallback: Image statique avec lien vers Google Maps */}
        <a
          href={`https://www.google.com/maps?q=${hotel.location.lat},${hotel.location.lng}`}
          target="_blank"
          rel="noopener noreferrer"
          className="block relative"
          style={{ height }}
        >
          <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
            <div className="text-center">
              <MapPin className="w-12 h-12 text-client-primary-500 mx-auto mb-2" />
              <p className="text-sm text-gray-600 mb-1">{hotel.address}</p>
              <p className="text-sm text-gray-500">{hotel.city}, {hotel.country}</p>
              <p className="text-xs text-client-primary-600 mt-2">
                Cliquez pour ouvrir dans Google Maps
              </p>
            </div>
          </div>
        </a>
      </div>

      <div className="text-sm text-gray-600 space-y-1">
        <p className="font-medium">{hotel.address}</p>
        <p>{hotel.zipCode} {hotel.city}, {hotel.country}</p>
      </div>
    </div>
  );
}

