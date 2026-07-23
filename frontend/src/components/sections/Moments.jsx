import './Moments.css'

const PHOTOS = [
  { src: 'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?w=900&q=80', cap: 'Sorties nature, à leur rythme', big: true,  alt: 'Sortie en nature' },
  { src: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=600&q=80', cap: 'Jeux libres',                            alt: 'Enfant jouant au sol' },
  { src: 'https://images.unsplash.com/photo-1607453998774-d533f65dac99?w=600&q=80', cap: 'Lecture',                                alt: 'Moment de lecture' },
  { src: 'https://images.unsplash.com/photo-1471286174890-9c112ffca5b4?w=600&q=80', cap: 'Temps calmes',                           alt: 'Temps calme en extérieur' },
  { src: 'https://images.unsplash.com/photo-1753164726456-487d6c6d1f9d?q=80&w=1331&auto=format&fit=crop', cap: 'Activités manuelles', alt: 'Activité manuelle' },
]

export default function Moments() {
  return (
    <section className="moments">
      <div className="container">
        <div className="section-head">
          <span className="section-head__kicker">Le quotidien</span>
          <h2>Des temps calmes, pas des animations</h2>
          <p>Pas de programme chargé. Des moments simples, adaptés au rythme de chaque enfant.</p>
        </div>

        <div className="moments__grid">
          {PHOTOS.map(({ src, cap, big, alt }) => (
            <figure key={cap} className={`moment ${big ? 'moment--big' : ''}`}>
              <img src={src} alt={alt} loading="lazy" />
              <figcaption>{cap}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}
