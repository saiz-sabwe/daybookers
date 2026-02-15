"use client";

import { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { Hotel } from "@/types";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix pour les icônes Leaflet avec Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

interface HotelMapViewProps {
  hotels: Hotel[];
  selectedHotelId?: string;
  onHotelSelect?: (hotelId: string) => void;
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

export function HotelMapView({
  hotels,
  selectedHotelId,
  onHotelSelect,
  className = "",
  height = "500px",
}: HotelMapViewProps) {
  // Filtrer les hôtels qui ont des coordonnées
  const hotelsWithCoords = hotels.filter(
    (hotel) => hotel.latitude && hotel.longitude
  );

  // Calculer le centre de la carte basé sur les hôtels
  const center: [number, number] = hotelsWithCoords.length > 0
    ? [
        hotelsWithCoords.reduce((sum, hotel) => sum + (hotel.latitude || 0), 0) / hotelsWithCoords.length,
        hotelsWithCoords.reduce((sum, hotel) => sum + (hotel.longitude || 0), 0) / hotelsWithCoords.length,
      ]
    : [-4.3276, 15.3136]; // Kinshasa par défaut

  if (hotelsWithCoords.length === 0) {
    return (
      <div
        className={`bg-gray-100 rounded-lg flex items-center justify-center ${className}`}
        style={{ height }}
      >
        <div className="text-center text-gray-500">
          <p className="font-medium">Aucun hôtel avec localisation disponible</p>
          <p className="text-sm mt-1">Les coordonnées GPS seront ajoutées prochainement</p>
        </div>
      </div>
    );
  }

  return (
    <div className={className} style={{ height }}>
      <MapContainer
        center={center}
        zoom={12}
        scrollWheelZoom={false}
        style={{ height: "100%", width: "100%", borderRadius: "0.5rem" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {hotelsWithCoords.map((hotel) => (
          <Marker
            key={hotel.id}
            position={[hotel.latitude!, hotel.longitude!]}
            eventHandlers={{
              click: () => onHotelSelect?.(hotel.id),
            }}
          >
            <Popup>
              <div className="p-2">
                <h3 className="font-bold text-gray-900">{hotel.name}</h3>
                <p className="text-sm text-gray-600">{hotel.address}</p>
                <p className="text-sm text-gray-600">{hotel.city}, {hotel.country}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-lg font-bold text-client-primary-600">
                    ${hotel.minPrice}
                  </span>
                  <span className="text-xs text-gray-500">/ créneau</span>
                </div>
                <a
                  href={`/hotels/${hotel.id}`}
                  className="inline-block mt-2 px-3 py-1 bg-client-primary-500 text-white text-sm rounded hover:bg-client-primary-600"
                >
                  Voir détails
                </a>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

