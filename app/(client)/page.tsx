import { SearchForm } from "@/components/client/SearchForm";
import { HotelCard } from "@/components/client/HotelCard";
import { getHotels } from "@/app/actions/hotels/get";
import { getTimeSlots } from "@/app/actions/time-slots/get";
import { Check, Shield, Clock } from "lucide-react";
import Image from "next/image";

const valueProps = [
  {
    icon: Clock,
    title: "Jusqu'à -75%",
    description: "Sur le prix de la nuitée",
  },
  {
    icon: Shield,
    title: "Annulation gratuite",
    description: "Sans frais jusqu'à la dernière minute",
  },
  {
    icon: Check,
    title: "Paiement à l'hôtel",
    description: "Pas de carte requise",
  },
];

export default async function Home() {
  const hotels = await getHotels();
  const timeSlots = await getTimeSlots();

  return (
    <div className="flex flex-col">
      <section className="relative overflow-hidden border-b border-gray-200">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=2070&auto=format&fit=crop"
            alt="Luxury Hotel"
            fill
            className="object-cover brightness-[0.55]"
            priority
          />
        </div>

        <div className="relative z-10 container mx-auto px-4 py-5 md:py-6">
          <div className="mb-4 max-w-2xl">
            <h1 className="text-xl font-bold text-white drop-shadow-sm md:text-2xl">
              Réservez votre hôtel en journée
            </h1>
            <p className="mt-1 text-sm text-white/90 md:text-base">
              Quelques heures à prix réduit — idéal pour travailler ou se détendre.
            </p>
          </div>
          <SearchForm compact />
        </div>
      </section>

      <section className="border-b border-gray-200 bg-white">
        <div className="container mx-auto px-4 py-2.5">
          <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:justify-center sm:gap-x-8 sm:gap-y-1 md:justify-between">
            {valueProps.map((item, index) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="flex items-center gap-2 text-sm text-gray-700"
                >
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-client-primary-50 text-client-primary-600">
                    <Icon className="h-3.5 w-3.5" />
                  </div>
                  <span className="font-semibold text-gray-900">{item.title}</span>
                  <span className="hidden text-gray-500 lg:inline">
                    — {item.description}
                  </span>
                  {index < valueProps.length - 1 && (
                    <span className="mx-2 hidden h-4 w-px bg-gray-200 md:inline" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-gray-100 py-8 md:py-10">
        <div className="container mx-auto px-4">
          <div className="mb-6 flex items-end justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 md:text-3xl">
                Nos coups de cœur à Kinshasa
              </h2>
              <p className="mt-1 text-sm text-gray-500 md:text-base">
                Sélectionnés pour leur charme et leur qualité de service
              </p>
            </div>
            <a
              href="/hotels"
              className="hidden text-sm font-medium text-client-primary-600 hover:underline md:block"
            >
              Voir tous les hôtels
            </a>
          </div>

          <div className="mb-4 text-center md:hidden">
            <a
              href="/hotels"
              className="text-sm font-medium text-client-primary-600 hover:underline"
            >
              Voir tous les hôtels
            </a>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
            {hotels.slice(0, 4).map((hotel) => (
              <HotelCard
                key={hotel.id}
                {...hotel}
                image={hotel.images[0] || ""}
                reviewCount={hotel.reviewCount}
                timeSlots={timeSlots
                  .slice(0, 3)
                  .map((slot) => `${slot.startTime} - ${slot.endTime}`)}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-gray-100 bg-white py-10">
        <div className="container mx-auto max-w-4xl px-4 text-center">
          <h2 className="mb-4 text-xl font-bold md:text-2xl">
            Réservez votre hôtel en journée à Kinshasa
          </h2>
          <p className="mb-3 text-sm text-gray-500 md:text-base">
            DayBooker vous permet de réserver une chambre d&apos;hôtel en journée
            pour quelques heures à Kinshasa, à prix réduit. Profitez d&apos;un
            espace confortable sans réserver pour toute la nuit.
          </p>
          <p className="text-sm text-gray-500 md:text-base">
            Travail, détente ou rendez-vous : trouvez l&apos;hôtel en journée
            adapté à vos besoins à Kinshasa.
          </p>
        </div>
      </section>
    </div>
  );
}
