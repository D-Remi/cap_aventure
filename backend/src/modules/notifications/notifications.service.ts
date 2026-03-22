import { Injectable } from '@nestjs/common'
import { Subject } from 'rxjs'

export interface AppNotification {
  type: 'registration_status' | 'new_registration' | 'new_interest' | 'activity_created'
  title: string
  message: string
  data?: any
  userId?: number   // Si ciblé sur un user précis (undefined = broadcast admins)
  timestamp: Date
}

@Injectable()
export class NotificationsService {
  // Stream global pour les admins/animateurs
  private adminStream$ = new Subject<AppNotification>()

  // Streams par userId pour les parents
  private userStreams = new Map<number, Subject<AppNotification>>()

  // ── Émettre une notif admin ──────────────────────────────────
  emitAdmin(notification: Omit<AppNotification, 'timestamp'>) {
    this.adminStream$.next({ ...notification, timestamp: new Date() })
  }

  // ── Émettre une notif pour un user précis ───────────────────
  emitUser(userId: number, notification: Omit<AppNotification, 'timestamp'>) {
    const stream = this.userStreams.get(userId)
    if (stream) {
      stream.next({ ...notification, timestamp: new Date() })
    }
  }

  // ── S'abonner au stream admin ────────────────────────────────
  getAdminStream$() {
    return this.adminStream$.asObservable()
  }

  // ── S'abonner au stream d'un user ────────────────────────────
  getUserStream$(userId: number) {
    if (!this.userStreams.has(userId)) {
      this.userStreams.set(userId, new Subject<AppNotification>())
    }
    return this.userStreams.get(userId)!.asObservable()
  }

  // ── Nettoyer le stream d'un user (déconnexion) ───────────────
  cleanUserStream(userId: number) {
    const stream = this.userStreams.get(userId)
    if (stream) {
      stream.complete()
      this.userStreams.delete(userId)
    }
  }
}
