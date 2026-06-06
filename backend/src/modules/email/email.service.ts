import { Injectable, Logger } from '@nestjs/common'
import * as nodemailer from 'nodemailer'

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name)
  private transporter: nodemailer.Transporter

  constructor() {
    this.transporter = nodemailer.createTransport({
      host:   process.env.MAIL_HOST   || 'smtp.gmail.com',
      port:   parseInt(process.env.MAIL_PORT || '587'),
      secure: process.env.MAIL_SECURE === 'true',
      auth: { user: process.env.MAIL_USER || '', pass: process.env.MAIL_PASS || '' },
    })
  }

  private async send(to: string, subject: string, html: string) {
    try {
      await this.transporter.sendMail({
        from: `"CapAventure" <${process.env.MAIL_FROM || process.env.MAIL_USER}>`,
        to, subject, html,
      })
      this.logger.log(`Email → ${to} : ${subject}`)
    } catch (err) {
      this.logger.error(`Erreur email → ${to} : ${err.message}`)
    }
  }

  private tpl(content: string) {
    return `<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8"/>
<style>
body{margin:0;padding:0;background:#f0e6d8;font-family:'Segoe UI',Arial,sans-serif}
.wrap{max-width:580px;margin:32px auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,.08)}
.header{background:linear-gradient(135deg,#2d3a6b,#4a7a6d);padding:28px 40px;text-align:center}
.header h1{margin:0;font-size:26px;color:#fff;font-weight:900}
.header h1 span{color:#d4b99a}
.header p{margin:6px 0 0;color:rgba(255,255,255,.7);font-size:13px}
.body{padding:32px 40px}
.body p{margin:0 0 16px;color:#374151;font-size:15px;line-height:1.7}
.btn{display:inline-block;margin:8px 0 20px;background:#4a7a6d;color:#fff!important;font-weight:800;font-size:15px;padding:14px 32px;border-radius:50px;text-decoration:none}
.box{background:#f0e6d8;border-left:4px solid #4a7a6d;border-radius:8px;padding:14px 18px;margin:16px 0}
.box p{margin:0;font-size:14px;color:#374151}
.footer{background:#faf8f4;padding:20px 40px;text-align:center;border-top:1px solid #e5e7eb}
.footer p{margin:0;font-size:12px;color:#9ca3af}
.footer a{color:#4a7a6d;text-decoration:none}
</style></head><body><div class="wrap">
<div class="header"><h1>Cap<span>Aventure</span></h1><p>Garde · Répit · Animation · Biganos (33)</p></div>
<div class="body">${content}</div>
<div class="footer"><p>CapAventure · Biganos · Bassin d'Arcachon (33)<br/>
<a href="mailto:${process.env.MAIL_USER}">Nous contacter</a> · 
<a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}">Visiter le site</a></p></div>
</div></body></html>`
  }

  // ── Bienvenue ──
  async sendWelcome(to: string, prenom: string) {
    await this.send(to, '👋 Bienvenue sur CapAventure !', this.tpl(`
      <p>Bonjour <strong>${prenom}</strong> 👋</p>
      <p>Votre compte <strong>CapAventure</strong> a bien été créé. Vous pouvez dès maintenant gérer vos enfants et réserver des créneaux.</p>
      <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/dashboard" class="btn">Accéder à mon espace →</a>
    `))
  }

  // ── Reset password ──
  async sendResetPassword(to: string, prenom: string, token: string) {
    const url = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${token}`
    await this.send(to, '🔑 Réinitialisation de votre mot de passe', this.tpl(`
      <p>Bonjour <strong>${prenom}</strong>,</p>
      <p>Cliquez sur le bouton ci-dessous pour réinitialiser votre mot de passe :</p>
      <a href="${url}" class="btn">Réinitialiser mon mot de passe →</a>
      <div class="box"><p>⚠️ Ce lien est valable <strong>1 heure</strong> uniquement.</p></div>
    `))
  }

  // ── Réservation en attente (parent) ──
  async sendBookingPending(to: string, prenom: string, enfant: string, date: string) {
    await this.send(to, `⏳ Demande de réservation reçue — ${date}`, this.tpl(`
      <p>Bonjour <strong>${prenom}</strong>,</p>
      <p>Votre demande pour <strong>${enfant}</strong> le <strong>${date}</strong> a bien été reçue.</p>
      <div class="box"><p>⏳ Je vous confirmerai rapidement par email.</p></div>
      <a href="${process.env.FRONTEND_URL}/dashboard" class="btn">Voir mes réservations →</a>
    `))
  }

  // ── Réservation confirmée (parent) ──
  async sendBookingConfirmed(to: string, prenom: string, enfant: string, date: string, heure?: string) {
    await this.send(to, `✅ Réservation confirmée — ${date}`, this.tpl(`
      <p>Bonjour <strong>${prenom}</strong>,</p>
      <p>La réservation de <strong>${enfant}</strong> le <strong>${date}${heure ? ' à ' + heure : ''}</strong> est <strong style="color:#166534">confirmée</strong> ✅</p>
      <a href="${process.env.FRONTEND_URL}/dashboard" class="btn">Voir mes réservations →</a>
    `))
  }

  // ── Réservation annulée ──
  async sendBookingCancelled(to: string, prenom: string, enfant: string, date: string) {
    await this.send(to, `❌ Réservation annulée — ${date}`, this.tpl(`
      <p>Bonjour <strong>${prenom}</strong>,</p>
      <p>La réservation de <strong>${enfant}</strong> le <strong>${date}</strong> a été annulée.</p>
      <p>N'hésitez pas à en faire une nouvelle depuis votre espace.</p>
      <a href="${process.env.FRONTEND_URL}/dashboard" class="btn">Mon espace →</a>
    `))
  }

  // ── Notification contact (admin) ──
  async sendContactNotif(data: { prenom: string; email: string; service?: string; besoins_specifiques?: boolean }) {
    const admin = process.env.ADMIN_EMAIL
    if (!admin) return
    await this.send(admin, `📩 Nouveau contact — ${data.prenom}`, this.tpl(`
      <p>Nouvelle demande de contact reçue.</p>
      <div class="box">
        <p><strong>${data.prenom}</strong> · ${data.email}<br/>
        Service : ${data.service || '—'}<br/>
        ${data.besoins_specifiques ? '🌿 Besoins spécifiques signalés' : ''}</p>
      </div>
      <a href="mailto:${data.email}" class="btn">Répondre →</a>
    `))
  }

  // ── Aliases ancienne API (compatibilité) ──
  async sendNewInterestNotification(adminEmail: string, form: any) {
    return this.sendContactNotif({ prenom: form.prenom, email: form.email, service: form.activite })
  }

  async sendRegistrationConfirmed(to: string, prenom: string, childName: string, activity: any) {
    const date = activity?.date ? new Date(activity.date).toLocaleDateString('fr-FR') : '—'
    return this.sendBookingConfirmed(to, prenom, childName, date)
  }

  async sendRegistrationPending(to: string, prenom: string, childName: string, activityTitle: string) {
    return this.sendBookingPending(to, prenom, childName, activityTitle)
  }

  async sendRegistrationCancelled(to: string, prenom: string, childName: string, activityTitle: string) {
    return this.sendBookingCancelled(to, prenom, childName, activityTitle)
  }
}
