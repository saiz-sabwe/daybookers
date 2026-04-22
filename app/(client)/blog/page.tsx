import { Lightbulb, TrendingUp, Waves } from "lucide-react";
import { PageHero, PageSection } from "@/components/client/content/PageShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const articles = [
  {
    icon: TrendingUp,
    category: "Productivite",
    title:
      "Bloque dans un embouteillage ? Pourquoi le day-use est votre nouveau bureau.",
    intro:
      "Tout habitant d'une grande ville africaine connait ce sentiment : un rendez-vous a 10h, le suivant a 15h, et des heures perdues dans la voiture sous une chaleur etouffante.",
    points: [
      "Connexion haute vitesse : fini le partage de connexion instable, profitez du Wi-Fi professionnel de nos hotels partenaires.",
      "Climatisation et calme : preparez votre dossier ou votre presentation dans un cadre serein.",
      "Le creneau 08h-13h : parfait pour boucler vos mails du matin avant votre dejeuner d'affaires.",
    ],
    closing:
      "Transformer un temps d'attente en temps de gain, c'est le secret des entrepreneurs qui reussissent.",
  },
  {
    icon: Waves,
    category: "Lifestyle & Detente",
    title: "Une apres-midi de vacances sans quitter la ville : l'offre 12h-17h.",
    intro:
      "Pas besoin de prendre l'avion pour decompresser. Parfois, quatre heures suffisent pour recharger les batteries.",
    points: [
      "12h00 : check-in dans un hotel affilie a DayBooker.",
      "14h00 : quelques longueurs dans la piscine suivies d'une sieste au frais.",
      "16h00 : un cocktail ou un jus frais en repondant a vos derniers messages.",
      "17h00 : vous repartez frais et dispo pour votre soiree.",
    ],
    closing:
      "Le plus ? Vous profitez du luxe d'une suite a une fraction du prix d'une nuitee.",
  },
  {
    icon: Lightbulb,
    category: "Business & Hotellerie",
    title: "Hoteliers : comment DayBooker optimise votre taux d'occupation en journee.",
    intro:
      "Entre 9h et 17h, une grande part des chambres d'hotel a Kinshasa restent vides alors que les charges continuent de courir.",
    points: [
      "Monetiser l'invisible : vendre une chambre le matin et la revendre pour la nuit a un autre client.",
      "Attirer une clientele locale : faire decouvrir votre restaurant et vos services a des Kinois qui ne seraient jamais venus dormir chez vous.",
      "Zero conflit : nos creneaux sont calcules pour laisser le temps aux equipes de nettoyage de preparer la chambre pour les clients de nuit.",
    ],
    closing:
      "DayBooker transforme les heures creuses en opportunites concretes de croissance.",
  },
];

export default function BlogPage() {
  return (
    <div className="bg-zinc-100">
      <PageHero
        eyebrow="Blog"
        title="Le blog DayBooker : vivre l'Afrique autrement"
        description="Conseils, lifestyle et productivite au coeur des villes africaines."
      />

      <PageSection
        title="Nos articles a la une"
        description="Des contenus penses pour les voyageurs, les professionnels urbains et les hoteliers africains."
        className="bg-white"
      >
        <div className="grid gap-6">
          {articles.map((article) => {
            const Icon = article.icon;

            return (
              <Card key={article.title} className="border-gray-300 bg-white shadow-sm">
                <CardHeader className="space-y-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-client-primary-50 text-client-primary-600">
                    <Icon className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-client-primary-600">
                      {article.category}
                    </p>
                    <CardTitle className="mt-2 text-2xl leading-tight text-gray-900">
                      {article.title}
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-5">
                  <p className="leading-7 text-gray-600">{article.intro}</p>
                  <ul className="space-y-3 text-gray-700">
                    {article.points.map((point) => (
                      <li key={point} className="flex gap-3 leading-7">
                        <span className="mt-2 h-2 w-2 rounded-full bg-client-primary-500" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="font-medium leading-7 text-gray-900">{article.closing}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </PageSection>

      <PageSection
        title='Rubrique "Le saviez-vous ?"'
        description="Le format full-day est devenu l'un des favoris des equipes de projet en Afrique."
      >
        <Card className="border-gray-300 bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="text-2xl text-gray-900">
              Le full-day, un nouveau bureau pour les startups
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 leading-7 text-gray-600">
            <p>
              Plutot que de louer un bureau hors de prix, certaines equipes
              reservent une suite pour une journee de brainstorming intensif,
              suivie d&apos;un moment de detente team building en after work.
            </p>
            <p>
              Cafe, Wi-Fi, confort et souplesse horaire sont inclus. C&apos;est une
              nouvelle facon de penser les espaces de travail et de collaboration
              dans les grandes villes africaines.
            </p>
          </CardContent>
        </Card>
      </PageSection>
    </div>
  );
}
