import Link from "next/link";
import { CalendarDays, Clock3, Globe2, Hotel, LaptopMinimal, Plane } from "lucide-react";
import { PageHero, PageSection } from "@/components/client/content/PageShell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const formats = [
  {
    title: "Matinee productive",
    schedule: "08h00 - 13h00",
    description:
      "Le format ideal pour travailler au calme, avancer sur ses priorites et tenir ses rendez-vous du matin.",
  },
  {
    title: "Apres-midi de travail",
    schedule: "12h00 - 17h00",
    description:
      "Une solution confortable pour un bureau temporaire ou une attente utile en ville.",
  },
  {
    title: "After work detente",
    schedule: "16h00 - 22h00",
    description:
      "Quelques heures pour decompresser, recuperer ou profiter d'un cadre premium apres la journee.",
  },
  {
    title: "Journee complete",
    schedule: "08h00 - 22h00",
    description:
      "Le format full day pense pour le bureau nomade, les sessions de travail intenses et les projets d'equipe.",
  },
];

const audiences = [
  {
    icon: LaptopMinimal,
    title: "Professionnels en deplacement",
    description:
      "Un lieu calme entre deux rendez-vous, avec Wi-Fi stable, climatisation et intimite.",
  },
  {
    icon: Plane,
    title: "Voyageurs en transit",
    description:
      "Une attente confortable entre deux trajets, pres de l'aeroport ou au coeur de la ville.",
  },
  {
    icon: Globe2,
    title: "Citadins en quete de flexiblite",
    description:
      "Une nouvelle facon de profiter des infrastructures hotelieres sans reserver une nuit complete.",
  },
];

export default function PressPage() {
  return (
    <div className="bg-zinc-100">
      <PageHero
        eyebrow="Espace Presse | DayBooker RDC"
        title="DayBooker : la plateforme numerique qui reinvente l'hotellerie de courte duree en Afrique"
        description="Une nouvelle ere commence avec le lancement officiel de DayBooker, la premiere plateforme numerique dediee a la reservation de chambres d'hotel et d'espaces de travail pour quelques heures seulement."
      >
        <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
          <CalendarDays className="h-4 w-4" />
          <span>Kinshasa, [Date de publication]</span>
        </div>
      </PageHero>

      <PageSection
        title="Communique de presse"
        description="Pour diffusion immediate."
        className="bg-white"
      >
        <div className="space-y-6 text-lg leading-8 text-gray-700">
          <p>
            Dans les villes africaines dynamiques et etendues, les besoins de
            flexibilite sont immenses. Qu&apos;il s&apos;agisse d&apos;un professionnel entre
            deux rendez-vous au centre-ville, d&apos;un voyageur en attente d&apos;un vol
            ou d&apos;un citadin en quete de calme et d&apos;une connexion stable, DayBooker
            propose une solution inedite.
          </p>
          <p>
            La plateforme permet de reserver des espaces de prestige selon
            differents formats strategiques, en tenant compte des usages reels des
            grandes metropoles africaines et du besoin d&apos;acceder rapidement a des
            lieux fiables, confortables et accessibles.
          </p>
        </div>
      </PageSection>

      <PageSection
        title="La revolution du sejour hotelier en journee"
        description="Des formats concus pour les rythmes de vie des villes africaines."
      >
        <div className="grid gap-6 md:grid-cols-2">
          {formats.map((format) => (
            <Card key={format.title} className="border-gray-300 bg-white shadow-sm">
              <CardHeader>
                <div className="mb-4 flex items-center gap-2 text-sm font-medium text-client-primary-600">
                  <Clock3 className="h-4 w-4" />
                  {format.schedule}
                </div>
                <CardTitle className="text-xl text-gray-900">{format.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="leading-7 text-gray-600">{format.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </PageSection>

      <PageSection
        title="Une opportunite majeure pour les hoteliers africains"
        description="DayBooker transforme les chambres inoccupes en journee en nouvelles opportunites de revenus."
        className="bg-white"
      >
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="border-gray-300 bg-white shadow-sm">
            <CardHeader>
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-client-primary-50 text-client-primary-600">
                <Hotel className="h-6 w-6" />
              </div>
              <CardTitle>Optimiser les actifs hoteliers</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 leading-7 text-gray-600">
              <p>
                DayBooker permet aux hotels, des grands complexes internationaux
                aux boutiques-hotels de milieu de gamme, de generer des revenus
                additionnels sans perturber leurs reservations de nuit.
              </p>
              <p>
                Comme le rappelle l&apos;equipe de direction, l&apos;enjeu n&apos;est pas
                seulement de vendre des chambres, mais d&apos;optimiser des actifs
                immobiliers deja disponibles.
              </p>
            </CardContent>
          </Card>

          <Card className="border-gray-300 bg-white shadow-sm">
            <CardHeader>
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-client-primary-50 text-client-primary-600">
                <Globe2 className="h-6 w-6" />
              </div>
              <CardTitle>Technologie et accessibilite</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 leading-7 text-gray-600">
              <p>
                Fidele a ses racines africaines, DayBooker investit dans une
                interface intuitive adaptee aux realites locales, avec reservation
                instantanee, securite des donnees et acces simplifie aux meilleures
                infrastructures de la ville.
              </p>
              <p>
                Piscines, salles de sport, salons d&apos;affaires ou chambres
                climatisees deviennent plus accessibles pour les clients comme
                pour les partenaires hoteliers.
              </p>
            </CardContent>
          </Card>
        </div>
      </PageSection>

      <PageSection
        title="Les besoins auxquels DayBooker repond"
        description="Une plateforme pensee pour des usages urbains tres concrets."
      >
        <div className="grid gap-6 md:grid-cols-3">
          {audiences.map((item) => {
            const Icon = item.icon;

            return (
              <Card key={item.title} className="border-gray-300 bg-white shadow-sm">
                <CardHeader>
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-client-primary-50 text-client-primary-600">
                    <Icon className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-xl">{item.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="leading-7 text-gray-600">{item.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="mt-10 flex flex-wrap gap-4">
          <Button asChild className="bg-black text-white hover:bg-gray-800">
            <Link href="/contact">Contacter DayBooker</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/a-propos">En savoir plus sur DayBooker</Link>
          </Button>
        </div>
      </PageSection>
    </div>
  );
}
