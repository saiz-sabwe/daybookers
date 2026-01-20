"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface HotelGalleryProps {
    images: string[];
}

export function HotelGallery({ images }: HotelGalleryProps) {
    const [selectedImage, setSelectedImage] = useState(0);

    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 h-[400px] md:h-[500px]">
            {/* Main Image */}
            <div className="md:col-span-3 h-full relative group cursor-pointer overflow-hidden rounded-xl">
                <img
                    src={images[selectedImage]}
                    alt="Hotel Main View"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
            </div>

            {/* Thumbnails */}
            <div className="hidden md:flex flex-col gap-4 h-full">
                {images.slice(0, 3).map((image, index) => (
                    <div
                        key={index}
                        className={cn(
                            "flex-1 relative cursor-pointer overflow-hidden rounded-xl border-2 transition-all",
                            selectedImage === index ? "border-client-primary-500" : "border-transparent"
                        )}
                        onClick={() => setSelectedImage(index)}
                    >
                        <img
                            src={image}
                            alt={`Thumbnail ${index + 1}`}
                            className="w-full h-full object-cover hover:opacity-80 transition-opacity"
                        />
                    </div>
                ))}
                {images.length > 3 && (
                    <div className="flex-1 relative cursor-pointer overflow-hidden rounded-xl bg-gray-900 flex items-center justify-center text-white font-bold hover:bg-gray-800 transition-colors">
                        +{images.length - 3} photos
                    </div>
                )}
            </div>
        </div>
    );
}
