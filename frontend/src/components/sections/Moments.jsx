import { img, P } from '../../data/photos'
import './Moments.css'

const PHOTOS = [
  { id: P.saut,      cap: 'Sorties nature, à son rythme', alt: 'Des enfants sautent de joie dans une forêt', big: true },
  { id: P.lecture,   cap: 'Lecture',                      alt: 'Un adulte et un enfant lisent un livre sur le canapé' },
  { id: P.coloriage, cap: 'Activités manuelles',          alt: 'Un enfant colorie un papillon' },
  { id: P.automne,   cap: 'Balades',                      alt: 'Un adulte et un enfant marchent dans une forêt en automne' },
  { id: P.cubes,     cap: 'Jeux libres',                  alt: 'Un enfant empile des cubes colorés' },
]

export default function Moments() {
  return (
    <section className="ev-section ev-section--mist">
      <div className="ev-container">
        <div className="ev-head ev-moments__head ev-reveal">
          <span className="ev-kicker">Le quotidien</span>
          <h2>Des temps calmes, <em>pas des animations.</em></h2>
          <p>Pas de programme chargé. Des moments simples, adaptés au rythme et à la sensibilité de chaque enfant.</p>
        </div>

        <div className="ev-moments">
          {PHOTOS.map(({ id, cap, alt, big }, i) => (
            <figure key={cap} className={`ev-moment ${big ? 'ev-moment--big' : ''} ev-reveal`} style={{ transitionDelay: `${i * 70}ms` }}>
              <img src={img(id, big ? 1200 : 700)} alt={alt} loading="lazy" />
              <figcaption>{cap}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}
