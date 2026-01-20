"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Calendar as CalendarIcon, MapPin, Clock, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { getTimeSlots } from "@/app/actions/time-slots/get";
import { TimeSlot } from "@/app/actions/time-slots/get";

export function SearchForm() {
    const router = useRouter();
    const [date, setDate] = useState<Date | undefined>(new Date());
    const [timeSlotId, setTimeSlotId] = useState<string>("");
    const [location, setLocation] = useState<string>("");
    const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);

    // Charger les timeSlots depuis la base de données
    useEffect(() => {
        getTimeSlots().then(setTimeSlots);
    }, []);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        
        // Construire l'URL avec les paramètres de recherche
        const params = new URLSearchParams();
        
        if (date) {
            params.set("date", format(date, "yyyy-MM-dd"));
        }
        
        if (timeSlotId) {
            params.set("timeSlot", timeSlotId);
        }
        
        if (location) {
            params.set("location", location);
        }
        
        // Rediriger vers la page des résultats avec les paramètres
        const queryString = params.toString();
        router.push(`/hotels${queryString ? `?${queryString}` : ""}`);
    };

    return (
        <form onSubmit={handleSearch} className="bg-white p-4 rounded-xl shadow-lg max-w-4xl mx-auto flex flex-col md:flex-row gap-4 items-center">
            {/* Location Input */}
            <div className="flex-1 w-full relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10">
                    <MapPin className="w-5 h-5" />
                </div>
                <Input
                    placeholder="Où allez-vous ?"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="pl-10 h-12 border-gray-200 focus:border-client-primary-500 focus:ring-client-primary-500 text-base text-gray-900"
                />
            </div>

            <div className="h-8 w-px bg-gray-200 hidden md:block" />

            {/* Date Picker */}
            <div className="w-full md:w-auto">
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            variant={"outline"}
                            className={cn(
                                "w-full md:w-[240px] h-12 justify-start text-left font-normal border-gray-200 hover:bg-gray-50 text-gray-900",
                                !date && "text-gray-500"
                            )}
                        >
                            <CalendarIcon className="mr-2 h-4 w-4 text-gray-400" />
                            {date ? (
                                <span className="text-gray-900">{format(date, "PPP", { locale: fr })}</span>
                            ) : (
                                <span className="text-gray-500">Date</span>
                            )}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 bg-white border-gray-200 shadow-lg" align="start">
                        <Calendar
                            mode="single"
                            selected={date}
                            onSelect={setDate}
                            initialFocus
                            className="bg-white"
                        />
                    </PopoverContent>
                </Popover>
            </div>

            <div className="h-8 w-px bg-gray-200 hidden md:block" />

            {/* Time Slot */}
            <div className="w-full md:w-[200px] relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10 pointer-events-none">
                    <Clock className="w-4 h-4 text-gray-400" />
                </div>
                <Select value={timeSlotId} onValueChange={setTimeSlotId}>
                    <SelectTrigger className="w-full h-12 pl-10 pr-8 border-gray-200 bg-white text-gray-900 focus:border-client-primary-500 focus:ring-client-primary-500">
                        <SelectValue placeholder="Créneau horaire" className="text-gray-900" />
                    </SelectTrigger>
                    <SelectContent className="bg-white text-gray-900 border-gray-200">
                        {timeSlots.map((slot) => (
                            <SelectItem key={slot.id} value={slot.id} className="text-gray-900 cursor-pointer">
                                {slot.name} ({slot.startTime} - {slot.endTime})
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Search Button */}
            <Button 
                type="submit"
                className="w-full md:w-auto h-12 px-8 bg-client-primary-500 hover:bg-client-primary-600 text-white font-bold text-lg rounded-lg shadow-md transition-transform active:scale-95"
            >
                <Search className="w-5 h-5 md:hidden mr-2" />
                <span className="hidden md:inline">Rechercher</span>
                <span className="md:hidden">Rechercher</span>
            </Button>
        </form>
    );
}
