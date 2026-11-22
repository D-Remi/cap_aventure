import { useState, useEffect } from 'react'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import PageHero from '../components/sections/PageHero'
import CtaFinal from '../components/sections/CtaFinal'
import { PARCOURS } from '../components/sections/QuiJeSuis'
import ContactModal from '../components/ui/ContactModal'
import StickyContact from '../components/ui/StickyContact'
import useReveal from '../hooks/useReveal'
import { setMeta } from '../utils/seo'
import { P, REMI } from '../data/photos'
import { EMAIL, TEL_AFFICHE, TEL_LIEN, waLink, IconeWhatsApp } from '../data/contact'
import '../components/sections/QuiJeSuis.css'
import './StructuresPage.css'

const WA_TEXTE = 'Bonjour Rémi, je vous contacte au sujet d\'une mission en Suisse (structure : ...).'
const MAIL_CV = `mailto:${EMAIL}?subject=${encodeURIComponent('Demande de CV - mission en Suisse')}&body=${encodeURIComponent('Bonjour Rémi,\n\nNous sommes [structure, ville] et nous recherchons [type de mission].\nPourriez-vous nous transmettre votre CV ?\n\nMerci,\n')}`

const ATOUTS = [
  { t: 'Enfants autistes et troubles du comportement', d: 'Animateur de séjours adaptés APAJH : encadrement au quotidien, activités adaptées, prévention et gestion des moments de crise.' },
  { t: 'Polyhandicap', d: "Aide médico-psychologique en centre d'éducation motrice, auprès d'enfants atteints de paralysie cérébrale : alimentation, hygiène, mobilité, activités adaptées." },
  { t: 'Vie quotidienne en internat', d: 'Accompagnant éducatif en lieu de vie : cadre éducatif, médiation, travail en équipe pluridisciplinaire.' },
  { t: 'Milieu scolaire', d: "Plus de deux ans d'assistant d'éducation en collège : médiation, suivi des élèves, gestion de groupe." },
  { t: 'Camps et séjours', d: "BAFA, colonies de ski, cirque, karting, classe découverte. Référent d'un enfant en situation de handicap en camp de ski." },
  { t: 'Confiance', d: "Attestation d'honorabilité à jour (contrôle des antécédents), permis B, ponctuel et calme en toute situation." },
]

const MISSIONS = [
  ['Relève à domicile', 'Pour un service de relève ou directement auprès des familles : quelques heures, une soirée, un week-end.'],
  ['Remplacements', 'En foyer, en école spécialisée ou en centre de jour, pendant les absences et les vacances de vos équipes.'],
  ['Camps et séjours adaptés', "L'été, pendant les relâches ou le week-end, en encadrement d'enfants et d'adolescents."],
  ['Accompagnement individuel', "Sorties, loisirs, soutien à l'intégration d'un enfant dans une structure ordinaire."],
]

export default function StructuresPage() {
  const [modalOpen, setModalOpen] = useState(false)
  const openContact = () => setModalOpen(true)
  useReveal()

  useEffect(() => {
    setMeta(
      'Intervenant pour institutions et services de relève à Genève et Vaud · Éduc & Vous',
      "Accompagnant éducatif frontalier basé à Thonon, expérimenté auprès d'enfants autistes, polyhandicapés ou avec troubles du comportement. Disponible pour de la relève, des remplacements et des camps adaptés à Genève, dans le canton de Vaud et le Chablais valaisan."
    )
  }, [])

  return (
    <div className="ev">
      <Navbar onContact={openContact} overHero />
      <main>
        <PageHero
          kicker="Institutions · associations · services de relève en Suisse"
          title={<>Un intervenant formé au handicap, <em>disponible à Genève et dans le canton de Vaud.</em></>}
          lead="Accompagnant éducatif, j'interviens auprès d'enfants et d'adolescents autistes, polyhandicapés ou avec troubles du comportement. Frontalier basé à Thonon, de l'autre côté du Léman, je suis disponible pour de la relève, des remplacements et des camps adaptés."
          photo={P.foret2}
          alt="Un adulte et un garçon en forêt"
        >
          <div className="ev-phero__ticket">
            <span>Pour vous, employeur</span>
            <b style={{ fontSize: '1.5rem' }}>Frontalier</b>
            <em>Ressortissant français : le permis G est demandé par l'employeur, sur la base du contrat de travail.</em>
          </div>
        </PageHero>

        <section className="ev-section">
          <div className="ev-container">
            <div className="ev-head ev-reveal">
              <span className="ev-kicker">Ce que j'apporte</span>
              <h2>Du terrain, avec les enfants <em>que l'on dit « difficiles »</em></h2>
              <p>Des séjours adaptés au collège, en passant par le polyhandicap et l'internat : des situations variées, et la même attention à chaque enfant.</p>
            </div>
            <div className="ev-str__atouts">
              {ATOUTS.map((a, i) => (
                <div key={a.t} className="ev-str__atout ev-reveal" style={{ transitionDelay: `${(i % 3) * 80}ms` }}>
                  <h3>{a.t}</h3>
                  <p>{a.d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="ev-section ev-section--forest">
          <div className="ev-container">
            <div className="ev-head ev-reveal">
              <span className="ev-kicker">Les missions qui m'intéressent</span>
              <h2>Ponctuel, régulier ou <em>à temps partiel</em></h2>
            </div>
            <div className="ev-str__missions">
              {MISSIONS.map(([t, d], i) => (
                <div key={t} className="ev-reveal" style={{ transitionDelay: `${i * 80}ms` }}>
                  <h3>{t}</h3>
                  <p>{d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="ev-section">
          <div className="ev-container ev-str__grid">
            <div className="ev-reveal">
              <span className="ev-kicker">Infos pratiques</span>
              <h2 className="ev-str__h2">Ce qu'il faut savoir pour m'embaucher</h2>
              <dl className="ev-str__infos">
                <dt>Domicile</dt><dd>Thonon-les-Bains (Haute-Savoie), frontalier</dd>
                <dt>Autorisation de travail</dt><dd>Ressortissant français. Le permis frontalier (G) est demandé par l'employeur avec le contrat de travail.</dd>
                <dt>Secteur</dt><dd>Genève, La Côte, Lausanne, Riviera, Chablais valaisan</dd>
                <dt>Disponibilités</dt><dd>Soirées, week-ends, vacances ; missions ponctuelles, remplacements ou temps partiel, à définir ensemble</dd>
                <dt>Contrat</dt><dd>Salarié : CDD, temps partiel, sur appel ou contrat de mission</dd>
                <dt>Langues</dt><dd>Français ; anglais intermédiaire</dd>
                <dt>Documents</dt><dd>CV et attestation d'honorabilité sur simple demande</dd>
              </dl>
              <div className="ev-btns" style={{ marginTop: '1.6rem' }}>
                <a className="ev-btn ev-btn--green" href={MAIL_CV}>Recevoir mon CV</a>
                <a className="ev-btn ev-btn--ghost" href={waLink(WA_TEXTE)} target="_blank" rel="noopener noreferrer"><IconeWhatsApp /> WhatsApp</a>
                <a className="ev-btn ev-btn--ghost" href={TEL_LIEN}>{TEL_AFFICHE}</a>
              </div>
            </div>
            <div className="ev-reveal">
              <div className="ev-str__portrait">
                <img src={REMI} alt="Rémi, accompagnant éducatif" loading="lazy" />
              </div>
              <ol className="ev-qui__parcours" style={{ marginTop: '1.6rem' }}>
                {PARCOURS.map(({ quand, quoi }) => (
                  <li key={quoi}><span>{quand}</span><p>{quoi}</p></li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        <CtaFinal
          onContact={openContact}
          photo={P.vapeur}
          titre="Parlons d'une mission en Suisse"
          texte="Je vous envoie mon CV et je réponds rapidement. Entretien possible à Genève, à Lausanne ou en visio."
          waTexte={WA_TEXTE}
        />
      </main>
      <Footer onContact={openContact} />
      <StickyContact onContact={openContact} waTexte={WA_TEXTE} />
      <ContactModal open={modalOpen} onClose={() => setModalOpen(false)} serviceInitial="autre" residenceInitiale="suisse" />
    </div>
  )
}
