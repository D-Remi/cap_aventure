import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import ContactModal from '../components/ui/ContactModal'
import StickyContact from '../components/ui/StickyContact'
import { setMeta, setJsonLd } from '../utils/seo'
import { img, P, REMI } from '../data/photos'
import { ARTICLES, CATEGORIES, trouverArticle } from '../data/articles'
import { ouvrirRendezVous } from '../utils/rendezVous'
import './Conseils.css'

const SITE = 'https://educetvous74.fr'
const dateFr = (d) => new Date(`${d}T12:00:00`).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })

function Bloc({ b }) {
  if (b.h2) return <h2>{b.h2}</h2>
  if (b.ul) return <ul>{b.ul.map(x => <li key={x}>{x}</li>)}</ul>
  if (b.ol) return <ol>{b.ol.map(x => <li key={x}>{x}</li>)}</ol>
  if (b.note) return <aside className="ev-article__note"><b>À retenir</b><p>{b.note}</p></aside>
  return <p>{b.p}</p>
}

export default function ArticlePage() {
  const { slug } = useParams()
  const a = trouverArticle(slug)
  const [modalOpen, setModalOpen] = useState(false)

  useEffect(() => {
    if (!a) { setMeta('Article introuvable · Éduc & Vous', 'Cet article n\'existe pas ou a été déplacé.'); setJsonLd(null); return }
    const image = SITE + img(P[a.photo], 1200)
    setMeta(`${a.titre} · Éduc & Vous`, a.description, { image })
    setJsonLd({
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: a.titre,
      description: a.description,
      image,
      datePublished: a.date,
      dateModified: a.date,
      inLanguage: 'fr',
      mainEntityOfPage: `${SITE}/conseils/${a.slug}`,
      author: { '@type': 'Person', name: 'Rémi', jobTitle: 'Accompagnant éducatif', url: SITE },
      publisher: { '@type': 'Organization', name: 'Éduc & Vous', url: SITE },
    })
    return () => setJsonLd(null)
  }, [a])

  if (!a) return (
    <div className="ev">
      <Navbar onContact={() => setModalOpen(true)} />
      <main className="ev-article ev-container" style={{ paddingTop: '9rem', minHeight: '60vh' }}>
        <h1>Article introuvable</h1>
        <p><Link to="/conseils">Voir tous les conseils</Link></p>
      </main>
      <Footer onContact={() => setModalOpen(true)} />
      <ContactModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  )

  const autres = ARTICLES.filter(x => x.slug !== a.slug).sort((x, y) => (y.categorie === a.categorie) - (x.categorie === a.categorie)).slice(0, 3)

  return (
    <div className="ev">
      <Navbar onContact={() => setModalOpen(true)} />
      <main>
        <article className="ev-article">
          <header className="ev-article__tete">
            <div className="ev-container ev-article__etroit">
              <nav className="ev-article__fil" aria-label="Fil d'Ariane"><Link to="/conseils">Conseils</Link> › {CATEGORIES[a.categorie]}</nav>
              <h1>{a.titre}</h1>
              <p className="ev-article__chapo">{a.description}</p>
              <p className="ev-article__meta">Par Rémi, accompagnant éducatif · {dateFr(a.date)} · {a.lecture} min de lecture</p>
            </div>
          </header>
          <div className="ev-container ev-article__etroit">
            <img className="ev-article__photo" src={img(P[a.photo], 1400)} alt="" />
            <div className="ev-article__corps">
              {a.corps.map((b, i) => <Bloc key={i} b={b} />)}
            </div>

            <aside className="ev-article__cta">
              <img src={REMI} alt="" onError={e => { e.currentTarget.style.display = 'none' }} />
              <div>
                <h2>Besoin de souffler ?</h2>
                <p>Je garde chez vous les enfants à besoins particuliers, dans le Chablais, à Genève et dans le canton de Vaud. Premier appel gratuit et sans engagement.</p>
                <div className="ev-btns">
                  <button className="ev-btn ev-btn--green" onClick={ouvrirRendezVous}>Réserver un appel</button>
                  <Link className="ev-btn ev-btn--ghost" to="/tarifs#simulateur">Calculer le prix</Link>
                </div>
              </div>
            </aside>

            <section className="ev-article__autres" aria-label="À lire aussi">
              <h2>À lire aussi</h2>
              <div>
                {autres.map(x => (
                  <Link key={x.slug} to={`/conseils/${x.slug}`}>
                    <span>{CATEGORIES[x.categorie]}</span>
                    <b>{x.court}</b>
                  </Link>
                ))}
              </div>
            </section>
          </div>
        </article>
      </main>
      <Footer onContact={() => setModalOpen(true)} />
      <StickyContact onContact={() => setModalOpen(true)} />
      <ContactModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  )
}
