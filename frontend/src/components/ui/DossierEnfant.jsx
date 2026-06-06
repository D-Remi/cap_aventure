import './DossierEnfant.css'
const AGE = dob => dob ? Math.floor((Date.now()-new Date(dob))/(365.25*86400000)) : null
const COMM = {verbal:'Verbal',pictogrammes:'Pictogrammes',mixte:'Mixte',lsf:'LSF',autre:'Autre'}

export default function DossierEnfant({ child, showPrivate=false }) {
  if (!child) return null
  const age = AGE(child.date_naissance)
  const ini = ((child.prenom?.[0]||'')+(child.nom?.[0]||'')).toUpperCase()
  return (
    <div className="dossier">
      <div className="dossier__head">
        <div className="dossier__avatar">{ini}</div>
        <div className="dossier__identity">
          <h2>{child.prenom} {child.nom}</h2>
          <div className="dossier__meta">
            {child.date_naissance && <span>Né le {new Date(child.date_naissance).toLocaleDateString('fr-FR')} ({age} ans)</span>}
            <span>ID unique : #CHILD-{String(child.id).padStart(4,'0')}</span>
          </div>
        </div>
        {child.besoins_specifiques && child.type_besoin && (
          <div className="dossier__badge">Profil Spécifique : {child.type_besoin}</div>
        )}
      </div>
      {child.dossier_complete ? (
        <>
          <div className="dossier__blocs">
            {child.centres_interet && (
              <div className="dossier__bloc">
                <div className="dossier__bloc-title"><span>❤️</span> CENTRES D'INTÉRÊT & CANAUX D'ATTENTION</div>
                <p>{child.centres_interet}</p>
                {child.activites_a_eviter && <p className="dossier__avoid">⚠️ À éviter : {child.activites_a_eviter}</p>}
              </div>
            )}
            {child.declencheurs_crise && (
              <div className="dossier__bloc dossier__bloc--warning">
                <div className="dossier__bloc-title"><span>⚠️</span> FACTEURS DÉCLENCHEURS DE CRISE / SURCHARGE</div>
                <p>{child.declencheurs_crise}</p>
                {child.signes_avant_crise && <p><em>Signaux : {child.signes_avant_crise}</em></p>}
              </div>
            )}
            {child.hypersensibilites && (
              <div className="dossier__bloc">
                <div className="dossier__bloc-title"><span>🔔</span> HYPERSENSIBILITÉS SENSORIELLES</div>
                <p>{child.hypersensibilites}</p>
                {child.hyposensibilites && <p><em>Hyposensibilités : {child.hyposensibilites}</em></p>}
              </div>
            )}
            {child.methodes_apaisement && (
              <div className="dossier__bloc dossier__bloc--green">
                <div className="dossier__bloc-title"><span>✅</span> PROTOCOLE D'APAISEMENT VALIDÉ</div>
                <p>{child.methodes_apaisement}</p>
                {child.protocole_urgence && <p className="dossier__urgence">🆘 Urgence : {child.protocole_urgence}</p>}
              </div>
            )}
          </div>
          {child.mode_communication !== 'verbal' && (
            <div className="dossier__comm">💬 Communication : <strong>{COMM[child.mode_communication]}</strong>{child.consignes_communication && ` — ${child.consignes_communication}`}</div>
          )}
        </>
      ) : (
        <div className="dossier__incomplete"><span>⚠️</span><p>Le dossier complet n'a pas encore été rempli par les parents.</p></div>
      )}
      <div className="dossier__footer">
        <div className="dossier__contact">
          <div className="dossier__contact-label">Contact Urgence :</div>
          <strong>{child.contact_urgence_nom||'—'}{child.contact_urgence_lien?` (${child.contact_urgence_lien})`:''}</strong>
          <span>{child.contact_urgence_telephone||''}</span>
        </div>
        <div className="dossier__contact">
          <div className="dossier__contact-label">Médecin Référent :</div>
          <strong>{child.medecin_nom||'—'}</strong>
          <span>{child.medecin_telephone||''}</span>
        </div>
        {child.niveau_natation && (
          <div className="dossier__contact">
            <div className="dossier__contact-label">Niveau Natation :</div>
            <span className="dossier__nage">🏊 {child.niveau_natation}</span>
          </div>
        )}
      </div>
      {showPrivate && child.notes_animateur && (
        <div className="dossier__private">
          <div className="dossier__private-title">🔒 Notes privées animateur</div>
          <p>{child.notes_animateur}</p>
        </div>
      )}
      <div className="dossier__auths">
        <span className={child.autorisation_sortie?'auth-ok':'auth-no'}>{child.autorisation_sortie?'✅':'❌'} Sortie</span>
        <span className={child.autorisation_photo?'auth-ok':'auth-no'}>{child.autorisation_photo?'✅':'❌'} Photo</span>
        {child.traitement_medicamenteux && <span className="auth-warn">💊 Traitement en cours</span>}
      </div>
    </div>
  )
}