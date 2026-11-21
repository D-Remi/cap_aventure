import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Publication, Prospect } from './marketing.entities'
import { CATEGORIES_RADAR, CODES_POSTAUX_CHABLAIS } from './radar.config'

const API_ENTREPRISES = 'https://recherche-entreprises.api.gouv.fr/search'
const FT_TOKEN_URL = 'https://entreprise.francetravail.fr/connexion/oauth2/access_token?realm=%2Fpartenaire'
const FT_SEARCH_URL = 'https://api.francetravail.io/partenaire/offresdemploi/v2/offres/search'

const CHAMPS_PUBLICATION = ['date', 'heure', 'reseaux', 'format', 'theme', 'titre', 'legende', 'statut']
const CHAMPS_PROSPECT = ['type', 'nom', 'organisme', 'categorie', 'siret', 'adresse', 'code_postal', 'ville', 'telephone', 'email', 'site', 'source', 'statut', 'relance', 'notes']

function garder(dto: Record<string, any>, champs: string[]) {
  const out: Record<string, any> = {}
  champs.forEach(k => { if (dto[k] !== undefined) out[k] = dto[k] === '' ? null : dto[k] })
  return out
}

@Injectable()
export class MarketingService {
  constructor(
    @InjectRepository(Publication) private pubRepo: Repository<Publication>,
    @InjectRepository(Prospect)    private proRepo: Repository<Prospect>,
  ) {}

  // ── Publications ───────────────────────────────────────────────
  listePublications() { return this.pubRepo.find({ order: { date: 'ASC', heure: 'ASC' } }) }
  creerPublication(dto: any) {
    if (!dto?.date) throw new BadRequestException('Date obligatoire')
    return this.pubRepo.save(this.pubRepo.create(garder(dto, CHAMPS_PUBLICATION)))
  }
  async modifierPublication(id: number, dto: any) {
    await this.pubRepo.update(id, garder(dto, CHAMPS_PUBLICATION))
    return this.pubRepo.findOne({ where: { id } })
  }
  supprimerPublication(id: number) { return this.pubRepo.delete(id) }

  // ── Prospects ──────────────────────────────────────────────────
  listeProspects() { return this.proRepo.find({ order: { updated_at: 'DESC' } }) }
  async creerProspect(dto: any) {
    if (!dto?.nom) throw new BadRequestException('Nom obligatoire')
    if (dto.siret) {
      const deja = await this.proRepo.findOne({ where: { siret: dto.siret } })
      if (deja) return deja // déjà dans le suivi
    }
    return this.proRepo.save(this.proRepo.create(garder(dto, CHAMPS_PROSPECT)))
  }
  async modifierProspect(id: number, dto: any) {
    const p = await this.proRepo.findOne({ where: { id } })
    if (!p) throw new NotFoundException()
    await this.proRepo.update(id, garder(dto, CHAMPS_PROSPECT))
    return this.proRepo.findOne({ where: { id } })
  }
  supprimerProspect(id: number) { return this.proRepo.delete(id) }

  // ── Radar : annuaire officiel des entreprises ──────────────────
  categories() {
    return Object.entries(CATEGORIES_RADAR).map(([cle, c]) => ({ cle, label: c.label, aide: c.aide, zone: c.zone }))
  }

  async radarEntreprises(cle: string, page = 1) {
    const cat = CATEGORIES_RADAR[cle]
    if (!cat) throw new BadRequestException('Catégorie inconnue')

    const requetes: URLSearchParams[] = []
    const base = (extra: Record<string, string>) => {
      const p = new URLSearchParams({ per_page: '25', page: String(page), etat_administratif: 'A', ...extra })
      if (cat.zone === 'chablais') p.set('code_postal', CODES_POSTAUX_CHABLAIS.join(','))
      else p.set('departement', '74')
      return p
    }
    if (cat.naf) requetes.push(base({ activite_principale: cat.naf }))
    ;(cat.motsCles || []).forEach(q => requetes.push(base({ q })))

    const resultats: any[] = []
    let total = 0, pages = 1
    for (const p of requetes) {
      const r = await fetch(`${API_ENTREPRISES}?${p.toString()}`, { headers: { Accept: 'application/json' } })
      if (!r.ok) throw new BadRequestException(`Annuaire indisponible (${r.status}), réessaie dans un instant`)
      const d: any = await r.json()
      total += d.total_results || 0
      pages = Math.max(pages, d.total_pages || 1)
      for (const ent of d.results || []) {
        const etabs = (ent.matching_etablissements?.length ? ent.matching_etablissements : [ent.siege])
          .filter((e: any) => e && e.etat_administratif !== 'F')
          .filter((e: any) => cat.zone === 'departement' || CODES_POSTAUX_CHABLAIS.includes(e.code_postal))
        for (const e of etabs) {
          if (resultats.some(x => x.siret === e.siret)) continue
          resultats.push({
            siret: e.siret,
            nom: (e.liste_enseignes?.[0] || e.nom_commercial || ent.nom_complet || '').trim(),
            raison_sociale: ent.nom_complet,
            activite: e.activite_principale || ent.activite_principale,
            adresse: e.adresse,
            code_postal: e.code_postal,
            ville: e.libelle_commune,
            latitude: e.latitude, longitude: e.longitude,
            date_creation: e.date_creation,
            entrepreneur_individuel: !!ent.complements?.est_entrepreneur_individuel,
          })
        }
      }
    }
    return { categorie: cle, page, pages, total, resultats }
  }

  // ── Radar : annonces de familles (API France Travail, compte gratuit) ──
  private jeton: { valeur: string, expire: number } | null = null

  franceTravailConfigure() {
    return !!(process.env.FT_CLIENT_ID && process.env.FT_CLIENT_SECRET)
  }

  private async jetonFranceTravail() {
    if (this.jeton && this.jeton.expire > Date.now() + 30000) return this.jeton.valeur
    const corps = new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: process.env.FT_CLIENT_ID || '',
      client_secret: process.env.FT_CLIENT_SECRET || '',
      scope: process.env.FT_SCOPE || 'api_offresdemploiv2 o2dsoffre',
    })
    const r = await fetch(FT_TOKEN_URL, { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: corps })
    if (!r.ok) throw new BadRequestException(`Connexion à France Travail refusée (${r.status}) : vérifie FT_CLIENT_ID, FT_CLIENT_SECRET et FT_SCOPE`)
    const d: any = await r.json()
    this.jeton = { valeur: d.access_token, expire: Date.now() + (d.expires_in || 1400) * 1000 }
    return this.jeton.valeur
  }

  async radarOffres(motsCles = "garde d'enfants") {
    if (!this.franceTravailConfigure()) return { configure: false, offres: [] }
    const jeton = await this.jetonFranceTravail()
    const p = new URLSearchParams({ motsCles, departement: '74', range: '0-149', sort: '1' })
    const r = await fetch(`${FT_SEARCH_URL}?${p.toString()}`, { headers: { Authorization: `Bearer ${jeton}`, Accept: 'application/json' } })
    if (r.status === 204) return { configure: true, offres: [] }
    if (!r.ok) throw new BadRequestException(`France Travail ne répond pas (${r.status})`)
    const d: any = await r.json()
    const offres = (d.resultats || []).map((o: any) => ({
      id: o.id,
      intitule: o.intitule,
      description: String(o.description || '').slice(0, 400),
      date: o.dateActualisation || o.dateCreation,
      lieu: o.lieuTravail?.libelle,
      code_postal: o.lieuTravail?.codePostal,
      employeur: o.entreprise?.nom || 'Particulier',
      contrat: o.typeContratLibelle || o.typeContrat,
      horaires: o.dureeTravailLibelle,
      chablais: CODES_POSTAUX_CHABLAIS.includes(o.lieuTravail?.codePostal),
      url: o.origineOffre?.urlOrigine || `https://candidat.francetravail.fr/offres/recherche/detail/${o.id}`,
    }))
    offres.sort((a: any, b: any) => Number(b.chablais) - Number(a.chablais))
    return { configure: true, offres }
  }
}
