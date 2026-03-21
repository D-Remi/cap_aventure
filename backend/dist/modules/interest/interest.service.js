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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InterestService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const interest_entity_1 = require("./interest.entity");
const email_service_1 = require("../email/email.service");
const notifications_service_1 = require("../notifications/notifications.service");
let InterestService = class InterestService {
    constructor(repo, email, notif) {
        this.repo = repo;
        this.email = email;
        this.notif = notif;
    }
    async create(dto) {
        const form = await this.repo.save(this.repo.create(dto));
        if (process.env.ADMIN_EMAIL) {
            this.email.sendNewInterestNotification(process.env.ADMIN_EMAIL, {
                prenom: dto.prenom || '',
                nom: dto.nom || '',
                email: dto.email || '',
                enfant: dto.enfant || '',
                activite: dto.activite || '',
            });
        }
        this.notif.emitAdmin({
            type: 'new_interest',
            title: '📩 Nouvelle demande de contact',
            message: `${dto.prenom} ${dto.nom || ''} a soumis une demande via le site`,
            data: { prenom: dto.prenom, email: dto.email },
        });
        return form;
    }
    findAll() {
        return this.repo.find({ order: { created_at: 'DESC' } });
    }
};
exports.InterestService = InterestService;
exports.InterestService = InterestService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(interest_entity_1.InterestForm)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        email_service_1.EmailService,
        notifications_service_1.NotificationsService])
], InterestService);
//# sourceMappingURL=interest.service.js.map