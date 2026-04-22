import Link from "next/link";
import { ArrowRight, BriefcaseBusiness, Building2, MapPinned, Zap } from "lucide-react";
import { PageHero, PageSection } from "@/components/client/content/PageShell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const reasons = [
  {
    icon: Zap,
    title: "L'innovation au coeur de l'Afrique",
    description:
      "Travaillez sur des problematiques concretes comme le paiement mobile, la geolocalisation et l'optimisation en temps reel dans les villes les plus dynamiques du continent.",
  },
  {
    icon: BriefcaseBusiness,
    title: "Un impact reel",
    description:
      "Chaque ligne de code et chaque partenariat signe aide les hoteliers locaux a accroitre leurs revenus et les professionnels a gagner en productivite.",
  },
  {
    icon: Building2,
    title: "Flexibilite et culture",
    description:
      "Nous croyons au travail par objectifs, a la flexibilite des horaires et a l'epanouissement personnel, a l'image de notre produit.",
  },
  {
    icon: MapPinned,
    title: "Une ambition panafricaine",
    description:
      "Aujourd'hui Kinshasa, demain Abidjan, Johannesburg et au-dela. Rejoignez une structure qui veut voir grand.",
  },
];

const departments = [
  {
    name: "Technologie & Produit",
    mission:
      "Developper une plateforme robuste, fluide et adaptee aux reseaux et usages locaux.",
  },
  {
    name: "Business Development",
    mission:
      "Convaincre les plus beaux hotels de la capitale et construire un ecosysteme partenaire solide.",
  },
  {
    name: "Operations & Support",
    mission:
      "Garantir une experience client 5 etoiles et accompagner les etablissements partenaires.",
  },
  {
    name: "Marketing & Growth",
    mission:
      "Faire de DayBooker le reflexe numero 1 des Africains pour leurs besoins en journee.",
  },
];

const values = [
  {
    title: "L'obsession client",
    description:
      "Qu'il s'agisse d'un businessman, d'un voyageur ou d'un hotelier, leur satisfaction est notre boussole.",
  },
  {
    title: "L'agilite",
    description:
      "En Afrique, les defis sont nombreux. Nous pivotons, nous apprenons et nous avancons vite.",
  },
  {
    title: "L'integrite",
    description:
      "Nous cultivons une transparence totale avec nos partenaires et nos utilisateurs.",
  },
  {
    title: "La fierte locale",
    description:
      "Nous voulons demontrer l'excellence du genie technologique africain.",
  },
];

export default function CareersPage() {
  return (
    <div className="bg-zinc-100">
      <PageHero
        eyebrow="Carrieres"
        title="Rejoignez l'aventure DayBooker"
        description="Construisons ensemble le futur de l'hotellerie en Afrique."
      />

      <PageSection
        title="Pourquoi nous rejoindre"
        description="Chez DayBooker, nous ne nous contentons pas de creer une application de reservation. Nous transformons la facon dont les Africains vivent, travaillent et se detendent dans leur ville."
        className="bg-white"
      >
        <div className="grid gap-6 md:grid-cols-2">
          {reasons.map((reason) => {
            const Icon = reason.icon;

            return (
              <Card key={reason.title} className="border-gray-300 bg-white shadow-sm">
                <CardHeader>
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-client-primary-50 text-client-primary-600">
                    <Icon className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-xl text-gray-900">{reason.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="leading-7 text-gray-600">{reason.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </PageSection>

      <PageSection
        title="Les equipes qui font avancer DayBooker"
        description="Chaque departement joue un role cle dans le developpement de la plateforme."
      >
        <div className="grid gap-6 md:grid-cols-2">
          {departments.map((department) => (
            <Card key={department.name} className="border-gray-300 bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl text-gray-900">{department.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="leading-7 text-gray-600">{department.mission}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </PageSection>

      <PageSection
        title='Nos valeurs, le "Spirit" DayBooker'
        description="Ces principes guident notre facon de construire, de collaborer et de servir nos utilisateurs."
        className="bg-white"
      >
        <div className="grid gap-6 md:grid-cols-2">
          {values.map((value, index) => (
            <Card key={value.title} className="border-gray-300 bg-white shadow-sm">
              <CardHeader>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-client-primary-600">
                  Valeur {index + 1}
                </p>
                <CardTitle className="text-xl">{value.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="leading-7 text-gray-600">{value.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </PageSection>

      <PageSection
        title="Candidature spontanee"
        description="Vous ne trouvez pas encore de poste correspondant a votre profil mais vous pensez pouvoir faire briller DayBooker ?"
      >
        <Card className="border-gray-300 bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="text-2xl text-gray-900">
              Envoyez-nous votre CV et un court texte
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <p className="leading-7 text-gray-600">
              Racontez-nous ce que vous apporteriez a l&apos;equipe et comment vous
              imaginez contribuer a l&apos;avenir de DayBooker.
            </p>
            <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-4 text-sm text-gray-700">
              Email de candidature : <span className="font-semibold">ChoisirAdresse@example.com</span>
            </div>
            <div className="flex flex-wrap gap-4">
              <Button asChild className="bg-black text-white hover:bg-gray-800">
                <Link href="/contact">
                  Nous contacter
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/a-propos">Decouvrir notre mission</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </PageSection>
    </div>
  );
}
