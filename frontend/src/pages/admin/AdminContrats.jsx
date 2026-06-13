import { useState, useEffect } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import AdminLayout from '../../components/layout/AdminLayout'
import { genererFacturePDF } from '../../utils/pdfGenerator'
import SignatureCanvas from '../../components/ui/SignatureCanvas'

const STATUT = {
  brouillon:    { bg:'#f3f4f6', c:'#6b7280', l:'📝 Brouillon' },
  envoye:       { bg:'#fff8e1', c:'#f57f17', l:'📤 Envoyé' },
  signe_parent: { bg:'#e3f2fd', c:'#1565c0', l:'✍️ Signé parent' },
  signe_admin:  { bg:'#e8f5e9', c:'#2e7d32', l:'✍️ Signé admin' },
  actif:        { bg:'#e8f5e9', c:'#1b5e20', l:'✅ Actif' },
  termine:      { bg:'#f5f5f5', c:'#9e9e9e', l:'🏁 Terminé' },
  annule:       { bg:'#fee2e2', c:'#991b1b', l:'❌ Annulé' },
}
const JOURS_L = ['Lun','Mar','Mer','Jeu','Ven','Sam','Dim']
const EMPTY_CONTRAT = { user_id:'',child_id:'',date_debut:'',date_fin:'',jours_semaine:'',tarif_horaire:'15',heures_semaine:'3',tarif_km:'0.40',km_inclus:'0',objectifs:'',besoins_specifiques:'',modalites:'',clauses:'' }

export default function AdminContrats() {
  const [contrats,  setContrats]  = useState([])
  const [users,     setUsers]     = useState([])
  const [children,  setChildren]  = useState([])
  const [selected,  setSelected]  = useState(null)
  const [seances,   setSeances]   = useState([])
  const [factures,  setFactures]  = useState([])
  const [tab,       setTab]       = useState('detail')
  const [modal,     setModal]     = useState(null)
  const [form,      setForm]      = useState(EMPTY_CONTRAT)
  const [seanceForm,setSF]        = useState({date:'',heure_debut:'09:00',heure_fin:'12:00',km_aller:0,km_retour:0,notes:''})
  const [factForm,  setFF]        = useState({periode_debut:'',periode_fin:'',notes:''})
  const [signing,   setSigning]   = useState(false)
  const [saving,    setSaving]    = useState(false)
  const [filterSt,  setFilterSt]  = useState('tous')

  useEffect(() => { fetchAll() }, [])

  const fetchAll = () => Promise.all([
    axios.get('/api/contrats'),
    axios.get('/api/users'),
    axios.get('/api/children'),
  ]).then(([c,u,ch]) => { setContrats(c.data); setUsers(u.data.filter(x=>x.role==='parent')); setChildren(ch.data) })
  .catch(()=>{})

  const fetchContrat = (id) => Promise.all([
    axios.get(`/api/contrats/${id}/seances`),
    axios.get(`/api/contrats/${id}/factures`),
  ]).then(([s,f]) => { setSeances(s.data); setFactures(f.data) }).catch(()=>{})

  const select = (c) => { setSelected(c); setTab('detail'); fetchContrat(c.id) }

  const set  = k => e => setForm(f=>({...f,[k]:e.target.value}))
  const setSF2 = k => e => setSF(f=>({...f,[k]:e.target.value}))
  const setFF2 = k => e => setFF(f=>({...f,[k]:e.target.value}))

  const toggleJour = j => {
    const cur = form.jours_semaine ? form.jours_semaine.split(',').filter(Boolean).map(Number) : []
    const next = cur.includes(j) ? cur.filter(x=>x!==j) : [...cur,j]
    setForm(f=>({...f,jours_semaine:next.sort().join(',')}))
  }

  const jourActif = j => (form.jours_semaine||'').split(',').filter(Boolean).map(Number).includes(j)

  const saveContrat = async () => {
    setSaving(true)
    try {
      if (modal==='create') {
        const {data} = await axios.post('/api/contrats', form)
        setContrats(c=>[data,...c]); setSelected(data); toast.success('Contrat créé')
      } else {
        const {data} = await axios.put(`/api/contrats/${selected.id}`, form)
        setContrats(c=>c.map(x=>x.id===data.id?data:x)); setSelected(data); toast.success('Contrat mis à jour')
      }
      setModal(null)
    } catch(e){ toast.error(e.response?.data?.message||'Erreur') }
    finally { setSaving(false) }
  }

  const envoyer = async () => {
    const {data} = await axios.patch(`/api/contrats/${selected.id}/envoyer`)
    setSelected(data); setContrats(c=>c.map(x=>x.id===data.id?data:x))
    toast.success('Contrat envoyé au parent')
  }

  const signerAdmin = async (sig) => {
    const {data} = await axios.patch(`/api/contrats/${selected.id}/signer-admin`, { signature:sig })
    setSelected(data); setContrats(c=>c.map(x=>x.id===data.id?data:x))
    setSigning(false); toast.success('Contrat signé — maintenant actif ✅')
  }

  const addSeance = async () => {
    const {data} = await axios.post(`/api/contrats/${selected.id}/seances`, seanceForm)
    setSeances(s=>[...s,data])
    setSF({date:'',heure_debut:'09:00',heure_fin:'12:00',km_aller:0,km_retour:0,notes:''})
    toast.success('Séance ajoutée')
    setModal(null)
  }

  const delSeance = async (id) => {
    await axios.delete(`/api/contrats/seances/${id}`)
    setSeances(s=>s.filter(x=>x.id!==id))
  }

  const genererFacture = async () => {
    const {data} = await axios.post(`/api/contrats/${selected.id}/factures`, factForm)
    setFactures(f=>[data.facture,...f])
    setModal(null); toast.success(`Facture ${data.facture.numero} générée`)
  }

  const badge = (st) => {
    const s = STATUT[st]||STATUT.brouillon
    return <span style={{background:s.bg,color:s.c,fontSize:'.72rem',fontWeight:700,padding:'2px 8px',borderRadius:50,whiteSpace:'nowrap'}}>{s.l}</span>
  }

  const childrenOfUser = (uid) => children.filter(c => c.user_id===+uid || c.user?.id===+uid)

  const filtered = contrats.filter(c => filterSt==='tous' || c.statut===filterSt)

  const fi = (label, key, type='text', ph='') => (
    <div style={{marginBottom:'.75rem'}}>
      <label style={{fontSize:'.78rem',fontWeight:700,display:'block',marginBottom:4,textTransform:'uppercase',color:'var(--nuit)'}}>{label}</label>
      <input type={type} value={form[key]} onChange={set(key)} placeholder={ph}
        style={{width:'100%',padding:'.5rem',border:'1.5px solid var(--sable-dark)',borderRadius:8,fontFamily:'inherit',fontSize:'.9rem'}}/>
    </div>
  )
  const ta = (label, key, rows=3) => (
    <div style={{marginBottom:'.75rem'}}>
      <label style={{fontSize:'.78rem',fontWeight:700,display:'block',marginBottom:4,textTransform:'uppercase',color:'var(--nuit)'}}>{label}</label>
      <textarea value={form[key]} onChange={set(key)} rows={rows}
        style={{width:'100%',padding:'.5rem',border:'1.5px solid var(--sable-dark)',borderRadius:8,fontFamily:'inherit',fontSize:'.9rem',resize:'vertical'}}/>
    </div>
  )
  const sel = (label, key, opts) => (
    <div style={{marginBottom:'.75rem'}}>
      <label style={{fontSize:'.78rem',fontWeight:700,display:'block',marginBottom:4,textTransform:'uppercase',color:'var(--nuit)'}}>{label}</label>
      <select value={form[key]} onChange={set(key)} style={{width:'100%',padding:'.5rem',border:'1.5px solid var(--sable-dark)',borderRadius:8,fontFamily:'inherit',fontSize:'.9rem'}}>
        {opts.map(([v,l])=><option key={v} value={v}>{l}</option>)}
      </select>
    </div>
  )

  const sInput = (label, val, onChange, type='text') => (
    <div style={{marginBottom:'.65rem'}}>
      <label style={{fontSize:'.75rem',fontWeight:700,display:'block',marginBottom:3,textTransform:'uppercase',color:'var(--nuit)'}}>{label}</label>
      <input type={type} value={val} onChange={onChange} style={{width:'100%',padding:'.45rem',border:'1.5px solid var(--sable-dark)',borderRadius:8,fontFamily:'inherit',fontSize:'.88rem'}}/>
    </div>
  )

  const calcHeures = (d,f) => {
    if (!d||!f) return 0
    const [h1,m1]=d.split(':').map(Number), [h2,m2]=f.split(':').map(Number)
    return Math.max(0,((h2*60+m2)-(h1*60+m1))/60)
  }

  return (
    <AdminLayout>
      <div className="admin-page">
        <div className="admin-page__header">
          <div><h1>📄 Contrats Répit</h1>
            <p className="admin-page__subtitle">{contrats.filter(c=>c.statut==='actif').length} contrat{contrats.filter(c=>c.statut==='actif').length>1?'s':''} actif{contrats.filter(c=>c.statut==='actif').length>1?'s':''}</p>
          </div>
          <button className="btn-primary" onClick={()=>{setForm(EMPTY_CONTRAT);setModal('create')}}>+ Nouveau contrat</button>
        </div>

        <div style={{display:'flex',gap:'.6rem',marginBottom:'1.5rem',flexWrap:'wrap'}}>
          {[{v:'tous',l:'Tous'},{v:'brouillon',l:'📝 Brouillons'},{v:'envoye',l:'📤 Envoyés'},{v:'signe_parent',l:'✍️ Signé parent'},{v:'actif',l:'✅ Actifs'},{v:'termine',l:'🏁 Terminés'}].map(({v,l})=>(
            <button key={v} className={`cal-filter-btn ${filterSt===v?'active':''}`} onClick={()=>setFilterSt(v)}>{l}</button>
          ))}
        </div>

        <div style={{display:'grid',gridTemplateColumns:'300px 1fr',gap:'1.5rem',alignItems:'start'}}>
          {/* Liste */}
          <div style={{display:'flex',flexDirection:'column',gap:'.5rem'}}>
            {filtered.length===0 && <div style={{textAlign:'center',color:'var(--text-muted)',padding:'2rem',fontSize:'.85rem'}}>Aucun contrat</div>}
            {filtered.map(c=>(
              <div key={c.id} onClick={()=>select(c)}
                style={{padding:'1rem',background:selected?.id===c.id?'var(--sable-light)':'white',border:`2px solid ${selected?.id===c.id?'var(--sauge)':'#eef2ee'}`,borderRadius:'var(--radius-lg)',cursor:'pointer',transition:'all .18s'}}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'.35rem'}}>
                  <div style={{fontWeight:700,color:'var(--nuit)',fontSize:'.9rem'}}>{c.child?.prenom} {c.child?.nom}</div>
                  {badge(c.statut)}
                </div>
                <div style={{fontSize:'.75rem',color:'var(--text-muted)'}}>
                  {c.user?.prenom} {c.user?.nom} · {c.date_debut ? new Date(c.date_debut+'T00:00:00').toLocaleDateString('fr-FR',{day:'numeric',month:'short'}) : '—'} → {c.date_fin ? new Date(c.date_fin+'T00:00:00').toLocaleDateString('fr-FR',{day:'numeric',month:'short',year:'numeric'}) : '—'}
                </div>
                {c.montant_estime && <div style={{fontSize:'.75rem',color:'var(--sauge)',fontWeight:700,marginTop:3}}>~{parseFloat(c.montant_estime).toFixed(0)} € estimé</div>}
              </div>
            ))}
          </div>

          {/* Détail */}
          {selected ? (
            <div style={{display:'flex',flexDirection:'column',gap:'1rem'}}>
              {/* Actions */}
              <div style={{background:'white',borderRadius:'var(--radius-xl)',padding:'1.25rem 1.5rem',boxShadow:'var(--shadow-sm)',display:'flex',gap:'.65rem',flexWrap:'wrap',alignItems:'center'}}>
                {badge(selected.statut)}
                <div style={{flex:1}}/>
                <button className="btn-secondary" style={{fontSize:'.82rem'}} onClick={()=>{setForm({...selected,jours_semaine:selected.jours_semaine||''});setModal('edit')}}>✏️ Modifier</button>
                {['brouillon','signe_parent'].includes(selected.statut) && (
                  <button className="btn-primary" style={{fontSize:'.82rem'}} onClick={envoyer}>📤 Envoyer au parent</button>
                )}
                {selected.statut==='signe_parent' && !selected.signature_admin && (
                  <button className="btn-primary" style={{fontSize:'.82rem',background:'#2e7d32'}} onClick={()=>setSigning(true)}>✍️ Signer</button>
                )}
              </div>

              {/* Onglets */}
              <div style={{display:'flex',gap:'.4rem',borderBottom:'2px solid var(--sable-light)',paddingBottom:'0'}}>
                {[{id:'detail',l:'📋 Détail'},{id:'seances',l:`🕐 Séances (${seances.length})`},{id:'factures',l:`💶 Factures (${factures.length})`},{id:'signatures',l:'✍️ Signatures'}].map(t=>(
                  <button key={t.id} onClick={()=>setTab(t.id)}
                    style={{padding:'.5rem 1rem',border:'none',background:'none',cursor:'pointer',fontWeight:tab===t.id?700:400,color:tab===t.id?'var(--nuit)':'var(--text-muted)',borderBottom:tab===t.id?'2px solid var(--nuit)':'2px solid transparent',marginBottom:-2,fontFamily:'inherit',fontSize:'.88rem'}}>
                    {t.l}
                  </button>
                ))}
              </div>

              {/* Tab Détail */}
              {tab==='detail' && (
                <div style={{background:'white',borderRadius:'var(--radius-xl)',padding:'1.75rem',boxShadow:'var(--shadow-sm)',display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1.5rem'}}>
                  <div>
                    <h3 style={{fontFamily:"'Baloo 2',cursive",color:'var(--nuit)',fontSize:'1rem',marginBottom:'1rem'}}>Parties</h3>
                    <div style={{display:'flex',flexDirection:'column',gap:'.5rem',fontSize:'.88rem',color:'var(--text-dark)'}}>
                      <div><strong>Enfant :</strong> {selected.child?.prenom} {selected.child?.nom}</div>
                      <div><strong>Parent :</strong> {selected.user?.prenom} {selected.user?.nom}</div>
                      <div><strong>Email :</strong> {selected.user?.email}</div>
                    </div>
                    <h3 style={{fontFamily:"'Baloo 2',cursive",color:'var(--nuit)',fontSize:'1rem',marginTop:'1.25rem',marginBottom:'1rem'}}>Période</h3>
                    <div style={{display:'flex',flexDirection:'column',gap:'.4rem',fontSize:'.88rem',color:'var(--text-dark)'}}>
                      <div><strong>Du :</strong> {selected.date_debut ? new Date(selected.date_debut+'T00:00:00').toLocaleDateString('fr-FR',{weekday:'long',day:'numeric',month:'long',year:'numeric'}) : '—'}</div>
                      <div><strong>Au :</strong> {selected.date_fin ? new Date(selected.date_fin+'T00:00:00').toLocaleDateString('fr-FR',{weekday:'long',day:'numeric',month:'long',year:'numeric'}) : '—'}</div>
                      {selected.jours_semaine && <div><strong>Jours :</strong> {selected.jours_semaine.split(',').filter(Boolean).map(j=>JOURS_L[+j]).join(', ')}</div>}
                    </div>
                  </div>
                  <div>
                    <h3 style={{fontFamily:"'Baloo 2',cursive",color:'var(--nuit)',fontSize:'1rem',marginBottom:'1rem'}}>Tarification</h3>
                    <div style={{display:'flex',flexDirection:'column',gap:'.4rem',fontSize:'.88rem',color:'var(--text-dark)'}}>
                      <div><strong>Tarif horaire :</strong> {selected.tarif_horaire} €/h</div>
                      <div><strong>Heures / semaine :</strong> {selected.heures_semaine} h</div>
                      <div><strong>Tarif km :</strong> {selected.tarif_km} €/km</div>
                      <div><strong>Km inclus / séance :</strong> {selected.km_inclus} km</div>
                      {selected.montant_estime && <div style={{marginTop:'.5rem',fontWeight:700,color:'var(--sauge)'}}>Montant estimé : ~{parseFloat(selected.montant_estime).toFixed(0)} €</div>}
                    </div>
                  </div>
                  {selected.objectifs && <div style={{gridColumn:'1/-1'}}><h3 style={{fontFamily:"'Baloo 2',cursive",color:'var(--nuit)',fontSize:'1rem',marginBottom:'.75rem'}}>Objectifs</h3><p style={{fontSize:'.88rem',color:'var(--text-dark)',lineHeight:1.7,whiteSpace:'pre-wrap'}}>{selected.objectifs}</p></div>}
                  {selected.besoins_specifiques && <div style={{gridColumn:'1/-1'}}><h3 style={{fontFamily:"'Baloo 2',cursive",color:'var(--nuit)',fontSize:'1rem',marginBottom:'.75rem'}}>Besoins spécifiques</h3><p style={{fontSize:'.88rem',color:'var(--text-dark)',lineHeight:1.7,whiteSpace:'pre-wrap'}}>{selected.besoins_specifiques}</p></div>}
                  {selected.modalites && <div style={{gridColumn:'1/-1'}}><h3 style={{fontFamily:"'Baloo 2',cursive",color:'var(--nuit)',fontSize:'1rem',marginBottom:'.75rem'}}>Modalités pratiques</h3><p style={{fontSize:'.88rem',color:'var(--text-dark)',lineHeight:1.7,whiteSpace:'pre-wrap'}}>{selected.modalites}</p></div>}
                  {selected.clauses && <div style={{gridColumn:'1/-1'}}><h3 style={{fontFamily:"'Baloo 2',cursive",color:'var(--nuit)',fontSize:'1rem',marginBottom:'.75rem'}}>Clauses particulières</h3><p style={{fontSize:'.88rem',color:'var(--text-dark)',lineHeight:1.7,whiteSpace:'pre-wrap'}}>{selected.clauses}</p></div>}
                </div>
              )}

              {/* Tab Séances */}
              {tab==='seances' && (
                <div style={{background:'white',borderRadius:'var(--radius-xl)',padding:'1.75rem',boxShadow:'var(--shadow-sm)'}}>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'1.25rem'}}>
                    <h3 style={{fontFamily:"'Baloo 2',cursive",color:'var(--nuit)',fontSize:'1rem',margin:0}}>Séances réalisées</h3>
                    <button className="btn-primary" style={{fontSize:'.82rem'}} onClick={()=>setModal('seance')}>+ Ajouter une séance</button>
                  </div>

                  {seances.length===0 ? <p style={{color:'var(--text-muted)',fontSize:'.85rem'}}>Aucune séance saisie</p> : (
                    <>
                      <div style={{overflowX:'auto'}}>
                        <table style={{width:'100%',borderCollapse:'collapse',fontSize:'.84rem'}}>
                          <thead><tr style={{borderBottom:'1px solid var(--sable-light)'}}>
                            <th style={{padding:'6px 8px',textAlign:'left',color:'var(--text-muted)',fontWeight:600,fontSize:'.78rem'}}>Date</th>
                            <th style={{padding:'6px 8px',textAlign:'center',color:'var(--text-muted)',fontWeight:600,fontSize:'.78rem'}}>Horaires</th>
                            <th style={{padding:'6px 8px',textAlign:'center',color:'var(--text-muted)',fontWeight:600,fontSize:'.78rem'}}>Durée</th>
                            <th style={{padding:'6px 8px',textAlign:'center',color:'var(--text-muted)',fontWeight:600,fontSize:'.78rem'}}>Km</th>
                            <th style={{padding:'6px 8px',textAlign:'right',color:'var(--text-muted)',fontWeight:600,fontSize:'.78rem'}}>Montant</th>
                            <th style={{padding:'6px 8px',textAlign:'center',color:'var(--text-muted)',fontWeight:600,fontSize:'.78rem'}}>Facturé</th>
                            <th/>
                          </tr></thead>
                          <tbody>
                            {seances.map(s=>(
                              <tr key={s.id} style={{borderBottom:'1px solid #f5f5f5'}}>
                                <td style={{padding:'6px 8px',fontWeight:600,color:'var(--nuit)'}}>{new Date(s.date+'T00:00:00').toLocaleDateString('fr-FR',{weekday:'short',day:'numeric',month:'short'})}</td>
                                <td style={{padding:'6px 8px',textAlign:'center',color:'var(--text-muted)'}}>{s.heure_debut?.slice(0,5)} – {s.heure_fin?.slice(0,5)}</td>
                                <td style={{padding:'6px 8px',textAlign:'center',color:'var(--text-muted)'}}>{calcHeures(s.heure_debut,s.heure_fin).toFixed(1)} h</td>
                                <td style={{padding:'6px 8px',textAlign:'center',color:'var(--text-muted)'}}>{(Number(s.km_aller||0)+Number(s.km_retour||0)).toFixed(0)} km</td>
                                <td style={{padding:'6px 8px',textAlign:'right',fontWeight:700,color:'var(--sauge)'}}>{parseFloat(s.montant_total||0).toFixed(2)} €</td>
                                <td style={{padding:'6px 8px',textAlign:'center'}}>{s.facture_id ? <span style={{fontSize:'.7rem',background:'#e8f5e9',color:'#2e7d32',padding:'1px 6px',borderRadius:50}}>✅</span> : <span style={{fontSize:'.7rem',color:'var(--text-muted)'}}>—</span>}</td>
                                <td style={{padding:'6px 8px'}}><button onClick={()=>delSeance(s.id)} style={{background:'#fee2e2',color:'#991b1b',border:'none',borderRadius:6,padding:'2px 7px',cursor:'pointer',fontSize:'.8rem',fontFamily:'inherit'}}>🗑️</button></td>
                              </tr>
                            ))}
                          </tbody>
                          <tfoot><tr style={{borderTop:'2px solid var(--sable-light)'}}>
                            <td colSpan={4} style={{padding:'8px',fontWeight:700,color:'var(--nuit)',fontSize:'.88rem'}}>Total non facturé</td>
                            <td style={{padding:'8px',textAlign:'right',fontWeight:800,color:'var(--sauge)',fontSize:'.95rem'}}>
                              {seances.filter(s=>!s.facture_id).reduce((t,s)=>t+parseFloat(s.montant_total||0),0).toFixed(2)} €
                            </td>
                            <td colSpan={2}/>
                          </tr></tfoot>
                        </table>
                      </div>

                      {seances.filter(s=>!s.facture_id).length > 0 && (
                        <button className="btn-primary" style={{marginTop:'1rem',fontSize:'.85rem'}} onClick={()=>{setFF({periode_debut:'',periode_fin:'',notes:''});setModal('facture')}}>
                          💶 Générer une facture
                        </button>
                      )}
                    </>
                  )}
                </div>
              )}

              {/* Tab Factures */}
              {tab==='factures' && (
                <div style={{background:'white',borderRadius:'var(--radius-xl)',padding:'1.75rem',boxShadow:'var(--shadow-sm)'}}>
                  <h3 style={{fontFamily:"'Baloo 2',cursive",color:'var(--nuit)',fontSize:'1rem',marginBottom:'1.25rem'}}>Factures émises</h3>
                  {factures.length===0 ? <p style={{color:'var(--text-muted)',fontSize:'.85rem'}}>Aucune facture générée</p> : (
                    <div style={{display:'flex',flexDirection:'column',gap:'.75rem'}}>
                      {factures.map(f=>(
                        <div key={f.id} style={{padding:'1.25rem',background:'var(--sable-light)',borderRadius:'var(--radius-lg)',display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:'.75rem'}}>
                          <div>
                            <div style={{fontWeight:700,color:'var(--nuit)',fontSize:'.92rem'}}>{f.numero}</div>
                            <div style={{fontSize:'.78rem',color:'var(--text-muted)',marginTop:2}}>
                              {new Date(f.periode_debut+'T00:00:00').toLocaleDateString('fr-FR',{day:'numeric',month:'short'})} → {new Date(f.periode_fin+'T00:00:00').toLocaleDateString('fr-FR',{day:'numeric',month:'short',year:'numeric'})}
                              &nbsp;·&nbsp;{f.total_heures} h · {f.total_km} km
                            </div>
                          </div>
                          <div style={{display:'flex',alignItems:'center',gap:'.75rem'}}>
                            <span style={{fontFamily:"'Baloo 2',cursive",fontSize:'1.3rem',fontWeight:800,color:'var(--sauge)'}}>{parseFloat(f.montant_total).toFixed(2)} €
                      <button onClick={(e)=>{e.stopPropagation();genererFacturePDF(f, selected, selected.user, [])}}
                        style={{marginLeft:'.5rem',background:'#e0f2fe',color:'#0369a1',border:'none',borderRadius:6,padding:'2px 8px',cursor:'pointer',fontSize:'.72rem',fontWeight:700,fontFamily:'inherit'}}>
                        ⬇️ PDF
                      </button></span>
                            <span style={{background:f.statut==='payee'?'#e8f5e9':f.statut==='envoyee'?'#fff8e1':'#f3f4f6',color:f.statut==='payee'?'#2e7d32':f.statut==='envoyee'?'#f57f17':'#6b7280',fontSize:'.72rem',fontWeight:700,padding:'2px 8px',borderRadius:50}}>
                              {f.statut==='payee'?'💰 Payée':f.statut==='envoyee'?'📤 Envoyée':'📝 Brouillon'}
                            </span>
                            {f.statut!=='payee' && <button onClick={()=>axios.patch(`/api/contrats/factures/${f.id}/payee`).then(()=>{setFactures(fa=>fa.map(x=>x.id===f.id?{...x,statut:'payee'}:x));toast.success('Facture marquée payée')})} style={{background:'#e8f5e9',color:'#2e7d32',border:'none',borderRadius:8,padding:'.35rem .75rem',cursor:'pointer',fontFamily:'inherit',fontWeight:700,fontSize:'.78rem'}}>Marquer payée</button>}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Tab Signatures */}
              {tab==='signatures' && (
                <div style={{background:'white',borderRadius:'var(--radius-xl)',padding:'1.75rem',boxShadow:'var(--shadow-sm)',display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1.5rem'}}>
                  <div>
                    <h3 style={{fontFamily:"'Baloo 2',cursive",color:'var(--nuit)',fontSize:'1rem',marginBottom:'1rem'}}>✍️ Signature parent</h3>
                    {selected.signature_parent ? (
                      <>
                        <img src={selected.signature_parent} alt="Signature parent" style={{width:'100%',border:'1px solid var(--sable-dark)',borderRadius:8,background:'white'}}/>
                        <p style={{fontSize:'.78rem',color:'var(--text-muted)',marginTop:'.5rem'}}>Signé le {selected.signature_parent_at ? new Date(selected.signature_parent_at).toLocaleString('fr-FR') : '—'}</p>
                      </>
                    ) : <p style={{color:'var(--text-muted)',fontSize:'.85rem'}}>Non signé</p>}
                  </div>
                  <div>
                    <h3 style={{fontFamily:"'Baloo 2',cursive",color:'var(--nuit)',fontSize:'1rem',marginBottom:'1rem'}}>✍️ Signature animateur</h3>
                    {selected.signature_admin ? (
                      <>
                        <img src={selected.signature_admin} alt="Signature admin" style={{width:'100%',border:'1px solid var(--sable-dark)',borderRadius:8,background:'white'}}/>
                        <p style={{fontSize:'.78rem',color:'var(--text-muted)',marginTop:'.5rem'}}>Signé le {selected.signature_admin_at ? new Date(selected.signature_admin_at).toLocaleString('fr-FR') : '—'}</p>
                      </>
                    ) : (
                      selected.signature_parent ? (
                        <button className="btn-primary" onClick={()=>setSigning(true)}>✍️ Signer maintenant</button>
                      ) : <p style={{color:'var(--text-muted)',fontSize:'.85rem'}}>En attente de la signature parent</p>
                    )}
                  </div>
                </div>
              )}

              {/* Signature admin overlay */}
              {signing && (
                <div className="admin-modal-overlay" onClick={()=>setSigning(false)}>
                  <div className="admin-modal" onClick={e=>e.stopPropagation()}>
                    <h2>✍️ Votre signature</h2>
                    <SignatureCanvas label="Signez pour valider le contrat" onSave={signerAdmin} onCancel={()=>setSigning(false)}/>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div style={{textAlign:'center',padding:'4rem',background:'white',borderRadius:'var(--radius-xl)',color:'var(--text-muted)'}}>
              ← Sélectionnez un contrat
            </div>
          )}
        </div>
      </div>

      {/* Modal créer/modifier contrat */}
      {(modal==='create'||modal==='edit') && (
        <div className="admin-modal-overlay" onClick={()=>!saving&&setModal(null)}>
          <div className="admin-modal" style={{maxWidth:640,maxHeight:'85vh',overflowY:'auto'}} onClick={e=>e.stopPropagation()}>
            <h2>{modal==='create'?'➕ Nouveau contrat répit':'✏️ Modifier le contrat'}</h2>

            {modal==='create' && (
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'.75rem',marginBottom:'.75rem'}}>
                <div>
                  <label style={{fontSize:'.78rem',fontWeight:700,display:'block',marginBottom:4,textTransform:'uppercase',color:'var(--nuit)'}}>Parent *</label>
                  <select value={form.user_id} onChange={set('user_id')} style={{width:'100%',padding:'.5rem',border:'1.5px solid var(--sable-dark)',borderRadius:8,fontFamily:'inherit'}}>
                    <option value="">— Choisir —</option>
                    {users.map(u=><option key={u.id} value={u.id}>{u.prenom} {u.nom}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{fontSize:'.78rem',fontWeight:700,display:'block',marginBottom:4,textTransform:'uppercase',color:'var(--nuit)'}}>Enfant *</label>
                  <select value={form.child_id} onChange={set('child_id')} style={{width:'100%',padding:'.5rem',border:'1.5px solid var(--sable-dark)',borderRadius:8,fontFamily:'inherit'}}>
                    <option value="">— Choisir —</option>
                    {childrenOfUser(form.user_id).map(c=><option key={c.id} value={c.id}>{c.prenom} {c.nom}</option>)}
                  </select>
                </div>
              </div>
            )}

            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'.75rem'}}>
              {fi('Date début *','date_debut','date')}
              {fi('Date fin *','date_fin','date')}
            </div>

            <div style={{marginBottom:'.75rem'}}>
              <label style={{fontSize:'.78rem',fontWeight:700,display:'block',marginBottom:6,textTransform:'uppercase',color:'var(--nuit)'}}>Jours de la semaine</label>
              <div style={{display:'flex',gap:'.4rem',flexWrap:'wrap'}}>
                {[0,1,2,3,4,5,6].map(j=>(
                  <button key={j} type="button" onClick={()=>toggleJour(j)}
                    style={{padding:'.3rem .75rem',borderRadius:50,border:`1.5px solid ${jourActif(j)?'var(--sauge)':'var(--sable-dark)'}`,background:jourActif(j)?'var(--sauge)':'white',color:jourActif(j)?'white':'var(--nuit)',fontWeight:700,fontSize:'.82rem',cursor:'pointer',fontFamily:'inherit'}}>
                    {JOURS_L[j]}
                  </button>
                ))}
              </div>
            </div>

            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr 1fr',gap:'.75rem'}}>
              {fi('Tarif €/h','tarif_horaire','number')}
              {fi('H/semaine','heures_semaine','number')}
              {fi('€/km','tarif_km','number')}
              {fi('Km inclus/séance','km_inclus','number')}
            </div>

            {ta('Objectifs de la prise en charge','objectifs',3)}
            {ta('Besoins spécifiques de l\'enfant','besoins_specifiques',3)}
            {ta('Modalités pratiques (lieu, transport, repas…)','modalites',2)}
            {ta('Clauses particulières','clauses',2)}

            <div className="admin-modal__actions">
              <button className="btn-secondary" onClick={()=>setModal(null)} disabled={saving}>Annuler</button>
              <button className="btn-primary" onClick={saveContrat} disabled={saving||!form.date_debut||!form.date_fin}>{saving?'Enregistrement…':'Enregistrer'}</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal séance */}
      {modal==='seance' && (
        <div className="admin-modal-overlay" onClick={()=>setModal(null)}>
          <div className="admin-modal" style={{maxWidth:460}} onClick={e=>e.stopPropagation()}>
            <h2>🕐 Ajouter une séance</h2>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:'.75rem'}}>
              {sInput('Date *', seanceForm.date, setSF2('date'), 'date')}
              {sInput('Début', seanceForm.heure_debut, setSF2('heure_debut'), 'time')}
              {sInput('Fin',   seanceForm.heure_fin,   setSF2('heure_fin'),   'time')}
            </div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'.75rem'}}>
              {sInput('Km aller', seanceForm.km_aller, setSF2('km_aller'), 'number')}
              {sInput('Km retour', seanceForm.km_retour, setSF2('km_retour'), 'number')}
            </div>
            {sInput('Notes (optionnel)', seanceForm.notes, setSF2('notes'))}
            {seanceForm.heure_debut && seanceForm.heure_fin && (
              <div style={{background:'var(--sable-light)',borderRadius:8,padding:'.65rem',fontSize:'.82rem',color:'var(--nuit)',marginBottom:'.75rem'}}>
                Durée : {calcHeures(seanceForm.heure_debut,seanceForm.heure_fin).toFixed(1)} h ·
                Km facturables : {Math.max(0,(Number(seanceForm.km_aller||0)+Number(seanceForm.km_retour||0))-Number(selected?.km_inclus||0)).toFixed(0)} km ·
                Estimé : {(calcHeures(seanceForm.heure_debut,seanceForm.heure_fin)*Number(selected?.tarif_horaire||15) + Math.max(0,(Number(seanceForm.km_aller||0)+Number(seanceForm.km_retour||0))-Number(selected?.km_inclus||0))*Number(selected?.tarif_km||0.40)).toFixed(2)} €
              </div>
            )}
            <div className="admin-modal__actions">
              <button className="btn-secondary" onClick={()=>setModal(null)}>Annuler</button>
              <button className="btn-primary" onClick={addSeance} disabled={!seanceForm.date||!seanceForm.heure_debut||!seanceForm.heure_fin}>Enregistrer</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal facture */}
      {modal==='facture' && (
        <div className="admin-modal-overlay" onClick={()=>setModal(null)}>
          <div className="admin-modal" style={{maxWidth:420}} onClick={e=>e.stopPropagation()}>
            <h2>💶 Générer une facture</h2>
            <p style={{fontSize:'.85rem',color:'var(--text-muted)',marginBottom:'1rem'}}>Toutes les séances non facturées dans la période seront incluses.</p>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'.75rem'}}>
              {sInput('Période début *', factForm.periode_debut, setFF2('periode_debut'), 'date')}
              {sInput('Période fin *',   factForm.periode_fin,   setFF2('periode_fin'),   'date')}
            </div>
            <div style={{marginBottom:'.75rem'}}>
              <label style={{fontSize:'.75rem',fontWeight:700,display:'block',marginBottom:3,textTransform:'uppercase',color:'var(--nuit)'}}>Notes (optionnel)</label>
              <textarea value={factForm.notes} onChange={setFF2('notes')} rows={2} style={{width:'100%',padding:'.45rem',border:'1.5px solid var(--sable-dark)',borderRadius:8,fontFamily:'inherit',resize:'vertical'}}/>
            </div>
            <div className="admin-modal__actions">
              <button className="btn-secondary" onClick={()=>setModal(null)}>Annuler</button>
              <button className="btn-primary" onClick={genererFacture} disabled={!factForm.periode_debut||!factForm.periode_fin}>Générer</button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}