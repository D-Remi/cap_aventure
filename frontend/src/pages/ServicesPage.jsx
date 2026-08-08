import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import './ServicesPage.css'

// Communes couvertes — maillage local pour le référencement
const COMMUNES = [
  'Bordeaux', 'Mérignac', 'Pessac', 'Talence', 'Le Bouscat', 'Bruges',
  'Eysines', 'Saint-Médard-en-Jalles', 'Gradignan', 'Villenave-d\'Ornon',
  'Bègles', 'Cenon', 'Lormont', 'Floirac', 'Le Haillan', 'Martignas-sur-Jalle',
]

const FAQ = [
  {
    q: "Proposez-vous de la garde d'enfant à domicile en Gironde ?",
    r: "Oui. Je propose un relais à la journée : une garde occasionnelle et de confiance, à votre domicile ou en extérieur, partout dans la métropole bordelaise. Pour un imprévu, un rendez-vous, une journée à souffler, ou parce que vous n'avez personne pour prendre le relais.",
  },
  {
    q: "Gardez-vous des enfants en situation de handicap ou autistes ?",
    r: "Oui. J'ai l'habitude d'accompagner des enfants porteurs de TSA, de TDAH, de troubles du comportement ou de troubles DYS. Un échange préalable permet toujours de vérifier que je suis la bonne personne pour votre enfant.",
  },
  {
    q: "Qu'est-ce que l'accompagnement éducatif que vous proposez ?",
    r: "C'est un appui pour les familles dont la relation avec l'enfant s'est tendue : crises à répétition, autorité qui ne tient plus, sentiment de ne plus être écouté. On regarde ensemble ce qui se joue, et on reconstruit un cadre tenable, à votre rythme et sans jugement.",
  },
  {
    q: "Combien coûtent vos services et quelles aides existent ?",
    r: "Les tarifs sont établis sur devis selon le service et la fréquence. Le crédit d'impôt services à la personne peut s'appliquer. Le premier échange est gratuit et sans engagement. Paiement en CESU et virement acceptés.",
  },
  {
    q: "Dans quelles communes intervenez-vous ?",
    r: "J'interviens dans toute la métropole bordelaise et ses environs : Bordeaux, Mérignac, Pessac, Talence, Le Bouscat, Bruges, Eysines, Saint-Médard-en-Jalles, Gradignan, Villenave-d'Ornon, Bègles et les communes alentour.",
  },
]

export default function ServicesPage() {
  useEffect(() => {
    document.title = "Garde d'enfant & accompagnement éducatif en Gironde — Éduc & Vous"
    const meta = document.querySelector('meta[name="description"]')
    if (meta) meta.setAttribute(
      'content',
      "Garde d'enfant occasionnelle et accompagnement éducatif en Gironde. Relais à la journée, y compris enfants autistes ou en situation de handicap. Bordeaux et métropole. Premier échange gratuit."
    )
  }, [])

  return (
    <>
      <Navbar />

      <main className="sp">
        {/* En-tête */}
        <header className="sp-head">
          <div className="container">
            <span className="section-tag">Nos services · Gironde (33)</span>
            <h1>Garde d'enfant et accompagnement éducatif en Gironde</h1>
            <p className="sp-lead">
              Accompagnant éducatif dans la métropole bordelaise, je propose deux services
              aux familles : un relais à la journée pour faire garder votre enfant en confiance,
              et un accompagnement éducatif quand la vie de famille devient difficile.
            </p>
          </div>
        </header>

        {/* Service 1 */}
        <section className="sp-block" id="garde">
          <div className="container">
            <span className="sp-kicker">Service 01</span>
            <h2>Le relais à la journée — garde d'enfant occasionnelle</h2>
            <p>
              Vous cherchez une <strong>garde d'enfant ponctuelle et de confiance en Gironde</strong> ?
              Le relais à la journée est une garde occasionnelle, à la journée ou pour quelques heures,
              assurée par un accompagnant éducatif expérimenté. Que ce soit pour un imprévu, un
              rendez-vous médical, une journée pour souffler, ou parce que vous n'avez aucun relais
              familial autour de vous, je prends le relais auprès de votre enfant, chez vous ou en sortie.
            </p>
            <p>
              À la différence d'une garde classique, je suis à l'aise aussi bien avec une
              <strong> fratrie nombreuse</strong> qu'avec des <strong>enfants aux besoins
              spécifiques</strong> : troubles du spectre de l'autisme (TSA), TDAH, troubles du
              comportement, troubles DYS. Chaque garde est préparée avec vous, en fonction des
              repères et des habitudes de votre enfant.
            </p>
            <ul className="sp-list">
              <li>Garde occasionnelle à la journée ou à l'heure</li>
              <li>À domicile ou en extérieur, selon vos besoins</li>
              <li>Enfants de tous profils, y compris besoins spécifiques</li>
              <li>Un accompagnant éducatif formé, pas un simple baby-sitter</li>
            </ul>
          </div>
        </section>

        {/* Service 2 */}
        <section className="sp-block sp-block--alt" id="accompagnement">
          <div className="container">
            <span className="sp-kicker">Service 02</span>
            <h2>L'accompagnement éducatif des familles</h2>
            <p>
              Votre enfant ne vous écoute plus, les crises s'enchaînent, chaque demande devient
              un conflit et vous avez le sentiment d'avoir tout essayé ? Ce n'est pas un manque
              d'amour ni de compétence : c'est un <strong>cadre éducatif à reconstruire</strong>.
              L'accompagnement éducatif est un appui concret pour les familles de Gironde qui
              traversent une période difficile.
            </p>
            <p>
              Ma méthode repose sur la communication : aider l'enfant à comprendre que chacun de
              ses gestes a un effet sur toute la famille, et lui montrer que bien vivre ensemble
              est plus agréable pour lui aussi. Je ne suis pas là pour juger votre façon d'élever
              vos enfants, mais pour vous épauler sur ce qui vous dépasse, à votre rythme.
            </p>
            <ul className="sp-list">
              <li>Guidance parentale et soutien à l'autorité</li>
              <li>Travail avec l'enfant sur les crises et le comportement</li>
              <li>Des ajustements tenables, adaptés à votre famille</li>
              <li>Un suivi régulier pour tenir dans la durée</li>
            </ul>
          </div>
        </section>

        {/* Zone d'intervention — maillage communes */}
        <section className="sp-zone">
          <div className="container">
            <h2>Zone d'intervention en Gironde</h2>
            <p>
              J'interviens dans toute la métropole bordelaise et ses environs. Voici les
              principales communes couvertes :
            </p>
            <div className="sp-communes">
              {COMMUNES.map(v => <span key={v} className="sp-commune">{v}</span>)}
            </div>
            <p className="sp-zone-note">
              Votre commune n'apparaît pas ? Contactez-moi, j'étudie chaque demande selon la distance.
            </p>
          </div>
        </section>

        {/* FAQ */}
        <section className="sp-faq" id="faq">
          <div className="container">
            <h2>Questions fréquentes</h2>
            <div className="sp-faq-list">
              {FAQ.map(({ q, r }) => (
                <details key={q} className="sp-faq-item">
                  <summary>{q}</summary>
                  <p>{r}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="sp-cta">
          <div className="container">
            <h2>Le premier échange est gratuit</h2>
            <p>Racontez-moi votre situation. Sans jugement, sans engagement.</p>
            <Link to="/" className="btn-primary">Prendre contact</Link>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}
