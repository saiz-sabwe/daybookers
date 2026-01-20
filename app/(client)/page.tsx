import { SearchForm } from "@/components/client/SearchForm";
import { HotelCard } from "@/components/client/HotelCard";
import { getHotels } from "@/app/actions/hotels/get";
import { getTimeSlots } from "@/app/actions/time-slots/get";
import { Check, Shield, Clock, Star } from "lucide-react";
import Image from "next/image";

export default async function Home() {
  const hotels = await getHotels();
  const timeSlots = await getTimeSlots();
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative h-[500px] md:h-[600px] flex items-center justify-center">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=2070&auto=format&fit=crop"
            alt="Luxury Hotel"
            fill
            className="object-cover brightness-75"
            priority
          />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 container mx-auto px-4 text-center text-white mt-10">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 drop-shadow-lg">
            Réservez votre hôtel en journée
          </h1>
          <p className="text-xl md:text-2xl mb-10 max-w-2xl mx-auto drop-shadow-md font-light">
            Profitez d'une chambre d'hôtel pour quelques heures à prix réduit.
            <br className="hidden md:block" /> Idéal pour travailler, se détendre ou voyager.
          </p>

          {/* Search Form */}
          <div className="transform translate-y-8">
            <SearchForm />
          </div>
        </div>
      </section>

      {/* Value Props */}
      <section className="py-20 bg-white mt-12 hidden md:block">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="flex flex-col items-center p-6">
              <div className="w-16 h-16 bg-client-primary-50 rounded-full flex items-center justify-center mb-4 text-client-primary-500">
                <Clock className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-2">Jusqu'à -75%</h3>
              <p className="text-gray-500">Sur le prix de la nuitée pour une réservation de quelques heures.</p>
            </div>
            <div className="flex flex-col items-center p-6">
              <div className="w-16 h-16 bg-client-primary-50 rounded-full flex items-center justify-center mb-4 text-client-primary-500">
                <Shield className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-2">Annulation Gratuite</h3>
              <p className="text-gray-500">Annulez sans frais jusqu'à la dernière minute sur la plupart des offres.</p>
            </div>
            <div className="flex flex-col items-center p-6">
              <div className="w-16 h-16 bg-client-primary-50 rounded-full flex items-center justify-center mb-4 text-client-primary-500">
                <Check className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-2">Paiement à l'hôtel</h3>
              <p className="text-gray-500">Pas de carte bancaire requise pour réserver. Payez directement sur place.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Hotels */}
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Nos coups de cœur à Kinshasa</h2>
              <p className="text-gray-500">Sélectionnés pour leur charme et leur qualité de service</p>
            </div>
            <a href="/hotels" className="text-client-primary-600 font-medium hover:underline hidden md:block">
              Voir tous les hôtels
            </a>
          </div>

          {/* Bouton mobile en haut */}
          <div className="mb-6 text-center md:hidden">
            <a href="/hotels" className="text-client-primary-600 font-medium hover:underline">
              Voir tous les hôtels
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {hotels.slice(0, 4).map((hotel) => (
              <HotelCard
                key={hotel.id}
                {...hotel}
                image={hotel.images[0] || ""}
                reviewCount={hotel.reviewCount}
                timeSlots={timeSlots.slice(0, 3).map((slot) => `${slot.startTime} - ${slot.endTime}`)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* SEO Content / Footer Text */}
      <section className="py-16 bg-white border-t border-gray-100">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h2 className="text-2xl font-bold mb-6">Réservez votre hôtel en journée à Kinshasa</h2>
          <p className="text-gray-500 mb-4">
            DayBooker vous permet de réserver une chambre d'hôtel en journée pour quelques heures à Kinshasa, 
            à prix réduit. Profitez d'un espace confortable et professionnel sans réserver pour toute la nuit.
          </p>
          <p className="text-gray-500">
            Que vous ayez besoin d'un espace de travail, d'un moment de détente, ou d'un lieu pour une rencontre, 
            trouvez l'hôtel en journée qui correspond à vos besoins et à votre budget à Kinshasa.
          </p>
        </div>
      </section>
    </div>
  );
}
