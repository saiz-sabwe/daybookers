"use client";

import { useMemo, useState } from "react";
import { HotelCard } from "@/components/client/HotelCard";
import { useFilters } from "@/contexts/FilterContext";
import { Hotel } from "@/types";
import { TimeSlot } from "@/app/actions/time-slots/get";

interface HotelListProps {
    hotels: Hotel[];
    timeSlots: TimeSlot[];
    selectedDate?: string | null;
    selectedTimeSlotId?: string | null;
}

export function HotelList({ hotels, timeSlots, selectedDate, selectedTimeSlotId }: HotelListProps) {
    const { priceRange, selectedStars, selectedAmenities } = useFilters();
    const [sortBy, setSortBy] = useState<string>("pertinence");

    const filteredHotels = useMemo(() => {
        let filtered: Hotel[] = [...hotels];

        // Filter by price
        filtered = filtered.filter(
            (hotel) => hotel.minPrice >= priceRange[0] && hotel.minPrice <= priceRange[1]
        );

        // Filter by stars
        if (selectedStars.length > 0) {
            filtered = filtered.filter((hotel) => selectedStars.includes(hotel.stars));
        }

        // Filter by amenities
        if (selectedAmenities.length > 0) {
            filtered = filtered.filter((hotel) =>
                selectedAmenities.every((amenity) => hotel.amenities.includes(amenity))
            );
        }

        // Sort
        const sorted = [...filtered];
        switch (sortBy) {
            case "prix-croissant":
                sorted.sort((a, b) => a.minPrice - b.minPrice);
                break;
            case "prix-decroissant":
                sorted.sort((a, b) => b.minPrice - a.minPrice);
                break;
            case "note":
                sorted.sort((a, b) => b.rating - a.rating);
                break;
            default:
                // Pertinence (par défaut, garder l'ordre original)
                break;
        }

        return sorted;
    }, [priceRange, selectedStars, selectedAmenities, sortBy]);

    return (
        <div className="flex-1">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900">
                    {filteredHotels.length} hôtel{filteredHotels.length > 1 ? "s" : ""} disponible{filteredHotels.length > 1 ? "s" : ""} à Kinshasa
                </h1>
                <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">Trier par:</span>
                    <select
                        className="text-sm font-medium bg-transparent border-none focus:ring-0 cursor-pointer text-gray-900"
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                    >
                        <option value="pertinence">Pertinence</option>
                        <option value="prix-croissant">Prix croissant</option>
                        <option value="prix-decroissant">Prix décroissant</option>
                        <option value="note">Note</option>
                    </select>
                </div>
            </div>

            {filteredHotels.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-gray-500 text-lg mb-2">Aucun hôtel ne correspond à vos critères</p>
                    <p className="text-gray-400 text-sm">Essayez de modifier vos filtres</p>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredHotels.map((hotel) => {
                            // Si un créneau est sélectionné, n'afficher que celui-ci
                            const displayTimeSlots = selectedTimeSlotId
                                ? timeSlots
                                    .filter((slot) => slot.id === selectedTimeSlotId)
                                    .map((slot) => `${slot.startTime} - ${slot.endTime}`)
                                : timeSlots.slice(0, 3).map((slot) => `${slot.startTime} - ${slot.endTime}`);
                            
                            return (
                                <HotelCard
                                    key={hotel.id}
                                    {...hotel}
                                    image={hotel.images[0] || ""}
                                    reviewCount={hotel.reviewCount}
                                    timeSlots={displayTimeSlots}
                                />
                            );
                        })}
                    </div>

                    {/* Pagination Mock */}
                    <div className="mt-12 flex justify-center gap-2">
                        <button className="w-10 h-10 rounded-full bg-client-primary-500 text-white font-bold flex items-center justify-center">1</button>
                        <button className="w-10 h-10 rounded-full hover:bg-gray-100 text-gray-600 font-medium flex items-center justify-center">2</button>
                        <button className="w-10 h-10 rounded-full hover:bg-gray-100 text-gray-600 font-medium flex items-center justify-center">3</button>
                    </div>
                </>
            )}
        </div>
    );
}
