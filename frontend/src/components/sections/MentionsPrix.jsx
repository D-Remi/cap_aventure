import { Link } from 'react-router-dom'
import useEntreprise from '../../hooks/useEntreprise'

// Informations obligatoires à côté des prix (arrêté du 17 mars 2015 relatif aux services à la personne) :
// prix HT et TTC, mode d'intervention, devis gratuit, avantage fiscal en caractères plus petits que le prix.
export default function MentionsPrix({ style }) {
  const e = useEntreprise()
  const franchise = (e.tva_regime || 'franchise') === 'franchise'
  return (
    <div className="ev-mentions-prix" style={style}>
      <p>
        Prix TTC. {franchise
          ? 'TVA non applicable, article 293 B du CGI : prix HT = prix TTC.'
          : `Prix HT = prix TTC / ${(1 + (parseFloat(e.tva_taux) || 10) / 100).toFixed(3).replace('.', ',')} (TVA ${String(parseFloat(e.tva_taux) || 10).replace('.', ',')} %).`}
        {' '}Prestations en mode prestataire : je suis votre interlocuteur unique, vous n'êtes pas employeur.
        {' '}Frais de déplacement inclus jusqu'à 20 km autour de Thonon.
      </p>
      <p>
        Je remets gratuitement un devis personnalisé pour toute prestation dont le prix mensuel est supérieur ou égal à 100 € TTC, et sur simple demande en dessous.
        {e.sap_numero ? ` Organisme de services à la personne déclaré sous le n° ${e.sap_numero}.` : ''}
        {' '}<Link to="/cgv">Conditions générales</Link>.
      </p>
      <p className="ev-mentions-prix__fiscal">
        Avantage fiscal : les sommes versées ouvrent droit, sous conditions, au crédit d'impôt de 50 % prévu à l'article 199 sexdecies du code général des impôts, dans la limite des plafonds annuels. Les paiements en espèces n'y ouvrent pas droit.
      </p>
    </div>
  )
}
