import { FilterSidebar } from "@/components/client/search/FilterSidebar";
import { HotelList } from "@/components/client/search/HotelList";
import { SearchForm } from "@/components/client/SearchForm";
import { FilterProvider } from "@/contexts/FilterContext";
import { getHotels } from "@/app/actions/hotels/get";
import { getTimeSlots } from "@/app/actions/time-slots/get";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface SearchParams {
    date?: string;
    timeSlot?: string;
    location?: string;
}

export default async function SearchResultsPage({
    searchParams,
}: {
    searchParams: Promise<SearchParams>;
}) {
    const params = await searchParams;
    const [hotels, timeSlots] = await Promise.all([
        getHotels(),
        getTimeSlots(),
    ]);
    
    // Extraire les paramètres de recherche
    const selectedDate = params.date || null;
    const selectedTimeSlotId = params.timeSlot || null;
    const selectedLocation = params.location || null;
    
    // Formater la date pour l'affichage
    const formattedDate = selectedDate 
        ? format(new Date(selectedDate), "PPP", { locale: fr })
        : "Aujourd'hui";
    
    // Trouver le nom du créneau horaire
    const selectedTimeSlot = timeSlots.find(ts => ts.id === selectedTimeSlotId);
    const timeSlotLabel = selectedTimeSlot ? selectedTimeSlot.name : "En journée";
    
    return (
        <FilterProvider>
            <div className="min-h-screen bg-gray-100 pb-20">
                {/* Compact Search Bar Header */}
                <div className="bg-white border-b border-gray-200 py-4 shadow-sm sticky top-16 z-40">
                    <div className="container mx-auto px-4">
                        <div className="hidden md:block">
                            <div className="flex items-center gap-4 text-sm">
                                <div className="font-bold text-lg">
                                    {selectedLocation || "Kinshasa, RDC"}
                                </div>
                                <div className="h-4 w-px bg-gray-300"></div>
                                <div className="text-gray-600">{formattedDate}</div>
                                <div className="h-4 w-px bg-gray-300"></div>
                                <div className="text-gray-600">{timeSlotLabel}</div>
                                <a 
                                    href="/" 
                                    className="ml-auto text-client-primary-600 font-medium hover:underline"
                                >
                                    Modifier la recherche
                                </a>
                            </div>
                        </div>
                        <div className="md:hidden">
                            <SearchForm />
                        </div>
                    </div>
                </div>

                <div className="container mx-auto px-4 py-8 flex flex-col md:flex-row gap-8">
                    <FilterSidebar />
                    <HotelList 
                        hotels={hotels} 
                        timeSlots={timeSlots}
                        selectedDate={selectedDate}
                        selectedTimeSlotId={selectedTimeSlotId}
                    />
                </div>
            </div>
        </FilterProvider>
    );
}
