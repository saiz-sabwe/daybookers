"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, HelpCircle, MessageCircle, Mail, Phone } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ContactForm } from "@/components/client/forms/ContactForm";
import { FormCard } from "@/components/client/forms/FormCard";

const faqs = [
  {
    question: "Comment réserver une chambre d'hôtel en journée ?",
    answer:
      "Utilisez la barre de recherche pour choisir destination, date et créneau. Parcourez les hôtels disponibles et cliquez sur « Réserver ».",
  },
  {
    question: "Quels sont les créneaux horaires disponibles ?",
    answer:
      "Matin (9h–13h), Après-midi (12h–17h) et Journée complète (10h–18h). Les horaires peuvent varier selon l'hôtel.",
  },
  {
    question: "Puis-je annuler ma réservation ?",
    answer:
      "Oui, gratuitement jusqu'à 10 h le jour du séjour, depuis votre tableau de bord.",
  },
  {
    question: "Comment puis-je payer ?",
    answer:
      "Paiement sur place à l'hôtel. Vous pouvez aussi confirmer en ligne selon le mode choisi lors de la réservation.",
  },
  {
    question: "Que se passe-t-il si je suis en retard ?",
    answer:
      "Contactez l'hôtel directement. Un retard important peut entraîner des frais selon la politique de l'établissement.",
  },
  {
    question: "Puis-je modifier ma réservation ?",
    answer:
      "Annulez la réservation actuelle puis créez-en une nouvelle avec les informations mises à jour.",
  },
];

export default function HelpPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="min-h-screen bg-gray-100 py-8 md:py-12">
      <div className="container mx-auto max-w-4xl px-4">
        <div className="mb-10 text-center">
          <h1 className="mb-3 text-3xl font-bold text-gray-900 md:text-4xl">
            Centre d&apos;aide
          </h1>
          <p className="text-base text-gray-600 md:text-lg">
            Trouvez rapidement les réponses à vos questions
          </p>
        </div>

        <div className="mb-10">
          <h2 className="mb-6 flex items-center gap-2 text-2xl font-bold text-gray-900">
            <HelpCircle className="h-6 w-6 text-client-primary-600" />
            Questions fréquentes
          </h2>
          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <Card
                key={faq.question}
                className="overflow-hidden rounded-xl border-gray-200 shadow-sm"
              >
                <CardHeader
                  className="cursor-pointer transition-colors hover:bg-gray-50"
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                >
                  <div className="flex items-center justify-between gap-4">
                    <CardTitle className="text-base font-semibold md:text-lg">
                      {faq.question}
                    </CardTitle>
                    {openIndex === index ? (
                      <ChevronUp className="h-5 w-5 shrink-0 text-gray-400" />
                    ) : (
                      <ChevronDown className="h-5 w-5 shrink-0 text-gray-400" />
                    )}
                  </div>
                </CardHeader>
                {openIndex === index && (
                  <CardContent className="border-t border-gray-100 pt-0">
                    <p className="leading-relaxed text-gray-600">{faq.answer}</p>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        </div>

        <FormCard
          title="Nous contacter"
          description="Vous ne trouvez pas la réponse ? Écrivez-nous directement."
          icon={<MessageCircle className="h-5 w-5 text-client-primary-600" />}
        >
          <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50 p-4">
              <Mail className="h-5 w-5 text-client-primary-600" />
              <div>
                <p className="font-semibold text-gray-900">Email</p>
                <p className="text-sm text-gray-600">support@daybooker.cd</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50 p-4">
              <Phone className="h-5 w-5 text-client-primary-600" />
              <div>
                <p className="font-semibold text-gray-900">Téléphone</p>
                <p className="text-sm text-gray-600">+243 817 113 497</p>
              </div>
            </div>
          </div>

          <ContactForm showEmail />
        </FormCard>
      </div>
    </div>
  );
}
