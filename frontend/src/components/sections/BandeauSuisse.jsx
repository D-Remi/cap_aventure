import { Link } from 'react-router-dom'
import { img, P } from '../../data/photos'
import './BandeauSuisse.css'

export default function BandeauSuisse() {
  return (
    <section className="ev-section ev-ch-band">
      <div className="ev-container">
        <div className="ev-ch-band__card ev-reveal">
          <img src={img(P.vapeur, 1800)} alt="Un bateau à vapeur sur le Léman devant le jet d'eau de Genève" loading="lazy" />
          <div className="ev-ch-band__veil" />
          <div className="ev-ch-band__content">
            <span className="ev-kicker">Frontaliers et familles suisses</span>
            <h2>Vous travaillez en Suisse, ou vous avez un chalet dans le Chablais ?</h2>
            <p>
              Horaires de frontalier, bateau CGN en retard, relâches genevoises et vaudoises :
              je m'adapte. Et si vous habitez en France, le crédit d'impôt de 50 % s'applique,
              même avec un salaire suisse.
            </p>
            <ul>
              <li>De 6 h 30 à 20 h 30</li>
              <li>Tarifs en francs suisses</li>
              <li>Gardes au chalet</li>
            </ul>
            <Link to="/frontaliers-suisse" className="ev-btn ev-btn--lime">Tout savoir pour les frontaliers</Link>
          </div>
        </div>
      </div>
    </section>
  )
}
