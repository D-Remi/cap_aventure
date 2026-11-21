import { REMI } from '../../data/photos'
import './QuiJeSuis.css'

const PARCOURS = [
  { quand: "2024 → aujourd'hui", quoi: "Assistant d'éducation en collège, à Annecy, Évian puis Douvaine" },
  { quand: '2026', quoi: 'Accompagnant éducatif en lieu de vie, auprès de jeunes accueillis en internat' },
  { quand: '2025', quoi: 'Animateur de séjours adaptés APAJH, avec des enfants autistes et des enfants avec troubles du comportement' },
  { quand: '2025', quoi: "Référent d'un enfant en situation de handicap en colonie de ski" },
  { quand: '2023 → 2024', quoi: "Aide médico-psychologique auprès d'enfants atteints de paralysie cérébrale, en centre d'éducation motrice" },
  { quand: '2022 → 2023', quoi: "Garde d'enfants, dont en situation de handicap, et soutien éducatif en foyer" },
]

const BADGES = ['BAFA', 'Séjours adaptés TSA', 'Polyhandicap', "Attestation d'honorabilité", 'Permis B']

export default function QuiJeSuis() {
  return (
    <section className="ev-section ev-qui" id="qui">
      <div className="ev-container ev-qui__grid">
        <div className="ev-qui__photo ev-reveal">
          <div className="ev-qui__frame">
            <img src={REMI} alt="Rémi, accompagnant éducatif dans le Chablais" loading="lazy" />
          </div>
          <div className="ev-qui__name">
            <b>Rémi</b>
            <span>Accompagnant éducatif · Thonon-les-Bains</span>
          </div>
        </div>

        <div className="ev-qui__text">
          <div className="ev-head ev-reveal">
            <span className="ev-kicker">Qui je suis</span>
            <h2>Un éducateur pour garder votre enfant, <em>pas juste un baby-sitter.</em></h2>
          </div>
          <div className="ev-qui__lead ev-reveal">
            <p>
              J'ai quitté l'informatique en 2022 parce que ce qui compte pour moi, c'est l'humain.
              Depuis, je travaille chaque jour avec des enfants et des adolescents, dont beaucoup
              ont des besoins particuliers.
            </p>
            <p>
              Gérer une crise, rassurer un enfant qui ne parle pas, garder son calme quand tout déborde :
              c'est mon quotidien de professionnel. Cette expérience-là, aucun baby-sitter occasionnel ne l'a.
            </p>
          </div>

          <ol className="ev-qui__parcours ev-reveal">
            {PARCOURS.map(({ quand, quoi }) => (
              <li key={quoi}><span>{quand}</span><p>{quoi}</p></li>
            ))}
          </ol>

          <div className="ev-qui__badges ev-reveal">
            {BADGES.map(b => <span key={b}>{b}</span>)}
          </div>
        </div>
      </div>
    </section>
  )
}
