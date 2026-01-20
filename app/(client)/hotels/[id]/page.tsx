import { HotelDetailsClient } from "./HotelDetailsClient";
import { RoomList } from "@/components/client/hotel/RoomList";
import { getHotelById } from "@/app/actions/hotels/get";
import { getRoomTypesByHotelId } from "@/app/actions/rooms/get";
import { Star, MapPin, Wifi, Car, Coffee, Dumbbell } from "lucide-react";
import { notFound } from "next/navigation";

// This is a server component
export default async function HotelDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const hotel = await getHotelById(id);
    const roomTypes = await getRoomTypesByHotelId(id);

    if (!hotel) {
        return notFound();
    }

    return (
        <div className="min-h-screen bg-gray-100 pb-20">
            <div className="bg-white border-b border-gray-200 py-4 shadow-sm">
                <div className="container mx-auto px-4">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                        <span>Accueil</span>
                        <span>/</span>
                        <span>RDC</span>
                        <span>/</span>
                        <span>Kinshasa</span>
                        <span>/</span>
                        <span className="text-gray-900 font-medium">{hotel.name}</span>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                {/* Header Info */}
                <div className="mb-8">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">{hotel.name}</h1>
                            <div className="flex items-center gap-4 text-gray-600">
                                <div className="flex items-center gap-1">
                                    {Array.from({ length: hotel.stars }).map((_, i) => (
                                        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                    ))}
                                </div>
                                <div className="flex items-center gap-1">
                                    <MapPin className="w-4 h-4" />
                                    <span>{hotel.city}, RDC</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col items-end">
                            <div className="flex items-center gap-2 bg-client-primary-50 px-3 py-1 rounded-lg">
                                <span className="text-2xl font-bold text-client-primary-700">{hotel.rating}</span>
                                <div className="flex flex-col items-start">
                                    <span className="font-bold text-client-primary-900 text-sm">Excellent</span>
                                    <span className="text-xs text-client-primary-600">{hotel.reviewCount} avis</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Gallery */}
                <div className="mb-12">
                    <HotelDetailsClient hotel={hotel} roomTypes={roomTypes} />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Description & Rooms */}
                    <div className="lg:col-span-2 space-y-12">
                        {/* Description */}
                        <section className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
                            <h2 className="text-xl font-bold mb-4">À propos de l'hôtel</h2>
                            <p className="text-gray-600 leading-relaxed">
                                {hotel.description || "Situé au cœur de Kinshasa, cet hôtel offre un cadre idéal pour vos séjours en journée. Profitez d'un design moderne et d'un confort exceptionnel. Que ce soit pour travailler au calme ou pour vous détendre, nos chambres sont équipées pour répondre à tous vos besoins."}
                            </p>

                            <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="flex items-center gap-2 text-gray-600">
                                    <Wifi className="w-5 h-5 text-client-primary-500" />
                                    <span>Wifi Haut Débit</span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-600">
                                    <Car className="w-5 h-5 text-client-primary-500" />
                                    <span>Parking</span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-600">
                                    <Coffee className="w-5 h-5 text-client-primary-500" />
                                    <span>Restaurant</span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-600">
                                    <Dumbbell className="w-5 h-5 text-client-primary-500" />
                                    <span>Salle de sport</span>
                                </div>
                            </div>
                        </section>

                        {/* Rooms */}
                        <RoomList roomTypes={roomTypes} hotelId={id} />
                    </div>

                    {/* Right Column: Map / Sticky Info */}
                    <div className="space-y-6">
                        <div className="bg-white p-4 rounded-xl shadow-md border border-gray-200 sticky top-24">
                            <div className="h-48 bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
                                <span className="text-gray-500 font-medium">Carte</span>
                            </div>
                            <h3 className="font-bold mb-2">Localisation</h3>
                            <p className="text-sm text-gray-600 mb-4">
                                {hotel.address}, {hotel.city}
                            </p>
                            <div className="space-y-2 text-sm text-gray-600">
                                <p>• Centre-ville (5 min)</p>
                                <p>• Aéroport N'Djili (30 min)</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
