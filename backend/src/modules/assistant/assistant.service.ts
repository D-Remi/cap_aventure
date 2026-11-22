import { BadRequestException, Injectable, Logger, ServiceUnavailableException } from '@nestjs/common'
import Anthropic from '@anthropic-ai/sdk'
import { CONSIGNES_ASSISTANT } from './assistant.prompt'

const MAX_MESSAGES = 20
const MAX_CARACTERES_MESSAGE = 1500
const MAX_CARACTERES_TOTAL = 15000

const REPONSE_REFUS = "Je ne peux pas répondre à cette question ici. Pour en parler directement avec Rémi, réservez un appel gratuit sur /rendez-vous ou écrivez-lui au +33 7 52 09 66 98."

@Injectable()
export class AssistantService {
  private readonly logger = new Logger(AssistantService.name)
  private client: Anthropic | null = null
  private jour = ''
  private compteur = 0

  // L'assistant n'apparaît sur le site que si une clé API est configurée dans .env
  actif() { return !!process.env.ANTHROPIC_API_KEY }

  private sdk() {
    if (!this.client) this.client = new Anthropic()
    return this.client
  }

  // Plafond de sécurité sur le nombre de réponses par jour (coût maîtrisé)
  private quota() {
    const auj = new Date().toISOString().slice(0, 10)
    if (auj !== this.jour) { this.jour = auj; this.compteur = 0 }
    const max = parseInt(process.env.ASSISTANT_MAX_JOUR || '300', 10)
    if (this.compteur >= max) return false
    this.compteur++
    return true
  }

  private valider(messages: unknown): Anthropic.Beta.BetaMessageParam[] {
    if (!Array.isArray(messages) || !messages.length || messages.length > MAX_MESSAGES) {
      throw new BadRequestException('Conversation invalide')
    }
    let total = 0
    const propres = messages.map((m: any, i: number) => {
      const role = i % 2 === 0 ? 'user' : 'assistant'
      if (!m || m.role !== role || typeof m.content !== 'string') throw new BadRequestException('Conversation invalide')
      const content = m.content.trim().slice(0, MAX_CARACTERES_MESSAGE)
      if (!content) throw new BadRequestException('Message vide')
      total += content.length
      return { role, content } as Anthropic.Beta.BetaMessageParam
    })
    if (propres[propres.length - 1].role !== 'user') throw new BadRequestException('Conversation invalide')
    if (total > MAX_CARACTERES_TOTAL) throw new BadRequestException('La conversation est trop longue : recommencez-en une nouvelle.')
    return propres
  }

  async repondre(messages: unknown) {
    if (!this.actif()) throw new ServiceUnavailableException("L'assistant n'est pas disponible.")
    const conversation = this.valider(messages)
    if (!this.quota()) throw new ServiceUnavailableException("L'assistant a beaucoup répondu aujourd'hui. Écrivez directement à Rémi ou réservez un appel sur /rendez-vous.")

    try {
      const res = await this.sdk().beta.messages.create({
        model: process.env.ASSISTANT_MODELE || 'claude-opus-5-5',
        max_tokens: 4000,
        betas: ['server-side-fallback-2026-07-01'],
        fallbacks: 'default',
        output_config: { effort: 'low' },
        system: [{ type: 'text', text: CONSIGNES_ASSISTANT, cache_control: { type: 'ephemeral' } }],
        messages: conversation,
      })

      // Journal sans le contenu des messages (confidentialité)
      this.logger.log(`Réponse (${res.model}) : ${res.usage.input_tokens} + ${res.usage.cache_read_input_tokens || 0} en cache, ${res.usage.output_tokens} en sortie`)

      if (res.stop_reason === 'refusal') return { reponse: REPONSE_REFUS }
      const texte = res.content
        .filter((b): b is Anthropic.Beta.BetaTextBlock => b.type === 'text')
        .map(b => b.text).join('\n').trim()
      return { reponse: texte || REPONSE_REFUS }
    } catch (err) {
      if (err instanceof Anthropic.RateLimitError) {
        this.logger.warn('Assistant : limite de débit de l\'API atteinte')
      } else if (err instanceof Anthropic.AuthenticationError) {
        this.logger.error('Assistant : clé ANTHROPIC_API_KEY invalide')
      } else if (err instanceof Anthropic.APIError) {
        this.logger.error(`Assistant : erreur API ${err.status} ${err.message}`)
      } else {
        this.logger.error(`Assistant : ${(err as Error)?.message}`)
      }
      throw new ServiceUnavailableException("L'assistant ne répond pas pour le moment. Écrivez à Rémi ou réservez un appel sur /rendez-vous.")
    }
  }
}
