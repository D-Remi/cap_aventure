import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import useEntreprise, { v, nomEI, fmtDate } from '../hooks/useEntreprise'
import { setMeta } from '../utils/seo'
import './LegalPages.css'

const SOMMAIRE = [
  ['objet', 'Objet'], ['prix', 'Prix'], ['devis', 'Devis et contrat'], ['retractation', 'Rétractation'],
  ['execution', 'Déroulement'], ['annulation', 'Annulation'], ['duree', 'Durée et résiliation'],
  ['paiement', 'Facturation et paiement'], ['fiscal', 'Avantage fiscal'], ['famille', 'Engagements de la famille'],
  ['responsabilite', 'Assurance'], ['donnees', 'Données personnelles'], ['litiges', 'Réclamations et médiation'],
  ['formulaire', 'Formulaire de rétractation'],
]

export default function CgvPage() {
  const e = useEntreprise()
  useEffect(() => {
    setMeta('Conditions générales · Éduc & Vous', "Conditions générales des prestations de garde d'enfants à domicile Éduc & Vous : prix, devis, rétractation, annulation, paiement, médiation.")
  }, [])
  const adresse = [e.adresse, [e.code_postal, e.ville].filter(Boolean).join(' ')].filter(Boolean).join(', ')
  const franchise = (e.tva_regime || 'franchise') === 'franchise'

  return (
    <div className="ev">
      <Navbar />
      <main className="ev-legal">
        <div className="ev-legal__head">
          <span className="ev-kicker">Services à la personne</span>
          <h1>Conditions générales de prestation</h1>
          <p>Applicables aux prestations de garde d'enfants à domicile conclues avec des particuliers. Elles sont remises avec le devis et le contrat.</p>
        </div>

        <nav className="ev-legal__toc" aria-label="Sommaire">
          {SOMMAIRE.map(([id, t]) => <a key={id} href={`#${id}`}>{t}</a>)}
        </nav>

        <section id="objet">
          <h2>1. Prestataire et objet</h2>
          <p>
            Les prestations sont réalisées par {nomEI(e)}{e.nom_commercial ? ` (« ${e.nom_commercial} »)` : ''}, {v(adresse, 'adresse')},
            SIRET {v(e.siret)}, organisme de services à la personne {e.sap_numero ? `déclaré sous le n° ${e.sap_numero}${e.sap_date ? ` le ${fmtDate(e.sap_date)}` : ''}` : '[n° de déclaration à compléter]'}
            {e.agrement_numero ? `, agréé sous le n° ${e.agrement_numero}` : ''}.
          </p>
          <p>
            Elles portent sur la garde d'enfants au domicile de la famille (ou dans sa résidence secondaire du Chablais), y compris d'enfants
            présentant des besoins spécifiques, et sur leur accompagnement lors de sorties. Mode d'intervention : <b>prestataire</b>.
            Le prestataire intervient lui-même ; la famille n'est pas employeur.
          </p>
          <p>
            Pour les familles qui habitent en Suisse (cantons de Genève et de Vaud), les gardes à domicile sont ponctuelles. Chaque intervention est
            déclarée au préalable aux autorités suisses (procédure d'annonce des prestataires de services), ce qui impose une réservation au moins
            8 jours à l'avance et une limite de 90 jours d'intervention par année civile. Le crédit d'impôt français ne s'applique pas aux familles
            qui ne sont pas résidentes fiscales en France. Une garde régulière au domicile d'une famille en Suisse relève d'un contrat de travail
            conclu directement avec la famille, hors des présentes conditions.
          </p>
          <p>La garde d'enfants en situation de handicap de moins de 18 ans et d'enfants de moins de 3 ans n'est réalisée qu'une fois l'agrément obtenu.</p>
        </section>

        <section id="prix">
          <h2>2. Prix</h2>
          <p>
            Les prix sont ceux de la <Link to="/tarifs">grille tarifaire</Link> en vigueur le jour du devis, exprimés toutes taxes comprises.
            {franchise ? ' TVA non applicable, article 293 B du CGI : les prix HT et TTC sont identiques.' : ` Ils incluent la TVA au taux de ${e.tva_taux} %.`}
          </p>
          <p>
            Les frais de déplacement sont inclus jusqu'à 20 km autour de Thonon-les-Bains ; au-delà, ils sont facturés au kilomètre ou par forfait,
            comme indiqué sur la grille et sur le devis. Aucun autre frais (dossier, gestion) n'est facturé.
          </p>
          <p>En cas d'évolution des tarifs, la famille en est informée par écrit au moins un mois avant ; elle peut alors résilier sans frais.</p>
        </section>

        <section id="devis">
          <h2>3. Devis et contrat</h2>
          <p>
            Un devis personnalisé et gratuit est remis avant toute prestation dont le prix mensuel est supérieur ou égal à 100 € TTC, et sur simple demande
            en dessous de ce montant. Il précise notamment le lieu d'intervention, la nature et la durée des prestations, le prix horaire, le montant total
            ou mensuel et sa durée de validité.
          </p>
          <p>
            Le contrat est formé par la signature du devis ou du contrat de garde par la famille. Une rencontre préalable au domicile permet de préparer la garde
            (habitudes, besoins, traitements, consignes d'urgence) ; elle est gratuite.
          </p>
        </section>

        <section id="retractation">
          <h2>4. Droit de rétractation</h2>
          <p>
            Lorsque le contrat est conclu au domicile de la famille ou à distance (téléphone, e-mail, espace famille), la famille dispose d'un délai de
            <b> 14 jours</b> à compter de la conclusion du contrat pour se rétracter, sans avoir à se justifier ni à payer de pénalité
            (articles L221-18 et suivants du Code de la consommation).
          </p>
          <p>
            Pour l'exercer, il suffit d'envoyer une déclaration claire par courrier ou par e-mail à {v(e.email, 'e-mail')}, par exemple avec le
            <a href="#formulaire"> formulaire ci-dessous</a>.
          </p>
          <p>
            Si la famille souhaite qu'une garde ait lieu pendant ce délai, elle doit le demander expressément par écrit. En cas de rétractation ensuite,
            elle règle uniquement les gardes réalisées jusqu'à la communication de sa décision. Le droit de rétractation ne peut plus être exercé pour une
            prestation entièrement réalisée avant la fin du délai, à la demande expresse de la famille.
          </p>
        </section>

        <section id="execution">
          <h2>5. Déroulement des gardes</h2>
          <ul>
            <li>Les jours et horaires sont fixés au contrat ou à la réservation. Toute modification se fait d'un commun accord.</li>
            <li>Un adulte responsable confie l'enfant au début de la garde et le reprend à la fin.</li>
            <li>Si le retour des parents est retardé, le prestataire reste auprès de l'enfant ; le temps supplémentaire est facturé au quart d'heure, au tarif de la formule.</li>
            <li>Le prestataire intervenant seul, il n'est pas remplacé en cas d'indisponibilité (maladie, force majeure) : la famille est prévenue au plus tôt et la garde n'est pas facturée.</li>
            <li>En cas d'urgence, le prestataire applique le protocole préparé avec la famille, appelle les secours (15 ou 112) et prévient immédiatement les parents.</li>
          </ul>
        </section>

        <section id="annulation">
          <h2>6. Annulation d'une garde</h2>
          <ul>
            <li>Par la famille, au moins 48 heures avant : sans frais.</li>
            <li>Par la famille, moins de 48 heures avant : la garde est due, sauf hospitalisation ou maladie de l'enfant justifiée.</li>
            <li>Par le prestataire : aucune somme n'est due et la famille est prévenue au plus tôt.</li>
          </ul>
        </section>

        <section id="duree">
          <h2>7. Durée et résiliation</h2>
          <p>
            Les gardes ponctuelles sont conclues pour la prestation réservée. L'abonnement hebdomadaire comporte un engagement initial de 3 mois ;
            il se poursuit ensuite sans durée minimale et chaque partie peut y mettre fin à tout moment, par écrit, avec un préavis de 15 jours.
          </p>
          <p>Pendant l'engagement initial, la famille peut résilier sans frais pour motif légitime (déménagement, hospitalisation longue, entrée de l'enfant en établissement).</p>
        </section>

        <section id="paiement">
          <h2>8. Facturation et paiement</h2>
          <p>
            Une facture est remise avant le paiement, chaque mois ou à l'issue de la prestation. Elle détaille les dates, les durées, le prix horaire et les
            éventuels frais de déplacement. Elle est payable à réception.
          </p>
          <p>
            Modes de paiement : avance immédiate du crédit d'impôt (via l'URSSAF, la famille ne règle alors que sa part), virement bancaire,
            CESU préfinancé. En cas de retard de paiement, et après une relance restée sans effet, les gardes suivantes peuvent être suspendues.
          </p>
        </section>

        <section id="fiscal">
          <h2>9. Avantage fiscal</h2>
          <p>
            Les sommes versées ouvrent droit, sous conditions, au crédit d'impôt de 50 % prévu à l'article 199 sexdecies du code général des impôts,
            dans la limite des plafonds annuels. Une attestation fiscale annuelle est adressée à chaque famille avant le 31 mars de l'année suivante.
            Les paiements en espèces et la part financée par des CESU préfinancés par un tiers n'ouvrent pas droit à cet avantage.
          </p>
        </section>

        <section id="famille">
          <h2>10. Engagements de la famille</h2>
          <ul>
            <li>Communiquer les informations utiles à la sécurité de l'enfant : santé, allergies, traitements, contacts d'urgence, consignes particulières, et signaler tout changement.</li>
            <li>Fournir les autorisations nécessaires (sorties, administration d'un traitement sur ordonnance, photos le cas échéant).</li>
            <li>Prévenir en cas de maladie contagieuse de l'enfant ou d'un membre du foyer.</li>
            <li>Assurer un accès au domicile et des conditions de garde sûres.</li>
          </ul>
        </section>

        <section id="responsabilite">
          <h2>11. Assurance</h2>
          <p>
            Le prestataire est assuré en responsabilité civile professionnelle auprès de {v(e.assureur, 'assureur')}{e.police_rc ? ` (contrat n° ${e.police_rc})` : ''}
            pour les dommages causés dans le cadre de ses prestations.
          </p>
        </section>

        <section id="donnees">
          <h2>12. Données personnelles</h2>
          <p>
            Les informations transmises, dont celles relatives à la santé de l'enfant, sont utilisées uniquement pour réaliser les gardes et respecter les
            obligations légales. Elles restent confidentielles. Voir la <Link to="/confidentialite">politique de confidentialité</Link>.
          </p>
        </section>

        <section id="litiges">
          <h2>13. Réclamations, médiation et droit applicable</h2>
          <p>Toute réclamation peut être adressée par écrit à {v(e.email, 'e-mail')} ou {v(adresse, 'adresse')}. Une réponse est apportée sous 15 jours.</p>
          <p>
            À défaut d'accord, la famille peut saisir gratuitement le médiateur de la consommation : {v(e.mediateur_nom, 'médiateur à compléter')}
            {e.mediateur_adresse ? `, ${e.mediateur_adresse}` : ''}{e.mediateur_site ? <>, <a href={e.mediateur_site} target="_blank" rel="noopener noreferrer">{e.mediateur_site}</a></> : ''}.
          </p>
          <p>Le droit français s'applique. La famille peut saisir la juridiction du lieu où elle demeurait au moment de la conclusion du contrat.</p>
        </section>

        <section id="formulaire">
          <h2>Annexe : formulaire de rétractation</h2>
          <p>À compléter et renvoyer uniquement si vous souhaitez vous rétracter du contrat.</p>
          <div className="ev-legal__form">
            <p>À l'attention de {nomEI(e)}, {v(adresse, 'adresse')}, {v(e.email, 'e-mail')} :</p>
            <p>Je/Nous (*) vous notifie/notifions (*) par la présente ma/notre (*) rétractation du contrat portant sur la prestation de services ci-dessous :</p>
            <p>Conclu le : ....................</p>
            <p>Nom du (des) consommateur(s) : ....................</p>
            <p>Adresse du (des) consommateur(s) : ....................</p>
            <p>Signature du (des) consommateur(s) (uniquement en cas de notification sur papier) : ....................</p>
            <p>Date : ....................</p>
            <p>(*) Rayez la mention inutile.</p>
          </div>
        </section>

        <p className="ev-legal__maj">Dernière mise à jour : novembre 2026.</p>
      </main>
      <Footer />
    </div>
  )
}
