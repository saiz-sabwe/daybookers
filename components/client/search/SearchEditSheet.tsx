"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { format, startOfDay } from "date-fns";
import { fr } from "date-fns/locale";
import { Calendar as CalendarIcon, MapPin, Clock, Search, Edit } from "lucide-react";
import { cn } from "@/lib/utils";
import { getTimeSlots } from "@/app/actions/time-slots/get";
import { TimeSlot } from "@/app/actions/time-slots/get";

interface SearchEditSheetProps {
  initialDate?: string | null;
  initialTimeSlotId?: string | null;
  initialLocation?: string | null;
}

const today = () => startOfDay(new Date());

export function SearchEditSheet({ initialDate, initialTimeSlotId, initialLocation }: SearchEditSheetProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [date, setDate] = useState<Date | undefined>(() => {
    if (!initialDate) return today();
    const d = new Date(initialDate);
    return startOfDay(d) < today() ? today() : d;
  });
  const [timeSlotId, setTimeSlotId] = useState<string>(initialTimeSlotId || "");
  const [location, setLocation] = useState<string>(initialLocation || "");
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    getTimeSlots().then(setTimeSlots);
  }, []);

  const handleSearch = () => {
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
    
    const queryString = params.toString();
    router.push(`/hotels${queryString ? `?${queryString}` : ""}`);
    setOpen(false);
  };

  if (!mounted) {
    return (
      <button
        type="button"
        className="text-client-primary-600 font-medium hover:underline flex items-center gap-1"
        disabled
      >
        <Edit className="w-4 h-4" />
        Modifier la recherche
      </button>
    );
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button className="text-client-primary-600 font-medium hover:underline flex items-center gap-1">
          <Edit className="w-4 h-4" />
          Modifier la recherche
        </button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Modifier votre recherche</SheetTitle>
          <SheetDescription>
            Ajustez vos critères de recherche pour trouver l'hôtel idéal
          </SheetDescription>
        </SheetHeader>
        
        <div className="mt-6 space-y-6">
          {/* Location Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Localisation</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                placeholder="Où allez-vous ?"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Date Picker */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Date</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP", { locale: fr }) : <span>Choisir une date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                  disabled={(date) => startOfDay(date) < startOfDay(new Date())}
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Time Slot */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Créneau horaire</label>
            <Select value={timeSlotId} onValueChange={setTimeSlotId}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Sélectionnez un créneau" />
              </SelectTrigger>
              <SelectContent>
                {timeSlots.map((slot) => (
                  <SelectItem key={slot.id} value={slot.id}>
                    {slot.name} ({slot.startTime} - {slot.endTime})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Search Button */}
          <Button 
            onClick={handleSearch}
            className="w-full bg-client-primary-500 hover:bg-client-primary-600 text-white"
          >
            <Search className="w-5 h-5 mr-2" />
            Rechercher
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

