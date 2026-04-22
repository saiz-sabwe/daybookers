/* eslint-disable react/no-unescaped-entities */

import { PageHero, PageSection } from "@/components/client/content/PageShell";
import {
  LegalArticle,
  LegalIntro,
  LegalTable,
} from "@/components/client/content/LegalContent";

const privacyReferences = [
  "L'Ordonnance-loi ndeg 23/010 du 13 mars 2023 portant Code du numerique en Republique Democratique du Congo, notamment ses dispositions relatives a la protection des donnees a caractere personnel et a la cybersecurite ;",
  "La Constitution de la Republique Democratique du Congo du 18 fevrier 2006, notamment l'article 31 garantissant le droit a la vie privee ;",
  "Les principes generaux du droit applicables en matiere de protection de la vie privee et des donnees personnelles ;",
  "Toute autre disposition legale ou reglementaire applicable en RDC.",
];

const processingPrinciples = [
  ["Licite, loyaute et transparence", "Les donnees sont traitees de maniere licite, loyale et transparente a l'egard de la personne concernee."],
  ["Limitation des finalites", "Les donnees sont collectees pour des finalites determinees, explicites et legitimes."],
  ["Minimisation", "Seules les donnees adequates, pertinentes et necessaires au regard des finalites sont collectees."],
  ["Exactitude", "Les donnees sont exactes et tenues a jour ; les donnees inexactes sont rectifiees ou supprimees."],
  ["Limitation de la conservation", "Les donnees sont conservees pendant une duree n'excedant pas celle necessaire aux finalites du traitement."],
  ["Integrite et confidentialite", "Les donnees sont traitees de maniere a garantir leur securite, y compris la protection contre le traitement non autorise ou illicite."],
  ["Responsabilite", "Le responsable du traitement est en mesure de demontrer le respect de ces principes."],
];

const directDataRows = [
  ["Identification", "Nom, post-nom, prenom, date de naissance, nationalite, sexe", "Creation de compte / Reservation"],
  ["Coordonnees", "Adresse e-mail, numeros de telephone, adresse postale, commune, ville, province", "Creation de compte / Reservation"],
  ["Piece d'identite", "Type et numero de piece d'identite, collectes par l'Etablissement Partenaire lors du check-in", "Arrivee a l'Etablissement"],
  ["Donnees de paiement", "Numero de compte Mobile Money, numero de carte tronque, informations de transaction", "Reservation via prestataire de paiement"],
  ["Donnees de reservation", "Etablissement choisi, dates, creneaux horaires, type de chambre, services complementaires, historique, preferences", "Reservation"],
  ["Donnees de communication", "Messages au service client, reclamations, avis deposes, echanges telephoniques", "Utilisation du service client"],
  ["Donnees professionnelles", "Denomination sociale, RCCM, NIF, nom du representant, fonction", "Reservation professionnelle"],
];

const automaticDataRows = [
  ["Donnees techniques de connexion", "Adresse IP, type et version de navigateur, systeme d'exploitation, type d'appareil, resolution d'ecran"],
  ["Donnees de navigation", "Pages visitees, duree de visite, parcours, clics, date et heure de connexion, URL de provenance"],
  ["Donnees de geolocalisation", "Localisation approximative basee sur l'adresse IP ou, avec consentement, geolocalisation precise"],
  ["Cookies et traceurs", "Identifiants de cookies et identifiants de session"],
];

const purposesRows = [
  ["Creation et gestion des Comptes utilisateurs", "Execution du contrat (CGU)"],
  ["Traitement, confirmation et suivi des Reservations", "Execution du contrat"],
  ["Traitement des paiements et facturation", "Execution du contrat"],
  ["Communications transactionnelles", "Execution du contrat"],
  ["Service client et gestion des reclamations", "Execution du contrat / Interet legitime"],
  ["Amelioration de la Plateforme et des Services", "Interet legitime"],
  ["Personnalisation de l'experience et recommandations", "Interet legitime"],
  ["Envoi de newsletters, offres promotionnelles, alertes", "Consentement prealable"],
  ["Prospection commerciale par SMS, e-mail, WhatsApp", "Consentement prealable"],
  ["Gestion et publication des avis clients", "Interet legitime"],
  ["Prevention de la fraude, lutte contre les abus", "Interet legitime"],
  ["Respect des obligations legales et fiscales", "Obligation legale"],
  ["Geolocalisation precise pour la recherche d'etablissements", "Consentement prealable"],
  ["Statistiques et mesure d'audience anonymisees", "Interet legitime"],
  ["Securite et integrite de la Plateforme", "Interet legitime / Obligation legale"],
  ["Reponse aux requisitions des autorites", "Obligation legale"],
];

const recipientRows = [
  ["Etablissements Partenaires", "Nom, prenom, e-mail, telephone, details de Reservation", "Execution de la Reservation et accueil du Client"],
  ["Prestataires de paiement", "Donnees de paiement", "Traitement securise des transactions"],
  ["Hebergeur du site", "Donnees techniques", "Hebergement et fonctionnement de la Plateforme"],
  ["Prestataires techniques", "Donnees necessaires a la prestation", "Envoi de communications, maintenance"],
  ["Prestataires d'analyse", "Donnees de navigation anonymisees ou pseudonymisees", "Amelioration de la Plateforme"],
  ["Conseils juridiques et commissaires aux comptes", "Donnees necessaires", "Conformite legale et audit"],
  ["Autorites judiciaires, administratives, fiscales", "Donnees requises par la loi", "Reponse aux requisitions et controles"],
];

const retentionRows = [
  ["Donnees du Compte", "Duree de l'existence du Compte + 3 ans a compter de la derniere activite ou de la demande de suppression"],
  ["Donnees de Reservation", "5 ans a compter de la fin de la prestation"],
  ["Donnees de paiement", "Duree de la transaction ; conservation du numero tronque et de la reference de transaction pendant 5 ans"],
  ["Donnees de facturation", "10 ans a compter de la cloture de l'exercice"],
  ["Donnees de prospection commerciale", "3 ans a compter du dernier contact actif ou du retrait du consentement"],
  ["Donnees de navigation / cookies", "13 mois maximum a compter du depot du cookie"],
  ["Donnees de connexion (logs)", "1 an"],
  ["Reclamations et litiges", "Duree du traitement du litige + delai de prescription applicable"],
  ["Avis clients", "Duree de publication sur la Plateforme, sauf suppression par l'Utilisateur ou la Societe"],
];

const rightsRows = [
  ["Droit d'acces", "Obtenir la confirmation que des donnees le concernant sont traitees et en obtenir une copie."],
  ["Droit de rectification", "Faire corriger des donnees inexactes ou completer des donnees incompletes."],
  ["Droit a l'effacement", "Obtenir la suppression des donnees lorsqu'elles ne sont plus necessaires ou en cas de traitement illicite."],
  ["Droit a la limitation du traitement", "Obtenir la limitation du traitement dans certains cas."],
  ["Droit d'opposition", "S'opposer au traitement pour des motifs legitimes ou a la prospection commerciale."],
  ["Droit a la portabilite", "Recevoir les donnees dans un format structure, couramment utilise et lisible par machine."],
  ["Droit de retirer son consentement", "Retirer a tout moment le consentement donne pour un traitement fonde sur le consentement."],
  ["Droit d'introduire une plainte", "Saisir l'autorite competente en cas de violation de ses droits."],
];

const technicalMeasures = [
  "Chiffrement des donnees sensibles en transit (HTTPS / TLS) et, lorsque necessaire, au repos ;",
  "Pare-feu et systemes de detection et de prevention des intrusions ;",
  "Antivirus et protection contre les logiciels malveillants ;",
  "Sauvegardes regulieres des donnees sur des serveurs securises ;",
  "Pseudonymisation et anonymisation des donnees lorsque cela est possible et pertinent ;",
  "Tests de vulnerabilite et audits de securite periodiques.",
];

const organizationalMeasures = [
  "Controle d'acces strict aux donnees personnelles (authentification forte, profils d'habilitation, principe du moindre privilege) ;",
  "Sensibilisation et formation du personnel aux enjeux de protection des donnees et de cybersecurite ;",
  "Clauses de confidentialite dans les contrats de travail et les contrats avec les sous-traitants ;",
  "Procedures de gestion des incidents de securite incluant la notification aux autorites competentes et aux personnes concernees en cas de violation de donnees ;",
  "Politique interne de protection des donnees formalisee et regulierement mise a jour.",
];

const cookiesRows = [
  ["Cookies strictement necessaires", "Fonctionnement du site (session, authentification, securite, panier de reservation)", "Duree de la session", "Non requis"],
  ["Cookies de preferences", "Memorisation des preferences (langue, devise, localisation par defaut)", "12 mois", "Oui"],
  ["Cookies analytiques", "Statistiques de frequentation, mesure d'audience, amelioration du site", "13 mois", "Oui"],
  ["Cookies publicitaires / marketing", "Publicites ciblees, mesure de performance des campagnes", "13 mois", "Oui"],
];

const commercialChannels = [
  "E-mail ;",
  "SMS ;",
  "WhatsApp ou toute autre application de messagerie ;",
  "Notifications push, le cas echeant.",
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

export default function PrivacyPage() {
  return (
    <div className="bg-zinc-100">
      <PageHero
        eyebrow="Juridique"
        title="Politique de confidentialite"
        description="Politique de confidentialite et de protection des donnees a caractere personnel applicable a DayBooker en Republique Democratique du Congo."
      />

      <PageSection
        title="Protection des donnees"
        description="Seconde partie du document juridique transmis : la politique de confidentialite et de protection des donnees."
        className="bg-white"
      >
        <div className="space-y-6">
          <LegalIntro>
            <p>
              La Societe <strong>ELITESYS</strong> s'engage a
              proteger la vie privee et les donnees a caractere personnel de ses
              Utilisateurs conformement au Code du numerique de la RDC, a la
              Constitution congolaise et a toute autre disposition legale ou
              reglementaire applicable.
            </p>
            <p>
              La presente Politique de Confidentialite a pour objet d'informer
              les Utilisateurs de la maniere dont leurs donnees personnelles sont
              collectees, traitees, utilisees, stockees et protegees dans le
              cadre de l'utilisation de la Plateforme <strong>DayBooker</strong>.
            </p>
            <ul>
              {privacyReferences.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </LegalIntro>

          <LegalArticle title="Article 1 - Responsable du traitement">
            <p>
              Le responsable du traitement des donnees a caractere personnel est
              : <strong>ELITESYS</strong>, <strong>SAS</strong> de droit OHADA,
              siege social : <strong>22B Avenue Mont Fleury, Commune de Ngaliema, Kinshasa, RDC</strong>,
              RCCM : <strong>CD/KNG/RCCM/26-B-0033</strong>, Id. Nat. :
              <strong> 01-H5300-N90224C</strong>, NIF : <strong>A260779AB</strong>,
              e-mail : <strong>support@daybooker.cd</strong>, telephone :
              <strong> +243 817 113 497</strong>.
            </p>
            <p>
              Toute question relative a la protection des donnees peut etre
              adressee a l'equipe DayBooker via les coordonnees de contact
              mentionnees ci-dessus.
            </p>
          </LegalArticle>

          <LegalArticle title="Article 2 - Principes applicables au traitement">
            <LegalTable
              headers={["Principe", "Description"]}
              rows={processingPrinciples}
            />
          </LegalArticle>

          <LegalArticle title="Article 3 - Donnees a caractere personnel collectees">
            <p>Donnees collectees directement aupres de l'Utilisateur :</p>
            <LegalTable
              headers={["Categorie", "Donnees collectees", "Moment de la collecte"]}
              rows={directDataRows}
            />
            <p>Donnees collectees automatiquement :</p>
            <LegalTable
              headers={["Categorie", "Donnees collectees"]}
              rows={automaticDataRows}
            />
            <p>
              La Societe ne collecte aucune donnee sensible telle que l'origine
              raciale ou ethnique, les opinions politiques, convictions
              religieuses, donnees genetiques, donnees de sante ou donnees
              relatives a la vie sexuelle ou a l'orientation sexuelle.
            </p>
          </LegalArticle>

          <LegalArticle title="Article 4 - Finalites et bases legales du traitement">
            <LegalTable
              headers={["Finalite du traitement", "Base legale"]}
              rows={purposesRows}
            />
          </LegalArticle>

          <LegalArticle title="Article 5 - Destinataires des donnees">
            <p>
              Les donnees personnelles collectees peuvent etre communiquees aux
              services autorises de la Societe : service client, service
              technique, service commercial, direction financiere et comptable,
              direction generale.
            </p>
            <p>Les destinataires externes peuvent inclure :</p>
            <LegalTable
              headers={["Destinataire", "Donnees partagees", "Finalite"]}
              rows={recipientRows}
            />
            <p>
              Les sous-traitants sont lies par des contrats conformes au Code du
              numerique, imposant des obligations de securite, de confidentialite
              et de protection des donnees equivalentes a celles de la Societe.
            </p>
            <p>
              Certains prestataires techniques peuvent etre situes hors de la
              RDC. En pareil cas, la Societe s'assure qu'un niveau de protection
              adequat ou des garanties contractuelles appropriees sont mis en
              place. Aucune donnee personnelle n'est vendue, louee ou echangee
              a des tiers a des fins commerciales sans consentement expres.
            </p>
          </LegalArticle>

          <LegalArticle title="Article 6 - Duree de conservation des donnees">
            <LegalTable
              headers={["Categorie de donnees", "Duree de conservation"]}
              rows={retentionRows}
            />
            <p>
              A l'expiration de ces delais, les donnees sont supprimees
              definitivement ou anonymisees de maniere irreversible.
            </p>
          </LegalArticle>

          <LegalArticle title="Article 7 - Droits des personnes concernees">
            <LegalTable headers={["Droit", "Description"]} rows={rightsRows} />
            <p>Les Utilisateurs peuvent exercer leurs droits :</p>
            <ul>
              <li>par e-mail : <strong>support@daybooker.cd</strong> ;</li>
              <li>par courrier : <strong>22B Avenue Mont Fleury, Commune de Ngaliema, Kinshasa, RDC</strong> ;</li>
              <li>par telephone : <strong>+243 817 113 497</strong> ;</li>
              <li>depuis l'espace Compte pour la rectification, la suppression et l'export des donnees.</li>
            </ul>
            <p>
              Toute demande devra etre accompagnee d'une copie d'un justificatif
              d'identite en cours de validite. La Societe s'engage a repondre
              dans un delai de trente jours a compter de la reception de la
              demande complete, sauf prolongation justifiee en cas de demande
              complexe.
            </p>
            <p>
              En cas d'insatisfaction, l'Utilisateur peut introduire une plainte
              aupres de l'Autorite de Regulation du Numerique, de l'ARPTC le cas
              echeant, ou de toute juridiction competente en RDC.
            </p>
          </LegalArticle>

          <LegalArticle title="Article 8 - Securite des donnees">
            <p>La Societe met en oeuvre des mesures techniques appropriees :</p>
            <BulletList items={technicalMeasures} />
            <p>Elle applique egalement des mesures organisationnelles :</p>
            <BulletList items={organizationalMeasures} />
            <p>
              En cas de violation de donnees a caractere personnel susceptible
              d'engendrer un risque pour les droits et libertes des personnes
              concernees, la Societe notifie l'autorite competente dans les
              meilleurs delais, informe les personnes concernees en cas de risque
              eleve et documente toute violation dans un registre interne.
            </p>
          </LegalArticle>

          <LegalArticle title="Article 9 - Cookies et traceurs">
            <p>
              Un cookie est un petit fichier texte depose sur le terminal de
              l'Utilisateur lors de sa visite sur la Plateforme. Il permet de
              stocker des informations relatives a la navigation.
            </p>
            <LegalTable
              headers={["Type", "Finalite", "Duree", "Consentement"]}
              rows={cookiesRows}
            />
            <p>
              Lors de la premiere visite, un bandeau d'information sur les
              cookies permet a l'Utilisateur d'accepter tous les cookies, de
              refuser tous les cookies non essentiels ou de parametrer ses choix
              categorie par categorie.
            </p>
            <p>
              L'Utilisateur peut modifier ses preferences a tout moment via le
              lien <strong>Gerer les cookies</strong> en pied de page du Site ou
              directement depuis les reglages de son navigateur.
            </p>
          </LegalArticle>

          <LegalArticle title="Article 10 - Prospection commerciale">
            <p>
              Avec le consentement prealable et expres de l'Utilisateur, la
              Societe peut lui adresser des communications commerciales par :
            </p>
            <BulletList items={commercialChannels} />
            <p>
              L'Utilisateur peut retirer son consentement et se desabonner a
              tout moment en cliquant sur le lien de desinscription, en envoyant
              STOP par SMS, depuis les parametres de notification du Compte ou
              en contactant la Societe a l'adresse <strong>support@daybooker.cd</strong>.
              Le retrait du consentement prend effet dans un delai maximum de
              quarante-huit heures.
            </p>
          </LegalArticle>

          <LegalArticle title="Article 11 - Protection des mineurs">
            <p>
              La Plateforme et ses Services s'adressent exclusivement a des
              personnes majeures, soit 18 ans et plus au sens du droit congolais.
              La Societe ne collecte pas sciemment de donnees personnelles
              relatives a des mineurs. Si elle constate une telle collecte, elle
              procedera a leur suppression dans les meilleurs delais.
            </p>
          </LegalArticle>

          <LegalArticle title="Article 12 - Liens vers des sites tiers">
            <p>
              La Plateforme peut contenir des liens hypertextes vers des sites
              tiers, tels que reseaux sociaux, sites des Etablissements
              Partenaires ou services de paiement. La Societe n'exerce aucun
              controle sur ces sites et decline toute responsabilite quant a
              leur contenu, leur fonctionnement ou leur politique de
              confidentialite.
            </p>
          </LegalArticle>

          <LegalArticle title="Article 13 - Utilisation des donnees a des fins statistiques">
            <p>
              La Societe peut utiliser les donnees collectees pour produire des
              statistiques agregees et anonymisees relatives a l'utilisation de
              la Plateforme. Ces donnees anonymisees ne permettent pas
              d'identifier directement ou indirectement les Utilisateurs et
              peuvent etre utilisees ou partagees librement a des fins d'analyse,
              de recherche ou commerciales.
            </p>
          </LegalArticle>

          <LegalArticle title="Article 14 - Modification de la Politique de Confidentialite">
            <p>
              La Societe se reserve le droit de modifier la presente Politique
              de Confidentialite a tout moment, notamment pour se conformer aux
              evolutions legislatives, reglementaires ou technologiques, ou pour
              refleter des changements dans ses pratiques.
            </p>
            <p>
              Toute modification substantielle sera portee a la connaissance des
              Utilisateurs par un bandeau d'information sur la Plateforme, par
              e-mail et/ou SMS pour les Utilisateurs inscrits, ainsi que par la
              mise a jour de la date de derniere modification en fin de document.
            </p>
          </LegalArticle>

          <LegalArticle title="Article 15 - Contact">
            <p>
              Pour toute question relative a la presente Politique de
              Confidentialite, a la protection de vos donnees personnelles ou
              pour exercer vos droits, vous pouvez contacter :
            </p>
            <ul>
              <li><strong>ELITESYS / DayBooker</strong></li>
              <li>Adresse : <strong>22B Avenue Mont Fleury, Commune de Ngaliema, Kinshasa, RDC</strong></li>
              <li>E-mail : <strong>support@daybooker.cd</strong></li>
              <li>Telephone : <strong>+243 817 113 497</strong></li>
              <li>WhatsApp : <strong>+243 817 113 497</strong></li>
              <li>Contact protection des donnees : <strong>support@daybooker.cd</strong></li>
            </ul>
          </LegalArticle>
        </div>
      </PageSection>
    </div>
  );
}
