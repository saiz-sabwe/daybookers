/* eslint-disable react/no-unescaped-entities */

import { PageHero, PageSection } from "@/components/client/content/PageShell";
import { LegalArticle, LegalIntro } from "@/components/client/content/LegalContent";

const legalReferences = [
  "L'Acte Uniforme OHADA relatif au Droit Commercial General (AUDCG) revise le 15 decembre 2010 ;",
  "L'Acte Uniforme OHADA relatif au Droit des Societes Commerciales et du Groupement d'Interet Economique (AUSCGIE) revise le 30 janvier 2014 ;",
  "L'Ordonnance-loi ndeg 23/010 du 13 mars 2023 portant Code du numerique en Republique Democratique du Congo ;",
  "Le Code civil congolais, Livre III (Des obligations) ;",
  "La Constitution de la Republique Democratique du Congo du 18 fevrier 2006, telle que modifiee ;",
  "La reglementation congolaise applicable au secteur hotelier et touristique ;",
  "Toute autre disposition legale ou reglementaire applicable.",
];

const definitions = [
  ['"Utilisateur"', "toute personne physique ou morale accedant au Site, qu'elle soit inscrite ou non."],
  ['"Client"', "tout Utilisateur ayant procede a une Reservation via la Plateforme."],
  ['"Compte"', "espace personnel cree par l'Utilisateur sur la Plateforme."],
  ['"Etablissement Partenaire" ou "Hotel"', "tout etablissement d'hebergement dument autorise conformement a la reglementation congolaise, reference sur la Plateforme et proposant des chambres a la journee."],
  ['"Reservation"', "engagement contractuel du Client pour la location d'une chambre d'hotel sur un Creneau Horaire defini."],
  ['"Day Booker"', "formule de location d'une chambre d'hotel pour une duree determinee en journee, sans nuitee, generalement comprise entre 3 et 12 heures."],
  ['"Creneau Horaire"', "plage horaire convenue (heure d'arrivee et heure de depart)."],
  ['"Services"', "l'ensemble des fonctionnalites mises a disposition par la Plateforme."],
  ['"RCCM"', "Registre du Commerce et du Credit Mobilier tel que prevu par l'AUDCG de l'OHADA."],
  ['"CCJA"', "Cour Commune de Justice et d'Arbitrage de l'OHADA."],
  ['"Code du numerique"', "Ordonnance-loi ndeg 23/010 du 13 mars 2023 portant Code du numerique en RDC."],
];

const accountData = [
  "Personne physique : nom, prenom (post-nom le cas echeant), date de naissance, adresse e-mail, numero de telephone (format RDC ou international), adresse de residence ;",
  "Personne morale : denomination sociale, numero RCCM, NIF / Id. Nat., nom et qualite du representant legal, adresse du siege social, e-mail et telephone ;",
  "Creation d'un mot de passe securise et confidentiel.",
];

const accountSuspensionReasons = [
  "Non-respect des presentes CGU ;",
  "Fourniture d'informations fausses, inexactes ou frauduleuses ;",
  "Comportement contraire a l'ordre public, aux bonnes moeurs ou aux lois de la RDC ;",
  "Atteinte aux droits de tiers ou aux interets legitimes de la Societe ;",
  "Tentative de fraude ou d'intrusion dans les systemes de la Plateforme.",
];

const serviceSearchBullets = [
  "Rechercher des chambres d'hotel disponibles a la journee selon differents criteres : ville, commune, quartier, date, creneau horaire, categorie d'etablissement, equipements, budget ;",
  "Consulter les fiches descriptives des Etablissements Partenaires (photos, description, equipements, services inclus, categorisation officielle, avis clients) ;",
  "Comparer les offres et tarifs.",
];

const bookingSteps = [
  "Selection : choix de l'Etablissement, du type de chambre, de la date et du Creneau Horaire ;",
  "Recapitulatif : verification des details (etablissement, chambre, creneau, prix total, conditions d'annulation) ;",
  "Identification : connexion au Compte ou saisie des informations personnelles ;",
  "Paiement : choix du mode de paiement et validation ;",
  "Confirmation : envoi d'un e-mail et/ou SMS de confirmation comportant un numero de Reservation unique.",
];

const dayUseObligations = [
  "Se presenter a l'Etablissement Partenaire a l'heure d'arrivee indiquee ;",
  "Liberer la chambre au plus tard a l'heure de depart indiquee ;",
  "Respecter le reglement interieur de l'Etablissement ;",
  "Se conformer aux lois et reglements en vigueur en RDC.",
];

const paymentMethods = [
  "Mobile Money (M-Pesa, Airtel Money, Orange Money, Afri Money, ou tout autre service de monnaie electronique agree par la Banque Centrale du Congo) ;",
  "Carte bancaire (Visa, Mastercard) ;",
  "Virement bancaire (pour les reservations professionnelles, sous conditions) ;",
  "Tout autre moyen de paiement qui serait ulterieurement affiche et accepte sur la Plateforme.",
];

const invoiceMentions = [
  "Le numero de facture ;",
  "La date de la Reservation ;",
  "L'identification de la Societe (RCCM, NIF) ;",
  "L'identification du Client ;",
  "Le detail de la prestation ;",
  "Le prix hors taxes, le montant des taxes et le prix TTC ;",
  "Le mode de paiement.",
];

const userGeneralObligations = [
  "Utiliser la Plateforme conformement a sa destination et aux presentes CGU ;",
  "Fournir des informations exactes, completes et actualisees ;",
  "Ne pas usurper l'identite d'un tiers ;",
  "Ne pas utiliser la Plateforme a des fins illicites, frauduleuses ou contraires a l'ordre public et aux bonnes moeurs ;",
  "Ne pas tenter de porter atteinte au fonctionnement, a la securite ou a l'integrite de la Plateforme ;",
  "Respecter les droits de propriete intellectuelle de la Societe et des tiers.",
];

const roomUseObligations = [
  "Se presenter a l'Etablissement muni d'une piece d'identite en cours de validite ;",
  "Respecter le reglement interieur de l'Etablissement ;",
  "Prendre soin des equipements et installations mis a sa disposition ;",
  "Ne pas utiliser la chambre a des fins illicites ou contraires aux lois et reglements de la RDC ;",
  "Ne pas introduire dans l'Etablissement des produits stupefiants, des armes ou tout objet dangereux ou prohibe ;",
  "Signaler tout dysfonctionnement ou dommage constate a son arrivee.",
];

const companyMeans = [
  "La disponibilite et le bon fonctionnement de la Plateforme ;",
  "La securite des transactions et la confidentialite des donnees personnelles ;",
  "L'exactitude des informations transmises par les Etablissements Partenaires, sous reserve de la responsabilite de ces derniers quant a leur veracite.",
];

const reviewModeration = [
  "Contraire aux conditions ci-dessus ;",
  "Contenant des donnees personnelles de tiers sans leur consentement ;",
  "A caractere discriminatoire, haineux ou incitant a la violence ;",
  "Manifestement frauduleux, mensonger ou sans rapport avec l'experience d'hebergement ;",
  "Contrevenant a l'ordre public ou aux bonnes moeurs.",
];

const hotelCompliance = [
  "Etre titulaires de toutes les autorisations administratives requises pour l'exploitation d'un etablissement d'hebergement en RDC ;",
  "Etre immatricules au RCCM conformement a l'AUDCG ;",
  "Etre en conformite avec les normes de securite, d'hygiene et de salubrite applicables ;",
  "Disposer des assurances necessaires, notamment en responsabilite civile professionnelle ;",
  "Respecter la reglementation congolaise en matiere de tarification et de classification hoteliere ;",
  "Tenir, le cas echeant, le registre des voyageurs conformement a la reglementation en vigueur.",
];

const forceMajeureCases = [
  "Catastrophes naturelles (inondations, tremblements de terre, eruptions volcaniques, epidemies) ;",
  "Guerres, conflits armes, insurrections, troubles civils ;",
  "Actes de terrorisme ;",
  "Epidemies, pandemies et mesures sanitaires imposees par les autorites ;",
  "Decisions gouvernementales ou administratives (etat d'urgence, couvre-feu, interdictions de circuler, fermetures administratives) ;",
  "Pannes generalisees de reseau Internet, de telecommunications ou d'electricite ;",
  "Greves generales affectant les transports ou les services essentiels.",
];

function BulletList({ items }: { items: string[] }) {
  return (
    <ul>
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

export default function TermsPage() {
  return (
    <div className="bg-zinc-100">
      <PageHero
        eyebrow="Juridique"
        title="Conditions generales d'utilisation"
        description="Conditions generales d'utilisation de DayBooker pour la reservation de chambres d'hotel a la journee en Republique Democratique du Congo."
      />

      <PageSection
        title="Cadre general"
        description="Premiere partie du document juridique transmis : les conditions generales d'utilisation (CGU)."
        className="bg-white"
      >
        <div className="space-y-6">
          <LegalIntro>
            <p>
              Les presentes Conditions Generales d'Utilisation regissent l'acces
              et l'utilisation du site internet DAYBOOKER, accessible a l'adresse
              <strong> WWW.DAYBOOKER.ONLINE</strong>.
            </p>
            <p>
              Le site est edite par <strong>ELITESYS</strong>, SAS de droit
              OHADA, capital social de <strong>4.600.000 CDF</strong>, siege
              social au <strong>22B Avenue Mont Fleury, Commune de Ngaliema,
              Ville-Province de Kinshasa, RDC</strong>, immatriculee au RCCM
              sous le numero <strong>CD/KNG/RCCM/26-B-0033</strong>, avec pour
              Numero d'Identification Nationale <strong>01-H5300-N90224C</strong>
              et Numero Impot <strong>A260779AB</strong>.
            </p>
            <p>
              Les informations relatives a la direction de la publication et a
              l'hebergement du site peuvent etre communiquees sur demande via
              les coordonnees de contact de DayBooker.
            </p>
            <p>
              Toute utilisation de la Plateforme emporte acceptation pleine,
              entiere et sans reserve des presentes CGU.
            </p>
            <ul>
              {legalReferences.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </LegalIntro>

          <LegalArticle title="Article 1 - Definitions">
            <ul>
              {definitions.map(([term, meaning]) => (
                <li key={term}>
                  <strong>{term}</strong> : {meaning}
                </li>
              ))}
            </ul>
          </LegalArticle>

          <LegalArticle title="Article 2 - Objet">
            <p>
              Les presentes CGU ont pour objet de definir les conditions dans
              lesquelles la Societe met a disposition des Utilisateurs la
              Plateforme et ses Services, dans lesquelles les Utilisateurs y
              accedent et l'utilisent, et dans lesquelles les Clients procedent
              a la reservation et au paiement de chambres d'hotel a la journee.
            </p>
            <p>
              La Plateforme agit en qualite d'intermediaire commercial au sens
              de l'AUDCG, assurant la mise en relation entre les Clients et les
              Etablissements Partenaires. La prestation d'hebergement est
              fournie directement par l'Etablissement Partenaire, seul
              responsable de son execution.
            </p>
          </LegalArticle>

          <LegalArticle title="Article 3 - Acceptation des CGU">
            <p>
              L'utilisation de la Plateforme implique l'acceptation sans reserve
              des presentes CGU. En cochant la case d'acceptation lors de la
              creation de Compte ou de la validation d'une Reservation,
              l'Utilisateur reconnait avoir pris connaissance des CGU et les
              accepter sans restriction.
            </p>
            <p>
              Conformement au Code du numerique, cette acceptation par voie
              electronique a la meme valeur juridique qu'une signature
              manuscrite entre les parties.
            </p>
            <p>
              La Societe se reserve le droit de modifier les presentes CGU a
              tout moment. Les CGU applicables sont celles en vigueur a la date
              de la Reservation. Toute modification substantielle pourra etre
              portee a la connaissance de l'Utilisateur par notification sur le
              Site, e-mail ou SMS.
            </p>
          </LegalArticle>

          <LegalArticle title="Article 4 - Capacite juridique">
            <p>Pour utiliser la Plateforme et proceder a une Reservation, l'Utilisateur doit :</p>
            <ul>
              <li>
                etre une personne physique majeure (18 ans revolus) et jouissant
                de sa pleine capacite juridique conformement au droit congolais,
                ou etre un mineur emancipe ;
              </li>
              <li>
                ou etre une personne morale valablement constituee et representee
                conformement a l'AUSCGIE et aux lois congolaises.
              </li>
            </ul>
            <p>
              En utilisant la Plateforme, l'Utilisateur declare et garantit
              remplir ces conditions. La Societe ne saurait etre tenue
              responsable en cas de declaration frauduleuse sur l'age ou la
              capacite juridique de l'Utilisateur.
            </p>
          </LegalArticle>

          <LegalArticle title="Article 5 - Acces a la Plateforme et inscription">
            <p>
              L'acces au Site et la consultation des offres disponibles sont
              libres et gratuits, sous reserve de disposer d'un acces a Internet.
              La realisation d'une Reservation necessite la creation d'un Compte
              ou la fourniture d'informations d'identification en mode invite.
            </p>
            <p>Pour creer un Compte, l'Utilisateur doit fournir notamment :</p>
            <BulletList items={accountData} />
            <p>
              L'Utilisateur garantit l'exactitude, la veracite et la mise a jour
              des informations communiquees. Il demeure seul responsable de la
              confidentialite de ses identifiants et de toutes les operations
              realisees depuis son Compte.
            </p>
            <p>
              La Societe se reserve le droit de suspendre ou supprimer tout
              Compte, de plein droit, apres mise en demeure restee infructueuse
              pendant sept jours, notamment en cas de :
            </p>
            <BulletList items={accountSuspensionReasons} />
            <p>
              En cas de manquement grave, la suspension ou la suppression peut
              intervenir sans preavis.
            </p>
          </LegalArticle>

          <LegalArticle title="Article 6 - Description des services">
            <p>La Plateforme permet a l'Utilisateur de :</p>
            <BulletList items={serviceSearchBullets} />
            <p>Le processus de Reservation comprend les etapes suivantes :</p>
            <ol>
              {bookingSteps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
            <p>
              Conformement au Code du numerique, le Client peut verifier le
              detail de sa commande, son prix total et corriger d'eventuelles
              erreurs avant confirmation definitive. La Reservation est
              consideree comme definitive apres reception de la confirmation et
              encaissement effectif du paiement.
            </p>
            <p>
              La chambre reservee en Day Booker est mise a disposition
              exclusivement pendant le Creneau Horaire reserve. Le Client
              s'engage a :
            </p>
            <BulletList items={dayUseObligations} />
            <p>
              Tout depassement du Creneau Horaire pourra donner lieu a une
              facturation complementaire par l'Etablissement Partenaire.
            </p>
            <p>
              Certains Etablissements Partenaires peuvent proposer des services
              complementaires (petit-dejeuner, restauration, acces piscine ou
              spa, parking, Wi-Fi premium, transfert aeroport, etc.) avec une
              tarification distincte indiquee sur leur fiche.
            </p>
          </LegalArticle>

          <LegalArticle title="Article 7 - Tarifs et paiement">
            <p>
              Les tarifs affiches sur la Plateforme sont indiques en Francs
              congolais (CDF) et/ou en Dollars americains (USD), toutes taxes
              comprises, conformement a la legislation fiscale congolaise.
            </p>
            <p>Les tarifs incluent notamment :</p>
            <ul>
              <li>la mise a disposition de la chambre pour le Creneau Horaire selectionne ;</li>
              <li>les services de base precises sur la fiche de l'Etablissement ;</li>
              <li>les taxes applicables et, le cas echeant, la taxe de sejour.</li>
            </ul>
            <p>
              Des frais de service de la Plateforme peuvent s'ajouter au prix de
              la chambre. Le prix total definitif est celui figurant sur la page
              de recapitulatif avant validation du paiement.
            </p>
            <p>Le paiement s'effectue en ligne au moment de la Reservation par :</p>
            <BulletList items={paymentMethods} />
            <p>
              Le paiement est securise via des prestataires agrees. La Societe
              ne stocke aucune donnee de paiement complete sur ses propres
              serveurs. Lorsque les tarifs sont affiches en USD et regles en CDF
              ou inversement, le taux de change applique est celui du jour de la
              transaction, tel que publie par la Banque Centrale du Congo ou
              determine par le prestataire de paiement.
            </p>
            <p>
              Une facture conforme a la legislation comptable et fiscale
              congolaise est adressee au Client par e-mail apres chaque
              Reservation confirmee. Elle mentionne notamment :
            </p>
            <BulletList items={invoiceMentions} />
          </LegalArticle>

          <LegalArticle title="Article 8 - Annulation, modification et remboursement">
            <p>
              Conformement au Code du numerique relatif aux exceptions au droit
              de retractation en matiere de commerce electronique, le droit de
              retractation ne s'applique pas aux prestations d'hebergement
              fournies a une date ou selon une periodicite determinee.
            </p>
            <p>
              Les conditions d'annulation sont definies par chaque Etablissement
              Partenaire et affichees sur la fiche de l'offre puis rappelees
              avant validation. Les politiques peuvent etre gratuites, flexibles
              ou non remboursables selon les modalites indiquees par l'offre.
            </p>
            <p>
              L'annulation peut etre demandee depuis l'espace Compte, par e-mail
              a l'adresse <strong>support@daybooker.cd</strong>, par telephone
              au <strong>+243 817 113 497</strong> ou par SMS / WhatsApp au
              <strong> +243 817 113 497</strong>. Le Client recoit un accuse de
              reception par e-mail et/ou SMS.
            </p>
            <p>
              En cas d'annulation ouvrant droit a remboursement, celui-ci est
              effectue par le meme moyen de paiement dans un delai maximum de
              trois jours ouvrables a compter de la confirmation de l'annulation.
            </p>
            <p>
              Toute modification de Reservation est soumise a la disponibilite
              et aux conditions de l'Etablissement Partenaire. En cas de non
              presentation sans annulation prealable, aucun remboursement ne sera
              effectue.
            </p>
            <p>
              En cas d'annulation par l'Etablissement Partenaire, la Societe
              s'engage a informer le Client dans les meilleurs delais, a
              proposer une solution de remplacement et, a defaut de solution
              acceptee, a proceder au remboursement integral sous trois jours
              ouvrables.
            </p>
          </LegalArticle>

          <LegalArticle title="Article 9 - Obligations de l'Utilisateur et du Client">
            <p>L'Utilisateur s'engage a :</p>
            <BulletList items={userGeneralObligations} />
            <p>Lors de l'utilisation de la chambre, le Client s'engage egalement a :</p>
            <BulletList items={roomUseObligations} />
            <p>
              Le Client est civilement responsable de tout dommage cause a
              l'Etablissement Partenaire, a ses equipements ou a des tiers
              pendant l'utilisation de la chambre, conformement au Code civil
              congolais.
            </p>
          </LegalArticle>

          <LegalArticle title="Article 10 - Obligations et responsabilite de la Societe">
            <p>
              La Societe agit en qualite de plateforme intermediaire de mise en
              relation entre les Clients et les Etablissements Partenaires. Elle
              n'est pas partie au contrat d'hebergement conclu entre le Client
              et l'Etablissement Partenaire et ne fournit pas elle-meme la
              prestation d'hebergement.
            </p>
            <p>
              La Societe ne saurait etre tenue responsable de la qualite, de la
              conformite, de la salubrite ou de la disponibilite effective des
              prestations fournies par l'Etablissement Partenaire.
            </p>
            <p>Elle s'engage toutefois a mettre en oeuvre tous les moyens raisonnables pour assurer :</p>
            <BulletList items={companyMeans} />
            <p>
              La Societe ne garantit pas un acces permanent et ininterrompu a la
              Plateforme. Elle ne saurait etre tenue responsable en cas
              d'interruption temporaire pour maintenance, mise a jour, panne de
              reseau Internet ou electrique, ou cas de force majeure.
            </p>
            <p>
              Dans les limites autorisees par le droit congolais et le droit
              OHADA, la responsabilite totale de la Societe au titre d'une
              Reservation ne saurait exceder le montant des frais de service
              effectivement percus par la Societe.
            </p>
          </LegalArticle>

          <LegalArticle title="Article 11 - Reclamations et service client">
            <p>
              En cas de litige relatif a la prestation d'hebergement ou aux
              Services de la Plateforme, le Client est invite a :
            </p>
            <ol>
              <li>signaler tout probleme au personnel de l'Etablissement Partenaire des sa constatation ;</li>
              <li>
                contacter le service client dans un delai de quarante-huit heures
                suivant la fin du Creneau Horaire, a l'adresse <strong>support@daybooker.cd</strong>,
                par telephone au <strong>+243 817 113 497</strong> ou via le formulaire de contact du Site ;
              </li>
              <li>
                joindre a sa reclamation le numero de Reservation, une description detaillee du probleme
                et tout justificatif utile.
              </li>
            </ol>
            <p>
              La Societe s'engage a accuser reception sous quarante-huit heures
              ouvrables et a apporter une reponse motivee dans un delai de quinze
              jours ouvrables.
            </p>
            <p>
              En cas de desaccord persistant, les parties s'engagent a rechercher
              une solution amiable avant toute action judiciaire, conformement a
              l'Acte Uniforme OHADA relatif a la Mediation du 23 novembre 2017.
            </p>
          </LegalArticle>

          <LegalArticle title="Article 12 - Avis clients">
            <p>
              Seuls les Clients ayant effectue une Reservation confirmee et
              consommee peuvent deposer un avis sur l'Etablissement Partenaire
              concerne. L'avis doit etre redige en francais ou dans l'une des
              langues nationales de la RDC, porter exclusivement sur l'experience
              vecue et rester sincere, respectueux et conforme aux lois
              congolaises.
            </p>
            <p>La Societe se reserve le droit de moderer, de ne pas publier ou de supprimer tout avis :</p>
            <BulletList items={reviewModeration} />
          </LegalArticle>

          <LegalArticle title="Article 13 - Propriete intellectuelle">
            <p>
              L'ensemble des elements composant la Plateforme, notamment textes,
              images, photographies, logos, marques, graphismes, logiciels,
              bases de donnees et architecture du site, sont la propriete
              exclusive de la Societe ou de ses concedants et sont proteges par
              la legislation congolaise et les conventions internationales
              applicables.
            </p>
            <p>
              Toute reproduction, representation, modification, publication,
              transmission ou denaturation, totale ou partielle, sans
              autorisation ecrite prealable, est strictement interdite.
            </p>
            <p>
              La Societe concede a l'Utilisateur un droit d'utilisation
              personnel, non exclusif, non cessible et non transferable, limite
              a l'acces et a l'utilisation de la Plateforme conformement a sa
              destination.
            </p>
          </LegalArticle>

          <LegalArticle title="Article 14 - Conformite reglementaire des Etablissements Partenaires">
            <p>Les Etablissements Partenaires declarent et garantissent notamment :</p>
            <BulletList items={hotelCompliance} />
            <p>
              Le Client est informe que les Etablissements Partenaires peuvent
              etre tenus de demander la presentation d'une piece d'identite,
              faire remplir une fiche d'enregistrement et communiquer certaines
              informations aux autorites competentes.
            </p>
          </LegalArticle>

          <LegalArticle title="Article 15 - Force majeure">
            <p>
              Aucune des parties ne pourra etre tenue responsable de
              l'inexecution totale ou partielle de ses obligations si cette
              inexecution resulte d'un evenement constitutif de force majeure au
              sens du Code civil congolais.
            </p>
            <p>Sont notamment consideres comme des cas de force majeure :</p>
            <BulletList items={forceMajeureCases} />
            <p>
              En cas de force majeure, les obligations sont suspendues pour la
              duree de l'evenement. Si celui-ci perdure au-dela de trente jours,
              chaque partie pourra resilier la Reservation sans indemnite et le
              Client sera rembourse integralement.
            </p>
          </LegalArticle>

          <LegalArticle title="Article 16 - Loi applicable et reglement des litiges">
            <p>
              Les presentes CGU sont regies par et interpretees conformement au
              droit uniforme OHADA, au Code du numerique de la RDC, au Code civil
              congolais et, plus generalement, a la legislation de la Republique
              Democratique du Congo. En cas de conflit, les Actes Uniformes
              OHADA prevalent conformement a l'article 10 du Traite OHADA.
            </p>
            <p>
              En cas de litige relatif a la formation, l'interpretation,
              l'execution ou la resiliation des presentes CGU, les parties
              s'engagent a rechercher en priorite une solution amiable dans un
              delai de trente jours a compter de la reception de la reclamation.
            </p>
            <p>
              A defaut de resolution amiable, les parties pourront recourir a la
              mediation conformement a l'Acte Uniforme OHADA relatif a la
              Mediation. Les litiges entre professionnels pourront egalement
              etre soumis a l'arbitrage selon le centre designe et son reglement.
            </p>
            <p>
              Pour les litiges ne relevant pas de l'arbitrage, ou lorsque le
              litige implique un consommateur, le Tribunal de Commerce du ressort
              du siege social de la Societe ou le Tribunal de Grande Instance
              competent selon les regles de droit commun sera competent.
            </p>
          </LegalArticle>

          <LegalArticle title="Article 17 - Dispositions diverses">
            <p>
              Si l'une quelconque des stipulations des presentes CGU est
              declaree nulle, illicite ou inapplicable, les autres stipulations
              demeureront pleinement en vigueur, pour autant que l'economie
              generale du contrat ne s'en trouve pas bouleversee.
            </p>
            <p>
              Le fait pour la Societe de ne pas se prevaloir, a un moment donne,
              de l'une des stipulations des presentes CGU ne saurait etre
              interprete comme une renonciation a s'en prevaloir ulterieurement.
            </p>
            <p>
              Les presentes CGU, ensemble avec la Politique de Confidentialite
              et les conditions particulieres des Etablissements Partenaires,
              constituent l'integralite de l'accord entre l'Utilisateur et la
              Societe relatif a l'utilisation de la Plateforme.
            </p>
            <p>
              Les presentes CGU sont redigees en langue francaise. En cas de
              traduction, seule la version francaise fait foi.
            </p>
            <p>
              Date de derniere mise a jour des CGU : <strong>22 avril 2026</strong>.
            </p>
          </LegalArticle>
        </div>
      </PageSection>
    </div>
  );
}
