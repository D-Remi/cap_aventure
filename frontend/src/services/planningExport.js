/**
 * Export le planning de toutes les inscriptions d'un parent en PDF
 * Via window.print() sur une fenêtre dédiée
 */
export function exportPlanningPDF(registrationsWithDates, parentName) {
  const rows = []

  registrationsWithDates.forEach(({ registration: r, dates }) => {
    if (!dates || dates.length === 0) {
      rows.push({
        activite: r.activity?.titre || '—',
        enfant:   `${r.child?.prenom} ${r.child?.nom}`,
        date:     '⚠️ Dates à choisir',
        heure:    '—',
        lieu:     r.activity?.lieu || '—',
        statut:   r.status,
        formule:  r.subscription_type || 'seance',
      })
    } else {
      dates.forEach(d => {
        const dt = new Date(d.date)
        rows.push({
          activite: r.activity?.titre || '—',
          enfant:   `${r.child?.prenom} ${r.child?.nom}`,
          date:     dt.toLocaleDateString('fr-FR', { weekday:'short', day:'numeric', month:'short', year:'numeric' }),
          heure:    dt.toLocaleTimeString('fr-FR', { hour:'2-digit', minute:'2-digit' }),
          lieu:     r.activity?.lieu || '—',
          statut:   r.status,
          formule:  r.subscription_type || 'seance',
          attended: d.attended,
        })
      })
    }
  })

  // Trier par date
  rows.sort((a, b) => {
    if (a.date.startsWith('⚠️') || b.date.startsWith('⚠️')) return 0
    return new Date(a.date) - new Date(b.date)
  })

  const STATUS_LABELS = { pending:'En attente', confirmed:'Confirmée', cancelled:'Annulée' }
  const STATUS_COLORS = { pending:'#f59e0b', confirmed:'#16a34a', cancelled:'#dc2626' }
  const SUB_LABELS    = { essai:'Essai', seance:'Séance', mensuel:'Mensuel', trimestriel:'Trimestriel', semestriel:'Semestriel', annuel:'Annuel' }

  const rowsHtml = rows.map(r => `
    <tr>
      <td>${r.activite}</td>
      <td>${r.enfant}</td>
      <td>${r.date}</td>
      <td>${r.heure}</td>
      <td>${r.lieu}</td>
      <td style="font-size:0.8rem">${SUB_LABELS[r.formule] || r.formule}</td>
      <td style="color:${STATUS_COLORS[r.statut] || '#666'};font-weight:700;font-size:0.8rem">${STATUS_LABELS[r.statut] || r.statut}</td>
    </tr>
  `).join('')

  const html = `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
      <meta charset="UTF-8" />
      <title>Planning CapAventure — ${parentName}</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: Arial, sans-serif; padding: 2rem; color: #1a1a1a; font-size: 0.88rem; }
        .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1.5rem; padding-bottom: 1rem; border-bottom: 3px solid #0d2c4a; }
        .header h1 { font-size: 1.4rem; color: #0d2c4a; margin-bottom: 0.2rem; }
        .header p { color: #666; font-size: 0.85rem; }
        .logo { font-size: 1.2rem; font-weight: 900; color: #0d2c4a; text-align: right; }
        .logo span { color: #4ecb71; }
        table { width: 100%; border-collapse: collapse; margin-top: 1rem; }
        th { background: #0d2c4a; color: white; padding: 0.5rem 0.7rem; text-align: left; font-size: 0.8rem; font-weight: 600; }
        td { padding: 0.45rem 0.7rem; border-bottom: 1px solid #e5e7eb; vertical-align: middle; }
        tr:nth-child(even) td { background: #f9fafb; }
        tr:hover td { background: #f0fdf4; }
        .footer { margin-top: 2rem; padding-top: 1rem; border-top: 1px solid #e5e7eb; font-size: 0.78rem; color: #9ca3af; display: flex; justify-content: space-between; }
        .count { background: #e8f5ed; color: #166534; padding: 0.2rem 0.6rem; border-radius: 50px; font-size: 0.78rem; font-weight: 700; display: inline-block; margin-left: 0.5rem; }
        @media print {
          body { padding: 1rem; }
          .no-print { display: none; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div>
          <h1>Mon planning CapAventure</h1>
          <p>${parentName} · Exporté le ${new Date().toLocaleDateString('fr-FR', { day:'numeric', month:'long', year:'numeric' })}</p>
        </div>
        <div class="logo">Cap<span>Aventure</span><br><span style="font-size:0.75rem;font-weight:400;color:#666">Thonon-les-Bains</span></div>
      </div>

      <p style="font-size:0.85rem;color:#666">
        Total <span class="count">${rows.length} séance${rows.length > 1 ? 's' : ''}</span>
      </p>

      <table>
        <thead>
          <tr>
            <th>Activité</th>
            <th>Enfant</th>
            <th>Date</th>
            <th>Heure</th>
            <th>Lieu</th>
            <th>Formule</th>
            <th>Statut</th>
          </tr>
        </thead>
        <tbody>
          ${rowsHtml}
        </tbody>
      </table>

      <div class="footer">
        <span>CapAventure · Thonon-les-Bains · capaventure.duckdns.org</span>
        <span>Page 1</span>
      </div>
    </body>
    </html>
  `

  const w = window.open('', '_blank')
  w.document.write(html)
  w.document.close()
  setTimeout(() => w.print(), 500)
}
