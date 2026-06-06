import { useState, useEffect } from 'react'
import axios from 'axios'
import AdminLayout from '../../components/layout/AdminLayout'

export default function AdminStats() {
  const [data, setData] = useState(null)

  useEffect(() => {
    Promise.all([
      axios.get('/api/bookings'),
      axios.get('/api/children'),
      axios.get('/api/slots?all=true'),
      axios.get('/api/contact'),
    ]).then(([bk, ch, sl, co]) => {
      const bookings  = bk.data
      const children  = ch.data
      const slots     = sl.data
      const contacts  = co.data

      const confirmed = bookings.filter(b => b.status==='confirmed')
      const pending   = bookings.filter(b => b.status==='pending')
      const cancelled = bookings.filter(b => b.status==='cancelled')
      const revenue   = confirmed.reduce((s,b) => s + parseFloat(b.tarif_applique||0), 0)

      const byMonth = {}
      confirmed.forEach(b => {
        if (!b.slot?.date) return
        const m = b.slot.date.slice(0,7)
        byMonth[m] = (byMonth[m]||0) + parseFloat(b.tarif_applique||0)
      })

      const childrenWithDossier = children.filter(c => c.dossier_complete).length
      const childrenSpecifiques = children.filter(c => c.besoins_specifiques).length
      const slotsOuverts  = slots.filter(s => s.statut==='ouvert').length
      const slotsComplets = slots.filter(s => s.statut==='complet').length

      const typeAccueil = { standard:0, adapte:0, mixte:0 }
      slots.forEach(s => { if (typeAccueil[s.type_accueil]!==undefined) typeAccueil[s.type_accueil]++ })

      setData({ bookings:bookings.length, confirmed:confirmed.length, pending:pending.length,
        cancelled:cancelled.length, revenue, byMonth, children:children.length,
        childrenWithDossier, childrenSpecifiques, slotsOuverts, slotsComplets,
        typeAccueil, contacts:contacts.length, contactsTraites:contacts.filter(c=>c.traite).length })
    }).catch(() => {})
  }, [])

  if (!data) return <AdminLayout><div className="admin-loading">Chargement…</div></AdminLayout>

  const MOIS_LABELS = {'01':'Jan','02':'Fév','03':'Mar','04':'Avr','05':'Mai','06':'Jun','07':'Jul','08':'Aoû','09':'Sep','10':'Oct','11':'Nov','12':'Déc'}

  const sortedMonths = Object.entries(data.byMonth).sort(([a],[b]) => a.localeCompare(b))
  const maxRev = Math.max(...sortedMonths.map(([,v])=>v), 1)

  return (
    <AdminLayout>
      <div className="admin-page">
        <div className="admin-page__header"><div><h1>📈 Statistiques</h1></div></div>

        {/* Revenus */}
        <div style={{background:'white',borderRadius:'var(--radius-xl)',padding:'1.75rem',boxShadow:'var(--shadow-sm)',marginBottom:'1.5rem'}}>
          <h2 style={{fontFamily:"'Baloo 2',cursive",color:'var(--nuit)',fontSize:'1.1rem',marginBottom:'1.25rem'}}>💶 Revenus confirmés</h2>
          <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'1rem',marginBottom:'1.5rem'}}>
            {[
              {n:data.revenue.toFixed(0)+' €',l:'Total confirmé'},
              {n:data.confirmed,l:'Réservations confirmées'},
              {n:data.pending,l:'En attente'},
              {n:data.cancelled,l:'Annulées'},
            ].map(({n,l}) => (
              <div key={l} style={{background:'var(--sable-light)',borderRadius:'var(--radius-md)',padding:'1rem',textAlign:'center'}}>
                <div style={{fontFamily:"'Baloo 2',cursive",fontSize:'1.6rem',fontWeight:700,color:'var(--nuit)'}}>{n}</div>
                <div style={{fontSize:'.78rem',color:'var(--text-muted)',marginTop:4}}>{l}</div>
              </div>
            ))}
          </div>
          {sortedMonths.length > 0 ? (
            <div>
              <p style={{fontSize:'.82rem',color:'var(--text-muted)',marginBottom:'.75rem'}}>Revenus par mois</p>
              <div style={{display:'flex',alignItems:'flex-end',gap:6,height:120}}>
                {sortedMonths.map(([m, v]) => {
                  const pct = Math.round((v/maxRev)*100)
                  const [y, mo] = m.split('-')
                  return (
                    <div key={m} style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',gap:4}}>
                      <span style={{fontSize:'.65rem',color:'var(--text-muted)',fontWeight:600}}>{Math.round(v)}€</span>
                      <div style={{width:'100%',background:'var(--sauge)',borderRadius:'4px 4px 0 0',height:pct+'%',minHeight:4}}/>
                      <span style={{fontSize:'.65rem',color:'var(--text-muted)'}}>{MOIS_LABELS[mo]||mo}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          ) : <p style={{color:'var(--text-muted)',fontSize:'.85rem'}}>Aucune réservation confirmée pour le moment.</p>}
        </div>

        {/* Enfants */}
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1.5rem',marginBottom:'1.5rem'}}>
          <div style={{background:'white',borderRadius:'var(--radius-xl)',padding:'1.75rem',boxShadow:'var(--shadow-sm)'}}>
            <h2 style={{fontFamily:"'Baloo 2',cursive",color:'var(--nuit)',fontSize:'1.1rem',marginBottom:'1.25rem'}}>👶 Enfants</h2>
            <div style={{display:'flex',flexDirection:'column',gap:'.65rem'}}>
              {[
                {n:data.children,           l:'Enfants enregistrés',        c:'var(--nuit)'},
                {n:data.childrenSpecifiques,l:'Avec besoins spécifiques',   c:'#1565c0'},
                {n:data.childrenWithDossier,l:'Dossier complet',            c:'#2e7d32'},
                {n:data.children-data.childrenWithDossier,l:'Dossier incomplet',c:'#f57f17'},
              ].map(({n,l,c}) => (
                <div key={l} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'.5rem .75rem',background:'var(--sable-light)',borderRadius:8}}>
                  <span style={{fontSize:'.85rem',color:'var(--text-dark)'}}>{l}</span>
                  <span style={{fontWeight:800,color:c,fontSize:'1rem'}}>{n}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{background:'white',borderRadius:'var(--radius-xl)',padding:'1.75rem',boxShadow:'var(--shadow-sm)'}}>
            <h2 style={{fontFamily:"'Baloo 2',cursive",color:'var(--nuit)',fontSize:'1.1rem',marginBottom:'1.25rem'}}>📅 Créneaux</h2>
            <div style={{display:'flex',flexDirection:'column',gap:'.65rem'}}>
              {[
                {n:data.slotsOuverts,                     l:'Créneaux ouverts',  c:'#2e7d32'},
                {n:data.slotsComplets,                    l:'Créneaux complets', c:'#991b1b'},
                {n:data.typeAccueil.standard,             l:'Garde standard',    c:'var(--nuit)'},
                {n:data.typeAccueil.adapte,               l:'Accueil adapté',    c:'#1565c0'},
                {n:data.contacts-data.contactsTraites,    l:'Contacts non traités',c:'#f57f17'},
              ].map(({n,l,c}) => (
                <div key={l} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'.5rem .75rem',background:'var(--sable-light)',borderRadius:8}}>
                  <span style={{fontSize:'.85rem',color:'var(--text-dark)'}}>{l}</span>
                  <span style={{fontWeight:800,color:c,fontSize:'1rem'}}>{n}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}