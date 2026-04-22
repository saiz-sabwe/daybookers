import Link from "next/link";
import { ArrowRight, BriefcaseBusiness, Building2, Clock3, Newspaper } from "lucide-react";
import { PageHero, PageSection } from "@/components/client/content/PageShell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const useCases = [
  {
    title: "Bureau calme de 08h00 a 13h00",
    description:
      "Un cadre professionnel et discret pour avancer sur vos dossiers du matin sans subir les interruptions du quotidien.",
  },
  {
    title: "Attente confortable de 11h00 a 17h00",
    description:
      "Une solution simple entre deux rendez-vous, un transit ou un temps mort au centre-ville.",
  },
  {
    title: "Repos de 16h00 a 22h00",
    description:
      "Quelques heures pour recuperer, se rafraichir ou profiter d'un hotel de qualite avant de reprendre sa journee.",
  },
];

const strengths = [
  {
    icon: Clock3,
    title: "Micro-sejours sur mesure",
    description:
      "Des formats flexibles adaptes au rythme de vie urbain, sans payer une nuitee complete.",
  },
  {
    icon: Building2,
    title: "Valeur pour les hoteliers",
    description:
      "Les chambres et espaces inoccupes en journee deviennent une nouvelle source de revenus.",
  },
  {
    icon: BriefcaseBusiness,
    title: "Usage pro et loisir",
    description:
      "DayBooker repond autant aux besoins des professionnels en deplacement qu'a ceux des particuliers.",
  },
];

export default function AboutPage() {
  return (
    <div className="bg-zinc-100">
      <PageHero
        eyebrow="A Propos"
        title="Presentation de DayBooker"
        description="La plateforme locale africaine qui ambitionne de devenir la reference de l'e-commerce pour les sejours de courte duree en Afrique."
      >
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Badge className="bg-client-primary-500 text-white hover:bg-client-primary-500">
            Micro-sejours en journee
          </Badge>
          <Badge className="border-white/20 bg-white/10 text-white hover:bg-white/10">
            Flexibilite urbaine
          </Badge>
          <Badge className="border-white/20 bg-white/10 text-white hover:bg-white/10">
            Innovation hoteliere africaine
          </Badge>
        </div>
      </PageHero>

      <PageSection
        title="Notre ambition"
        description="Parce que les villes ne dorment jamais et que leurs habitants ont besoin de flexibilite, nous travaillons chaque jour pour rendre le confort d'un hotel de qualite accessible a tout moment."
        className="bg-white"
      >
        <div className="space-y-6 text-lg leading-8 text-gray-700">
          <p>
            DayBooker mise sur l&apos;innovation technologique pour permettre a chacun
            de vivre des experiences sur mesure. Que ce soit pour travailler au
            calme, attendre confortablement entre deux rendez-vous ou s&apos;offrir un
            repos bien merite, notre plateforme propose des solutions de
            micro-sejours adaptees au rythme de vie africain.
          </p>
          <p>
            DayBooker est la premiere plateforme locale africaine dediee a la
            reservation en journee. Elle repond aussi bien aux besoins des
            professionnels en deplacement qu&apos;a ceux des particuliers souhaitant
            profiter des infrastructures hotelieres comme la climatisation, le
            Wi-Fi et le calme, sans payer une nuit complete.
          </p>
          <p>
            En ouvrant leurs chambres pendant la journee, les hotels du continent
            peuvent optimiser leur taux d&apos;occupation et dynamiser leur activite
            economique. En retour, les clients accedent a une selection variee
            d&apos;hebergements et d&apos;espaces de travail, en plein centre de leur ville.
          </p>
        </div>
      </PageSection>

      <PageSection
        title="Des usages concrets au quotidien"
        description="Nos formats accompagnent les rythmes reels des grandes villes africaines."
      >
        <div className="grid gap-6 md:grid-cols-3">
          {useCases.map((item) => (
            <Card key={item.title} className="border-gray-300 bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl text-gray-900">{item.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="leading-7 text-gray-600">{item.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </PageSection>

      <PageSection
        title="Pourquoi DayBooker existe"
        description="Nous concevons la reservation en journee comme un levier de confort, de productivite et de croissance pour l'hospitalite africaine."
        className="bg-white"
      >
        <div className="grid gap-6 md:grid-cols-3">
          {strengths.map((item) => {
            const Icon = item.icon;

            return (
              <Card key={item.title} className="border-gray-300 bg-white shadow-sm">
                <CardHeader>
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-client-primary-50 text-client-primary-600">
                    <Icon className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-xl text-gray-900">{item.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="leading-7 text-gray-600">{item.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </PageSection>

      <PageSection
        title="Explorer DayBooker"
        description="Retrouvez aussi notre espace presse, nos opportunites de carriere et les coordonnees de l'equipe."
      >
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="border-gray-300 bg-white shadow-sm">
            <CardHeader>
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-client-primary-50 text-client-primary-600">
                <Newspaper className="h-6 w-6" />
              </div>
              <CardTitle>Espace presse</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="leading-7 text-gray-600">
                Decouvrez notre communique de presse et la vision qui porte le
                lancement de DayBooker.
              </p>
              <Button asChild variant="outline">
                <Link href="/presse">
                  Lire le communique
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="border-gray-300 bg-white shadow-sm">
            <CardHeader>
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-client-primary-50 text-client-primary-600">
                <BriefcaseBusiness className="h-6 w-6" />
              </div>
              <CardTitle>Carrieres</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="leading-7 text-gray-600">
                Rejoignez une equipe qui veut transformer la facon dont l&apos;Afrique
                vit, travaille et se detend en ville.
              </p>
              <Button asChild variant="outline">
                <Link href="/carrieres">
                  Voir la page carrieres
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="border-gray-300 bg-white shadow-sm">
            <CardHeader>
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-client-primary-50 text-client-primary-600">
                <Building2 className="h-6 w-6" />
              </div>
              <CardTitle>Contact</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="leading-7 text-gray-600">
                Voyageurs, professionnels ou hoteliers, notre equipe est a votre
                ecoute pour toute question.
              </p>
              <Button asChild className="bg-black text-white hover:bg-gray-800">
                <Link href="/contact">
                  Nous contacter
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </PageSection>
    </div>
  );
}
