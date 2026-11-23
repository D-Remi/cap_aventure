import { Logger } from '@nestjs/common'
import { Repository } from 'typeorm'

// Ajoute au démarrage les colonnes manquantes d'une table existante.
// La production n'utilise pas synchronize : sans ça, un déploiement sans migration casserait les écritures.
export async function ajouterColonnes(repo: Repository<any>, table: string, colonnes: Record<string, string>, logger: Logger) {
  try {
    const lignes: { c: string }[] = await repo.query(
      'SELECT COLUMN_NAME AS c FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ?', [table],
    )
    if (!lignes.length) return
    const existantes = lignes.map(l => l.c)
    for (const [nom, definition] of Object.entries(colonnes)) {
      if (existantes.includes(nom)) continue
      await repo.query(`ALTER TABLE \`${table}\` ADD COLUMN \`${nom}\` ${definition}`)
      logger.log(`Colonne ${table}.${nom} ajoutée`)
    }
  } catch (e) {
    logger.error(`Colonnes de ${table} non ajoutées : passe database/migrate_prospection_2026.sql (${(e as Error)?.message})`)
  }
}

// Comment la famille a connu Éduc & Vous (formulaire de contact et réservation d'appel)
export const SOURCES_CONTACT = ['instagram', 'facebook', 'google', 'bouche_a_oreille', 'professionnel', 'flyer', 'annonce', 'autre']
