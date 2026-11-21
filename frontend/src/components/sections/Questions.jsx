import { Link } from 'react-router-dom'

const FAQ = [
  {
    q: 'Combien ça coûte vraiment ?',
    r: <>40 € de l'heure en abonnement hebdomadaire, 45 € de l'heure en ponctuel. Grâce au crédit d'impôt des services à la personne, l'État en prend la moitié : vous payez réellement 20 € et 22,50 € de l'heure. <Link to="/tarifs">Voir tous les tarifs</Link>.</>,
  },
  {
    q: "C'est quoi, l'avance immédiate ?",
    r: "Après chaque garde, je déclare la facture à l'URSSAF. Vous la validez en ligne et l'URSSAF ne vous prélève que 50 %. L'autre moitié, c'est votre crédit d'impôt, versé directement : vous n'attendez plus l'année suivante. Le service est gratuit.",
  },
  {
    q: 'Mon enfant ne parle pas et fait des crises. Vous saurez faire ?',
    r: "Oui. J'ai encadré des enfants autistes et des enfants avec troubles du comportement en séjours adaptés, et accompagné au quotidien des enfants polyhandicapés. Ce qui compte, c'est la préparation : on note ensemble ce qui l'apaise, ses signaux, et ce que vous faites quand ça monte.",
  },
  {
    q: "Je peux payer avec l'AEEH ?",
    r: "L'AEEH et son complément vous sont versés directement : vous les utilisez comme vous le souhaitez, y compris pour vous offrir du répit. Avec le crédit d'impôt en plus, un créneau de 4 heures par semaine revient à environ 347 € par mois.",
  },
  {
    q: 'Et si je dois annuler ?',
    r: "Prévenez-moi au moins 48 heures avant : rien n'est facturé. En dessous, la garde est due, sauf hospitalisation ou maladie de l'enfant sur justificatif.",
  },
  {
    q: 'Je travaille en Suisse. C\'est pareil pour moi ?',
    r: <>Si vous habitez en France, oui, crédit d'impôt compris. Si vous habitez en Suisse et avez une résidence dans le Chablais, je viens aussi, au tarif plein. Tout est expliqué sur la page <Link to="/frontaliers-suisse">frontaliers et familles suisses</Link>.</>,
  },
]

export default function Questions() {
  return (
    <section className="ev-section" id="questions">
      <div className="ev-container">
        <div className="ev-head ev-head--center ev-reveal">
          <span className="ev-kicker">Vos questions</span>
          <h2>Ce que les parents <em>me demandent</em></h2>
        </div>
        <div className="ev-faq ev-reveal" style={{ marginInline: 'auto' }}>
          {FAQ.map(({ q, r }) => (
            <details key={q}>
              <summary>{q}</summary>
              <div><p>{r}</p></div>
            </details>
          ))}
        </div>
        <p className="ev-note" style={{ textAlign: 'center', marginTop: '1.6rem' }}>
          D'autres questions sur les aides, les documents ou l'espace famille ? <Link to="/documentation" className="ev-arrow">Centre d'aide</Link>
        </p>
      </div>
    </section>
  )
}
