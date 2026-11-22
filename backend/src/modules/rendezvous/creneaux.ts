// Calcul des créneaux libres pour les appels découverte.
// Toutes les heures sont celles de Paris (identiques à Genève et Lausanne).

export interface Occupation { date?: string; jour?: number; debut: string; fin: string; marge?: number }

export const enMinutes = (h: string) => {
  const [a, b] = String(h || '').slice(0, 5).split(':').map(Number)
  return a * 60 + (b || 0)
}

// Date et heure actuelles à Paris, quel que soit le fuseau du serveur
export function maintenantParis(ref = new Date()) {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/Paris', year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', hourCycle: 'h23',
  }).formatToParts(ref)
  const v = (t: string) => parts.find(p => p.type === t)?.value || '0'
  return { date: `${v('year')}-${v('month')}-${v('day')}`, minutes: Number(v('hour')) * 60 + Number(v('minute')) }
}

export function ajouterJours(date: string, n: number) {
  const d = new Date(`${date}T12:00:00Z`)
  d.setUTCDate(d.getUTCDate() + n)
  return d.toISOString().slice(0, 10)
}

// 1 = lundi … 7 = dimanche
export const jourSemaine = (date: string) => new Date(`${date}T12:00:00Z`).getUTCDay() || 7

export function creneauxLibres(opts: {
  creneaux: Record<string, string[]>
  duree: number
  delaiHeures: number
  joursMax: number
  occupations: Occupation[]   // gardes, séances, rendez-vous déjà pris
  maintenant?: { date: string; minutes: number }
}) {
  const now = opts.maintenant || maintenantParis()
  const limite = now.minutes + opts.delaiHeures * 60   // en minutes depuis le début d'aujourd'hui
  const jours: { date: string; creneaux: string[] }[] = []

  for (let i = 0; i <= opts.joursMax; i++) {
    const date = ajouterJours(now.date, i)
    const jour = jourSemaine(date)
    const libres = (opts.creneaux[String(jour)] || [])
      .slice().sort()
      .filter(h => i * 1440 + enMinutes(h) >= limite)
      .filter(h => {
        const debut = enMinutes(h), fin = debut + opts.duree
        return !opts.occupations.some(o => {
          if (o.date ? o.date !== date : o.jour !== jour) return false
          const m = o.marge || 0
          return debut < enMinutes(o.fin) + m && fin > enMinutes(o.debut) - m
        })
      })
    if (libres.length) jours.push({ date, creneaux: libres })
  }
  return jours
}

// Lien « Ajouter à mon agenda » Google, en heure de Paris
export function lienAgenda(date: string, heure: string, duree: number, titre: string, details: string) {
  const fin = enMinutes(heure) + duree
  const hh = (m: number) => `${String(Math.floor(m / 60)).padStart(2, '0')}${String(m % 60).padStart(2, '0')}00`
  const d = date.replace(/-/g, '')
  const q = new URLSearchParams({
    action: 'TEMPLATE', text: titre, details,
    dates: `${d}T${hh(enMinutes(heure))}/${d}T${hh(fin)}`, ctz: 'Europe/Paris',
  })
  return `https://calendar.google.com/calendar/render?${q.toString()}`
}

export const dateLongue = (date: string) =>
  new Date(`${date}T12:00:00Z`).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'UTC' })
