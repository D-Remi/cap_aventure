import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import CtaFinal from '../components/sections/CtaFinal'
import ContactModal from '../components/ui/ContactModal'
import StickyContact from '../components/ui/StickyContact'
import useReveal from '../hooks/useReveal'
import { setMeta, setJsonLd } from '../utils/seo'
import { img, P } from '../data/photos'
import { ARTICLES, CATEGORIES } from '../data/articles'
import './Conseils.css'

export default function ConseilsPage() {
  const [modalOpen, setModalOpen] = useState(false)
  const [cat, setCat] = useState('')
  useReveal()

  useEffect(() => {
    setMeta(
      "Conseils pour les parents d'enfants autistes, TDAH ou en situation de handicap · Éduc & Vous",
      "Transitions, devoirs, planning visuel, coin calme, aides financières, frontaliers : les conseils concrets d'un accompagnant éducatif du Chablais, pour souffler au quotidien."
    )
    setJsonLd(null)
  }, [])

  const liste = cat ? ARTICLES.filter(a => a.categorie === cat) : ARTICLES

  return (
    <div className="ev">
      <Navbar onContact={() => setModalOpen(true)} />
      <main>
        <section className="ev-conseils__tete">
          <div className="ev-container">
            <span className="ev-kicker">Conseils</span>
            <h1>Des idées concrètes, <em>pour le quotidien</em></h1>
            <p>Ce que j'ai appris auprès des enfants que j'accompagne : des astuces simples à essayer chez vous, et l'essentiel sur les aides.</p>
            <div className="ev-conseils__filtres" role="tablist" aria-label="Catégories">
              <button role="tab" aria-selected={!cat} className={!cat ? 'is-on' : ''} onClick={() => setCat('')}>Tout</button>
              {Object.entries(CATEGORIES).map(([k, l]) => (
                <button key={k} role="tab" aria-selected={cat === k} className={cat === k ? 'is-on' : ''} onClick={() => setCat(k)}>{l}</button>
              ))}
            </div>
          </div>
        </section>

        <section className="ev-section ev-conseils__liste">
          <div className="ev-container ev-conseils__grille">
            {liste.map(a => (
              <Link key={a.slug} to={`/conseils/${a.slug}`} className="ev-conseils__carte">
                <img src={img(P[a.photo], 800)} alt="" loading="lazy" />
                <div>
                  <span>{CATEGORIES[a.categorie]} · {a.lecture} min</span>
                  <h2>{a.titre}</h2>
                  <p>{a.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <CtaFinal onContact={() => setModalOpen(true)} photo={P.automne}
          titre="Une question sur votre enfant ?"
          texte="Racontez-moi votre situation : un premier appel de trente minutes, gratuit et sans engagement." />
      </main>
      <Footer onContact={() => setModalOpen(true)} />
      <StickyContact onContact={() => setModalOpen(true)} />
      <ContactModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  )
}
