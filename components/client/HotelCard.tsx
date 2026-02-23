import Link from "next/link";
import Image from "next/image";
import { Star, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HotelCardProps {
    id: string;
    name: string;
    city: string;
    image: string;
    stars: number;
    rating: number;
    reviewCount: number;
    minPrice: number;
    originalPrice?: number;
    timeSlots: string[];
}

export function HotelCard({
    id,
    name,
    city,
    image,
    stars,
    rating,
    reviewCount,
    minPrice,
    originalPrice,
    timeSlots
}: HotelCardProps) {
    const discount = originalPrice ? Math.round(((originalPrice - minPrice) / originalPrice) * 100) : 0;

    return (
        <div className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 border border-gray-100 flex flex-col h-full">
            {/* Image Container */}
            <Link href={`/hotels/${id}`} className="relative h-48 overflow-hidden block">
                <Image
                    src={image}
                    alt={name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                {discount > 0 && (
                    <div className="absolute top-3 left-3 bg-client-primary-500 text-white text-xs font-bold px-2 py-1 rounded">
                        -{discount}%
                    </div>
                )}
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-bold text-gray-800 flex items-center gap-1">
                    {stars} <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                </div>
            </Link>

            {/* Content */}
            <div className="p-4 flex flex-col flex-1">
                <div className="flex justify-between items-start mb-2">
                    <div>
                        <Link href={`/hotels/${id}`}>
                            <h3 className="font-bold text-lg text-gray-900 leading-tight group-hover:text-client-primary-600 transition-colors cursor-pointer">{name}</h3>
                        </Link>
                        <p className="text-sm text-gray-500">{city}</p>
                    </div>
                    <div className="flex flex-col items-end">
                        <div className="flex items-center gap-1 bg-client-primary-50 px-1.5 py-0.5 rounded">
                            <span className="font-bold text-client-primary-700 text-sm">{rating}</span>
                            <span className="text-[10px] text-client-primary-600">/10</span>
                        </div>
                        <span className="text-xs text-gray-400 mt-0.5">{reviewCount} avis</span>
                    </div>
                </div>

                {/* Time Slots Preview */}
                <div className="mt-3 mb-4 flex flex-wrap gap-2">
                    {timeSlots.slice(0, 2).map((slot, i) => (
                        <div key={i} className="flex items-center gap-1 text-xs text-gray-600 bg-gray-50 px-2 py-1 rounded border border-gray-100">
                            <Clock className="w-3 h-3 text-gray-400" />
                            {slot}
                        </div>
                    ))}
                    {timeSlots.length > 2 && (
                        <span className="text-xs text-gray-400 self-center">+{timeSlots.length - 2} créneaux</span>
                    )}
                </div>

                <div className="mt-auto pt-4 border-t border-gray-100">
                    <div className="flex flex-col">
                        <span className="text-xs text-gray-500">À partir de</span>
                        <div className="flex items-baseline gap-2">
                            <span className="text-2xl font-bold text-gray-900">${minPrice}</span>
                            {originalPrice && (
                                <span className="text-sm text-gray-400 line-through">${originalPrice}</span>
                            )}
                            <span className="text-xs text-gray-500">/ créneau</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
