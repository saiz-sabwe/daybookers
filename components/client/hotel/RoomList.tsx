import { Button } from "@/components/ui/button";
import { Clock, Check } from "lucide-react";
import Link from "next/link";
import { RoomTypeWithAvailability } from "@/app/actions/rooms/get";
import Image from "next/image";

interface RoomListProps {
    roomTypes: RoomTypeWithAvailability[];
    hotelId: string;
}

export function RoomList({ roomTypes, hotelId }: RoomListProps) {
    if (roomTypes.length === 0) {
        return (
            <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Choisissez votre chambre et votre créneau</h2>
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
                    <p className="text-gray-500">Aucun type de chambre disponible pour cet hôtel.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Choisissez votre chambre et votre créneau</h2>

            {roomTypes.map((room) => (
                <div key={room.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col md:flex-row">
                    {/* Room Image */}
                    <div className="w-full md:w-1/3 h-48 md:h-auto relative">
                        {room.images && room.images.length > 0 ? (
                            <Image
                                src={room.images[0]}
                                alt={room.name}
                                fill
                                className="object-cover"
                            />
                        ) : (
                            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                <span className="text-gray-400">Pas d'image</span>
                            </div>
                        )}
                    </div>

                    {/* Room Details & Slots */}
                    <div className="flex-1 p-6">
                        <div className="mb-4">
                            <h3 className="text-xl font-bold text-gray-900">{room.name}</h3>
                            <p className="text-gray-500 text-sm mt-1">{room.description || "Chambre confortable et élégante."}</p>
                            <div className="flex gap-4 mt-3 text-sm text-gray-600">
                                <span className="flex items-center gap-1"><Check className="w-4 h-4 text-green-500" /> Jusqu'à {room.maxGuests} personnes</span>
                                <span className="flex items-center gap-1"><Check className="w-4 h-4 text-green-500" /> Annulation Gratuite</span>
                            </div>
                        </div>

                        <div className="border-t border-gray-100 pt-4">
                            <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                                <Clock className="w-4 h-4" /> Créneaux disponibles
                            </h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                {room.timeSlots.map((slot) => {
                                    const price = room.basePrice;
                                    const originalPrice = Math.round(price * 1.5);
                                    return (
                                        <div key={slot.id} className="border border-gray-200 rounded-lg p-3 hover:border-client-primary-500 hover:bg-client-primary-50 cursor-pointer transition-all group">
                                            <div className="flex justify-between items-center mb-1">
                                                <span className="font-bold text-gray-900">{slot.startTime} - {slot.endTime}</span>
                                            </div>
                                            <div className="flex justify-between items-end">
                                                <div className="flex flex-col">
                                                    <span className="text-xs text-gray-400 line-through">{room.currency} {originalPrice}</span>
                                                    <span className="font-bold text-client-primary-600 text-lg">{room.currency} {price}</span>
                                                </div>
                                                <Button size="sm" className="bg-client-primary-500 hover:bg-client-primary-600 text-white" asChild>
                                                    <Link href={`/booking?hotelId=${hotelId}&roomTypeId=${room.id}&timeSlotId=${slot.id}`}>Réserver</Link>
                                                </Button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
