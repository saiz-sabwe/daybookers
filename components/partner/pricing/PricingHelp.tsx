"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { InfoIcon, Calendar, Sparkles, Clock, TrendingUp } from "lucide-react";

export function PricingHelp() {
  return (
    <Card className="bg-blue-50 border-blue-200">
      <CardHeader>
        <div className="flex items-center gap-2">
          <InfoIcon className="w-5 h-5 text-blue-600" />
          <CardTitle className="text-blue-900">Guide des règles de tarification</CardTitle>
        </div>
        <CardDescription className="text-blue-700">
          Comprendre comment fonctionnent les différents types de règles tarifaires
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="weekend">
            <AccordionTrigger className="text-blue-900 hover:text-blue-700">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>Supplément Week-end (WEEKEND)</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="text-blue-800">
              <div className="space-y-2">
                <p><strong>Description :</strong> Ajoute un supplément pour les réservations pendant le week-end (vendredi, samedi, dimanche).</p>
                <p><strong>Exemple concret :</strong></p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Prix de base chambre : 100 USD</li>
                  <li>Multiplicateur week-end : 1.2x</li>
                  <li><strong>Prix final : 120 USD</strong> (100 × 1.2)</li>
                </ul>
                <p className="mt-2"><strong>Bonnes pratiques :</strong> Utilisez un multiplicateur entre 1.1 et 1.5 pour rester compétitif.</p>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="season">
            <AccordionTrigger className="text-blue-900 hover:text-blue-700">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                <span>Haute/Basse Saison (SEASON)</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="text-blue-800">
              <div className="space-y-2">
                <p><strong>Description :</strong> Applique une tarification différente selon les périodes de l'année (haute saison, basse saison).</p>
                <p><strong>Exemple concret :</strong></p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Prix de base chambre : 100 USD</li>
                  <li>Haute saison (juillet-août) : +30% → <strong>130 USD</strong></li>
                  <li>Basse saison (novembre-janvier) : -20% → <strong>80 USD</strong></li>
                </ul>
                <p className="mt-2"><strong>Bonnes pratiques :</strong> Définissez des dates précises (startDate/endDate) pour éviter les conflits.</p>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="holiday">
            <AccordionTrigger className="text-blue-900 hover:text-blue-700">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                <span>Période spéciale/Événement (HOLIDAY)</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="text-blue-800">
              <div className="space-y-2">
                <p><strong>Description :</strong> Tarif spécial pour les jours fériés ou événements majeurs (Noël, Nouvel An, festivals, conférences).</p>
                <p><strong>Exemple concret :</strong></p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Prix de base chambre : 100 USD</li>
                  <li>Nouvel An (31 déc - 2 jan) : Montant fixe +50 USD → <strong>150 USD</strong></li>
                  <li>Festival local : Multiplicateur 1.8x → <strong>180 USD</strong></li>
                </ul>
                <p className="mt-2"><strong>Bonnes pratiques :</strong> Créez ces règles avec une priorité élevée pour qu'elles s'appliquent en premier.</p>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="last-minute">
            <AccordionTrigger className="text-blue-900 hover:text-blue-700">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>Réservation de dernière minute (LAST_MINUTE)</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="text-blue-800">
              <div className="space-y-2">
                <p><strong>Description :</strong> Applique une réduction pour encourager les réservations à courte échéance (remplir les chambres vides).</p>
                <p><strong>Exemple concret :</strong></p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Prix de base chambre : 100 USD</li>
                  <li>Réservation dans moins de 3 jours : -15% → <strong>85 USD</strong></li>
                  <li>Réservation dans moins de 24h : -25% → <strong>75 USD</strong></li>
                </ul>
                <p className="mt-2"><strong>Bonnes pratiques :</strong> Offrez une réduction attractive (15-30%) pour stimuler les réservations spontanées.</p>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="calculation">
            <AccordionTrigger className="text-blue-900 hover:text-blue-700">
              <div className="flex items-center gap-2">
                <InfoIcon className="w-4 h-4" />
                <span>Comment les règles se combinent-elles ?</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="text-blue-800">
              <div className="space-y-2">
                <p><strong>Ordre d'application :</strong> Les règles sont appliquées selon leur <strong>priorité</strong> (0 = priorité la plus haute).</p>
                <p><strong>Exemple avec plusieurs règles :</strong></p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Prix de base : 100 USD</li>
                  <li>Haute saison (priorité 1) : +20% → 120 USD</li>
                  <li>Week-end (priorité 2) : ×1.15 sur le nouveau prix → 138 USD</li>
                  <li><strong>Prix final : 138 USD</strong></li>
                </ul>
                <p className="mt-2"><strong>Types de modification :</strong></p>
                <ul className="list-disc pl-6 space-y-1">
                  <li><strong>Multiplicateur</strong> : Multiplie le prix actuel (ex: 1.2 = +20%)</li>
                  <li><strong>Pourcentage</strong> : Ajoute ou retire un % (ex: -15 = réduction de 15%)</li>
                  <li><strong>Montant fixe</strong> : Ajoute ou retire une somme (ex: +30 USD)</li>
                </ul>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <div className="mt-4 p-4 bg-white rounded-lg border border-blue-200">
          <h4 className="font-semibold text-blue-900 mb-2">💡 Astuce</h4>
          <p className="text-sm text-blue-800">
            Commencez par créer une règle simple (ex: supplément week-end) pour vous familiariser avec le système.
            Vous pourrez ensuite combiner plusieurs règles pour une tarification dynamique optimale.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

