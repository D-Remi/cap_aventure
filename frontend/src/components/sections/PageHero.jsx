import { img } from '../../data/photos'
import './PageHero.css'

// En-tête sombre des pages intérieures (Tarifs, Frontaliers…)
export default function PageHero({ kicker, title, lead, photo, alt = '', children }) {
  return (
    <header className="ev-phero">
      <div className="ev-container ev-phero__grid">
        <div className="ev-phero__text">
          <span className="ev-kicker">{kicker}</span>
          <h1>{title}</h1>
          {lead && <p>{lead}</p>}
        </div>
        <div className="ev-phero__visual">
          <figure className="ev-phero__photo">
            <img src={img(photo, 1200)} alt={alt} loading="eager" />
          </figure>
          {children}
        </div>
      </div>
    </header>
  )
}
