"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface FilterContextType {
  priceRange: [number, number];
  setPriceRange: (range: [number, number]) => void;
  selectedStars: number[];
  setSelectedStars: (stars: number[]) => void;
  selectedAmenities: string[];
  setSelectedAmenities: (amenities: string[]) => void;
  resetFilters: () => void;
}

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export function FilterProvider({ children }: { children: ReactNode }) {
  const [priceRange, setPriceRange] = useState<[number, number]>([50, 300]);
  const [selectedStars, setSelectedStars] = useState<number[]>([]);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);

  const resetFilters = () => {
    setPriceRange([50, 300]);
    setSelectedStars([]);
    setSelectedAmenities([]);
  };

  return (
    <FilterContext.Provider
      value={{
        priceRange,
        setPriceRange,
        selectedStars,
        setSelectedStars,
        selectedAmenities,
        setSelectedAmenities,
        resetFilters,
      }}
    >
      {children}
    </FilterContext.Provider>
  );
}

export function useFilters() {
  const context = useContext(FilterContext);
  if (context === undefined) {
    throw new Error("useFilters must be used within a FilterProvider");
  }
  return context;
}

