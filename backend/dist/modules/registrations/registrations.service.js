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
exports.RegistrationsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const registration_entity_1 = require("./registration.entity");
const activity_entity_1 = require("../activities/activity.entity");
const child_entity_1 = require("../children/child.entity");
const email_service_1 = require("../email/email.service");
const notifications_service_1 = require("../notifications/notifications.service");
const points_service_1 = require("../points/points.service");
const POINTS_INSCRIPTION = 10;
const POINTS_PRESENCE = 20;
let RegistrationsService = class RegistrationsService {
    constructor(repo, actRepo, childRepo, email, notif, points) {
        this.repo = repo;
        this.actRepo = actRepo;
        this.childRepo = childRepo;
        this.email = email;
        this.notif = notif;
        this.points = points;
    }
    async findByUser(userId) {
        return this.repo.find({
            where: { child: { user: { id: userId } } },
            relations: ['child', 'activity'],
            order: { created_at: 'DESC' },
        });
    }
    findAll() {
        return this.repo.find({
            relations: ['child', 'child.user', 'activity'],
            order: { created_at: 'DESC' },
        });
    }
    findByActivity(activityId) {
        return this.repo.find({
            where: { activity: { id: activityId } },
            relations: ['child', 'child.user'],
            order: { created_at: 'ASC' },
        });
    }
    async create(user, dto) {
        const child = await this.childRepo.findOne({
            where: { id: dto.child_id },
            relations: ['user'],
        });
        if (!child)
            throw new common_1.NotFoundException('Enfant introuvable.');
        if (user.role !== 'admin' && child.user.id !== user.id) {
            throw new common_1.ForbiddenException('Cet enfant ne vous appartient pas.');
        }
        const activity = await this.actRepo.findOne({ where: { id: dto.activity_id } });
        if (!activity)
            throw new common_1.NotFoundException('Activité introuvable.');
        const taken = await this.repo.count({
            where: [
                { activity: { id: dto.activity_id }, status: 'pending' },
                { activity: { id: dto.activity_id }, status: 'confirmed' },
            ],
        });
        if (taken >= activity.places_max) {
            throw new common_1.BadRequestException('Cette activité est complète.');
        }
        const existing = await this.repo.findOne({
            where: { child: { id: dto.child_id }, activity: { id: dto.activity_id } },
        });
        if (existing && existing.status !== 'cancelled') {
            throw new common_1.BadRequestException('Cet enfant est déjà inscrit à cette activité.');
        }
        const reg = this.repo.create({
            child,
            activity,
            status: 'pending',
            subscription_type: dto.subscription_type || 'seance',
            notes: dto.notes,
        });
        await this.repo.save(reg);
        this.email.sendRegistrationPending(child.user.email, child.user.prenom, `${child.prenom} ${child.nom}`, activity.titre);
        this.points.addPoints(child.id, POINTS_INSCRIPTION, 'inscription', `Inscription à "${activity.titre}"`, activity.id).catch(() => { });
        this.notif.emitAdmin({
            type: 'new_registration',
            title: 'Nouvelle inscription',
            message: `${child.prenom} ${child.nom} s'est inscrit(e) à "${activity.titre}"`,
            data: { childName: `${child.prenom} ${child.nom}`, activityTitle: activity.titre },
        });
        return reg;
    }
    async updateStatus(id, status) {
        await this.repo.update(id, { status });
        const reg = await this.repo.findOne({
            where: { id },
            relations: ['child', 'child.user', 'activity'],
        });
        if (reg && reg.child?.user) {
            const { email, prenom, id: userId } = reg.child.user;
            const childName = `${reg.child.prenom} ${reg.child.nom}`;
            const actTitle = reg.activity?.titre;
            if (status === 'confirmed') {
                this.email.sendRegistrationConfirmed(email, prenom, childName, reg.activity);
                this.notif.emitUser(userId, {
                    type: 'registration_status',
                    title: '✅ Inscription confirmée !',
                    message: `L'inscription de ${childName} pour "${actTitle}" est confirmée.`,
                    data: { status: 'confirmed', childName, actTitle },
                });
                this.points.addPoints(reg.child.id, POINTS_PRESENCE, 'presence', `Présence confirmée à "${actTitle}"`, reg.activity?.id).catch(() => { });
            }
            else if (status === 'cancelled') {
                this.email.sendRegistrationCancelled(email, prenom, childName, actTitle);
                this.notif.emitUser(userId, {
                    type: 'registration_status',
                    title: '❌ Inscription annulée',
                    message: `L'inscription de ${childName} pour "${actTitle}" a été annulée.`,
                    data: { status: 'cancelled', childName, actTitle },
                });
                this.points.addPoints(reg.child.id, -POINTS_INSCRIPTION, 'echange_recompense', `Annulation inscription "${actTitle}"`, reg.activity?.id).catch(() => { });
            }
        }
        return reg;
    }
    async cancel(id, user) {
        const reg = await this.repo.findOne({ where: { id }, relations: ['child', 'child.user'] });
        if (!reg)
            throw new common_1.NotFoundException();
        if (user.role !== 'admin' && reg.child.user.id !== user.id)
            throw new common_1.ForbiddenException();
        return this.updateStatus(id, 'cancelled');
    }
};
exports.RegistrationsService = RegistrationsService;
exports.RegistrationsService = RegistrationsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(registration_entity_1.Registration)),
    __param(1, (0, typeorm_1.InjectRepository)(activity_entity_1.Activity)),
    __param(2, (0, typeorm_1.InjectRepository)(child_entity_1.Child)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        email_service_1.EmailService,
        notifications_service_1.NotificationsService,
        points_service_1.PointsService])
], RegistrationsService);
//# sourceMappingURL=registrations.service.js.map