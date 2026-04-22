import Link from "next/link";
import { Building2, CalendarDays, Mail, MessageCircle, Phone } from "lucide-react";
import { PageHero, PageSection } from "@/components/client/content/PageShell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

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
        description="Utilisez ce formulaire pour toute demande generale. Le raccordement de l'envoi sera branche a l'etape suivante."
      >
        <Card className="border-gray-300 bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl text-gray-900">
              <MessageCircle className="h-5 w-5 text-client-primary-600" />
              Ecrivez-nous
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <form className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="full-name">Nom complet</Label>
                  <Input id="full-name" placeholder="Votre nom complet" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Numero de telephone (WhatsApp)</Label>
                  <Input id="phone" placeholder="+243 ..." />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject">Sujet</Label>
                <select
                  id="subject"
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
                  defaultValue=""
                >
                  <option value="" disabled>
                    Selectionnez un sujet
                  </option>
                  <option>Question sur une reservation</option>
                  <option>Devenir partenaire (Hotelier)</option>
                  <option>Presse / Medias</option>
                  <option>Recrutement</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Votre message</Label>
                <Textarea
                  id="message"
                  placeholder="Decrivez votre besoin, votre question ou votre projet..."
                  className="min-h-[160px]"
                />
              </div>

              <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-4 text-sm leading-6 text-gray-600">
                Cette page affiche deja le contenu et les champs attendus. Si vous
                souhaitez que le formulaire envoie reellement les messages, il
                faudra relier ce formulaire a une action serveur ou a un service
                d&apos;email.
              </div>

              <Button type="button" className="bg-black text-white hover:bg-gray-800">
                Envoyer le message
              </Button>
            </form>
          </CardContent>
        </Card>
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
