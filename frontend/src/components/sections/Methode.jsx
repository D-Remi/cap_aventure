import { img, P } from '../../data/photos'
import './Methode.css'

const ICONES = {
  securite: <path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6z" />,
  reperes:  <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
  prepa:    <><rect x="6" y="4" width="12" height="17" rx="2" /><path d="M9 4h6v3H9zM9 12h6M9 16h4" /></>,
  profils:  <><circle cx="9" cy="8" r="3" /><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6" /><circle cx="17" cy="9" r="2.5" /><path d="M16.5 14c2.5.2 4.5 2.3 4.5 5" /></>,
  sens:     <><path d="M5 19c0-8 6-14 14-14 0 8-6 14-14 14z" /><path d="M5 19l7-7" /></>,
  nouvelles:<><path d="M4 5h16v11H8l-4 4z" /><path d="M8 9h8M8 12h5" /></>,
}

const PRINCIPES = [
  { i: 'securite',  t: 'La sécurité avant tout', d: "Votre enfant est sous ma responsabilité : je reste attentif et présent à chaque instant. Consignes médicales et numéros utiles sont préparés avec vous." },
  { i: 'reperes',   t: 'Je respecte ses repères', d: "Ses habitudes, son rythme, ses rituels rassurants : je les apprends avec vous en amont, et je les suis pour qu'il se sente en confiance." },
  { i: 'prepa',     t: 'Une garde préparée avec vous', d: "Avant la première garde, on échange : ce qui l'apaise, ce qui le déclenche, ses besoins. Rien n'est improvisé." },
  { i: 'profils',   t: "À l'aise avec tous les profils", d: "Enfant non verbal, crises, hypersensibilité, fauteuil, fratrie nombreuse : j'ai l'habitude, et j'adapte ma présence à chaque enfant." },
  { i: 'sens',      t: 'Des moments qui ont du sens', d: "Je ne me contente pas de surveiller. Jeux, activités, sorties selon l'âge et l'envie : votre enfant passe un bon moment." },
  { i: 'nouvelles', t: 'Vous êtes tenu au courant', d: "À votre retour, je vous raconte comment ça s'est passé. Vous partez l'esprit tranquille et vous savez ce qui s'est vécu." },
]

export default function Methode() {
  return (
    <section className="ev-section ev-section--mist" id="methode">
      <div className="ev-container ev-methode">
        <figure className="ev-methode__photo ev-reveal">
          <img src={img(P.mains, 1000)} alt="La main d'un enfant serre le doigt d'un adulte" loading="lazy" />
          <figcaption>
            <span className="ev-kicker">Ma façon de faire</span>
            <b>Confier son enfant, ce n'est jamais anodin.</b>
          </figcaption>
        </figure>

        <div className="ev-methode__body">
          <div className="ev-head ev-reveal">
            <h2>La <em>confiance</em> avant tout</h2>
            <p>Voici ce sur quoi vous pouvez compter quand vous me confiez votre enfant.</p>
          </div>
          <div className="ev-methode__grid">
            {PRINCIPES.map(({ i, t, d }, k) => (
              <div className="ev-methode__item ev-reveal" key={t} style={{ transitionDelay: `${(k % 2) * 80}ms` }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{ICONES[i]}</svg>
                <h3>{t}</h3>
                <p>{d}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
