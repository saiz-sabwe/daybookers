import Link from "next/link";
import { Building2, CalendarDays, Mail, MessageCircle, Phone } from "lucide-react";
import { PageHero, PageSection } from "@/components/client/content/PageShell";
import { ContactForm } from "@/components/client/forms/ContactForm";
import { FormCard } from "@/components/client/forms/FormCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ContactPage() {
  return (
    <div className="bg-zinc-100">
      <PageHero
        eyebrow="Contact"
        title="Contactez-nous"
        description="L'equipe DayBooker est a votre ecoute, que vous soyez voyageur, professionnel ou hotelier."
      />

      <PageSection
        title="Nos bureaux"
        description="Retrouvez DayBooker RDC a Kinshasa."
        className="bg-white"
      >
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="border-gray-300 bg-white shadow-sm md:col-span-1">
            <CardHeader>
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-client-primary-50 text-client-primary-600">
                <Building2 className="h-6 w-6" />
              </div>
              <CardTitle>DayBooker RDC</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 leading-7 text-gray-600">
              <p>Avenue de Mont Fleury, Quartier Mont Fleury</p>
              <p>Commune de Ngaliema, Kinshasa</p>
              <p>Republique Democratique du Congo</p>
            </CardContent>
          </Card>

          <Card className="border-gray-300 bg-white shadow-sm md:col-span-1">
            <CardHeader>
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-client-primary-50 text-client-primary-600">
                <Phone className="h-6 w-6" />
              </div>
              <CardTitle>Assistance & reservations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 leading-7 text-gray-600">
              <p>
                Besoin d&apos;aide pour une reservation en cours ou une question sur
                nos creneaux en journee ?
              </p>
              <p>
                Telephone :{" "}
                <a className="font-medium text-client-primary-600 hover:underline" href="tel:+243817113497">
                  +243 817 113 497
                </a>
              </p>
              <p>
                WhatsApp Business :{" "}
                <a
                  className="font-medium text-client-primary-600 hover:underline"
                  href="https://wa.me/243817113497"
                  target="_blank"
                  rel="noreferrer"
                >
                  +243 817 113 497
                </a>
              </p>
              <p>
                Email :{" "}
                <a
                  className="font-medium text-client-primary-600 hover:underline"
                  href="mailto:support@daybooker.cd"
                >
                  support@daybooker.cd
                </a>
              </p>
            </CardContent>
          </Card>

          <Card className="border-gray-300 bg-white shadow-sm md:col-span-1">
            <CardHeader>
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-client-primary-50 text-client-primary-600">
                <CalendarDays className="h-6 w-6" />
              </div>
              <CardTitle>Devenir partenaire hotelier</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 leading-7 text-gray-600">
              <p>
                Vous gerez un etablissement et souhaitez rejoindre la revolution
                du sejour hotelier de jour ?
              </p>
              <p>
                Email partenariats :{" "}
                <a
                  className="font-medium text-client-primary-600 hover:underline"
                  href="mailto:hotels@daybooker.cd"
                >
                  hotels@daybooker.cd
                </a>
              </p>
              <Button asChild variant="outline" className="w-full">
                <Link href="mailto:hotels@daybooker.cd">Prendre contact</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </PageSection>

      <PageSection
        title="Formulaire de contact"
        description="Utilisez ce formulaire pour toute demande générale."
      >
        <FormCard
          title="Écrivez-nous"
          description="Notre équipe vous répond sous 24 h ouvrées."
          icon={<MessageCircle className="h-5 w-5 text-client-primary-600" />}
        >
          <ContactForm />
        </FormCard>
      </PageSection>

      <PageSection
        title="Suivez l'actualite de DayBooker"
        description="Ne manquez aucune de nos offres exclusives dans les plus beaux hotels de la capitale."
        className="bg-white"
      >
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="border-gray-300 bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Mail className="h-5 w-5 text-client-primary-600" />
                Instagram
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">@DayBooker_Africa</p>
            </CardContent>
          </Card>

          <Card className="border-gray-300 bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Mail className="h-5 w-5 text-client-primary-600" />
                LinkedIn
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">DayBooker Africa</p>
            </CardContent>
          </Card>

          <Card className="border-gray-300 bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Mail className="h-5 w-5 text-client-primary-600" />
                Facebook
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">DayBooker Africa</p>
            </CardContent>
          </Card>
        </div>
      </PageSection>
    </div>
  );
}
