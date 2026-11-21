import { img, P } from '../../data/photos'
import './Zone.css'

export const COMMUNES = [
  'Thonon-les-Bains', 'Évian-les-Bains', 'Publier', 'Amphion', 'Neuvecelle', 'Maxilly-sur-Léman', 'Lugrin',
  'Anthy-sur-Léman', 'Margencel', 'Sciez', 'Excenevex', 'Allinges', 'Armoy', 'Le Lyaud', 'Marin',
  'Perrignier', 'Bons-en-Chablais', 'Douvaine',
]
export const STATIONS = ['Châtel', 'Abondance', 'Bernex', 'Thollon-les-Mémises', 'Morzine', 'Les Gets']
export const SUISSE = ['Genève', 'Nyon', 'Lausanne', 'Riviera vaudoise']

export default function Zone() {
  return (
    <section className="ev-section ev-section--mist ev-zone">
      <div className="ev-container ev-zone__grid">
        <div>
          <div className="ev-head ev-reveal">
            <span className="ev-kicker">Où j'interviens</span>
            <h2>Thonon, Évian et <em>tout le Chablais.</em></h2>
            <p>Déplacement inclus jusqu'à 20 km autour de Thonon. Les stations et la Suisse sont possibles avec un forfait.</p>
          </div>
          <div className="ev-zone__chips ev-reveal">
            {COMMUNES.map(c => <span key={c}>{c}</span>)}
            {STATIONS.map(c => <span key={c} className="is-station">{c}</span>)}
            {SUISSE.map(c => <span key={c} className="is-station">{c} (CH)</span>)}
          </div>
          <p className="ev-note ev-reveal" style={{ marginTop: '1rem' }}>En pointillés : sur forfait. En Suisse : gardes ponctuelles, à réserver au moins 8 jours avant.</p>
        </div>
        <figure className="ev-zone__photo ev-photo ev-reveal">
          <img src={img(P.lavaux2, 1100)} alt="Une ferme au bord du Léman, les montagnes du Chablais au loin" loading="lazy" />
        </figure>
      </div>
    </section>
  )
}
