import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import './ServicesPage.css'

// Communes couvertes — maillage local pour le référencement
const COMMUNES = [
  'Thonon-les-Bains', 'Évian-les-Bains', 'Publier', 'Sciez', 'Anthy-sur-Léman',
  'Margencel', 'Allinges', 'Perrignier', 'Bons-en-Chablais', 'Douvaine',
  'Sillingy', 'Ballaison', 'Marin', 'Lugrin', 'Neuvecelle', 'Amphion',
]

const FAQ = [
  {
    q: "Proposez-vous de la garde d'enfant à domicile en Haute-Savoie ?",
    r: "Oui. Je propose un relais à la journée : une garde occasionnelle et de confiance, à votre domicile ou en extérieur, partout dans la métropole bordelaise. Pour un imprévu, un rendez-vous, une journée à souffler, ou parce que vous n'avez personne pour prendre le relais.",
  },
  {
    q: "Gardez-vous des enfants en situation de handicap ou autistes ?",
    r: "Oui. J'ai l'habitude d'accompagner des enfants porteurs de TSA, de TDAH, de troubles du comportement ou de troubles DYS. Un échange préalable permet toujours de vérifier que je suis la bonne personne pour votre enfant.",
  },
  {
    q: "Combien coûtent vos services et quelles aides existent ?",
    r: "Les tarifs sont établis sur devis selon le service et la fréquence. Le crédit d'impôt services à la personne peut s'appliquer. Le premier échange est gratuit et sans engagement. Paiement en CESU et virement acceptés.",
  },
  {
    q: "Dans quelles communes intervenez-vous ?",
    r: "J'interviens dans tout le Chablais : Thonon-les-Bains, Évian-les-Bains, Publier, Sciez, Anthy-sur-Léman, Douvaine, Bons-en-Chablais et les communes du Léman.",
  },
]

export default function ServicesPage() {
  useEffect(() => {
    document.title = "Garde d'enfant en Haute-Savoie — Éduc & Vous"
    const meta = document.querySelector('meta[name="description"]')
    if (meta) meta.setAttribute(
      'content',
      "Garde d'enfant occasionnelle et de confiance en Haute-Savoie. Relais à la journée, y compris enfants autistes ou en situation de handicap. Thonon, Évian et le Chablais. Premier échange gratuit."
    )
  }, [])

  return (
    <>
      <Navbar />

      <main className="sp">
        {/* En-tête */}
        <header className="sp-head">
          <div className="container">
            <span className="section-tag">Nos services · Haute-Savoie (74)</span>
            <h1>Garde d'enfant de confiance en Haute-Savoie</h1>
            <p className="sp-lead">
              Accompagnant éducatif dans le Chablais, je propose un service de garde d'enfant
              de confiance : une garde occasionnelle et fiable, à la journée ou pour quelques
              heures, y compris pour les enfants aux besoins spécifiques.
            </p>
          </div>
        </header>

        {/* Service 1 */}
        <section className="sp-block" id="garde">
          <div className="container">
            <span className="sp-kicker">Le service</span>
            <h2>Le relais à la journée — garde d'enfant occasionnelle</h2>
            <p>
              Vous cherchez une <strong>garde d'enfant ponctuelle et de confiance en Haute-Savoie</strong> ?
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

        {/* Zone d'intervention — maillage communes */}
        <section className="sp-zone">
          <div className="container">
            <h2>Zone d'intervention en Haute-Savoie</h2>
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
