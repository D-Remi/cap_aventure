"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var EmailService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailService = void 0;
const common_1 = require("@nestjs/common");
const nodemailer = __importStar(require("nodemailer"));
let EmailService = EmailService_1 = class EmailService {
    constructor() {
        this.logger = new common_1.Logger(EmailService_1.name);
        const user = process.env.MAIL_USER;
        const pass = process.env.MAIL_PASS;
        if (!user || !pass) {
            this.transporter = nodemailer.createTransport({ jsonTransport: true });
            this.logger.warn('Email non configuré — MAIL_USER/MAIL_PASS manquants dans .env');
        }
        else {
            this.transporter = nodemailer.createTransport({
                host: process.env.MAIL_HOST || 'smtp.gmail.com',
                port: parseInt(process.env.MAIL_PORT || '587'),
                secure: process.env.MAIL_SECURE === 'true',
                auth: { user, pass },
            });
        }
    }
    async send(to, subject, html, replyTo) {
        try {
            await this.transporter.sendMail({
                from: `"CapAventure" <${process.env.MAIL_FROM || process.env.MAIL_USER}>`,
                to, subject, html,
                ...(replyTo ? { replyTo } : {}),
            });
            this.logger.log(`Email → ${to} : ${subject}`);
        }
        catch (err) {
            this.logger.error(`Erreur email → ${to} : ${err.message}`);
        }
    }
    tpl(content) {
        const site = process.env.FRONTEND_URL || 'https://capaventure33.fun';
        return `<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<style>
body{margin:0;padding:0;background:#f6f7f9;font-family:'Segoe UI',Arial,sans-serif}
.wrap{max-width:580px;margin:32px auto;background:#fff;border-radius:18px;overflow:hidden;box-shadow:0 8px 32px rgba(15,17,21,.08)}
.header{background:#0f1115;padding:28px 40px}
.header h1{margin:0;font-size:24px;color:#fff;font-weight:800;letter-spacing:-.02em}
.header h1 span{color:#1a8a72}
.header p{margin:6px 0 0;color:rgba(255,255,255,.55);font-size:13px;font-weight:300}
.body{padding:32px 40px}
.body p{margin:0 0 16px;color:#1a1d24;font-size:15px;line-height:1.7}
.body strong{color:#0f1115}
.btn{display:inline-block;margin:8px 0 20px;background:#136f5b;color:#fff!important;font-weight:600;font-size:15px;padding:14px 30px;border-radius:50px;text-decoration:none}
.box{background:#f6f7f9;border-left:3px solid #136f5b;border-radius:8px;padding:16px 20px;margin:16px 0}
.box p{margin:0;font-size:14px;color:#1a1d24;line-height:1.6}
.footer{background:#f6f7f9;padding:22px 40px;text-align:center;border-top:1px solid #eaecef}
.footer p{margin:0;font-size:12px;color:#9ba1ac;line-height:1.6}
.footer a{color:#136f5b;text-decoration:none}
</style></head><body><div class="wrap">
<div class="header"><h1>Cap<span>Aventure</span></h1><p>Répit et accompagnement éducatif · Gironde (33)</p></div>
<div class="body">${content}</div>
<div class="footer"><p>CapAventure · Éducateur en lieu de vie · Gironde (33)<br/>
<a href="${site}">capaventure33.fun</a></p></div>
</div></body></html>`;
    }
    async sendWelcome(to, prenom) {
        await this.send(to, 'Bienvenue sur CapAventure', this.tpl(`
      <p>Bonjour <strong>${prenom}</strong>,</p>
      <p>Votre espace <strong>CapAventure</strong> a bien été créé. Vous pouvez dès maintenant y accéder pour suivre votre accompagnement.</p>
      <a href="${process.env.FRONTEND_URL || 'https://capaventure33.fun'}/dashboard" class="btn">Accéder à mon espace →</a>
    `));
    }
    async sendResetPassword(to, prenom, token) {
        const url = `${process.env.FRONTEND_URL || 'https://capaventure33.fun'}/reset-password?token=${token}`;
        await this.send(to, 'Réinitialisation de votre mot de passe', this.tpl(`
      <p>Bonjour <strong>${prenom}</strong>,</p>
      <p>Cliquez sur le bouton ci-dessous pour réinitialiser votre mot de passe :</p>
      <a href="${url}" class="btn">Réinitialiser mon mot de passe →</a>
      <div class="box"><p>Ce lien est valable <strong>1 heure</strong> uniquement. Si vous n'êtes pas à l'origine de cette demande, ignorez cet email.</p></div>
    `));
    }
    async sendSeancePlanifiee(to, prenom, date, heure) {
        await this.send(to, `Séance planifiée — ${date}`, this.tpl(`
      <p>Bonjour <strong>${prenom}</strong>,</p>
      <p>Une séance est planifiée le <strong>${date}${heure ? ' à ' + heure : ''}</strong>.</p>
      <a href="${process.env.FRONTEND_URL}/dashboard" class="btn">Voir mon suivi →</a>
    `));
    }
    async sendCompteRenduPartage(to, prenom, date) {
        await this.send(to, `Compte-rendu de la séance du ${date}`, this.tpl(`
      <p>Bonjour <strong>${prenom}</strong>,</p>
      <p>Le compte-rendu de la séance du <strong>${date}</strong> est disponible dans votre espace.</p>
      <a href="${process.env.FRONTEND_URL}/dashboard" class="btn">Lire le compte-rendu →</a>
    `));
    }
    async sendSeanceAnnulee(to, prenom, date) {
        await this.send(to, `Séance annulée — ${date}`, this.tpl(`
      <p>Bonjour <strong>${prenom}</strong>,</p>
      <p>La séance du <strong>${date}</strong> a été annulée.</p>
      <p>Je reviens vers vous pour convenir d'une nouvelle date.</p>
      <a href="${process.env.FRONTEND_URL}/dashboard" class="btn">Mon espace →</a>
    `));
    }
    async sendContactNotif(data) {
        const admin = process.env.ADMIN_EMAIL || process.env.MAIL_USER;
        if (!admin)
            return;
        const services = {
            repit: 'Répit', accompagnement: 'Accompagnement éducatif', autre: 'Non précisé',
        };
        const urgences = {
            info: 'Se renseigne', bientot: 'Dans les prochaines semaines', urgent: 'Situation urgente',
        };
        await this.send(admin, `Nouvelle demande — ${data.prenom}`, this.tpl(`
      <p>Vous avez reçu une nouvelle demande de contact.</p>
      <div class="box">
        <p>
          <strong>${data.prenom}</strong><br/>
          Email : ${data.email}<br/>
          ${data.telephone ? `Téléphone : ${data.telephone}<br/>` : ''}
          Service : ${services[data.service] || 'Non précisé'}<br/>
          ${data.urgence ? `Échéance : ${urgences[data.urgence] || data.urgence}<br/>` : ''}
        </p>
      </div>
      ${data.message ? `<p><strong>Message :</strong></p><div class="box"><p>${data.message.replace(/\n/g, '<br/>')}</p></div>` : ''}
      <a href="mailto:${data.email}" class="btn">Répondre par email →</a>
      <p style="font-size:13px;color:#6e7480">Ou retrouvez cette demande dans votre espace admin.</p>
    `), data.email);
    }
    async sendReponseContact(to, prenom, message) {
        await this.send(to, 'Réponse à votre demande — CapAventure', this.tpl(`
      <p>Bonjour <strong>${prenom}</strong>,</p>
      <div class="box"><p>${message.replace(/\n/g, '<br/>')}</p></div>
      <p>Vous pouvez répondre directement à cet email pour continuer notre échange.</p>
      <p style="font-size:14px;color:#6e7480">Rémi · Éducateur en lieu de vie</p>
    `), process.env.MAIL_USER);
    }
};
exports.EmailService = EmailService;
exports.EmailService = EmailService = EmailService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], EmailService);
