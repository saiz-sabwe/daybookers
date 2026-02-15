"use client";

import { MapPin } from "lucide-react";
import { Hotel } from "@/types";
import { cn } from "@/lib/utils";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix pour les icônes Leaflet avec Next.js
if (typeof window !== "undefined") {
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
    iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
  });
}

interface HotelMapProps {
  hotel: Hotel;
  className?: string;
  height?: string;
}

// Charger dynamiquement le composant Map de react-leaflet côté client uniquement
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);

const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);

const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
);

const Popup = dynamic(
  () => import("react-leaflet").then((mod) => mod.Popup),
  { ssr: false }
);

export function HotelMap({ hotel, className, height = "400px" }: HotelMapProps) {
  // Vérifier si l'hôtel a des coordonnées
  const hasCoordinates = hotel.latitude && hotel.longitude;

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center gap-2">
        <MapPin className="w-5 h-5 text-client-primary-500" />
        <h3 className="text-lg font-semibold text-gray-900">Localisation</h3>
      </div>

      <div className="rounded-lg overflow-hidden border border-gray-200 shadow-sm">
        {hasCoordinates ? (
          <MapContainer
            center={[hotel.latitude!, hotel.longitude!]}
            zoom={15}
            scrollWheelZoom={false}
            style={{ height, width: "100%" }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={[hotel.latitude!, hotel.longitude!]}>
              <Popup>
                <div className="p-2">
                  <h4 className="font-bold text-gray-900">{hotel.name}</h4>
                  <p className="text-sm text-gray-600">{hotel.address}</p>
                </div>
              </Popup>
            </Marker>
          </MapContainer>
        ) : (
          <a
            href={`https://www.google.com/maps?q=${encodeURIComponent(hotel.address + ", " + hotel.city)}`}
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
        )}
      </div>

      <div className="text-sm text-gray-600 space-y-1">
        <p className="font-medium">{hotel.address}</p>
        <p>{hotel.city}, {hotel.country}</p>
      </div>
    </div>
  );
}

