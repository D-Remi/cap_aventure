import { useState, useEffect } from 'react'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import PageHero from '../components/sections/PageHero'
import BandeauSuisse from '../components/sections/BandeauSuisse'
import CtaFinal from '../components/sections/CtaFinal'
import MentionsPrix from '../components/sections/MentionsPrix'
import { COMMUNES, STATIONS, SUISSE } from '../components/sections/Zone'
import ContactModal from '../components/ui/ContactModal'
import StickyContact from '../components/ui/StickyContact'
import useReveal from '../hooks/useReveal'
import { setMeta } from '../utils/seo'
import { P } from '../data/photos'
import './ServicesPage.css'

const GRILLE = [
  { groupe: 'Souffle · chaque semaine' },
  { p: 'Heure en abonnement', d: 'même créneau chaque semaine, engagement 3 mois', prix: '40,00 €', reel: '20,00 €' },
  { p: 'Formule 4 h par semaine', d: '≈ 17,3 h par mois', prix: '693 € / mois', reel: '347 € / mois' },
  { p: 'Formule 8 h par semaine', d: 'deux créneaux par semaine', prix: '1 387 € / mois', reel: '693 € / mois' },
  { groupe: 'Relais · ponctuel' },
  { p: 'Heure ponctuelle', d: 'minimum 3 h, réservée au moins 48 h avant', prix: '45,00 €', reel: '22,50 €' },
  { p: 'Heure en urgence', d: 'demande à moins de 24 h, selon disponibilités', prix: '54,00 €', reel: '27,00 €' },
  { p: 'Journée répit', d: '8 heures, sortie nature possible', prix: '340 €', reel: '170 €' },
  { groupe: 'Grand souffle · nuit et week-end' },
  { p: 'Soirée + nuit', d: 'de 18 h à 9 h le lendemain', prix: '260 €', reel: '130 €' },
  { p: 'Week-end répit', d: 'du samedi 9 h au dimanche 18 h', prix: '790 €', reel: '395 €' },
  { groupe: 'Options' },
  { p: 'Enfant en plus', d: 'fratrie, par enfant et par heure', prix: '+ 8,00 €', reel: '+ 4,00 €' },
  { p: 'Déplacement', d: 'inclus jusqu\'à 20 km autour de Thonon ; au-delà, par km', prix: '0,60 €', reel: '0,30 €' },
  { p: 'Forfait stations', d: 'Châtel, Abondance, Morzine, Les Gets…, par venue', prix: '30 €', reel: '15 €' },
  { p: 'Forfait Genève ou Vaud', d: 'garde à domicile en Suisse, par venue, minimum 4 h, réservée 8 jours avant', prix: '40 €', reel: 'pas de crédit d\'impôt' },
  { p: 'Rencontre de préparation', d: '1 h 30 chez vous, fiche de votre enfant', prix: 'offerte', reel: '—' },
]

const FAQ = [
  {
    q: "Proposez-vous de la garde d'enfant à domicile en Haute-Savoie ?",
    r: "Oui. Je garde votre enfant chez vous, dans tout le Chablais : à l'heure, à la journée, chaque semaine, ou pour une nuit ou un week-end. Pour un imprévu, un rendez-vous, une journée à souffler, ou parce que vous n'avez personne pour prendre le relais.",
  },
  {
    q: 'Gardez-vous des enfants autistes ou en situation de handicap ?',
    r: "Oui, c'est le cœur de mon travail. J'accompagne des enfants avec TSA, TDAH, troubles du comportement, troubles DYS ou polyhandicap. Un échange préalable permet toujours de vérifier que je suis la bonne personne pour votre enfant.",
  },
  {
    q: 'Quelles aides peuvent réduire le prix ?',
    r: "Le crédit d'impôt des services à la personne (50 %), déduit tout de suite avec l'avance immédiate de l'URSSAF. Si votre enfant est en situation de handicap, l'AEEH et son complément peuvent aussi financer le répit. Je peux vous orienter dans les démarches.",
  },
  {
    q: 'Comment je paie ?',
    r: "Par l'avance immédiate de l'URSSAF (vous ne réglez que la moitié), par virement bancaire ou en CESU préfinancé.",
  },
]

export default function ServicesPage() {
  const [modalOpen, setModalOpen] = useState(false)
  const openContact = () => setModalOpen(true)
  useReveal()

  useEffect(() => {
    setMeta(
      "Tarifs · Garde et répit d'enfants à besoins spécifiques · Thonon, Évian · Éduc & Vous",
      "Tarifs Éduc & Vous : 40 €/h en abonnement (20 €/h après crédit d'impôt), 45 €/h en ponctuel, journée répit 340 €, week-end 790 €. Avance immédiate URSSAF : vous ne payez que 50 %."
    )
  }, [])

  return (
    <div className="ev">
      <Navbar onContact={openContact} overHero />
      <main>
        <PageHero
          kicker="Tarifs · aides · Haute-Savoie"
          title={<>Des prix clairs, <em>et l'État en paie la moitié.</em></>}
          lead="Chaque garde ouvre droit au crédit d'impôt des services à la personne : 50 % de la facture. Avec l'avance immédiate de l'URSSAF, cette moitié est déduite tout de suite. Vous ne payez que l'autre."
          photo={P.dessin}
          alt="Un adulte et un enfant dessinent ensemble à une table"
        >
          <div className="ev-phero__ticket">
            <span>Exemple · 4 h chaque semaine</span>
            <b>347 € <small>/ mois</small></b>
            <em>au lieu de 693 € facturés : l'État prend 347 € en charge.</em>
          </div>
        </PageHero>

        <section className="ev-section">
          <div className="ev-container">
            <div className="ev-head ev-reveal">
              <span className="ev-kicker">Grille complète</span>
              <h2>Toutes les formules, <em>tous les prix</em></h2>
              <p>Prix facturés, puis ce que vous payez réellement après le crédit d'impôt de 50 %.</p>
            </div>
            <div className="ev-table-wrap ev-reveal">
              <table className="ev-table">
                <thead><tr><th>Prestation</th><th>Détail</th><th className="r">Prix facturé</th><th className="r">Ce que vous payez</th></tr></thead>
                <tbody>
                  {GRILLE.map((l, i) => l.groupe
                    ? <tr className="grp" key={i}><td colSpan={4}>{l.groupe}</td></tr>
                    : <tr key={i}><td>{l.p}</td><td>{l.d}</td><td className="r">{l.prix}</td><td className="r fort">{l.reel}</td></tr>
                  )}
                </tbody>
              </table>
            </div>
            <p className="ev-note" style={{ marginTop: '1rem' }}>
              « Ce que vous payez » : montant après le crédit d'impôt de 50 %, pour un foyer résident fiscal en France, dans la limite du plafond annuel.
            </p>
            <MentionsPrix />
          </div>
        </section>

        <section className="ev-section ev-section--mist">
          <div className="ev-container ev-tarifs__deux">
            <article className="ev-tarifs__card ev-reveal">
              <h3>Le crédit d'impôt, en clair</h3>
              <ul>
                <li>50 % de ce que vous payez pour la garde à domicile vous revient en crédit d'impôt.</li>
                <li>Avec l'avance immédiate, il est déduit dès le paiement : je déclare la garde, vous validez en ligne, l'URSSAF ne vous prélève que la moitié.</li>
                <li>C'est un crédit : même si vous ne payez pas d'impôt sur le revenu, vous en bénéficiez.</li>
                <li>Les dépenses sont retenues jusqu'à 12 000 € par an, plus 1 500 € par enfant à charge, et jusqu'à 20 000 € quand un enfant ouvre droit au complément d'AEEH.</li>
              </ul>
            </article>
            <article className="ev-tarifs__card ev-reveal">
              <h3>Les règles du jeu</h3>
              <ul>
                <li><b>Abonnement :</b> engagement de 3 mois, puis sans durée minimale (préavis de 15 jours). Facturé chaque mois selon les heures réalisées.</li>
                <li><b>Rétractation :</b> 14 jours si le contrat est signé chez vous ou à distance.</li>
                <li><b>Annulation :</b> gratuite jusqu'à 48 h avant. En dessous, la garde est due, sauf hospitalisation ou maladie de l'enfant sur justificatif.</li>
                <li><b>Retard à votre retour :</b> le temps en plus est facturé au quart d'heure, au tarif de votre formule.</li>
                <li><b>Paiement :</b> avance immédiate URSSAF, virement bancaire ou CESU préfinancé.</li>
              </ul>
            </article>
          </div>
        </section>

        <section className="ev-section">
          <div className="ev-container ev-tarifs__zone">
            <div className="ev-reveal">
              <span className="ev-kicker">Zone d'intervention</span>
              <h2>Garde d'enfant à domicile dans le Chablais</h2>
              <p>
                J'interviens chez vous à Thonon-les-Bains, Évian-les-Bains et dans les communes du Léman.
                Le déplacement est inclus jusqu'à 20 km autour de Thonon. En Suisse (Genève, Vaud), je viens pour des gardes
                ponctuelles réservées au moins 8 jours avant. Votre commune n'apparaît pas ? Écrivez-moi, j'étudie chaque demande.
              </p>
            </div>
            <div className="ev-zone__chips ev-reveal">
              {COMMUNES.map(c => <span key={c}>{c}</span>)}
              {STATIONS.map(c => <span key={c} className="is-station">{c}</span>)}
              {SUISSE.map(c => <span key={c} className="is-station">{c} (CH)</span>)}
            </div>
          </div>
        </section>

        <BandeauSuisse />

        <section className="ev-section ev-section--mist">
          <div className="ev-container">
            <div className="ev-head ev-reveal">
              <span className="ev-kicker">Questions fréquentes</span>
              <h2>Prix, aides et paiement</h2>
            </div>
            <div className="ev-faq ev-reveal">
              {FAQ.map(({ q, r }) => (
                <details key={q}><summary>{q}</summary><div><p>{r}</p></div></details>
              ))}
            </div>
          </div>
        </section>

        <CtaFinal
          onContact={openContact}
          photo={P.foret2}
          titre="Une question sur le prix ou les aides ?"
          texte="Écrivez-moi : on regarde ensemble ce que la garde vous coûterait vraiment, selon votre situation."
          waTexte="Bonjour Rémi, j'ai une question sur vos tarifs."
        />
      </main>
      <Footer onContact={openContact} />
      <StickyContact onContact={openContact} waTexte="Bonjour Rémi, j'ai une question sur vos tarifs." />
      <ContactModal open={modalOpen} onClose={() => setModalOpen(false)} serviceInitial="repit" />
    </div>
  )
}
