"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, HelpCircle, MessageCircle, Mail, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const faqs = [
  {
    question: "Comment réserver une chambre d'hôtel en journée ?",
    answer: "C'est très simple ! Utilisez notre barre de recherche pour sélectionner votre destination, la date et le créneau horaire souhaité. Parcourez les hôtels disponibles et cliquez sur 'Réserver' pour finaliser votre réservation en quelques étapes.",
  },
  {
    question: "Quels sont les créneaux horaires disponibles ?",
    answer: "Nous proposons trois créneaux horaires : Matin (9h-13h), Après-midi (12h-17h) et Journée complète (10h-18h). Les horaires exacts peuvent varier selon l'hôtel.",
  },
  {
    question: "Puis-je annuler ma réservation ?",
    answer: "Oui, vous pouvez annuler votre réservation gratuitement jusqu'à 10h le jour de votre séjour. Pour annuler, rendez-vous dans votre tableau de bord et cliquez sur 'Annuler' à côté de votre réservation.",
  },
  {
    question: "Comment puis-je payer ?",
    answer: "Aucun paiement n'est effectué en ligne. Vous paierez directement à l'hôtel lors de votre arrivée. Une carte bancaire est demandée uniquement pour garantir votre réservation.",
  },
  {
    question: "Que se passe-t-il si je suis en retard ?",
    answer: "Nous vous recommandons d'arriver à l'heure indiquée. En cas de retard, contactez directement l'hôtel pour les informer. Certains hôtels peuvent appliquer des frais en cas de retard important.",
  },
  {
    question: "Puis-je modifier ma réservation ?",
    answer: "Pour modifier votre réservation (date, créneau, nombre de personnes), vous devez d'abord annuler votre réservation actuelle et en créer une nouvelle avec les nouvelles informations.",
  },
];

export default function HelpPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Centre d'aide</h1>
          <p className="text-lg text-gray-600">
            Trouvez rapidement les réponses à vos questions
          </p>
        </div>

        {/* FAQ Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <HelpCircle className="w-6 h-6 text-client-primary-500" />
            Questions fréquentes
          </h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <Card key={index} className="border-gray-200">
                <CardHeader
                  className="cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => toggleFAQ(index)}
                >
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{faq.question}</CardTitle>
                    {openIndex === index ? (
                      <ChevronUp className="w-5 h-5 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                </CardHeader>
                {openIndex === index && (
                  <CardContent>
                    <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        </div>

        {/* Contact Section */}
        <Card className="border-gray-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-client-primary-500" />
              Nous contacter
            </CardTitle>
            <CardDescription>
              Vous ne trouvez pas la réponse à votre question ? Contactez-nous directement.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <Mail className="w-5 h-5 text-client-primary-500" />
                <div>
                  <p className="font-semibold text-gray-900">Email</p>
                  <p className="text-sm text-gray-600">support@daybooker.com</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <Phone className="w-5 h-5 text-client-primary-500" />
                <div>
                  <p className="font-semibold text-gray-900">Téléphone</p>
                  <p className="text-sm text-gray-600">+243 900 000 000</p>
                </div>
              </div>
            </div>

            <form className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contact-name">Nom</Label>
                  <Input id="contact-name" placeholder="Votre nom" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact-email">Email</Label>
                  <Input id="contact-email" type="email" placeholder="votre@email.com" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact-subject">Sujet</Label>
                <Input id="contact-subject" placeholder="Sujet de votre message" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact-message">Message</Label>
                <Textarea
                  id="contact-message"
                  placeholder="Décrivez votre question ou problème..."
                  className="min-h-[120px]"
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-client-primary-500 hover:bg-client-primary-600 text-white"
              >
                Envoyer le message
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

