import './Projet.css'

export default function Projet() {
  return (
    <section className="projet" id="projet">
      <div className="container projet__grid">

        <div className="projet__text reveal">
          <span className="section-tag">Le projet</span>
          <h2 className="section-title">
            Un projet pensé pour <span>grandir dehors</span>
          </h2>
          <p>
            CapAventure, c'est une initiative portée par un animateur passionné — assistant
            d'éducation en collège, chef scout et animateur de colos — pour proposer aux enfants
            de Haute-Savoie des activités outdoor encadrées et enrichissantes.
          </p>
          <p>
            Les mercredis après-midi, les week-ends et certains soirs, on sort, on explore
            et on vit des moments inoubliables dans un cadre exceptionnel. Chaque sortie
            allie plaisir, découverte et apprentissage.
          </p>
          <p>
            <strong>Ce n'est pas une simple garderie, ni un centre de loisirs classique.</strong>{' '}
            C'est une aventure à chaque fois !
          </p>
        </div>

        <div className="projet__visual reveal">
          <div className="projet__card">
            <img
              src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=700&q=80"
              alt="Montagne Haute-Savoie"
              className="projet__card-img"
            />
            <div className="projet__card-body">
              <div className="projet__card-label">HAUTE-SAVOIE</div>
              <h3>🎒 C'est quoi exactement ?</h3>
              <p>Un mix entre garde d'enfants et loisirs actifs, toujours autour d'une activité concrète en plein air.</p>
              <div className="projet__pills">
                {['📅 Mercredis','🗓️ Week-ends','🌙 Certains soirs','🎿 Ski','🚵 VTT','🥾 Rando','🌿 Nature','⛺ Scouts'].map(p => (
                  <span key={p} className="projet__pill">{p}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}
