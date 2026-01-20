"use client";

import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import { useFilters } from "@/contexts/FilterContext";

const amenityMap: Record<string, string> = {
    "Wifi Gratuit": "wifi",
    "Piscine": "pool",
    "Spa": "spa",
    "Parking": "parking",
    "Restaurant": "restaurant",
    "Salle de sport": "gym",
};

export function FilterSidebar() {
    const {
        priceRange,
        setPriceRange,
        selectedStars,
        setSelectedStars,
        selectedAmenities,
        setSelectedAmenities,
        resetFilters,
    } = useFilters();

    const handleStarToggle = (star: number) => {
        if (selectedStars.includes(star)) {
            setSelectedStars(selectedStars.filter((s) => s !== star));
        } else {
            setSelectedStars([...selectedStars, star]);
        }
    };

    const handleAmenityToggle = (amenity: string) => {
        const amenityKey = amenityMap[amenity];
        if (selectedAmenities.includes(amenityKey)) {
            setSelectedAmenities(selectedAmenities.filter((a) => a !== amenityKey));
        } else {
            setSelectedAmenities([...selectedAmenities, amenityKey]);
        }
    };

    return (
        <div className="w-full md:w-64 flex-shrink-0 space-y-8">
            {/* Map Toggle (Mock) */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <div className="h-32 bg-gray-200 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-300 transition-colors">
                    <span className="font-medium text-gray-600">Voir la carte</span>
                </div>
            </div>

            {/* Filters Container */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-8">

                {/* Price Filter */}
                <div>
                    <h3 className="font-bold text-gray-900 mb-4">Prix</h3>
                    <Slider
                        defaultValue={[50, 300]}
                        max={500}
                        step={10}
                        value={priceRange}
                        onValueChange={(value) => setPriceRange(value as [number, number])}
                        className="mb-4"
                    />
                    <div className="flex justify-between text-sm text-gray-600">
                        <span>${priceRange[0]}</span>
                        <span>${priceRange[1]}+</span>
                    </div>
                </div>

                <div className="h-px bg-gray-100" />

                {/* Stars Filter */}
                <div>
                    <h3 className="font-bold text-gray-900 mb-4">Étoiles</h3>
                    <div className="space-y-3">
                        {[5, 4, 3, 2].map((star) => (
                            <div key={star} className="flex items-center space-x-2">
                                <Checkbox
                                    id={`star-${star}`}
                                    checked={selectedStars.includes(star)}
                                    onCheckedChange={() => handleStarToggle(star)}
                                />
                                <Label htmlFor={`star-${star}`} className="flex items-center gap-1 cursor-pointer font-normal">
                                    <span className="flex">
                                        {Array.from({ length: star }).map((_, i) => (
                                            <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                        ))}
                                    </span>
                                </Label>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="h-px bg-gray-100" />

                {/* Amenities Filter */}
                <div>
                    <h3 className="font-bold text-gray-900 mb-4">Équipements</h3>
                    <div className="space-y-3">
                        {["Wifi Gratuit", "Piscine", "Spa", "Parking", "Restaurant", "Salle de sport"].map((item) => {
                            const amenityKey = amenityMap[item];
                            return (
                                <div key={item} className="flex items-center space-x-2">
                                    <Checkbox
                                        id={`amenity-${item}`}
                                        checked={selectedAmenities.includes(amenityKey)}
                                        onCheckedChange={() => handleAmenityToggle(item)}
                                    />
                                    <Label htmlFor={`amenity-${item}`} className="cursor-pointer font-normal text-gray-600">
                                        {item}
                                    </Label>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="h-px bg-gray-100" />

                {/* Reset Button */}
                <Button variant="outline" className="w-full" onClick={resetFilters}>
                    Réinitialiser les filtres
                </Button>

            </div>
        </div>
    );
}
