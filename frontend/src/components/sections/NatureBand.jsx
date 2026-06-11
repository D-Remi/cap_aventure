import './NatureBand.css'

export default function NatureBand() {
  const go = () => document.getElementById('contact')?.scrollIntoView({ behavior:'smooth' })
  return (
    <section className="tarifs section" id="tarifs">
      <div className="container">
        <div className="section-header">
          <span className="section-tag">Tarification</span>
          <h2>Un tarif <em>personnalisé</em></h2>
          <p>Chaque situation est unique. Je vous propose un tarif adapté après échange sur vos besoins, le profil de votre enfant et la fréquence souhaitée.</p>
        </div>
        <div className="tarifs__simple">
          <div className="tarif-simple-card">
            <span>💶</span>
            <div>
              <strong>Devis gratuit sur mesure</strong>
              <p>Contactez-moi pour discuter de vos besoins. Je vous envoie un devis personnalisé sous 48h.</p>
            </div>
            <button className="btn-primary" onClick={go} style={{flexShrink:0}}>Demander un devis</button>
          </div>
          <div className="tarif-simple-card">
            <span>✅</span>
            <div>
              <strong>CESU accepté</strong>
              <p>Paiement en CESU ou virement bancaire. Des aides CAF, MDPH ou associations peuvent couvrir une partie des frais.</p>
            </div>
          </div>
          <div className="tarif-simple-card">
            <span>📋</span>
            <div>
              <strong>Contrat répit disponible</strong>
              <p>Pour un accompagnement régulier, un contrat formalise les conditions, les dates et le tarif convenu ensemble.</p>
            </div>
            <button className="btn-secondary" onClick={go} style={{flexShrink:0}}>En savoir plus</button>
          </div>
        </div>
      </div>
    </section>
  )
}