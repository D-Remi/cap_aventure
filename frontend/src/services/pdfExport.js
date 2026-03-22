/**
 * Génère et imprime un PDF de la liste des inscrits pour une activité.
 * Utilise window.print() avec une feuille de style dédiée — pas de dépendance externe.
 */
export function exportRegistrationsPDF(activity, registrations) {
  const date = activity.date
    ? new Date(activity.date).toLocaleDateString('fr-FR', {
        weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
      })
    : '—'

  const rows = registrations
    .filter(r => r.status !== 'cancelled')
    .map((r, i) => `
      <tr>
        <td>${i + 1}</td>
        <td>${r.child?.prenom || ''} ${r.child?.nom || ''}</td>
        <td>${r.child?.date_naissance
          ? new Date(r.child.date_naissance).toLocaleDateString('fr-FR')
          : '—'
        }</td>
        <td>${r.child?.user?.prenom || ''} ${r.child?.user?.nom || ''}</td>
        <td>${r.child?.user?.email || ''}</td>
        <td>${r.child?.user?.telephone || '—'}</td>
        <td class="status status--${r.status}">${
          r.status === 'confirmed' ? 'Confirmée' : 'En attente'
        }</td>
        <td class="signature-cell"></td>
      </tr>
    `).join('')

  const confirmed = registrations.filter(r => r.status === 'confirmed').length
  const pending   = registrations.filter(r => r.status === 'pending').length

  const html = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8"/>
  <title>Inscrits — ${activity.titre}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: Arial, sans-serif; font-size: 11px; color: #111; padding: 20px; }

    .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 24px; border-bottom: 3px solid #1a5c3a; padding-bottom: 14px; }
    .header__logo { font-size: 22px; font-weight: 900; color: #0d2c4a; }
    .header__logo span { color: #1a5c3a; }
    .header__meta { text-align: right; font-size: 10px; color: #666; }

    .activity-info { background: #f0f7f2; border-radius: 8px; padding: 12px 16px; margin-bottom: 18px; }
    .activity-info h1 { font-size: 16px; color: #0d2c4a; margin-bottom: 6px; }
    .activity-info__row { display: flex; gap: 24px; font-size: 10px; color: #444; }
    .activity-info__row span { font-weight: 700; color: #1a5c3a; margin-right: 4px; }

    .stats { display: flex; gap: 16px; margin-bottom: 16px; }
    .stat-pill { background: #0d2c4a; color: #fff; border-radius: 50px; padding: 5px 14px; font-size: 10px; font-weight: 700; }
    .stat-pill--green { background: #2d8a56; }
    .stat-pill--yellow { background: #d97706; }

    table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
    th { background: #0d2c4a; color: #fff; padding: 7px 8px; text-align: left; font-size: 9.5px; text-transform: uppercase; letter-spacing: 0.5px; }
    td { padding: 7px 8px; border-bottom: 1px solid #e5e7eb; vertical-align: middle; }
    tr:nth-child(even) td { background: #f9fafb; }
    tr:last-child td { border-bottom: 2px solid #1a5c3a; }

    .status { display: inline-block; padding: 2px 8px; border-radius: 50px; font-size: 9px; font-weight: 700; }
    .status--confirmed { background: #dcfce7; color: #166534; }
    .status--pending   { background: #fef9c3; color: #92400e; }

    .signature-cell { min-width: 80px; }

    .footer { margin-top: 24px; border-top: 1px solid #e5e7eb; padding-top: 12px; display: flex; justify-content: space-between; font-size: 9px; color: #999; }

    @media print {
      body { padding: 0; }
      @page { margin: 1.5cm; size: A4 landscape; }
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="header__logo">Cap<span>Aventure</span></div>
    <div class="header__meta">
      Imprimé le ${new Date().toLocaleDateString('fr-FR')}<br/>
      Haute-Savoie (74) — Document interne
    </div>
  </div>

  <div class="activity-info">
    <h1>${activity.titre}</h1>
    <div class="activity-info__row">
      <div><span>📅</span>${date}</div>
      <div><span>💶</span>${parseFloat(activity.prix || 0).toFixed(2)}€ / enfant</div>
      <div><span>👥</span>${activity.places_max} places maximum</div>
      <div><span>🏷️</span>${activity.type}</div>
    </div>
  </div>

  <div class="stats">
    <div class="stat-pill">${registrations.filter(r=>r.status!=='cancelled').length} inscrit(s) total</div>
    <div class="stat-pill stat-pill--green">✅ ${confirmed} confirmé(s)</div>
    <div class="stat-pill stat-pill--yellow">⏳ ${pending} en attente</div>
  </div>

  <table>
    <thead>
      <tr>
        <th>#</th>
        <th>Enfant</th>
        <th>Date naissance</th>
        <th>Parent</th>
        <th>Email</th>
        <th>Téléphone</th>
        <th>Statut</th>
        <th>Signature</th>
      </tr>
    </thead>
    <tbody>${rows || '<tr><td colspan="8" style="text-align:center;padding:20px;color:#999;">Aucun inscrit</td></tr>'}</tbody>
  </table>

  <div class="footer">
    <span>CapAventure — ${activity.titre} — ${date}</span>
    <span>Document généré automatiquement · Ne pas diffuser</span>
  </div>

  <script>window.onload = () => { window.print(); window.onafterprint = () => window.close(); }<\/script>
</body>
</html>`

  const win = window.open('', '_blank', 'width=1000,height=700')
  win.document.write(html)
  win.document.close()
}
