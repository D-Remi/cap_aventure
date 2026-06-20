import { useState, useEffect } from 'react'
import axios from 'axios'
import { genererFacturePDF } from '../../utils/pdfGenerator'
import toast from 'react-hot-toast'
import SignatureCanvas from './SignatureCanvas'

const STATUT = {
  brouillon:    { bg:'#f3f4f6', c:'#6b7280', l:'Brouillon' },
  envoye:       { bg:'#e3f2fd', c:'#1565c0', l:'En attente de votre signature' },
  signe_parent: { bg:'#fff8e1', c:'#f57f17', l:'En attente de signature animateur' },
  signe_admin:  { bg:'#e8f5e9', c:'#2e7d32', l:'Signé des deux parties' },
  actif:        { bg:'#e8f5e9', c:'#1b5e20', l:'Contrat actif' },
  termine:      { bg:'#f5f5f5', c:'#9e9e9e', l:'Terminé' },
  annule:       { bg:'#fee2e2', c:'#991b1b', l:'Annulé' },
}
const JOURS_L = ['Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi','Dimanche']

export default function ContratTab() {
  const [contrats, setContrats] = useState([])
  const [selected, setSelected] = useState(null)
  const [seances,  setSeances]  = useState([])
  const [factures, setFactures] = useState([])
  const [signing,  setSigning]  = useState(false)
  const [loading,  setLoading]  = useState(true)

  useEffect(() => {
    axios.get('/api/contrats').then(r => setContrats(r.data)).catch(()=>{}).finally(()=>setLoading(false))
  }, [])

  const select = (c) => {
    setSelected(c)
    Promise.all([
      axios.get(`/api/contrats/${c.id}/seances`),
      axios.get(`/api/contrats/${c.id}/factures`),
    ]).then(([s,f]) => { setSeances(s.data); setFactures(f.data) }).catch(()=>{})
  }

  const signer = async (sig) => {
    try {
      const { data } = await axios.patch(`/api/contrats/${selected.id}/signer-parent`, { signature: sig })
      setSelected(data)
      setContrats(c => c.map(x => x.id===data.id ? data : x))
      setSigning(false)
      toast.success('Contrat signé ! L\'animateur va contresigner.')
    } catch(e) { toast.error(e.response?.data?.message || 'Erreur lors de la signature') }
  }

  const badge = (st) => {
    const s = STATUT[st] || STATUT.brouillon
    return <span style={{background:s.bg,color:s.c,fontSize:'.75rem',fontWeight:700,padding:'3px 10px',borderRadius:50}}>{s.l}</span>
  }

  if (loading) return <div style={{padding:'2rem',textAlign:'center',color:'var(--text-muted)'}}>Chargement…</div>

  if (contrats.length === 0) return (
    <div style={{textAlign:'center',padding:'3rem'}}>
      <div style={{fontSize:'2rem',marginBottom:'.75rem'}}></div>
      <h3 style={{fontFamily:"'Baloo 2',cursive",color:'var(--nuit)',marginBottom:'.5rem'}}>Aucun contrat répit</h3>
      <p style={{color:'var(--text-muted)',fontSize:'.88rem'}}>Contactez l'animateur pour établir un contrat de répit personnalisé.</p>
    </div>
  )

  return (
    <div>
      {!selected ? (
        <div style={{display:'flex',flexDirection:'column',gap:'.75rem'}}>
          {contrats.map(c => (
            <div key={c.id} onClick={() => select(c)}
              style={{background:'white',borderRadius:'var(--radius-xl)',padding:'1.25rem 1.5rem',boxShadow:'var(--shadow-sm)',cursor:'pointer',border:'2px solid transparent',transition:'border .18s'}}
              onMouseEnter={e=>e.currentTarget.style.borderColor='var(--sauge)'}
              onMouseLeave={e=>e.currentTarget.style.borderColor='transparent'}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'.5rem'}}>
                <div>
                  <div style={{fontFamily:"'Baloo 2',cursive",fontWeight:700,color:'var(--nuit)',fontSize:'1.05rem'}}>{c.child?.prenom} {c.child?.nom}</div>
                  <div style={{fontSize:'.82rem',color:'var(--text-muted)',marginTop:2}}>
                    {c.date_debut ? new Date(c.date_debut+'T00:00:00').toLocaleDateString('fr-FR',{day:'numeric',month:'long',year:'numeric'}) : '—'} →
                    {c.date_fin   ? new Date(c.date_fin+'T00:00:00').toLocaleDateString('fr-FR',{day:'numeric',month:'long',year:'numeric'})   : '—'}
                  </div>
                </div>
                {badge(c.statut)}
              </div>
              <div style={{display:'flex',gap:'1rem',fontSize:'.82rem',color:'var(--text-muted)'}}>
                <span>{c.heures_semaine} h/sem</span>
                <span>{c.tarif_horaire} €/h</span>
                {c.montant_estime && <span>~{parseFloat(c.montant_estime).toFixed(0)} € estimé</span>}
              </div>
              {c.statut === 'envoye' && (
                <div style={{marginTop:'.75rem',background:'#e3f2fd',borderRadius:8,padding:'.5rem .85rem',fontSize:'.82rem',color:'#1565c0',fontWeight:600}}>
                  Ce contrat attend votre signature — cliquez pour lire et signer
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div>
          <button onClick={() => setSelected(null)} style={{background:'none',border:'none',cursor:'pointer',color:'var(--text-muted)',fontWeight:700,fontSize:'.88rem',marginBottom:'1.25rem',fontFamily:'inherit',padding:0}}>
            ← Retour aux contrats
          </button>

          {/* Contrat complet */}
          <div style={{background:'white',borderRadius:'var(--radius-xl)',padding:'1.75rem',boxShadow:'var(--shadow-sm)',marginBottom:'1rem'}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'1.25rem',flexWrap:'wrap',gap:'.5rem'}}>
              <h2 style={{fontFamily:"'Baloo 2',cursive",color:'var(--nuit)',fontSize:'1.3rem',margin:0}}>
                Contrat répit — {selected.child?.prenom} {selected.child?.nom}
              </h2>
              {badge(selected.statut)}
            </div>

            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1.5rem',marginBottom:'1.25rem'}}>
              <div>
                <h4 style={{color:'var(--text-muted)',fontSize:'.78rem',textTransform:'uppercase',letterSpacing:.5,marginBottom:'.5rem'}}>Période</h4>
                <div style={{fontSize:'.9rem',color:'var(--text-dark)',lineHeight:1.8}}>
                  <div><strong>Début :</strong> {selected.date_debut ? new Date(selected.date_debut+'T00:00:00').toLocaleDateString('fr-FR',{weekday:'long',day:'numeric',month:'long',year:'numeric'}) : '—'}</div>
                  <div><strong>Fin :</strong> {selected.date_fin ? new Date(selected.date_fin+'T00:00:00').toLocaleDateString('fr-FR',{weekday:'long',day:'numeric',month:'long',year:'numeric'}) : '—'}</div>
                  {selected.jours_semaine && <div><strong>Jours :</strong> {selected.jours_semaine.split(',').filter(Boolean).map(j=>JOURS_L[+j]).join(', ')}</div>}
                </div>
              </div>
              <div>
                <h4 style={{color:'var(--text-muted)',fontSize:'.78rem',textTransform:'uppercase',letterSpacing:.5,marginBottom:'.5rem'}}>Tarification</h4>
                <div style={{fontSize:'.9rem',color:'var(--text-dark)',lineHeight:1.8}}>
                  <div><strong>Tarif horaire :</strong> {selected.tarif_horaire} €/h</div>
                  <div><strong>Heures / semaine :</strong> {selected.heures_semaine} h</div>
                  <div><strong>Tarif kilométrique :</strong> {selected.tarif_km} €/km</div>
                  {Number(selected.km_inclus) > 0 && <div><strong>Km inclus / séance :</strong> {selected.km_inclus} km</div>}
                  {selected.montant_estime && <div style={{marginTop:4,fontWeight:700,color:'var(--sauge)'}}><strong>Montant estimé :</strong> ~{parseFloat(selected.montant_estime).toFixed(0)} €</div>}
                </div>
              </div>
            </div>

            {selected.objectifs && <div style={{marginBottom:'1rem'}}><h4 style={{color:'var(--text-muted)',fontSize:'.78rem',textTransform:'uppercase',letterSpacing:.5,marginBottom:'.5rem'}}>Objectifs</h4><p style={{fontSize:'.9rem',color:'var(--text-dark)',lineHeight:1.7,whiteSpace:'pre-wrap'}}>{selected.objectifs}</p></div>}
            {selected.besoins_specifiques && <div style={{marginBottom:'1rem'}}><h4 style={{color:'var(--text-muted)',fontSize:'.78rem',textTransform:'uppercase',letterSpacing:.5,marginBottom:'.5rem'}}>Besoins spécifiques</h4><p style={{fontSize:'.9rem',color:'var(--text-dark)',lineHeight:1.7,whiteSpace:'pre-wrap'}}>{selected.besoins_specifiques}</p></div>}
            {selected.modalites && <div style={{marginBottom:'1rem'}}><h4 style={{color:'var(--text-muted)',fontSize:'.78rem',textTransform:'uppercase',letterSpacing:.5,marginBottom:'.5rem'}}>Modalités pratiques</h4><p style={{fontSize:'.9rem',color:'var(--text-dark)',lineHeight:1.7,whiteSpace:'pre-wrap'}}>{selected.modalites}</p></div>}
            {selected.clauses && <div style={{marginBottom:'1rem'}}><h4 style={{color:'var(--text-muted)',fontSize:'.78rem',textTransform:'uppercase',letterSpacing:.5,marginBottom:'.5rem'}}>Clauses particulières</h4><p style={{fontSize:'.9rem',color:'var(--text-dark)',lineHeight:1.7,whiteSpace:'pre-wrap'}}>{selected.clauses}</p></div>}

            {/* Signatures */}
            <div style={{borderTop:'1px solid var(--sable-light)',paddingTop:'1.25rem',marginTop:'1.25rem',display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1.25rem'}}>
              <div>
                <h4 style={{color:'var(--text-muted)',fontSize:'.78rem',textTransform:'uppercase',letterSpacing:.5,marginBottom:'.75rem'}}>Signature animateur</h4>
                {selected.signature_admin
                  ? <><img src={selected.signature_admin} alt="Sig admin" style={{width:'100%',border:'1px solid var(--sable-dark)',borderRadius:8,background:'white'}}/><p style={{fontSize:'.75rem',color:'var(--text-muted)',marginTop:4}}>Signé le {new Date(selected.signature_admin_at).toLocaleString('fr-FR')}</p></>
                  : <p style={{color:'var(--text-muted)',fontSize:'.85rem'}}>En attente</p>}
              </div>
              <div>
                <h4 style={{color:'var(--text-muted)',fontSize:'.78rem',textTransform:'uppercase',letterSpacing:.5,marginBottom:'.75rem'}}>Votre signature</h4>
                {selected.signature_parent
                  ? <><img src={selected.signature_parent} alt="Sig parent" style={{width:'100%',border:'1px solid var(--sable-dark)',borderRadius:8,background:'white'}}/><p style={{fontSize:'.75rem',color:'var(--text-muted)',marginTop:4}}>Signé le {new Date(selected.signature_parent_at).toLocaleString('fr-FR')}</p></>
                  : selected.statut === 'envoye'
                    ? <><p style={{color:'#1565c0',fontSize:'.85rem',marginBottom:'.75rem'}}>Ce contrat est prêt. Veuillez le lire attentivement avant de signer.</p><button className="btn-primary" onClick={()=>setSigning(true)}>Signer le contrat</button></>
                    : <p style={{color:'var(--text-muted)',fontSize:'.85rem'}}>Pas encore disponible</p>}
              </div>
            </div>

            {signing && (
              <div style={{marginTop:'1.25rem',borderTop:'2px solid var(--sauge)',paddingTop:'1.25rem'}}>
                <SignatureCanvas label="Signez pour accepter le contrat" onSave={signer} onCancel={()=>setSigning(false)}/>
              </div>
            )}
          </div>

          {/* Séances */}
          {seances.length > 0 && (
            <div style={{background:'white',borderRadius:'var(--radius-xl)',padding:'1.5rem',boxShadow:'var(--shadow-sm)',marginBottom:'1rem'}}>
              <h3 style={{fontFamily:"'Baloo 2',cursive",color:'var(--nuit)',fontSize:'1rem',marginBottom:'1rem'}}>Séances ({seances.length})</h3>
              <div style={{display:'flex',flexDirection:'column',gap:'.5rem'}}>
                {seances.map(s => (
                  <div key={s.id} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'.6rem .85rem',background:'var(--sable-light)',borderRadius:8,fontSize:'.85rem'}}>
                    <span style={{fontWeight:600,color:'var(--nuit)'}}>{new Date(s.date+'T00:00:00').toLocaleDateString('fr-FR',{weekday:'short',day:'numeric',month:'short'})}</span>
                    <span style={{color:'var(--text-muted)'}}>{s.heure_debut?.slice(0,5)} – {s.heure_fin?.slice(0,5)}</span>
                    <span style={{color:'var(--text-muted)'}}>{(Number(s.km_aller||0)+Number(s.km_retour||0)).toFixed(0)} km</span>
                    <span style={{fontWeight:700,color:'var(--sauge)'}}>{parseFloat(s.montant_total||0).toFixed(2)} €</span>
                    {s.facture_id && <span style={{fontSize:'.72rem',background:'#e8f5e9',color:'#2e7d32',padding:'1px 6px',borderRadius:50}}>Facturé</span>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Factures */}
          {factures.length > 0 && (
            <div style={{background:'white',borderRadius:'var(--radius-xl)',padding:'1.5rem',boxShadow:'var(--shadow-sm)'}}>
              <h3 style={{fontFamily:"'Baloo 2',cursive",color:'var(--nuit)',fontSize:'1rem',marginBottom:'1rem'}}>Factures ({factures.length})</h3>
              {factures.map(f => (
                <div key={f.id} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'.85rem',background:'var(--sable-light)',borderRadius:10,marginBottom:'.5rem',flexWrap:'wrap',gap:'.5rem'}}>
                  <div>
                    <div style={{fontWeight:700,color:'var(--nuit)',fontSize:'.9rem'}}>{f.numero}</div>
                    <div style={{fontSize:'.78rem',color:'var(--text-muted)'}}>
                      {new Date(f.periode_debut+'T00:00:00').toLocaleDateString('fr-FR',{day:'numeric',month:'short'})} → {new Date(f.periode_fin+'T00:00:00').toLocaleDateString('fr-FR',{day:'numeric',month:'short',year:'numeric'})}
                      &nbsp;·&nbsp;{f.total_heures} h · {f.total_km} km
                    </div>
                  </div>
                  <div style={{display:'flex',alignItems:'center',gap:'.75rem'}}>
                    <span style={{fontFamily:"'Baloo 2',cursive",fontSize:'1.2rem',fontWeight:800,color:'var(--sauge)'}}>{parseFloat(f.montant_total).toFixed(2)} €
                  <button onClick={()=>genererFacturePDF(f, selected, user, [])}
                    style={{marginLeft:'.5rem',background:'var(--sauge)',color:'white',border:'none',borderRadius:6,padding:'3px 10px',cursor:'pointer',fontSize:'.75rem',fontWeight:700,fontFamily:'inherit'}}>
                    ⬇Télécharger
                  </button></span>
                    <span style={{background:f.statut==='payee'?'#e8f5e9':f.statut==='envoyee'?'#fff8e1':'#f3f4f6',color:f.statut==='payee'?'#2e7d32':f.statut==='envoyee'?'#f57f17':'#6b7280',fontSize:'.72rem',fontWeight:700,padding:'2px 8px',borderRadius:50}}>
                      {f.statut==='payee'?'Payée':f.statut==='envoyee'?'Envoyée':'En attente'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}