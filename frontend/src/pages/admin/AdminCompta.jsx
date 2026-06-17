import { useState, useEffect } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import AdminLayout from '../../components/layout/AdminLayout'

const MOIS_LABELS = ['Jan','Fév','Mar','Avr','Mai','Jun','Jul','Aoû','Sep','Oct','Nov','Déc']
const MOIS_FULL   = ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre']
const MODES = { cesu:'🎫 CESU', virement:'🏦 Virement', especes:'💵 Espèces' }
const CATS  = ['Garde','Répit','Animation','Kilométrage','Matériel','Formation','Autre']

const EMPTY = { date: new Date().toISOString().slice(0,10), montant:'', mode:'virement', reference:'', description:'', famille:'', type:'recette', categorie:'Garde' }

// ════ Export CSV ════
function exportCSV(entrees, mois, annee) {
  const label = mois ? `${MOIS_FULL[mois-1]}_${annee}` : `Annee_${annee}`
  const rows = [
    ['Date','Type','Mode','Montant','Famille','Catégorie','Description','Référence'],
    ...entrees.map(e => [
      e.date, e.type, e.mode, parseFloat(e.montant).toFixed(2),
      e.famille||'', e.categorie||'', e.description||'', e.reference||''
    ])
  ]
  const csv = rows.map(r => r.map(v => `"${String(v).replace(/"/g,'""')}"`).join(';')).join('\n')
  const blob = new Blob(['\uFEFF'+csv], { type:'text/csv;charset=utf-8' })
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob)
  a.download = `CapAventure_Compta_${label}.csv`; a.click()
}

export default function AdminCompta() {
  const now = new Date()
  const [annee,    setAnnee]    = useState(now.getFullYear())
  const [moisSel,  setMoisSel]  = useState(now.getMonth() + 1)
  const [stats,    setStats]    = useState(null)
  const [entrees,  setEntrees]  = useState([])
  const [loading,  setLoading]  = useState(true)
  const [modal,    setModal]    = useState(false)
  const [editing,  setEditing]  = useState(null)
  const [form,     setForm]     = useState(EMPTY)
  const [users,    setUsers]    = useState([])

  useEffect(() => { fetchAll() }, [annee])
  useEffect(() => { fetchMonth() }, [annee, moisSel])

  const fetchAll = async () => {
    const [s, u] = await Promise.all([
      axios.get(`/api/compta/stats?year=${annee}`),
      axios.get('/api/users'),
    ])
    setStats(s.data); setUsers(u.data)
  }

  const fetchMonth = async () => {
    setLoading(true)
    const { data } = await axios.get(`/api/compta/month?year=${annee}&month=${moisSel}`)
    setEntrees(data)
    setLoading(false)
  }

  const openAdd = () => { setForm(EMPTY); setEditing(null); setModal(true) }
  const openEdit = (e) => {
    setForm({ date:e.date, montant:String(e.montant), mode:e.mode, reference:e.reference||'', description:e.description||'', famille:e.famille||'', type:e.type, categorie:e.categorie||'Garde' })
    setEditing(e.id); setModal(true)
  }

  const save = async () => {
    if (!form.montant || !form.date) { toast.error('Date et montant requis'); return }
    try {
      if (editing) {
        const { data } = await axios.put(`/api/compta/${editing}`, { ...form, montant: parseFloat(form.montant) })
        setEntrees(e => e.map(x => x.id===editing ? data : x))
        toast.success('Entrée modifiée')
      } else {
        const { data } = await axios.post('/api/compta', { ...form, montant: parseFloat(form.montant) })
        setEntrees(e => [data, ...e])
        toast.success('Entrée ajoutée')
      }
      setModal(false); fetchAll()
    } catch { toast.error('Erreur') }
  }

  const remove = async (id) => {
    if (!window.confirm('Supprimer cette entrée ?')) return
    await axios.delete(`/api/compta/${id}`)
    setEntrees(e => e.filter(x => x.id !== id))
    fetchAll(); toast.success('Supprimé')
  }

  const moisData = stats?.months?.[moisSel - 1]
  const recettes = entrees.filter(e => e.type==='recette')
  const depenses = entrees.filter(e => e.type==='depense')
  const totalRecM = recettes.reduce((s,e) => s + parseFloat(e.montant), 0)
  const totalDepM = depenses.reduce((s,e) => s + parseFloat(e.montant), 0)
  const maxBar = Math.max(...(stats?.months||[]).map(m => Math.max(m.recettes, m.depenses)), 1)

  const fi = (label, key, type='text', ph='') => (
    <div style={{marginBottom:'.75rem'}}>
      <label style={{fontSize:'.78rem',fontWeight:700,color:'var(--nuit)',display:'block',marginBottom:3,textTransform:'uppercase'}}>{label}</label>
      <input type={type} value={form[key]} onChange={e=>setForm(f=>({...f,[key]:e.target.value}))} placeholder={ph}
        style={{width:'100%',padding:'.5rem',border:'1.5px solid var(--sable-dark)',borderRadius:8,fontFamily:'inherit',fontSize:'.9rem'}}/>
    </div>
  )
  const fs = (label, key, opts) => (
    <div style={{marginBottom:'.75rem'}}>
      <label style={{fontSize:'.78rem',fontWeight:700,color:'var(--nuit)',display:'block',marginBottom:3,textTransform:'uppercase'}}>{label}</label>
      <select value={form[key]} onChange={e=>setForm(f=>({...f,[key]:e.target.value}))}
        style={{width:'100%',padding:'.5rem',border:'1.5px solid var(--sable-dark)',borderRadius:8,fontFamily:'inherit',fontSize:'.9rem'}}>
        {opts.map(([v,l]) => <option key={v} value={v}>{l}</option>)}
      </select>
    </div>
  )

  return (
    <AdminLayout>
      <div className="admin-page">
        <div className="admin-page__header">
          <div>
            <h1>💰 Comptabilité</h1>
            <p className="admin-page__subtitle">Suivi des recettes et dépenses — {annee}</p>
          </div>
          <div style={{display:'flex',gap:'.75rem',alignItems:'center'}}>
            <select value={annee} onChange={e=>setAnnee(+e.target.value)}
              style={{padding:'.5rem .85rem',border:'1.5px solid var(--sable-dark)',borderRadius:8,fontFamily:'inherit',fontWeight:700,fontSize:'.9rem'}}>
              {[2024,2025,2026,2027].map(y => <option key={y} value={y}>{y}</option>)}
            </select>
            <button onClick={() => exportCSV(entrees, moisSel, annee)} className="btn-secondary" style={{fontSize:'.85rem'}}>
              ⬇️ Export CSV
            </button>
            <button onClick={openAdd} className="btn-primary">+ Nouvelle entrée</button>
          </div>
        </div>

        {/* ══ Totaux annuels ══ */}
        {stats && (
          <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'1rem',marginBottom:'1.5rem'}}>
            {[
              { label:'Recettes annuelles', val: stats.totalRecettes, color:'#2e7d32', bg:'#e8f5e9' },
              { label:'Dépenses annuelles', val: stats.totalDepenses, color:'#c62828', bg:'#ffebee' },
              { label:'Bénéfice net', val: stats.net, color: stats.net>=0?'#2e7d32':'#c62828', bg: stats.net>=0?'#e8f5e9':'#ffebee' },
              { label:'Mois en cours', val: moisData?.recettes||0, color:'var(--nuit)', bg:'var(--sable-light)' },
            ].map(({ label, val, color, bg }) => (
              <div key={label} style={{background:bg,borderRadius:'var(--radius-lg)',padding:'1.25rem'}}>
                <div style={{fontSize:'.78rem',color,fontWeight:700,textTransform:'uppercase',letterSpacing:'.04em',marginBottom:'.4rem'}}>{label}</div>
                <div style={{fontFamily:"'Baloo 2',cursive",fontSize:'1.8rem',fontWeight:800,color,lineHeight:1}}>
                  {parseFloat(val).toFixed(2)} €
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ══ Graphique barres annuel ══ */}
        {stats && (
          <div style={{background:'white',borderRadius:'var(--radius-xl)',padding:'1.5rem',marginBottom:'1.5rem',boxShadow:'var(--shadow-sm)'}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'1.25rem'}}>
              <h3 style={{fontFamily:"'Baloo 2',cursive",color:'var(--nuit)',fontSize:'1rem'}}>Revenus par mois</h3>
              <div style={{display:'flex',gap:'1rem',fontSize:'.78rem'}}>
                <span style={{display:'flex',alignItems:'center',gap:'.35rem'}}><span style={{width:10,height:10,borderRadius:2,background:'#4a7a6d',display:'block'}}/> Recettes</span>
                <span style={{display:'flex',alignItems:'center',gap:'.35rem'}}><span style={{width:10,height:10,borderRadius:2,background:'#ef4444',display:'block'}}/> Dépenses</span>
              </div>
            </div>
            <div style={{display:'grid',gridTemplateColumns:'repeat(12,1fr)',gap:'.5rem',alignItems:'end',height:140}}>
              {stats.months.map((m,i) => (
                <div key={i} style={{display:'flex',flexDirection:'column',alignItems:'center',gap:3,cursor:'pointer'}}
                  onClick={() => setMoisSel(i+1)}>
                  <div style={{display:'flex',gap:2,alignItems:'flex-end',height:110}}>
                    <div style={{width:12,borderRadius:'3px 3px 0 0',background: moisSel===i+1 ? '#2d5c45':'#4a7a6d',transition:'height .4s',height:`${(m.recettes/maxBar)*100}%`,minHeight: m.recettes>0?4:0}}/>
                    <div style={{width:12,borderRadius:'3px 3px 0 0',background: m.depenses>0?'#ef4444':'transparent',transition:'height .4s',height:`${(m.depenses/maxBar)*100}%`,minHeight: m.depenses>0?4:0}}/>
                  </div>
                  <div style={{fontSize:'.65rem',color: moisSel===i+1 ? 'var(--nuit)':'var(--text-muted)',fontWeight: moisSel===i+1 ? 700:400}}>
                    {MOIS_LABELS[i]}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ══ Sélecteur de mois ══ */}
        <div style={{display:'flex',gap:'.5rem',flexWrap:'wrap',marginBottom:'1.25rem'}}>
          {MOIS_FULL.map((m,i) => (
            <button key={i} onClick={() => setMoisSel(i+1)}
              style={{padding:'.38rem .9rem',borderRadius:50,border:'1.5px solid',fontFamily:'inherit',fontSize:'.82rem',fontWeight:600,cursor:'pointer',
                borderColor: moisSel===i+1 ? 'var(--sauge)':'var(--sable-dark)',
                background:  moisSel===i+1 ? 'var(--sauge)':'white',
                color:       moisSel===i+1 ? 'white':'var(--nuit)'}}>
              {m}
            </button>
          ))}
        </div>

        {/* ══ Détail du mois sélectionné ══ */}
        <div style={{background:'white',borderRadius:'var(--radius-xl)',overflow:'hidden',boxShadow:'var(--shadow-sm)'}}>
          <div style={{padding:'1.25rem 1.5rem',borderBottom:'1px solid var(--sable-light)',display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:'1rem'}}>
            <h3 style={{fontFamily:"'Baloo 2',cursive",color:'var(--nuit)',fontSize:'1.05rem'}}>
              {MOIS_FULL[moisSel-1]} {annee}
            </h3>
            <div style={{display:'flex',gap:'1.5rem',fontSize:'.88rem'}}>
              <span style={{color:'#2e7d32',fontWeight:700}}>Recettes : {totalRecM.toFixed(2)} €</span>
              <span style={{color:'#c62828',fontWeight:700}}>Dépenses : {totalDepM.toFixed(2)} €</span>
              <span style={{fontWeight:700,color: totalRecM-totalDepM>=0 ? '#2e7d32':'#c62828'}}>Net : {(totalRecM-totalDepM).toFixed(2)} €</span>
            </div>
          </div>

          {loading ? (
            <div style={{padding:'2rem',textAlign:'center',color:'var(--text-muted)'}}>Chargement…</div>
          ) : entrees.length === 0 ? (
            <div style={{padding:'2.5rem',textAlign:'center',color:'var(--text-muted)'}}>
              <div style={{fontSize:'2rem',marginBottom:'.5rem'}}>📭</div>
              <p>Aucune entrée ce mois-ci</p>
              <button onClick={openAdd} className="btn-primary" style={{marginTop:'1rem',fontSize:'.85rem'}}>+ Ajouter une entrée</button>
            </div>
          ) : (
            <table style={{width:'100%',borderCollapse:'collapse',fontSize:'.88rem'}}>
              <thead>
                <tr style={{background:'var(--sable-light)'}}>
                  {['Date','Type','Mode','Montant','Famille','Catégorie','Description',''].map(h => (
                    <th key={h} style={{padding:'.75rem 1rem',textAlign:'left',fontWeight:700,fontSize:'.78rem',textTransform:'uppercase',letterSpacing:'.04em',color:'var(--nuit)',borderBottom:'1px solid var(--sable-light)'}}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {entrees.map(e => (
                  <tr key={e.id} style={{borderBottom:'1px solid var(--sable-light)'}}
                    onMouseEnter={el => el.currentTarget.style.background='var(--sable-light)'}
                    onMouseLeave={el => el.currentTarget.style.background='white'}>
                    <td style={{padding:'.75rem 1rem',fontWeight:600,whiteSpace:'nowrap'}}>
                      {new Date(e.date+'T00:00:00').toLocaleDateString('fr-FR',{day:'numeric',month:'short'})}
                    </td>
                    <td style={{padding:'.75rem 1rem'}}>
                      <span style={{background: e.type==='recette'?'#e8f5e9':'#ffebee',color: e.type==='recette'?'#2e7d32':'#c62828',borderRadius:50,padding:'2px 10px',fontWeight:700,fontSize:'.75rem'}}>
                        {e.type==='recette' ? '↑ Recette' : '↓ Dépense'}
                      </span>
                    </td>
                    <td style={{padding:'.75rem 1rem'}}>{MODES[e.mode]||e.mode}</td>
                    <td style={{padding:'.75rem 1rem',fontFamily:"'Baloo 2',cursive",fontWeight:800,fontSize:'1rem',color: e.type==='recette'?'#2e7d32':'#c62828'}}>
                      {e.type==='recette' ? '+' : '-'}{parseFloat(e.montant).toFixed(2)} €
                    </td>
                    <td style={{padding:'.75rem 1rem',color:'var(--text-muted)'}}>{e.famille||'—'}</td>
                    <td style={{padding:'.75rem 1rem'}}>{e.categorie||'—'}</td>
                    <td style={{padding:'.75rem 1rem',color:'var(--text-muted)',maxWidth:200,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{e.description||'—'}</td>
                    <td style={{padding:'.75rem 1rem'}}>
                      <div style={{display:'flex',gap:'.35rem'}}>
                        <button onClick={() => openEdit(e)} style={{background:'var(--sable-light)',border:'none',borderRadius:6,padding:'3px 8px',cursor:'pointer',fontSize:'.78rem',fontFamily:'inherit'}}>✏️</button>
                        <button onClick={() => remove(e.id)} style={{background:'#fee2e2',color:'#991b1b',border:'none',borderRadius:6,padding:'3px 8px',cursor:'pointer',fontSize:'.78rem',fontFamily:'inherit'}}>🗑️</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* ══ Récap CESU du mois ══ */}
        {recettes.filter(e => e.mode==='cesu').length > 0 && (
          <div style={{background:'#e0f2fe',borderRadius:'var(--radius-lg)',padding:'1.25rem 1.5rem',marginTop:'1.25rem',border:'1px solid #bae6fd'}}>
            <div style={{fontWeight:700,color:'#0369a1',marginBottom:'.5rem',fontSize:'.9rem'}}>
              🎫 CESU reçus ce mois — {recettes.filter(e=>e.mode==='cesu').reduce((s,e)=>s+parseFloat(e.montant),0).toFixed(2)} €
            </div>
            <div style={{display:'flex',flexWrap:'wrap',gap:'.5rem'}}>
              {recettes.filter(e => e.mode==='cesu').map(e => (
                <span key={e.id} style={{background:'#0369a1',color:'white',borderRadius:6,padding:'3px 10px',fontSize:'.78rem',fontWeight:600}}>
                  {parseFloat(e.montant).toFixed(2)} € {e.famille?`· ${e.famille}`:''} {e.reference?`· N°${e.reference}`:''}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* ══ Modal ajout/édition ══ */}
        {modal && (
          <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,.5)',zIndex:700,display:'flex',alignItems:'center',justifyContent:'center',padding:'1rem'}}
            onClick={() => setModal(false)}>
            <div style={{background:'white',borderRadius:'var(--radius-xl)',width:'100%',maxWidth:520,overflow:'hidden',boxShadow:'0 24px 64px rgba(0,0,0,.2)'}}
              onClick={e => e.stopPropagation()}>
              <div style={{background:'var(--nuit)',padding:'1.25rem 1.5rem',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                <h3 style={{fontFamily:"'Baloo 2',cursive",color:'white',fontSize:'1.1rem',margin:0}}>
                  {editing ? '✏️ Modifier' : '➕ Nouvelle entrée'}
                </h3>
                <button onClick={() => setModal(false)} style={{background:'rgba(255,255,255,.15)',border:'none',color:'white',width:30,height:30,borderRadius:'50%',cursor:'pointer',fontFamily:'inherit',fontSize:'1rem'}}>✕</button>
              </div>
              <div style={{padding:'1.5rem',display:'flex',flexDirection:'column',gap:'.1rem'}}>
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1rem'}}>
                  {fi('Date *', 'date', 'date')}
                  {fi('Montant (€) *', 'montant', 'number', '0.00')}
                </div>
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1rem'}}>
                  {fs('Type', 'type', [['recette','↑ Recette'],['depense','↓ Dépense']])}
                  {fs('Mode de paiement', 'mode', [['virement','🏦 Virement'],['cesu','🎫 CESU'],['especes','💵 Espèces']])}
                </div>
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1rem'}}>
                  {fs('Catégorie', 'categorie', CATS.map(c => [c,c]))}
                  {fi('Famille', 'famille', 'text', 'Nom de la famille')}
                </div>
                {form.mode === 'cesu' && fi('N° du chèque CESU', 'reference', 'text', 'Numéro du chèque')}
                {form.mode === 'virement' && fi('Référence virement', 'reference', 'text', 'Référence bancaire')}
                {fi('Description', 'description', 'text', 'Ex: Garde mercredi, Frais kilométriques...')}
                <div style={{display:'flex',gap:'.75rem',marginTop:'.5rem'}}>
                  <button onClick={() => setModal(false)} className="btn-secondary" style={{flex:1}}>Annuler</button>
                  <button onClick={save} className="btn-primary" style={{flex:1,justifyContent:'center'}}>
                    {editing ? 'Enregistrer' : 'Ajouter'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
