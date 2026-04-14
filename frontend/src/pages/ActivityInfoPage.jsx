import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import axios from 'axios'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import { useAuth } from '../context/AuthContext'
import { useSeo } from '../hooks/useSeo'
import './ActivityInfoPage.css'

const G = (img, caption) => ({ img, caption })
const S = (icon, title, content) => ({ icon, title, content })

const PAGES = {
  multi: {
    emoji: '🎯', title: 'Multi-activités', tag: '🔥 Toute saison', tagColor: '#f07d2a',
    intro: "Chaque sortie multi-activités est une surprise ! Jeux collectifs, défis sportifs, ateliers nature, parcours d'orientation… Le programme change à chaque fois pour garder la curiosité et l'envie de revenir.",
    gallery: [
      G('https://plus.unsplash.com/premium_photo-1726783237316-f5ae95126471?w=700&q=80', ''),
      G('https://images.unsplash.com/photo-1554728432-e8f16e88503e?w=700&q=80', ''),
      G('https://images.unsplash.com/photo-1588072400380-8e4f902281fb?w=700&q=80', ''),
      G('https://images.unsplash.com/photo-1614982515601-4e58aedc59fa?w=700&q=80', ''),
    ],
    sections: [
      S('🗓️', 'Le programme', "Mercredis après-midi et dimanches matin. Le programme est annoncé la veille pour maintenir la surprise. Jeux de coopération, parcours sportifs, ateliers, sorties nature. Jamais la même chose !"),
      S('📍', 'Où on se retrouve', "Parcs de Thonon-les-Bains, forêts du Chablais, bords du lac Léman. Le lieu de RDV est précisé la veille selon l'activité du jour."),
      S('🎒', "Ce qu'il faut", "Tenue de sport adaptée à la météo, chaussures fermées, eau. Rien de spécial à part l'envie de s'amuser — les détails sont communiqués la veille."),
      S('💶', 'Tarif', "25€ par sortie. Formule mensuelle : 4 sorties pour 80€. Paiement en espèces, virement ou CESU."),
    ],
    saison: "Toute l'année", ages: '6–14 ans', encadrement: 'Animateur BAFA',
  },

  vtt: {
    emoji: '🚵', title: 'VTT & Vélo', tag: '🚵 Printemps / Été', tagColor: '#4ecb71',
    intro: "Des sorties VTT accompagnées sur les chemins du Chablais et les pistes cyclables des bords du lac Léman. On roule ensemble, on explore, on profite — pas une compétition, une aventure collective !",
    gallery: [
      G('https://plus.unsplash.com/premium_photo-1726873269417-cbcaf06ff1e7?w=700&q=80', ''),
      G('https://images.unsplash.com/photo-1596126429924-321cf3522a17?w=700&q=80', ''),
      G('https://images.unsplash.com/photo-1660665630199-9270f79cf779?w=700&q=80', ''),
      G('https://images.unsplash.com/photo-1579861431227-405b9e9db520?w=700&q=80', ''),
    ],
    sections: [
      S('🗓️', 'Le programme', "Mercredis après-midi (printemps/été). Sorties de 2h sur les pistes cyclables des bords du lac et les chemins balisés du Chablais. Adapté au niveau du groupe."),
      S('⚠️', 'Accompagnement, pas cours', "Je ne suis pas moniteur cyclisme. Les sorties sont de l'accompagnement encadré : on roule ensemble, je veille à la sécurité. Pour des cours techniques, un club VTT local peut être recommandé."),
      S('🎒', "Ce qu'il faut", "Vélo en bon état (VTT ou vélo robuste), casque obligatoire, gants recommandés, eau. Le vélo doit être adapté à la taille de l'enfant."),
      S('💶', 'Tarif', "25€ par sortie. Paiement en espèces, virement ou CESU."),
    ],
    saison: 'Avril → Septembre', ages: '7–14 ans', encadrement: 'Animateur BAFA',
  },

  club: {
    emoji: '🌲', title: 'Club Scout', tag: '📅 Samedi matin', tagColor: '#a78bfa',
    intro: "Le club scout du samedi matin, c'est le cœur de CapAventure. Un groupe fixe qui se retrouve chaque semaine pour des aventures en forêt, des jeux, des techniques scouts et des sorties dans le Chablais.",
    gallery: [
      G('https://images.unsplash.com/photo-1741421963851-2ab751f036bb?w=700&q=80', ''),
      G('https://images.unsplash.com/photo-1647621692835-682e0babde97?w=700&q=80', ''),
      G('https://images.unsplash.com/photo-1551398766-791b80fde370?w=700&q=80', ''),
      G('https://images.unsplash.com/photo-1656378068262-055bffff5b87?w=700&q=80', ''),
    ],
    sections: [
      S('🗓️', 'Le programme', "Chaque samedi matin de 9h30 à 12h00. Techniques scouts, jeux en forêt, orientation, bivouac, sorties nature autour de Thonon. Le programme varie chaque semaine."),
      S('📍', 'Où on se retrouve', "Point de RDV fixe à Thonon-les-Bains, communiqué à l'inscription. L'animateur prend en charge les enfants et les ramène à la fin de la séance."),
      S('🎒', "Ce qu'il faut", "Tenue de sport, chaussures montantes, eau et collation. Un kit de base (carnet, crayon, foulard) sera fourni à l'inscription."),
      S('💶', 'Formules', "Journée d'essai : 10€. Mensuel : 50€/mois. Trimestriel : 135€. Semestriel : 255€. Annuel sept→juin : 460€. Espèces, virement ou CESU."),
    ],
    saison: 'Septembre → Juin', ages: '6–14 ans', encadrement: 'Animateur BAFA',
    subscriptions: [
      { label: "Journée d'essai", price: '10€', desc: 'Une séance pour tester', highlight: false },
      { label: 'Mensuel', price: '50€/mois', desc: '4 séances/mois', highlight: false },
      { label: 'Trimestriel', price: '135€', desc: '3 mois · remise 10%', highlight: false },
      { label: 'Semestriel', price: '255€', desc: '6 mois · remise 15%', highlight: true },
      { label: 'Annuel', price: '460€', desc: 'Sept → Juin · remise 23%', highlight: false },
    ],
  },

  velo: {
    emoji: '🚲', title: 'Vélo École', tag: '🚲 4–10 ans', tagColor: '#4ecb71',
    intro: "Apprendre à faire du vélo en petit groupe, à son rythme, dans un cadre sécurisé et bienveillant. De l'équilibre jusqu'à pédaler seul — avec patience et beaucoup de sourires !",
    gallery: [
      G('https://images.unsplash.com/photo-1566728060299-ad216d6fa3c1?w=700&q=80', ''),
      G('https://images.unsplash.com/photo-1666967533949-05b195343804?w=700&q=80', ''),
      G('https://images.unsplash.com/photo-1692681261954-bbd8aaf9919b?w=700&q=80', ''),
      G('https://images.unsplash.com/photo-1607444433383-c9938621ea2e?w=700&q=80', ''),
    ],
    sections: [
      S('🚲', 'Le programme', "Séances progressives en petit groupe (max 5 enfants) : équilibre sans pédales, pédalage, freinage, virages. On avance au rythme de chaque enfant, sans stress."),
      S('📍', "Où on s'entraîne", "Espaces plats et sécurisés à Thonon : parkings calmes, espaces verts, pistes cyclables. Toujours loin de la circulation."),
      S('🎒', "Ce qu'il faut", "Vélo adapté (avec ou sans pédales selon le niveau), casque obligatoire, genouillères et coudières recommandées. Contactez-nous si besoin."),
      S('💶', 'Tarif', "10€ par séance (45 min à 1h). Forfait initiation 5 séances : 40€."),
    ],
    saison: 'Avril → Septembre', ages: '4–10 ans', encadrement: 'Animateur BAFA',
  },

  evenements: {
    emoji: '🎉', title: 'Accompagnement Événements', tag: '🎉 Sur demande', tagColor: '#f5c842',
    intro: "Anniversaires, sorties, kermesses… Vous ne pouvez pas être présent ou avez besoin d'un encadrant supplémentaire ? J'accompagne et j'anime votre groupe d'enfants pour que la fête soit réussie !",
    gallery: [
      G('https://images.unsplash.com/photo-1587135374648-7518dc14b7ad?w=700&q=80', ''),
      G('https://images.unsplash.com/photo-1765947389862-afcc9035ba12?w=700&q=80', ''),
      G('https://plus.unsplash.com/premium_photo-1661964438203-0a5f5b40fcfd?w=700&q=80', ''),
      G('https://images.unsplash.com/photo-1688953690793-4cffa6891495?w=700&q=80', ''),
    ],
    sections: [
      S('🎂', 'Anniversaires', "Vous organisez un anniversaire ? J'interviens pour animer : jeux de groupe, parcours sportifs, chasse au trésor… Des enfants qui s'amusent, des parents qui soufflent !"),
      S('🏕️', 'Sorties & excursions', "Besoin d'un encadrant certifié BAFA pour une sortie ? J'accompagne votre groupe pour garantir sécurité et animation tout au long de la journée."),
      S('🏫', 'Événements scolaires / asso', "Kermesse, journée sport, fête de fin d'année… J'interviens comme animateur encadrant pour des groupes d'enfants dans le cadre d'événements organisés."),
      S('💶', 'Tarif', "À partir de 25€/heure. Demi-journée : à partir de 80€. Journée complète : à partir de 150€. Devis gratuit sur demande."),
    ],
    saison: "Toute l'année", ages: '4–14 ans', encadrement: 'Animateur BAFA',
  },
}

const SLUG_ORDER   = ['multi', 'vtt', 'club', 'velo', 'evenements']
const SLUG_TO_TYPE = { multi:'autre', vtt:'vtt', club:'scout', velo:'vtt', evenements:'autre' }
const SCHEDULE_ICONS = { ponctuelle:'📅', multi_dates:'🗓️', recurrente:'🔁', saisonniere:'🌿' }

function formatActivityDate(a) {
  if (a.schedule_type === 'ponctuelle' && a.date) {
    const d = new Date(a.date)
    return d.toLocaleDateString('fr-FR', { weekday:'long', day:'numeric', month:'long', year:'numeric' })
      + ' à ' + d.toLocaleTimeString('fr-FR', { hour:'2-digit', minute:'2-digit' })
  }
  if (a.schedule_type === 'multi_dates' && a.dates?.length)
    return `${a.dates.length} date${a.dates.length > 1 ? 's' : ''} disponible${a.dates.length > 1 ? 's' : ''}`
  if (a.schedule_type === 'recurrente') {
    const days = (a.recurrence_days || []).map(d => d.charAt(0).toUpperCase() + d.slice(1)).join(', ')
    return `${days} à ${a.recurrence_time || ''}`
  }
  return ''
}

export default function ActivityInfoPage() {
  const { slug } = useParams()
  const { user } = useAuth()
  const page     = PAGES[slug]

  const slugIdx  = SLUG_ORDER.indexOf(slug)
  const prevSlug = slugIdx > 0 ? SLUG_ORDER[slugIdx - 1] : null
  const nextSlug = slugIdx < SLUG_ORDER.length - 1 ? SLUG_ORDER[slugIdx + 1] : null
  const prevPage = prevSlug ? PAGES[prevSlug] : null
  const nextPage = nextSlug ? PAGES[nextSlug] : null

  const [activities, setActivities] = useState([])
  const [loadingActs, setLoadingActs] = useState(true)
  const [activePhoto, setActivePhoto] = useState(0)

  useSeo({
    title: page ? `${page.title} à Thonon-les-Bains` : null,
    description: page ? `${page.intro?.slice(0, 140)}…` : null,
    canonical: slug ? `/activites-info/${slug}` : null,
  })

  useEffect(() => {
    if (!page) return
    setActivePhoto(0)
    const type = SLUG_TO_TYPE[slug]
    axios.get('/api/activities')
      .then(r => setActivities(r.data.filter(a =>
        a.type === type && a.actif &&
        (a.schedule_type !== 'ponctuelle' || new Date(a.date) >= new Date())
      )))
      .catch(() => setActivities([]))
      .finally(() => setLoadingActs(false))
  }, [slug])

  if (!page) return (
    <>
      <Navbar />
      <div style={{ minHeight:'60vh', display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column', gap:'1rem' }}>
        <h1 style={{ fontFamily:"'Baloo 2',cursive", fontSize:'3rem', color:'var(--bleu-nuit)' }}>Activité introuvable</h1>
        <Link to="/" className="btn-primary">Retour à l'accueil</Link>
      </div>
      <Footer />
    </>
  )

  return (
    <div className="activity-info-page-root">
      <Navbar />

      {/* ── Barre nav activités sticky sous la navbar ── */}
      <div className="aip-hero-bar">
        <div className="container aip-hero-bar__inner">
          <Link to="/#activites" className="aip-back">← Activités</Link>
          <div className="aip-hero-nav">
            {prevPage
              ? <Link to={`/activites-info/${prevSlug}`} className="aip-nav-btn">‹ {prevPage.emoji} {prevPage.title}</Link>
              : <span />}
            <div className="aip-nav-dots">
              {SLUG_ORDER.map(s => (
                <Link key={s} to={`/activites-info/${s}`}
                  className={`aip-nav-dot ${s === slug ? 'active' : ''}`}
                  title={PAGES[s]?.title} />
              ))}
            </div>
            {nextPage
              ? <Link to={`/activites-info/${nextSlug}`} className="aip-nav-btn">{nextPage.emoji} {nextPage.title} ›</Link>
              : <span />}
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════
          BLOC PRINCIPAL : photo gauche | texte droite
          padding-top 1rem sous la barre de nav
      ════════════════════════════════════════════════════════ */}
      <div className="aip-main container">

        {/* ── Colonne gauche : galerie photos ── */}
        <div className="aip-gallery">
          <div className="aip-gallery__main">
            <img
              src={page.gallery[activePhoto]?.img}
              alt={page.title}
              key={activePhoto}
            />
            <span className="aip-gallery__tag" style={{ background: page.tagColor }}>
              {page.tag}
            </span>
          </div>
          <div className="aip-gallery__thumbs">
            {page.gallery.map(({ img }, i) => (
              <button
                key={i}
                className={`aip-gallery__thumb ${i === activePhoto ? 'active' : ''}`}
                onClick={() => setActivePhoto(i)}
              >
                <img src={img} alt="" />
              </button>
            ))}
          </div>
        </div>

        {/* ── Colonne droite : titre + chips + sections ── */}
        <div className="aip-content">
          <div className="aip-content__header">
            <h1>{page.emoji} {page.title}</h1>
            <p className="aip-content__intro">{page.intro}</p>
            <div className="aip-chips">
              <span>📅 {page.saison}</span>
              <span>🎂 {page.ages}</span>
              <span>✅ {page.encadrement}</span>
            </div>
          </div>

          <div className="aip-sections-list">
            {page.sections.map((s, i) => (
              <div key={i} className="aip-section-row">
                <div className="aip-section-row__icon">{s.icon}</div>
                <div>
                  <h3>{s.title}</h3>
                  <p>{s.content}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>{/* fin aip-main */}

      {/* ══════════════════════════════════════════════════════
          BLOC PRIX — formules abonnement (club scout uniquement)
      ════════════════════════════════════════════════════════ */}
      {page.subscriptions && (
        <div className="container aip-section-below">
          <div className="aip-subscriptions">
            <h2 className="aip-dates-title">💶 Formules d'inscription</h2>
            <div className="aip-subs-grid">
              {page.subscriptions.map((s, i) => (
                <div key={i} className={`aip-sub-card ${s.highlight ? 'highlighted' : ''}`}>
                  {s.highlight && <div className="aip-sub-card__badge">⭐ Populaire</div>}
                  <div className="aip-sub-card__label">{s.label}</div>
                  <div className="aip-sub-card__price">{s.price}</div>
                  <div className="aip-sub-card__desc">{s.desc}</div>
                  <Link to="/#contact" className="aip-sub-card__btn" style={{ textDecoration:'none' }}>
                    {s.label === "Journée d'essai" ? '🎯 Réserver un essai' : "S'inscrire"}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════
          BLOC DATES — prochaines séances BDD
      ════════════════════════════════════════════════════════ */}
      <div className="container aip-section-below">
        <div className="aip-dates-section">
          <h2 className="aip-dates-title">📅 Prochaines dates</h2>
          {loadingActs ? (
            <div className="aip-dates-loading">Chargement...</div>
          ) : activities.length > 0 ? (
            <div className="aip-dates-grid">
              {activities.map(a => (
                <Link key={a.id} to={`/activites/${a.id}`} className="aip-date-card">
                  <div className="aip-date-card__icon">{SCHEDULE_ICONS[a.schedule_type] || '📅'}</div>
                  <div className="aip-date-card__body">
                    <strong>{a.titre}</strong>
                    <span>{formatActivityDate(a)}</span>
                    <div className="aip-date-card__meta">
                      <span>💶 {parseFloat(a.prix).toFixed(0)}€</span>
                      {a.places_restantes !== undefined && (
                        <span>👥 {a.places_restantes} place{a.places_restantes > 1 ? 's' : ''}</span>
                      )}
                      {a.lieu && <span>📍 {a.lieu}</span>}
                    </div>
                  </div>
                  <div className="aip-date-card__arrow">→</div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="aip-no-dates">
              <div className="aip-no-dates__icon">📬</div>
              <h3>Pas encore de date affichée</h3>
              <p>Contacte-nous pour être prévenu dès qu'une date est ajoutée !</p>
              <Link to="/#contact" className="btn-primary" style={{ textDecoration:'none' }}>
                Demander les dates
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════
          BLOC CTA — nous contacter / calendrier
      ════════════════════════════════════════════════════════ */}
      <div className="container aip-section-below">
        <div className="aip-cta">
          <h2>Une question ? Une date à demander ?</h2>
          <p>Contacte-nous pour plus d'infos sur cette activité ou pour t'inscrire.</p>
          <div style={{ display:'flex', gap:'1rem', justifyContent:'center', flexWrap:'wrap' }}>
            <Link to="/#contact" className="btn-primary" style={{ textDecoration:'none' }}>
              Nous contacter
            </Link>
            <Link to="/calendrier" className="btn-secondary" style={{ textDecoration:'none' }}>
              Voir le calendrier
            </Link>
          </div>
        </div>
      </div>

      <Footer />

    </div>
  )
}
