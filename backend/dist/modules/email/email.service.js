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
    async send(to, subject, html) {
        try {
            await this.transporter.sendMail({
                from: `"CapAventure" <${process.env.MAIL_FROM || process.env.MAIL_USER}>`,
                to, subject, html,
            });
            this.logger.log(`Email → ${to} : ${subject}`);
        }
        catch (err) {
            this.logger.error(`Erreur email → ${to} : ${err.message}`);
        }
    }
    tpl(content) {
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
<div class="header"><h1>Cap<span>Aventure</span></h1><p>Répit et accompagnement éducatif · Gironde (33)</p></div>
<div class="body">${content}</div>
<div class="footer"><p>CapAventure · Gironde (33)<br/>
<a href="mailto:${process.env.MAIL_USER}">Nous contacter</a> · 
<a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}">Visiter le site</a></p></div>
</div></body></html>`;
    }
    async sendWelcome(to, prenom) {
        await this.send(to, 'Bienvenue sur CapAventure !', this.tpl(`
      <p>Bonjour <strong>${prenom}</strong> </p>
      <p>Votre compte <strong>CapAventure</strong> a bien été créé. Vous pouvez dès maintenant gérer vos enfants et réserver des créneaux.</p>
      <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/dashboard" class="btn">Accéder à mon espace →</a>
    `));
    }
    async sendResetPassword(to, prenom, token) {
        const url = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${token}`;
        await this.send(to, 'Réinitialisation de votre mot de passe', this.tpl(`
      <p>Bonjour <strong>${prenom}</strong>,</p>
      <p>Cliquez sur le bouton ci-dessous pour réinitialiser votre mot de passe :</p>
      <a href="${url}" class="btn">Réinitialiser mon mot de passe →</a>
      <div class="box"><p>Ce lien est valable <strong>1 heure</strong> uniquement.</p></div>
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
        const admin = process.env.ADMIN_EMAIL;
        if (!admin)
            return;
        await this.send(admin, `Nouveau contact — ${data.prenom}`, this.tpl(`
      <p>Nouvelle demande de contact reçue.</p>
      <div class="box">
        <p><strong>${data.prenom}</strong> · ${data.email}<br/>
        Service : ${data.service || '—'}<br/>
        ${data.besoins_specifiques ? 'Besoins spécifiques signalés' : ''}</p>
      </div>
      <a href="mailto:${data.email}" class="btn">Répondre →</a>
    `));
    }
};
exports.EmailService = EmailService;
exports.EmailService = EmailService = EmailService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], EmailService);
