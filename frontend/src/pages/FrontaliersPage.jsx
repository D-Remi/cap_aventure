import { useState, useEffect } from 'react'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import PageHero from '../components/sections/PageHero'
import CtaFinal from '../components/sections/CtaFinal'
import MentionsPrix from '../components/sections/MentionsPrix'
import ContactModal from '../components/ui/ContactModal'
import StickyContact from '../components/ui/StickyContact'
import useReveal from '../hooks/useReveal'
import { setMeta } from '../utils/seo'
import { img, P } from '../data/photos'
import { waLink, TEL_AFFICHE } from '../data/contact'
import './FrontaliersPage.css'

const WA_TEXTE = 'Bonjour Rémi, je travaille en Suisse et je cherche un relais pour mon enfant.'
const TAUX = '1 € ≈ 0,92 CHF' // taux indicatif novembre 2026, à mettre à jour si le cours bouge beaucoup

const TARIFS = [
  { p: 'Heure en abonnement', d: 'même créneau chaque semaine', eur: '40 €', chf: '37 CHF', fr: '20 €', ch: '40 €' },
  { p: 'Heure ponctuelle', d: 'minimum 3 h, réservée 48 h avant', eur: '45 €', chf: '41 CHF', fr: '22,50 €', ch: '45 €' },
  { p: 'Journée répit', d: '8 heures', eur: '340 €', chf: '313 CHF', fr: '170 €', ch: '340 €' },
  { p: 'Soirée + nuit', d: '18 h → 9 h', eur: '260 €', chf: '239 CHF', fr: '130 €', ch: '260 €' },
  { p: 'Week-end répit', d: 'samedi 9 h → dimanche 18 h', eur: '790 €', chf: '727 CHF', fr: '395 €', ch: '790 €' },
  { p: 'Forfait stations', d: 'par venue, minimum 4 h de garde', eur: '30 €', chf: '28 CHF', fr: '15 €', ch: '30 €' },
  { p: 'Forfait Genève ou Vaud', d: 'garde à votre domicile en Suisse, par venue, minimum 4 h', eur: '40 €', chf: '37 CHF', fr: '-', ch: '40 €' },
]

const FAQ = [
  {
    q: "Je suis frontalier imposé à la source à Genève. J'ai droit au crédit d'impôt ?",
    r: "Si vous habitez en France, vous êtes en principe résident fiscal français et vous déclarez vos revenus en France. Le crédit d'impôt pour les services à la personne vous est alors accessible. C'est un crédit : la part qui dépasse votre impôt français vous est remboursée. Chaque situation est particulière : en cas de doute, vérifiez sur impots.gouv.fr.",
  },
  {
    q: 'Je travaille dans le canton de Vaud ou en Valais. C\'est pareil ?',
    r: "Oui. Ce qui compte pour le crédit d'impôt, c'est que vous habitiez en France et que vous y déclariez vos revenus, quel que soit le canton où vous travaillez.",
  },
  {
    q: "J'habite en Suisse. Pouvez-vous garder mon enfant au chalet pendant les relâches ?",
    r: "Oui, dans votre résidence du Chablais, au tarif plein et avec le forfait stations si vous êtes en montagne. Réservez dès que vous connaissez vos dates : les semaines de vacances partent vite.",
  },
  {
    q: 'Pouvez-vous venir à Genève ou à Lausanne ?',
    r: "Oui, pour des gardes ponctuelles (soirées, week-ends, vacances), réservées au moins 8 jours à l'avance : chaque intervention est déclarée aux autorités suisses, dans la limite de 90 jours par an. Un forfait de déplacement s'ajoute.",
  },
  {
    q: 'Et pour un créneau chaque semaine chez nous, en Suisse ?',
    r: "Dans ce cas, vous m'employez directement, comme pour une garde d'enfants à domicile. Chèque service (Genève) ou Chèques-emploi (Vaud) s'occupent des déclarations et des assurances sociales à votre place, et le permis frontalier est demandé à votre nom. On regarde ensemble si c'est la bonne formule.",
  },
  {
    q: "Je n'ai pas de compte en euros. Comment je paie ?",
    r: 'Les factures sont en euros. Vous pouvez payer par virement SEPA depuis votre banque suisse, ou par un service de transfert en ligne.',
  },
  {
    q: 'Le bateau CGN a du retard, ou la douane est bouchée. Que se passe-t-il ?',
    r: "Envoyez-moi un message : je reste avec votre enfant jusqu'à votre arrivée. Le temps supplémentaire est facturé au quart d'heure, au tarif de votre formule.",
  },
]

export default function FrontaliersPage() {
  const [modalOpen, setModalOpen] = useState(false)
  const openContact = () => setModalOpen(true)
  useReveal()

  useEffect(() => {
    setMeta(
      "Garde et relève pour frontaliers et familles suisses · Thonon, Évian, Chablais · Éduc & Vous",
      "Vous travaillez à Genève, Lausanne ou en Valais, vous habitez en Suisse ou vous avez un chalet dans le Chablais ? Garde et répit à domicile pour enfants autistes, TDAH ou en situation de handicap, dans le Chablais et ponctuellement à Genève et Vaud. Crédit d'impôt de 50 % pour les frontaliers résidant en France."
    )
  }, [])

  return (
    <div className="ev">
      <Navbar onContact={openContact} overHero />
      <main>
        <PageHero
          kicker="Frontaliers · familles suisses · Chablais"
          title={<>Vous travaillez en Suisse. <em>Votre enfant a besoin de quelqu'un ici.</em></>}
          lead="Genève, Lausanne, le Valais : vos journées commencent tôt et finissent tard. Je garde votre enfant chez vous dans le Chablais, et je viens aussi à Genève et dans le canton de Vaud pour des gardes ponctuelles. Je reste jusqu'à votre retour, même quand la douane ou le bateau vous retardent."
          photo={P.vapeur}
          alt="Un bateau à vapeur sur le Léman devant le jet d'eau de Genève"
        >
          <div className="ev-phero__ticket">
            <span>Si vous habitez en France</span>
            <b>20 € <small>/ heure</small></b>
            <em>au lieu de 40 € (≈ 37 CHF), grâce au crédit d'impôt de 50 %.</em>
          </div>
        </PageHero>

        <section className="ev-section">
          <div className="ev-container">
            <div className="ev-head ev-reveal">
              <span className="ev-kicker">Votre situation</span>
              <h2>Trois situations, <em>une solution pour chacune</em></h2>
              <p>En Suisse, on parle de service de relève. En France, de répit. C'est la même idée : quelqu'un de formé prend le relais auprès de votre enfant, pour que vous puissiez souffler.</p>
            </div>
            <div className="ev-ch__cases">
              <article className="ev-ch__case ev-reveal">
                <div className="ev-ch__photo"><img src={img(P.lavaux, 900)} alt="Le Léman et les montagnes du Chablais" loading="lazy" /><span>Frontaliers</span></div>
                <div className="ev-ch__body">
                  <h3>Vous habitez dans le Chablais et travaillez en Suisse</h3>
                  <ul>
                    <li>Crédit d'impôt de 50 %, déduit tout de suite : vous êtes résident fiscal en France</li>
                    <li>Créneaux adaptés aux trajets, tôt le matin et tard le soir, de 6&nbsp;h&nbsp;30 à 20&nbsp;h&nbsp;30</li>
                    <li>Douane bouchée ou bateau CGN manqué : un message suffit, je reste</li>
                    <li>Abonnement hebdomadaire : le même créneau, la même personne, chaque semaine</li>
                  </ul>
                </div>
              </article>
              <article className="ev-ch__case ev-reveal" style={{ transitionDelay: '90ms' }}>
                <div className="ev-ch__photo"><img src={img(P.chalet, 900)} alt="Un chalet en bois sous la neige" loading="lazy" /><span>Résidence secondaire</span></div>
                <div className="ev-ch__body">
                  <h3>Vous habitez en Suisse et avez un chalet ou un appartement dans le Chablais</h3>
                  <ul>
                    <li>Garde pendant vos séjours : week-ends, relâches, vacances d'été</li>
                    <li>Châtel, Abondance, Bernex, Thollon-les-Mémises, Morzine, Les Gets, Évian, Thonon</li>
                    <li>Vos relâches tombent souvent pendant les semaines scolaires françaises : c'est là que j'ai le plus de place en journée</li>
                    <li>Tarif plein : le crédit d'impôt français concerne seulement les résidents fiscaux en France</li>
                  </ul>
                </div>
              </article>
              <article className="ev-ch__case ev-reveal" style={{ transitionDelay: '180ms' }}>
                <div className="ev-ch__photo"><img src={img(P.geneve, 900)} alt="Genève et le Léman vus du ciel" loading="lazy" /><span>Genève · Vaud</span></div>
                <div className="ev-ch__body">
                  <h3>Vous habitez à Genève ou dans le canton de Vaud</h3>
                  <ul>
                    <li>Gardes ponctuelles à votre domicile : soirées, week-ends, relâches, vacances</li>
                    <li>À réserver au moins 8 jours avant : chaque intervention est déclarée aux autorités suisses</li>
                    <li>Pour un créneau chaque semaine, vous pouvez m'employer directement, déclaré simplement par Chèque service (Genève) ou Chèques-emploi (Vaud). On en parle au premier échange</li>
                    <li>Tarif en francs, sans crédit d'impôt français, plus un forfait de déplacement</li>
                  </ul>
                </div>
              </article>
            </div>
          </div>
        </section>

        <section className="ev-section ev-section--mist" id="tarifs-chf">
          <div className="ev-container">
            <div className="ev-head ev-reveal">
              <span className="ev-kicker">Tarifs en euros et en francs</span>
              <h2>Ce que vous payez, <em>selon où vous habitez</em></h2>
              <p>Montants en francs suisses indicatifs ({TAUX}). Vous êtes facturé en euros.</p>
            </div>
            <div className="ev-table-wrap ev-reveal">
              <table className="ev-table">
                <thead>
                  <tr><th>Prestation</th><th className="r">Prix facturé</th><th className="r">≈ en CHF</th><th className="r">Vous habitez en France</th><th className="r">Vous habitez en Suisse</th></tr>
                </thead>
                <tbody>
                  {TARIFS.map(t => (
                    <tr key={t.p}>
                      <td>{t.p}<small>{t.d}</small></td>
                      <td className="r">{t.eur}</td><td className="r">{t.chf}</td>
                      <td className="r fort">{t.fr}</td><td className="r">{t.ch}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="ev-note" style={{ marginTop: '1rem' }}>
              Enfant en plus (fratrie) : + 8 € de l'heure. Le crédit d'impôt suppose d'être résident fiscal en France et s'applique dans la limite du plafond annuel.
            </p>
            <MentionsPrix />
          </div>
        </section>

        <section className="ev-section">
          <div className="ev-container ev-ch__notes">
            <div className="ev-ch__note ev-reveal">
              <h3>Garde chez vous, en Suisse : comment ça marche</h3>
              <p>
                Je viens à Genève et dans le canton de Vaud pour des gardes ponctuelles. Chaque intervention est déclarée en ligne aux autorités suisses
                au moins 8 jours avant, et ne peut pas dépasser 90 jours par an au total : réservez tôt. Pour une urgence à moins de 8 jours, je peux garder
                votre enfant côté français. Pour un créneau chaque semaine chez vous, la solution simple est de m'employer, déclaré par Chèque service (Genève)
                ou Chèques-emploi (Vaud), qui s'occupent des assurances sociales.
              </p>
            </div>
            <div className="ev-ch__note ev-ch__note--en ev-reveal" lang="en">
              <h3>In English</h3>
              <p>I look after children with special needs (autism, ADHD, disabilities, behavioural difficulties) at your home or holiday chalet in the French Chablais, and occasionally at your home in Geneva or Vaud (please book at least 8 days ahead). I speak English at an intermediate level.</p>
              <a href={waLink('Hello Rémi, I would like to talk about care for my child.')} target="_blank" rel="noopener noreferrer" className="ev-arrow">WhatsApp · {TEL_AFFICHE}</a>
            </div>
          </div>
        </section>

        <section className="ev-section ev-section--mist">
          <div className="ev-container">
            <div className="ev-head ev-reveal">
              <span className="ev-kicker">Vos questions</span>
              <h2>Frontaliers et familles suisses</h2>
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
          photo={P.chillon}
          titre="Parlons de votre enfant et de vos horaires"
          texte="Trente minutes au téléphone ou sur WhatsApp, depuis la France ou la Suisse. Sans engagement."
          waTexte={WA_TEXTE}
        />
      </main>
      <Footer onContact={openContact} />
      <StickyContact onContact={openContact} waTexte={WA_TEXTE} />
      <ContactModal open={modalOpen} onClose={() => setModalOpen(false)} serviceInitial="repit" residenceInitiale="suisse" />
    </div>
  )
}
