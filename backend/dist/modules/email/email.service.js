"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var EmailService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailService = void 0;
const common_1 = require("@nestjs/common");
const nodemailer = require("nodemailer");
let EmailService = EmailService_1 = class EmailService {
    constructor() {
        this.logger = new common_1.Logger(EmailService_1.name);
        this.transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST || 'smtp.gmail.com',
            port: parseInt(process.env.MAIL_PORT || '587'),
            secure: process.env.MAIL_SECURE === 'true',
            auth: {
                user: process.env.MAIL_USER || '',
                pass: process.env.MAIL_PASS || '',
            },
        });
    }
    async send(to, subject, html) {
        try {
            await this.transporter.sendMail({
                from: `"CapAventure 🏔️" <${process.env.MAIL_FROM || process.env.MAIL_USER}>`,
                to,
                subject,
                html,
            });
            this.logger.log(`Email envoyé à ${to} : ${subject}`);
        }
        catch (err) {
            this.logger.error(`Erreur email à ${to} : ${err.message}`);
        }
    }
    baseTemplate(content) {
        return `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <style>
    body { margin:0; padding:0; background:#f0f7f2; font-family:'Segoe UI',Arial,sans-serif; }
    .wrap { max-width:580px; margin:32px auto; background:#fff; border-radius:16px; overflow:hidden; box-shadow:0 4px 24px rgba(0,0,0,0.08); }
    .header { background:linear-gradient(135deg,#0d2c4a,#1a5c3a); padding:32px 40px 28px; text-align:center; }
    .header h1 { margin:0; font-size:26px; color:#fff; font-weight:900; letter-spacing:-0.5px; }
    .header h1 span { color:#4ecb71; }
    .header p { margin:6px 0 0; color:rgba(255,255,255,0.7); font-size:13px; }
    .body { padding:32px 40px; }
    .body p { margin:0 0 16px; color:#374151; font-size:15px; line-height:1.7; }
    .body strong { color:#0d2c4a; }
    .btn { display:inline-block; margin:8px 0 20px; background:#4ecb71; color:#0d2c4a !important; font-weight:800; font-size:15px; padding:14px 32px; border-radius:50px; text-decoration:none; }
    .info-box { background:#f0f7f2; border-left:4px solid #2d8a56; border-radius:8px; padding:14px 18px; margin:16px 0; }
    .info-box p { margin:0; font-size:14px; color:#374151; }
    .info-box .label { font-weight:700; color:#1a5c3a; font-size:12px; text-transform:uppercase; letter-spacing:0.5px; margin-bottom:4px; }
    .footer { background:#f8faf9; padding:20px 40px; text-align:center; border-top:1px solid #e5e7eb; }
    .footer p { margin:0; font-size:12px; color:#9ca3af; line-height:1.6; }
    .footer a { color:#2d8a56; text-decoration:none; }
  </style>
</head>
<body>
  <div class="wrap">
    <div class="header">
      <h1>Cap<span>Aventure</span></h1>
      <p>Activités outdoor · Haute-Savoie · 6–14 ans</p>
    </div>
    <div class="body">
      ${content}
    </div>
    <div class="footer">
      <p>CapAventure · Haute-Savoie (74)<br/>
      <a href="mailto:${process.env.MAIL_USER}">Nous contacter</a> · 
      <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}">Visiter le site</a></p>
    </div>
  </div>
</body>
</html>`;
    }
    async sendWelcome(to, prenom) {
        const html = this.baseTemplate(`
      <p>Bonjour <strong>${prenom}</strong> 👋</p>
      <p>Bienvenue dans l'espace famille <strong>CapAventure</strong> ! Votre compte a bien été créé.</p>
      <p>Vous pouvez dès maintenant :</p>
      <p>
        ✅ Ajouter vos enfants à votre espace<br/>
        🎿 Consulter et vous inscrire aux activités<br/>
        📋 Suivre vos inscriptions en temps réel
      </p>
      <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/dashboard" class="btn">
        Accéder à mon espace →
      </a>
      <p style="font-size:13px;color:#9ca3af;">À très vite sur les sentiers de Haute-Savoie !</p>
    `);
        await this.send(to, '🏔️ Bienvenue sur CapAventure !', html);
    }
    async sendResetPassword(to, prenom, token) {
        const url = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${token}`;
        const html = this.baseTemplate(`
      <p>Bonjour <strong>${prenom}</strong>,</p>
      <p>Vous avez demandé la réinitialisation de votre mot de passe. Cliquez sur le bouton ci-dessous pour choisir un nouveau mot de passe :</p>
      <a href="${url}" class="btn">Réinitialiser mon mot de passe →</a>
      <div class="info-box">
        <p class="label">⚠️ Important</p>
        <p>Ce lien est valable <strong>1 heure</strong> uniquement. Si vous n'avez pas fait cette demande, ignorez cet email.</p>
      </div>
    `);
        await this.send(to, '🔑 Réinitialisation de votre mot de passe CapAventure', html);
    }
    async sendRegistrationConfirmed(to, prenom, childName, activity) {
        const date = new Date(activity.date).toLocaleDateString('fr-FR', {
            weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
        });
        const html = this.baseTemplate(`
      <p>Bonjour <strong>${prenom}</strong>,</p>
      <p>Bonne nouvelle ! L'inscription de <strong>${childName}</strong> a été <strong style="color:#166534">confirmée</strong> ✅</p>
      <div class="info-box">
        <p class="label">📋 Détails de l'activité</p>
        <p><strong>${activity.titre}</strong><br/>
        📅 ${date}<br/>
        💶 ${parseFloat(String(activity.prix)).toFixed(2)}€</p>
      </div>
      <p>Pensez à vérifier l'équipement nécessaire avant la sortie. En cas de question, n'hésitez pas à nous contacter.</p>
      <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/dashboard" class="btn">
        Voir mes inscriptions →
      </a>
    `);
        await this.send(to, `✅ Inscription confirmée — ${activity.titre}`, html);
    }
    async sendRegistrationPending(to, prenom, childName, activityTitle) {
        const html = this.baseTemplate(`
      <p>Bonjour <strong>${prenom}</strong>,</p>
      <p>Nous avons bien reçu la demande d'inscription de <strong>${childName}</strong> pour l'activité <strong>${activityTitle}</strong>.</p>
      <div class="info-box">
        <p class="label">⏳ En attente de confirmation</p>
        <p>Votre inscription est en cours de traitement. Vous recevrez un email dès qu'elle sera confirmée.</p>
      </div>
      <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/dashboard" class="btn">
        Suivre mon inscription →
      </a>
    `);
        await this.send(to, `⏳ Inscription reçue — ${activityTitle}`, html);
    }
    async sendRegistrationCancelled(to, prenom, childName, activityTitle) {
        const html = this.baseTemplate(`
      <p>Bonjour <strong>${prenom}</strong>,</p>
      <p>L'inscription de <strong>${childName}</strong> pour <strong>${activityTitle}</strong> a été annulée.</p>
      <p>Si vous avez des questions, n'hésitez pas à nous contacter par email.</p>
      <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/activites" class="btn">
        Voir les autres activités →
      </a>
    `);
        await this.send(to, `❌ Inscription annulée — ${activityTitle}`, html);
    }
    async sendActivityReminder(to, prenom, childName, activity) {
        const date = new Date(activity.date).toLocaleDateString('fr-FR', {
            weekday: 'long', day: 'numeric', month: 'long',
        });
        const time = new Date(activity.date).toLocaleTimeString('fr-FR', {
            hour: '2-digit', minute: '2-digit',
        });
        const html = this.baseTemplate(`
      <p>Bonjour <strong>${prenom}</strong>,</p>
      <p>Rappel : <strong>${childName}</strong> participe à <strong>${activity.titre}</strong> dans 2 jours !</p>
      <div class="info-box">
        <p class="label">📅 Rendez-vous</p>
        <p><strong>${date} à ${time}</strong></p>
      </div>
      <p>Pensez à vérifier l'équipement et à vous préparer. À très bientôt !</p>
    `);
        await this.send(to, `🔔 Rappel — ${activity.titre} dans 2 jours`, html);
    }
    async sendNewInterestNotification(adminEmail, form) {
        const html = this.baseTemplate(`
      <p>Nouvelle demande de contact reçue via le site vitrine.</p>
      <div class="info-box">
        <p class="label">👤 Contact</p>
        <p><strong>${form.prenom} ${form.nom || ''}</strong><br/>
        📧 ${form.email}<br/>
        👶 Enfant : ${form.enfant || '—'}<br/>
        🎿 Activité souhaitée : ${form.activite || '—'}</p>
      </div>
      <a href="mailto:${form.email}" class="btn">Répondre →</a>
    `);
        await this.send(adminEmail, `📩 Nouvelle demande — ${form.prenom} ${form.nom || ''}`, html);
    }
};
exports.EmailService = EmailService;
exports.EmailService = EmailService = EmailService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], EmailService);
//# sourceMappingURL=email.service.js.map